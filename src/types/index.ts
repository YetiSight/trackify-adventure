
export interface User {
  id: string;
  name: string;
  avatar?: string;
  totalDistance: number; // in km
  maxSpeed: number; // in km/h
  totalSessions: number;
  rank?: number;
}

export interface Session {
  id: string;
  userId: string;
  date: string;
  distance: number; // in km
  duration: number; // in minutes
  maxSpeed: number; // in km/h
  avgSpeed: number; // in km/h
  maxAltitude: number; // in meters
  altitudeDifference: number; // in meters
  path?: GeoPoint[];
  slopeLevel?: "easy" | "medium" | "hard" | "extreme";
  collisionRisks?: number; // Number of collision risks detected
}

export interface GeoPoint {
  lat: number;
  lng: number;
  altitude?: number;
  timestamp?: number;
  speed?: number;
}

export interface Notification {
  id: string;
  type: "warning" | "info" | "emergency";
  message: string;
  timestamp: number;
  read: boolean;
  sensorData?: {
    type: "ultrasonic" | "pir" | "imu" | "gps";
    value: number | string | GeoPoint;
  };
}

export interface SensorData {
  ultrasonic: {
    distance: number; // in cm
    velocity: number; // in cm/s
  };
  pir: {
    detected: boolean;
  };
  imu: {
    acceleration: {
      x: number;
      y: number;
      z: number;
    };
    gyro: {
      x: number;
      y: number;
      z: number;
    };
    orientation: {
      roll: number; // in degrees
      pitch: number; // in degrees
      yaw: number; // in degrees
    };
    altitude: number; // in meters
  };
  gps: {
    position: GeoPoint;
    speed: number; // in km/h
    heading: number; // in degrees
    accuracy: number; // in meters
  };
  collisionRisk?: boolean; // Whether there is a risk of collision
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string; // ISO date string
  time: string; // Format: "HH:MM"
  skiResort: string;
  meetingPoint: string;
  sponsor: Sponsor;
  image?: string;
  location?: {
    lat: number;
    lng: number;
  };
}

export interface Sponsor {
  id: string;
  name: string;
  logo: string;
  color?: string; // Brand color for UI customization
  description?: string; // Description of the sponsor
  website?: string; // Sponsor's website URL
}

export interface PistaAlert {
  id: string;
  type: "obstacle" | "melting_snow" | "dune" | "ice" | "fog";
  description: string;
  position: GeoPoint;
  reportedBy: string;
  timestamp: number; // Unix timestamp
  active: boolean; // Whether the alert is still active
}
