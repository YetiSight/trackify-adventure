import React from "react";
import { create } from "zustand";
import { GeoPoint, SensorData, Session } from "@/types";
import { useArduinoStore } from "./ArduinoService";
import { toast } from "@/hooks/use-toast";

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
  
  // Sessioni salvate
  savedSessions: Session[];
  
  // Controlli
  startSession: () => void;
  stopSession: () => void;
  resetSession: () => void;
  updateWithSensorData: (data: SensorData) => void;
  updateDuration: () => void; // Nuovo metodo per aggiornare la durata indipendentemente
  saveSession: () => void; // Nuovo metodo per salvare la sessione corrente
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

// Creazione dello store per la sessione
export const useSessionStore = create<SessionState>((set, get) => ({
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
    });
  },
  
  updateDuration: () => {
    const { isActive, startTime } = get();
    if (isActive && startTime) {
      const now = Date.now();
      const duration = (now - startTime) / 1000; // in secondi
      set({ duration });
    }
  },
  
  updateWithSensorData: (data: SensorData) => {
    if (!get().isActive || !data.gps) return;
    
    const { path, startTime, distance } = get();
    const currentPoint = data.gps.position;
    const currentAltitude = data.imu?.altitude || 0;
    
    // Aggiorna la durata
    const now = Date.now();
    const duration = startTime ? (now - startTime) / 1000 : 0;
    
    // Controlla se è la prima posizione GPS
    if (path.length === 0) {
      // Salva la prima posizione
      set({
        path: [{ ...currentPoint, timestamp: now }],
        startAltitude: currentAltitude,
        maxAltitude: currentAltitude,
        duration,
      });
      return;
    }
    
    // Calcola la distanza dal punto precedente
    const lastPoint = path[path.length - 1];
    const segmentDistance = calculateDistance(lastPoint, currentPoint);
    
    // Verifica se la posizione è cambiata in modo significativo (per evitare micromovimenti)
    if (segmentDistance < 0.001) {
      // Aggiorna solo la durata se il movimento è troppo piccolo
      set({ duration });
      return;
    }
    
    // Calcola la nuova velocità istantanea
    const timeDiff = (now - (lastPoint.timestamp || now)) / 1000; // in secondi
    const speedInKmh = timeDiff > 0 ? (segmentDistance / timeDiff) * 3600 : 0;
    
    // Aggiorna il percorso e la distanza totale
    const newDistance = distance + segmentDistance;
    const newPath = [...path, { ...currentPoint, timestamp: now, speed: speedInKmh }];
    
    // Calcola velocità media
    const avgSpeed = startTime && duration > 0 ? (newDistance / (duration / 3600)) : 0;
    
    // Aggiorna velocità massima
    const maxSpeed = Math.max(get().maxSpeed, speedInKmh);
    
    // Aggiorna altitudine massima
    const maxAltitude = Math.max(get().maxAltitude, currentAltitude);
    
    // Aggiorna lo stato
    set({
      path: newPath,
      distance: newDistance,
      duration,
      averageSpeed: avgSpeed,
      maxSpeed,
      currentSpeed: speedInKmh,
      maxAltitude,
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
      startAltitude 
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
      duration: Math.round(duration), // Salviamo i secondi invece di convertirli in minuti
      maxSpeed: parseFloat(maxSpeed.toFixed(1)),
      avgSpeed: parseFloat(averageSpeed.toFixed(1)),
      maxAltitude: Math.round(maxAltitude),
      altitudeDifference: startAltitude ? Math.round(maxAltitude - startAltitude) : 0,
      path: path,
      slopeLevel: determineSlopeLevel(maxSpeed, distance)
    };
    
    // Aggiungi la sessione all'elenco delle sessioni salvate
    const updatedSessions = [newSession, ...get().savedSessions];
    set({ savedSessions: updatedSessions });
    
    // Debug message to help track session saving
    console.log("Sessione salvata:", newSession);
    console.log("Sessioni totali:", updatedSessions.length);
    
    toast({
      title: "Sessione salvata",
      description: "La sessione è stata salvata nel tuo profilo",
    });
  }
}));

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
