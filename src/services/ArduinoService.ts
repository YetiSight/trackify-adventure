
import { toast } from "@/hooks/use-toast";
import { SensorData } from "@/types";
import { create } from "zustand";

type ArduinoConnectionState = "disconnected" | "connecting" | "connected" | "error";

interface ArduinoState {
  connection: WebSocket | null;
  connectionState: ArduinoConnectionState;
  sensorData: SensorData | null;
  lastUpdated: number | null;
  connectToArduino: (ipAddress: string) => void;
  disconnectFromArduino: () => void;
  setSensorData: (data: SensorData) => void;
}

export const useArduinoStore = create<ArduinoState>((set, get) => ({
  connection: null,
  connectionState: "disconnected",
  sensorData: null,
  lastUpdated: null,
  
  connectToArduino: (ipAddress: string) => {
    // First disconnect if already connected
    const { connection } = get();
    if (connection) {
      connection.close();
    }
    
    set({ connectionState: "connecting" });
    
    try {
      // Connect to Arduino WebSocket server
      const ws = new WebSocket(`ws://${ipAddress}/ws`);
      
      ws.onopen = () => {
        set({ connection: ws, connectionState: "connected" });
        toast({
          title: "Connessione stabilita",
          description: "Arduino è ora connesso",
          variant: "default",
        });
      };
      
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as SensorData;
          set({ sensorData: data, lastUpdated: Date.now() });
        } catch (error) {
          console.error("Error parsing message from Arduino:", error);
          toast({
            title: "Errore di comunicazione",
            description: "Impossibile interpretare i dati del sensore",
            variant: "destructive",
          });
        }
      };
      
      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        set({ connectionState: "error" });
        toast({
          title: "Errore di connessione",
          description: "Impossibile connettersi ad Arduino",
          variant: "destructive",
        });
      };
      
      ws.onclose = () => {
        set({ connectionState: "disconnected" });
      };
      
      set({ connection: ws });
    } catch (error) {
      console.error("Failed to create WebSocket connection:", error);
      set({ connectionState: "error" });
      toast({
        title: "Errore di connessione",
        description: "Impossibile connettersi ad Arduino",
        variant: "destructive",
      });
    }
  },
  
  disconnectFromArduino: () => {
    const { connection } = get();
    if (connection) {
      connection.close();
    }
    set({ connection: null, connectionState: "disconnected" });
    toast({
      title: "Disconnesso",
      description: "Arduino è stato disconnesso",
    });
  },
  
  setSensorData: (data: SensorData) => {
    set({ sensorData: data, lastUpdated: Date.now() });
  }
}));
