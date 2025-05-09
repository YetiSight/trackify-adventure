import { SensorData } from "@/types";
import { toast } from "@/hooks/use-toast";
import { parseArduinoData } from "@/utils/arduinoHelpers";

interface ThingSpeakChannel {
  id: number;
  name: string;
  apiKey: string;
  fields: {
    [key: string]: string; // Map field number to sensor data path (e.g., "1": "ultrasonic.distance")
  };
}

export async function fetchThingSpeakData(channelId: number, apiKey: string): Promise<any> {
  try {
    console.log(`Fetching ThingSpeak data for channel ${channelId} with API key ${apiKey}`);
    const response = await fetch(
      `https://api.thingspeak.com/channels/${channelId}/feeds/last.json?api_key=${apiKey}`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("ThingSpeak data received:", data);
    return data;
  } catch (error) {
    console.error("Error fetching ThingSpeak data:", error);
    toast({
      title: "Errore ThingSpeak",
      description: "Impossibile recuperare i dati da ThingSpeak",
      variant: "destructive",
    });
    throw error;
  }
}

export function mapThingSpeakToSensorData(data: any, fieldMapping: ThingSpeakChannel['fields']): SensorData {
  const sensorData: SensorData = {
    ultrasonic: {
      distance: 0,
      velocity: 0
    },
    pir: {
      detected: false
    },
    imu: {
      acceleration: { x: 0, y: 0, z: 0 },
      gyro: { x: 0, y: 0, z: 0 },
      orientation: { roll: 0, pitch: 0, yaw: 0 },
      altitude: 0
    },
    gps: {
      position: { lat: 0, lng: 0 },
      speed: 0,
      heading: 0,
      accuracy: 0
    },
    collisionRisk: false
  };

  for (const [fieldNumber, path] of Object.entries(fieldMapping)) {
    const fieldKey = `field${fieldNumber}`;
    if (data[fieldKey] !== undefined) {
      const value = parseFloat(data[fieldKey]);
      
      if (isNaN(value)) continue;
      
      if (path.includes('pir.detected') || path.includes('collisionRisk')) {
        setNestedProperty(sensorData, path, value > 0);
      } else {
        setNestedProperty(sensorData, path, value);
      }
    }
  }

  console.log("Mapped sensor data:", sensorData);
  
  return sensorData;
}

function setNestedProperty(obj: any, path: string, value: any): void {
  const parts = path.split('.');
  let current = obj;
  
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    if (!current[part]) {
      current[part] = {};
    }
    current = current[part];
  }
  
  current[parts[parts.length - 1]] = value;
}

export const predefinedChannels: ThingSpeakChannel[] = [
  {
    id: 2271252,
    name: "Arduino Sensori Alpini",
    apiKey: "JJKCM5Q2H8G5MPAT",
    fields: {
      "1": "ultrasonic.distance",
      "2": "imu.orientation.pitch",
      "3": "imu.altitude",
      "4": "imu.orientation.roll",
      "5": "collisionRisk",
      "6": "gps.position.lng",
      "7": "gps.speed",
      "8": "gps.heading"
    }
  },
  {
    id: 2912718,
    name: "Arduino Sensori GPS",
    apiKey: "YIF25EQOHVOEKWZL",
    fields: {
      "1": "gps.position.lat",  
      "2": "gps.position.lng",
      "3": "imu.altitude",
      "4": "gps.heading",
      "5": "collisionRisk",
      "6": "ultrasonic.distance",
      "7": "gps.speed"
    }
  }
];

export function findChannelConfig(channelId: number): ThingSpeakChannel | undefined {
  return predefinedChannels.find(c => c.id === channelId);
}

export function getDefaultFieldMapping(): ThingSpeakChannel['fields'] {
  return {
    "1": "gps.position.lat",
    "2": "gps.position.lng",
    "3": "imu.altitude",
    "4": "gps.heading",
    "5": "collisionRisk",
    "6": "ultrasonic.distance",
    "7": "gps.speed",
    "8": "pir.detected"
  };
}

export function setupThingSpeakPolling(
  channelId: number, 
  apiKey: string, 
  fieldMapping: ThingSpeakChannel['fields'],
  onDataReceived: (data: SensorData) => void,
  interval = 15000
): () => void {
  let isActive = true;
  
  const pollData = async () => {
    if (!isActive) return;
    
    try {
      const data = await fetchThingSpeakData(channelId, apiKey);
      const sensorData = mapThingSpeakToSensorData(data, fieldMapping);
      
      if (channelId === 2912718) {
        if (data.field3) {
          sensorData.imu.altitude = parseFloat(data.field3);
        }
        
        if (data.field7) {
          sensorData.gps.speed = parseFloat(data.field7);
        }
        
        if (!data.field3 && data.field7) {
          const baseAltitude = 250;
          const speedFactor = parseFloat(data.field7) / 10;
          sensorData.imu.altitude = baseAltitude + speedFactor;
        }
        
        if (data.field5 !== undefined) {
          sensorData.collisionRisk = parseFloat(data.field5) > 0;
        }
      }
      
      console.log("Mapped sensor data:", sensorData);
      onDataReceived(sensorData);
    } catch (error) {
      console.error("Error fetching ThingSpeak data:", error);
      toast({
        title: "Errore ThingSpeak",
        description: "Impossibile recuperare i dati da ThingSpeak",
        variant: "destructive",
      });
      throw error;
    } finally {
      if (isActive) {
        setTimeout(pollData, interval);
      }
    }
  };
  
  pollData();
  
  return () => {
    isActive = false;
  };
}
