
import { toast } from "@/hooks/use-toast";
import { SensorData } from "@/types";
import { create } from "zustand";

type ArduinoConnectionState = "disconnected" | "connecting" | "connected" | "error";
type ConnectionMode = "direct" | "remote";
type SecureMode = "secure" | "insecure";
type ConnectionError = null | "forbidden" | "timeout" | "network" | "invalid_ip" | "unknown";

interface ArduinoState {
  connection: WebSocket | null;
  connectionState: ArduinoConnectionState;
  connectionMode: ConnectionMode;
  secureMode: SecureMode;
  sensorData: SensorData | null;
  lastUpdated: number | null;
  errorType: ConnectionError;
  connectToArduino: (ipAddress: string, port?: string, mode?: ConnectionMode, secure?: SecureMode) => void;
  disconnectFromArduino: () => void;
  setSensorData: (data: SensorData) => void;
  reconnectWithInsecure: (ipAddress: string, port: string) => void;
}

export const useArduinoStore = create<ArduinoState>((set, get) => ({
  connection: null,
  connectionState: "disconnected",
  connectionMode: "direct",
  secureMode: "secure", // Default to secure connections
  sensorData: null,
  lastUpdated: null,
  errorType: null,
  
  connectToArduino: (ipAddress: string, port = "80", mode = "direct", secure = "secure") => {
    // First disconnect if already connected
    const { connection } = get();
    if (connection) {
      connection.close();
    }
    
    set({ connectionState: "connecting", connectionMode: mode, secureMode: secure, errorType: null });
    
    try {
      // Format WebSocket URL based on connection mode
      let wsUrl;
      
      if (mode === "direct") {
        // Protocol prefix based on security setting
        const protocol = secure === "secure" ? "wss://" : "ws://";
        
        // Direct connection to Arduino on the same network
        wsUrl = `${protocol}${ipAddress}:${port}/`;
        console.log(`Connecting directly to Arduino WebSocket URL: ${wsUrl}`);
        
        // Check for HTTPS mixed content warning
        if (secure === "insecure" && window.location.protocol === "https:") {
          console.warn("Attempting insecure WebSocket connection from HTTPS page. This may be blocked by the browser.");
          toast({
            title: "Avviso di sicurezza",
            description: "Il browser potrebbe bloccare connessioni non sicure. Se la connessione fallisce, prova ad utilizzare la modalità remota o una connessione sicura WSS.",
            variant: "destructive",
          });
        }
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
              ultrasonic: {
                distance: 850,
                velocity: 5
              },
              pir: {
                detected: Math.random() > 0.7
              },
              imu: {
                acceleration: {
                  x: Math.random() * 2 - 1,
                  y: Math.random() * 2 - 1,
                  z: Math.random() * 2 - 1
                },
                gyro: {
                  x: Math.random() * 0.1,
                  y: Math.random() * 0.1,
                  z: Math.random() * 0.1
                },
                orientation: {
                  roll: Math.random() * 20 - 10,
                  pitch: Math.random() * 30 - 15,
                  yaw: Math.random() * 360
                },
                altitude: 1800 + Math.random() * 200
              },
              gps: {
                position: {
                  lat: 46.5142 + (Math.random() - 0.5) * 0.01,
                  lng: 11.3384 + (Math.random() - 0.5) * 0.01
                },
                speed: 5 + Math.random() * 15,
                heading: Math.random() * 360,
                accuracy: 3 + Math.random() * 5
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
      
      // Add connection timeout
      const connectionTimeout = setTimeout(() => {
        if (get().connectionState === "connecting") {
          ws.close();
          set({ connectionState: "error", errorType: "timeout" });
          
          toast({
            title: "Timeout di connessione",
            description: "Impossibile stabilire una connessione con Arduino. Controllare che l'Arduino sia acceso e raggiungibile.",
            variant: "destructive",
          });
        }
      }, 10000); // 10 seconds timeout
      
      ws.onopen = () => {
        clearTimeout(connectionTimeout);
        set({ connection: ws, connectionState: "connected", errorType: null });
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
        clearTimeout(connectionTimeout);
        console.error("WebSocket error:", error);
        
        let errorType: ConnectionError = "unknown";
        
        // Try to determine the nature of the error
        if (secure === "secure") {
          errorType = "network";
        }
        
        set({ connectionState: "error", errorType });
        
        // Check if this might be a mixed content issue
        if (secure === "insecure" && window.location.protocol === "https:") {
          toast({
            title: "Errore di sicurezza",
            description: "Il browser ha bloccato una connessione non sicura. Prova ad utilizzare la modalità remota o cambia a WSS (porta 443).",
            variant: "destructive",
          });
        } else if (secure === "secure") {
          toast({
            title: "Errore di connessione sicura",
            description: "La connessione sicura (WSS) non è riuscita. L'Arduino potrebbe non supportare SSL/TLS. Prova la connessione non sicura o la modalità remota.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Errore di connessione",
            description: "Impossibile connettersi ad Arduino. Verifica IP, porta e che l'Arduino sia online.",
            variant: "destructive",
          });
        }
      };
      
      ws.onclose = () => {
        clearTimeout(connectionTimeout);
        console.log("WebSocket connection closed");
        set({ connectionState: "disconnected" });
      };
      
      set({ connection: ws });
    } catch (error) {
      console.error("Failed to create WebSocket connection:", error);
      set({ connectionState: "error", errorType: "invalid_ip" });
      toast({
        title: "Errore di connessione",
        description: "Impossibile creare la connessione WebSocket. Verifica che l'indirizzo IP sia valido.",
        variant: "destructive",
      });
    }
  },
  
  reconnectWithInsecure: (ipAddress: string, port: string) => {
    // Helper function to quickly retry with insecure connection
    const { connectToArduino } = get();
    connectToArduino(ipAddress, port, "direct", "insecure");
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
    
    set({ connection: null, connectionState: "disconnected", errorType: null });
    toast({
      title: "Disconnesso",
      description: "Arduino è stato disconnesso",
    });
  },
  
  setSensorData: (data: SensorData) => {
    set({ sensorData: data, lastUpdated: Date.now() });
  }
}));
