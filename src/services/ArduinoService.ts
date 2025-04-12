import { toast } from "@/hooks/use-toast";
import { SensorData } from "@/types";
import { create } from "zustand";
import { 
  fetchThingSpeakData, 
  mapThingSpeakToSensorData, 
  predefinedChannels, 
  setupThingSpeakPolling,
  findChannelConfig,
  getDefaultFieldMapping
} from "./ThingSpeakService";

type ArduinoConnectionState = "disconnected" | "connecting" | "connected" | "error";
type ConnectionMode = "direct" | "remote" | "thingspeak";
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
  thingspeakCleanup: (() => void) | null;
  thingspeakChannelId: number | null;
  thingspeakApiKey: string | null;
  connectToArduino: (ipAddress: string, port?: string, mode?: ConnectionMode, secure?: SecureMode) => void;
  connectToThingSpeak: (channelId: number, apiKey: string) => void;
  disconnectFromArduino: () => void;
  setSensorData: (data: SensorData) => void;
  reconnectWithInsecure: (ipAddress: string, port: string) => void;
}

export const useArduinoStore = create<ArduinoState>((set, get) => ({
  connection: null,
  connectionState: "disconnected",
  connectionMode: "direct",
  secureMode: "secure",
  sensorData: null,
  lastUpdated: null,
  errorType: null,
  thingspeakCleanup: null,
  thingspeakChannelId: null,
  thingspeakApiKey: null,
  
  connectToArduino: (ipAddress: string, port = "80", mode = "direct", secure = "secure") => {
    const { connection, thingspeakCleanup } = get();
    if (connection) {
      connection.close();
    }
    
    if (thingspeakCleanup) {
      thingspeakCleanup();
      set({ thingspeakCleanup: null });
    }
    
    if (mode === "thingspeak") {
      const channelId = parseInt(ipAddress);
      if (isNaN(channelId)) {
        toast({
          title: "ID canale non valido",
          description: "L'ID del canale ThingSpeak deve essere un numero",
          variant: "destructive",
        });
        set({ connectionState: "error", errorType: "invalid_ip" });
        return;
      }
      
      const apiKey = port;
      get().connectToThingSpeak(channelId, apiKey);
      return;
    }
    
    if (!ipAddress.trim()) {
      toast({
        title: "Errore di connessione",
        description: "Inserisci un indirizzo IP valido",
        variant: "destructive",
      });
      set({ connectionState: "error", errorType: "invalid_ip" });
      return;
    }
    
    set({ connectionState: "connecting", connectionMode: mode, secureMode: secure, errorType: null });
    
    try {
      let wsUrl;
      
      if (mode === "direct") {
        const protocol = secure === "secure" ? "wss://" : "ws://";
        wsUrl = `${protocol}${ipAddress}:${port}/`;
        console.log(`Connecting directly to Arduino WebSocket URL: ${wsUrl}`);
        
        if (secure === "insecure" && window.location.protocol === "https:") {
          console.warn("Attempting insecure WebSocket connection from HTTPS page. This may be blocked by the browser.");
          toast({
            title: "Avviso di sicurezza",
            description: "Il browser potrebbe bloccare connessioni non sicure. Se la connessione fallisce, prova ad utilizzare la modalità remota o una connessione sicura WSS.",
            variant: "destructive",
          });
        }
      } else {
        wsUrl = `wss://remote-arduino-broker.example.com/connect?device=${ipAddress}`;
        console.log("Connecting remotely through broker to Arduino:", wsUrl);
        
        setTimeout(() => {
          toast({
            title: "Modalità remota",
            description: "Usando dati simulati per scopi dimostrativi",
            variant: "default",
          });
          
          set({ connectionState: "connected" });
          
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
          
          (window as any).__mockDataInterval = mockDataInterval;
        }, 1500);
        
        return;
      }
      
      const ws = new WebSocket(wsUrl);
      
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
      }, 10000);
      
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
        
        if (secure === "secure") {
          errorType = "network";
        }
        
        set({ connectionState: "error", errorType, connection: null });
        
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
        if (get().connectionState !== "error") {
          set({ connectionState: "disconnected", connection: null });
        }
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
  
  connectToThingSpeak: (channelId: number, apiKey: string) => {
    const { connection, thingspeakCleanup } = get();
    if (connection) {
      connection.close();
      set({ connection: null });
    }
    
    if (thingspeakCleanup) {
      thingspeakCleanup();
    }
    
    set({ 
      connectionState: "connecting", 
      connectionMode: "thingspeak", 
      errorType: null,
      thingspeakChannelId: channelId,
      thingspeakApiKey: apiKey
    });
    
    console.log(`Connecting to ThingSpeak channel: ${channelId} with API key: ${apiKey}`);
    
    fetchThingSpeakData(channelId, apiKey)
      .then(data => {
        let channel = findChannelConfig(channelId);
        let fieldMapping;
        
        if (!channel) {
          console.log("Channel configuration not found in predefined list, using default mapping");
          fieldMapping = getDefaultFieldMapping();
        } else {
          console.log(`Using predefined configuration for channel: ${channel.name}`);
          fieldMapping = channel.fields;
        }
        
        const sensorData = mapThingSpeakToSensorData(data, fieldMapping);
        
        set({ 
          sensorData, 
          lastUpdated: Date.now(), 
          connectionState: "connected" 
        });
        
        toast({
          title: "Connessione ThingSpeak stabilita",
          description: channel ? `Connesso al canale: ${channel.name}` : `Connesso al canale: ${channelId}`,
        });
        
        const cleanup = setupThingSpeakPolling(
          channelId,
          apiKey,
          fieldMapping,
          (newData) => {
            set({ sensorData: newData, lastUpdated: Date.now() });
          }
        );
        
        set({ thingspeakCleanup: cleanup });
      })
      .catch(error => {
        console.error("Failed to connect to ThingSpeak:", error);
        set({ 
          connectionState: "error", 
          errorType: "network",
          thingspeakChannelId: null,
          thingspeakApiKey: null
        });
        
        toast({
          title: "Errore connessione ThingSpeak",
          description: "Impossibile connettersi al canale ThingSpeak. Verifica ID e API key.",
          variant: "destructive",
        });
      });
  },
  
  reconnectWithInsecure: (ipAddress: string, port: string) => {
    const { connectToArduino } = get();
    connectToArduino(ipAddress, port, "direct", "insecure");
  },
  
  disconnectFromArduino: () => {
    const { connection, connectionMode, thingspeakCleanup } = get();
    
    if (connectionMode === "remote" && (window as any).__mockDataInterval) {
      clearInterval((window as any).__mockDataInterval);
      (window as any).__mockDataInterval = null;
    }
    
    if (thingspeakCleanup) {
      thingspeakCleanup();
    }
    
    if (connection) {
      connection.close();
    }
    
    set({ 
      connection: null, 
      connectionState: "disconnected", 
      errorType: null,
      thingspeakCleanup: null,
      thingspeakChannelId: null,
      thingspeakApiKey: null
    });
    
    toast({
      title: "Disconnesso",
      description: "Arduino è stato disconnesso",
    });
  },
  
  setSensorData: (data: SensorData) => {
    set({ sensorData: data, lastUpdated: Date.now() });
  }
}));
