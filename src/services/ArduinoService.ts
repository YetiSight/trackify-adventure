
import { toast } from "@/hooks/use-toast";
import { SensorData } from "@/types";
import { create } from "zustand";

type ArduinoConnectionState = "disconnected" | "connecting" | "connected" | "error";
type ConnectionMode = "direct" | "remote";

interface ArduinoState {
  connection: WebSocket | null;
  connectionState: ArduinoConnectionState;
  connectionMode: ConnectionMode;
  sensorData: SensorData | null;
  lastUpdated: number | null;
  connectToArduino: (ipAddress: string, port?: string, mode?: ConnectionMode) => void;
  disconnectFromArduino: () => void;
  setSensorData: (data: SensorData) => void;
}

export const useArduinoStore = create<ArduinoState>((set, get) => ({
  connection: null,
  connectionState: "disconnected",
  connectionMode: "direct",
  sensorData: null,
  lastUpdated: null,
  
  connectToArduino: (ipAddress: string, port = "80", mode = "direct") => {
    // First disconnect if already connected
    const { connection } = get();
    if (connection) {
      connection.close();
    }
    
    set({ connectionState: "connecting", connectionMode: mode });
    
    try {
      // Format WebSocket URL based on connection mode
      let wsUrl;
      
      if (mode === "direct") {
        // Direct connection to Arduino on the same network
        wsUrl = `ws://${ipAddress}:${port}/`;
        console.log("Connecting directly to Arduino WebSocket URL:", wsUrl);
      } else {
        // Remote connection through a broker service
        // In a real implementation, this would be a WebSocket broker URL
        wsUrl = `wss://remote-arduino-broker.example.com/connect?device=${ipAddress}`;
        console.log("Connecting remotely through broker to Arduino:", wsUrl);
        
        // Since we can't actually connect to a non-existent broker in this demo,
        // we'll simulate remote connection with mock data
        setTimeout(() => {
          toast({
            title: "Modalità remota",
            description: "Usando dati simulati per scopi dimostrativi",
            variant: "default",
          });
          
          // In a real app, we would connect to an actual broker service
          set({ connectionState: "connected" });
          
          // Start sending mock data every 2 seconds
          const mockDataInterval = setInterval(() => {
            const mockData: SensorData = {
              gps: {
                position: {
                  lat: 46.5142 + (Math.random() - 0.5) * 0.01,
                  lng: 11.3384 + (Math.random() - 0.5) * 0.01
                },
                heading: Math.random() * 360,
                speed: 5 + Math.random() * 15,
                altitude: 1800 + Math.random() * 200
              },
              imu: {
                acceleration: {
                  x: Math.random() * 2 - 1,
                  y: Math.random() * 2 - 1,
                  z: Math.random() * 2 - 1
                },
                orientation: {
                  pitch: Math.random() * 30 - 15,
                  roll: Math.random() * 20 - 10,
                  yaw: Math.random() * 360
                },
                altitude: 1800 + Math.random() * 200
              },
              environmentals: {
                temperature: -5 + Math.random() * 10,
                humidity: 70 + Math.random() * 20,
                pressure: 800 + Math.random() * 50
              }
            };
            
            set({ sensorData: mockData, lastUpdated: Date.now() });
          }, 2000);
          
          // Store the interval ID in a custom property on the window object
          // for cleanup when disconnecting
          (window as any).__mockDataInterval = mockDataInterval;
        }, 1500);
        
        // Return early since we're simulating the connection
        return;
      }
      
      // For direct mode, proceed with actual WebSocket connection
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
    const { connection, connectionMode } = get();
    
    // Clear mock data interval if in remote mode
    if (connectionMode === "remote" && (window as any).__mockDataInterval) {
      clearInterval((window as any).__mockDataInterval);
      (window as any).__mockDataInterval = null;
    }
    
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
