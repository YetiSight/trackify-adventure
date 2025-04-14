
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

// Function to fetch data from a ThingSpeak channel
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

// Function to map ThingSpeak fields to our SensorData structure
export function mapThingSpeakToSensorData(data: any, fieldMapping: ThingSpeakChannel['fields']): SensorData {
  // Start with default empty sensor data
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
    }
  };

  // Map ThingSpeak fields to sensor data
  for (const [fieldNumber, path] of Object.entries(fieldMapping)) {
    const fieldKey = `field${fieldNumber}`;
    if (data[fieldKey] !== undefined) {
      const value = parseFloat(data[fieldKey]);
      
      // Skip if not a valid number
      if (isNaN(value)) continue;
      
      // Special handling for boolean values
      if (path.includes('pir.detected')) {
        setNestedProperty(sensorData, path, value > 0);
      } else {
        setNestedProperty(sensorData, path, value);
      }
    }
  }

  return sensorData;
}

// Helper function to set a nested property using a path string
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

// Predefined ThingSpeak channel configurations
export const predefinedChannels: ThingSpeakChannel[] = [
  {
    id: 2271252,
    name: "Arduino Sensori Alpini",
    apiKey: "JJKCM5Q2H8G5MPAT",
    fields: {
      "1": "ultrasonic.distance",
      "2": "imu.orientation.pitch",
      "3": "imu.altitude", // This maps field3 to altitude
      "4": "imu.orientation.roll",
      "5": "gps.position.lat",
      "6": "gps.position.lng",
      "7": "gps.speed",
      "8": "gps.heading"
    }
  },
  // Adding the channel from the network logs that is functioning
  {
    id: 2912718,
    name: "Arduino Sensori GPS",
    apiKey: "YIF25EQOHVOEKWZL",
    fields: {
      "1": "gps.position.lat",  
      "2": "gps.position.lng",
      "3": "gps.speed",
      "4": "gps.heading",
      "5": "pir.detected",
      "6": "ultrasonic.distance",
      "7": "imu.altitude" // Added altitude mapping for this channel
    }
  }
];

// Function to find channel configuration by ID
export function findChannelConfig(channelId: number): ThingSpeakChannel | undefined {
  return predefinedChannels.find(c => c.id === channelId);
}

// Function to get default fields mapping for custom channels
export function getDefaultFieldMapping(): ThingSpeakChannel['fields'] {
  return {
    "1": "gps.position.lat",
    "2": "gps.position.lng",
    "3": "gps.speed",
    "4": "imu.altitude", // Make sure altitude is included in the default mapping
    "5": "imu.orientation.roll",
    "6": "imu.orientation.pitch",
    "7": "ultrasonic.distance",
    "8": "pir.detected"
  };
}

// Function to start polling ThingSpeak for data
export function setupThingSpeakPolling(
  channelId: number, 
  apiKey: string, 
  fieldMapping: ThingSpeakChannel['fields'],
  onDataReceived: (data: SensorData) => void,
  interval = 15000 // Default to 15 seconds (ThingSpeak has a 15s rate limit for free accounts)
): () => void {
  let isActive = true;
  
  const pollData = async () => {
    if (!isActive) return;
    
    try {
      const data = await fetchThingSpeakData(channelId, apiKey);
      const sensorData = mapThingSpeakToSensorData(data, fieldMapping);
      console.log("Mapped sensor data:", sensorData); // Log the mapped data to verify altitude
      onDataReceived(sensorData);
    } catch (error) {
      // Error is already logged and notified in fetchThingSpeakData
    } finally {
      if (isActive) {
        setTimeout(pollData, interval);
      }
    }
  };
  
  // Start polling
  pollData();
  
  // Return a function to stop polling
  return () => {
    isActive = false;
  };
}
