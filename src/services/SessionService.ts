import React from "react";
import { create } from "zustand";
import { GeoPoint, SensorData, Session } from "@/types";
import { useArduinoStore } from "./ArduinoService";
import { toast } from "@/hooks/use-toast";
import { persist } from "zustand/middleware";

// Definizione dello stato della sessione
interface SessionState {
  // Stato della sessione
  isActive: boolean;
  startTime: number | null;
  duration: number;  // in secondi
  
  // Dati di tracciamento
  path: GeoPoint[];
  distance: number;  // in km
  averageSpeed: number;  // in km/h
  maxSpeed: number;  // in km/h
  currentSpeed: number;  // in km/h
  
  // Metriche di altitudine
  startAltitude: number | null;  // in metri
  maxAltitude: number;  // in metri
  
  // Metriche di collisione
  collisionRisks: number; // Contatore dei rischi collisione
  lastCollisionRiskState: boolean; // Stato precedente del rischio collisione
  
  // Sessioni salvate
  savedSessions: Session[];
  
  // Controlli
  startSession: () => void;
  stopSession: () => void;
  resetSession: () => void;
  updateWithSensorData: (data: SensorData) => void;
  updateDuration: () => void;
  saveSession: () => void;
}

// Helper function per calcolare la distanza tra due punti GPS in km
function calculateDistance(point1: GeoPoint, point2: GeoPoint): number {
  const R = 6371; // Raggio della terra in km
  const dLat = (point2.lat - point1.lat) * Math.PI / 180;
  const dLng = (point2.lng - point1.lng) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Creazione dello store per la sessione con persistenza
export const useSessionStore = create<SessionState>()(
  persist(
    (set, get) => ({
      isActive: false,
      startTime: null,
      duration: 0,
      path: [],
      distance: 0,
      averageSpeed: 0,
      maxSpeed: 0,
      currentSpeed: 0,
      startAltitude: null,
      maxAltitude: 0,
      collisionRisks: 0,
      lastCollisionRiskState: false,
      savedSessions: [],
      
      startSession: () => {
        const { connectionState } = useArduinoStore.getState();
        
        if (connectionState !== "connected") {
          toast({
            title: "Errore",
            description: "Connettiti a ThingSpeak prima di iniziare la sessione",
            variant: "destructive",
          });
          return;
        }
        
        // Inizializza la sessione
        set({
          isActive: true,
          startTime: Date.now(),
          duration: 0,
          path: [],
          distance: 0,
          averageSpeed: 0,
          maxSpeed: 0,
          currentSpeed: 0,
          startAltitude: null,
          maxAltitude: 0,
          collisionRisks: 0,
          lastCollisionRiskState: false,
        });
        
        toast({
          title: "Sessione avviata",
          description: "La registrazione dei dati è iniziata",
        });
      },
      
      stopSession: () => {
        if (get().isActive) {
          set({ isActive: false });
          
          // Salva automaticamente la sessione quando viene fermata
          get().saveSession();
          
          console.log("Sessione fermata, salvata automaticamente");
          
          toast({
            title: "Sessione fermata",
            description: `Sessione completata. Distanza: ${get().distance.toFixed(2)} km`,
          });
        }
      },
      
      resetSession: () => {
        set({
          isActive: false,
          startTime: null,
          duration: 0,
          path: [],
          distance: 0,
          averageSpeed: 0,
          maxSpeed: 0,
          currentSpeed: 0,
          startAltitude: null,
          maxAltitude: 0,
          collisionRisks: 0,
          lastCollisionRiskState: false,
        });
      },
      
      updateDuration: () => {
        const { isActive, startTime } = get();
        if (isActive && startTime) {
          const now = Date.now();
          const duration = Math.round((now - startTime) / 1000); // in secondi, arrotondato
          set({ duration });
        }
      },
      
      updateWithSensorData: (data: SensorData) => {
        if (!get().isActive) return;
        
        const currentState = get();
        
        // Aggiorna la durata
        const now = Date.now();
        const duration = currentState.startTime ? Math.round((now - currentState.startTime) / 1000) : 0;
        
        // Gestione del contatore rischi collisione
        let collisionRisks = currentState.collisionRisks;
        
        // Verifica se c'è stato un cambiamento nel rischio collisione da 0 a 1
        if (data.collisionRisk && !currentState.lastCollisionRiskState) {
          collisionRisks += 1;
          console.log("Nuovo rischio collisione rilevato! Totale:", collisionRisks);
        }
        
        // Se non ci sono dati GPS validi, aggiorna solo il contatore collisioni e la durata
        if (!data.gps || !data.gps.position) {
          set({ 
            duration, 
            collisionRisks, 
            lastCollisionRiskState: data.collisionRisk || false 
          });
          return;
        }
        
        const currentPoint = data.gps.position;
        const currentAltitude = data.imu?.altitude || 0;
        const currentSpeed = data.gps.speed; // Usa direttamente la velocità dai dati del sensore (field7)
        
        // Controlla se è la prima posizione GPS
        if (currentState.path.length === 0) {
          // Salva la prima posizione
          set({
            path: [{ 
              ...currentPoint, 
              timestamp: now, 
              altitude: currentAltitude,
              speed: currentSpeed 
            }],
            startAltitude: currentAltitude,
            maxAltitude: currentAltitude,
            currentSpeed: currentSpeed,
            maxSpeed: currentSpeed,
            duration,
            collisionRisks,
            lastCollisionRiskState: data.collisionRisk || false
          });
          return;
        }
        
        // Calcola la distanza dal punto precedente
        const lastPoint = currentState.path[currentState.path.length - 1];
        const segmentDistance = calculateDistance(lastPoint, currentPoint);
        
        // Verifica se la posizione è cambiata in modo significativo (per evitare micromovimenti)
        if (segmentDistance < 0.001) {
          // Aggiorna la velocità corrente e potenzialmente la velocità massima, anche se il movimento è piccolo
          const newMaxSpeed = Math.max(currentState.maxSpeed, currentSpeed);
          
          set({ 
            duration,
            currentSpeed,
            maxSpeed: newMaxSpeed,
            collisionRisks, 
            lastCollisionRiskState: data.collisionRisk || false 
          });
          return;
        }
        
        // Aggiorna il percorso e la distanza totale
        const newDistance = currentState.distance + segmentDistance;
        const newPath = [...currentState.path, { 
          ...currentPoint, 
          timestamp: now, 
          speed: currentSpeed,
          altitude: currentAltitude 
        }];
        
        // Calcola velocità media - usando ora la durata in ore per il calcolo
        const avgSpeed = currentState.startTime && duration > 0 ? (newDistance / (duration / 3600)) : 0;
        
        // Aggiorna velocità massima
        const maxSpeed = Math.max(currentState.maxSpeed, currentSpeed);
        
        // Aggiorna altitudine massima
        const maxAltitude = Math.max(currentState.maxAltitude, currentAltitude);
        
        // Aggiorna lo stato
        set({
          path: newPath,
          distance: newDistance,
          duration,
          averageSpeed: avgSpeed,
          maxSpeed,
          currentSpeed,
          maxAltitude,
          collisionRisks,
          lastCollisionRiskState: data.collisionRisk || false
        });
      },
      
      saveSession: () => {
        const { 
          duration, 
          distance, 
          averageSpeed, 
          maxSpeed, 
          maxAltitude, 
          path, 
          startAltitude,
          collisionRisks 
        } = get();
        
        // Verifica che ci siano dati sufficienti per salvare la sessione
        if (distance < 0.01 || duration < 10) {
          toast({
            title: "Sessione non salvata",
            description: "La sessione è troppo breve per essere salvata",
            variant: "destructive",
          });
          return;
        }
        
        // Crea un oggetto sessione
        const newSession: Session = {
          id: Date.now().toString(),
          userId: "current-user", // In un'app reale useremmo l'ID dell'utente autenticato
          date: new Date().toLocaleDateString('it-IT', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          }),
          distance: parseFloat(distance.toFixed(2)),
          duration: Math.round(duration), // Salviamo i secondi come secondi, senza conversione
          maxSpeed: parseFloat(maxSpeed.toFixed(1)),
          avgSpeed: parseFloat(averageSpeed.toFixed(1)),
          maxAltitude: Math.round(maxAltitude),
          altitudeDifference: startAltitude ? Math.round(maxAltitude - startAltitude) : 0,
          path: path,
          slopeLevel: determineSlopeLevel(maxSpeed, distance),
          collisionRisks: collisionRisks // Salva il conteggio delle collisioni nella sessione
        };
        
        console.log("Salvando sessione con durata (secondi):", newSession.duration);
        
        // Aggiungi la sessione all'elenco delle sessioni salvate
        set((state) => ({ 
          savedSessions: [newSession, ...state.savedSessions]
        }));
        
        toast({
          title: "Sessione salvata",
          description: "La sessione è stata salvata nel tuo profilo",
        });
      }
    }),
    {
      name: "ski-session-storage", // nome della chiave in localStorage
      partialize: (state) => ({ 
        savedSessions: state.savedSessions 
      }), // salva solo le sessioni completate
    }
  )
);

