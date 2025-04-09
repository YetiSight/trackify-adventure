
import { toast } from "@/hooks/use-toast";
import { SensorData } from "@/types";
import { create } from "zustand";

type ArduinoConnectionState = "disconnected" | "connecting" | "connected" | "error";

interface ArduinoState {
  connection: WebSocket | null;
  connectionState: ArduinoConnectionState;
  sensorData: SensorData | null;
  lastUpdated: number | null;
  connectToArduino: (ipAddress: string, port?: string) => void;
  disconnectFromArduino: () => void;
  setSensorData: (data: SensorData) => void;
}

export const useArduinoStore = create<ArduinoState>((set, get) => ({
  connection: null,
  connectionState: "disconnected",
  sensorData: null,
  lastUpdated: null,
  
  connectToArduino: (ipAddress: string, port = "80") => {
    // First disconnect if already connected
    const { connection } = get();
    if (connection) {
      connection.close();
    }
    
    set({ connectionState: "connecting" });
    
    try {
      // Format WebSocket URL based on Arduino UNO R4 WiFi specifications
      // Default endpoint for Arduino UNO R4 WiFi might be just the root path
      const wsUrl = `ws://${ipAddress}:${port}/`;
      console.log("Connecting to WebSocket URL:", wsUrl);
      
      const ws = new WebSocket(wsUrl);
      
      ws.onopen = () => {
        set({ connection: ws, connectionState: "connected" });
        console.log("WebSocket connection established successfully");
        toast({
          title: "Connessione stabilita",
          description: "Arduino è ora connesso",
          variant: "default",
        });
      };
      
      ws.onmessage = (event) => {
        try {
          console.log("Received data from Arduino:", event.data);
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
        console.log("WebSocket connection closed");
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