// Funzione per determinare il livello di difficoltà della pista in base alla velocità massima e distanza
function determineSlopeLevel(maxSpeed: number, distance: number): "easy" | "medium" | "hard" | "extreme" {
  if (maxSpeed > 60) return "extreme";
  if (maxSpeed > 40) return "hard";
  if (maxSpeed > 20) return "medium";
  return "easy";
}

// Hook per aggiornare automaticamente la sessione con i dati del sensore
export function useSessionUpdater() {
  const { sensorData, lastUpdated, connectionState } = useArduinoStore();
  const { isActive, updateWithSensorData, updateDuration } = useSessionStore();
  
  // Effetto per aggiornare la durata ogni secondo, indipendentemente dai dati ThingSpeak
  React.useEffect(() => {
    let timerId: number | undefined;
    
    if (isActive) {
      // Aggiorna la durata ogni secondo
      timerId = window.setInterval(() => {
        updateDuration();
      }, 1000);
    }
    
    // Cleanup al cambio di stato o smontaggio
    return () => {
      if (timerId) {
        clearInterval(timerId);
      }
    };
  }, [isActive, updateDuration]);
  
  // Effetto per processare i dati quando arrivano da ThingSpeak
  React.useEffect(() => {
    // Aggiorna la sessione solo se è attiva e ci sono nuovi dati del sensore
    if (isActive && sensorData && connectionState === "connected") {
      updateWithSensorData(sensorData);
    }
  }, [sensorData, lastUpdated, isActive, connectionState, updateWithSensorData]);
}
