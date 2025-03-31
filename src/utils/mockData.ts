
import { User, Session, Notification, SensorData } from "../types";

export const mockUsers: User[] = [
  {
    id: "1",
    name: "Mario Rossi",
    avatar: "https://i.pravatar.cc/150?img=1",
    totalDistance: 456.7,
    maxSpeed: 78.2,
    totalSessions: 32,
    rank: 1
  },
  {
    id: "2",
    name: "Lucia Bianchi",
    avatar: "https://i.pravatar.cc/150?img=5",
    totalDistance: 398.4,
    maxSpeed: 82.1,
    totalSessions: 29,
    rank: 2
  },
  {
    id: "3",
    name: "Giovanni Verdi",
    avatar: "https://i.pravatar.cc/150?img=3",
    totalDistance: 356.9,
    maxSpeed: 75.5,
    totalSessions: 27,
    rank: 3
  },
  {
    id: "4",
    name: "Francesca Neri",
    avatar: "https://i.pravatar.cc/150?img=9",
    totalDistance: 320.2,
    maxSpeed: 68.7,
    totalSessions: 24,
    rank: 4
  },
  {
    id: "5",
    name: "Alessandro Blu",
    avatar: "https://i.pravatar.cc/150?img=6",
    totalDistance: 298.5,
    maxSpeed: 71.3,
    totalSessions: 23,
    rank: 5
  },
  {
    id: "6",
    name: "Laura Gialli",
    avatar: "https://i.pravatar.cc/150?img=10",
    totalDistance: 267.8,
    maxSpeed: 65.9,
    totalSessions: 20,
    rank: 6
  },
  {
    id: "7",
    name: "Marco Viola",
    avatar: "https://i.pravatar.cc/150?img=11",
    totalDistance: 245.3,
    maxSpeed: 69.8,
    totalSessions: 18,
    rank: 7
  },
  {
    id: "8",
    name: "Valentina Rosa",
    avatar: "https://i.pravatar.cc/150?img=12",
    totalDistance: 213.6,
    maxSpeed: 64.2,
    totalSessions: 16,
    rank: 8
  },
  {
    id: "9",
    name: "Fabio Arancio",
    avatar: "https://i.pravatar.cc/150?img=13",
    totalDistance: 187.9,
    maxSpeed: 61.4,
    totalSessions: 14,
    rank: 9
  },
  {
    id: "10",
    name: "Martina Celeste",
    avatar: "https://i.pravatar.cc/150?img=14",
    totalDistance: 162.4,
    maxSpeed: 59.7,
    totalSessions: 12,
    rank: 10
  }
];

export const mockSessions: Session[] = [
  {
    id: "s1",
    userId: "1",
    date: "2023-10-15",
    distance: 12.4,
    duration: 95,
    maxSpeed: 68.2,
    avgSpeed: 42.5,
    maxAltitude: 2450,
    altitudeDifference: 850,
    slopeLevel: "hard"
  },
  {
    id: "s2",
    userId: "1",
    date: "2023-10-10",
    distance: 9.7,
    duration: 65,
    maxSpeed: 72.8,
    avgSpeed: 45.2,
    maxAltitude: 2100,
    altitudeDifference: 720,
    slopeLevel: "medium"
  },
  {
    id: "s3",
    userId: "1",
    date: "2023-10-05",
    distance: 15.2,
    duration: 125,
    maxSpeed: 78.2,
    avgSpeed: 48.7,
    maxAltitude: 2780,
    altitudeDifference: 920,
    slopeLevel: "extreme"
  },
  {
    id: "s4",
    userId: "1",
    date: "2023-09-28",
    distance: 8.5,
    duration: 60,
    maxSpeed: 65.4,
    avgSpeed: 41.8,
    maxAltitude: 1980,
    altitudeDifference: 580,
    slopeLevel: "easy"
  },
  {
    id: "s5",
    userId: "1",
    date: "2023-09-20",
    distance: 11.8,
    duration: 85,
    maxSpeed: 70.1,
    avgSpeed: 44.3,
    maxAltitude: 2340,
    altitudeDifference: 780,
    slopeLevel: "medium"
  }
];

export const mockNotifications: Notification[] = [
  {
    id: "n1",
    type: "warning",
    message: "Oggetto rilevato in avvicinamento a 5 metri di distanza",
    timestamp: Date.now() - 120000, // 2 minuti fa
    read: false,
    sensorData: {
      type: "ultrasonic",
      value: 5
    }
  },
  {
    id: "n2",
    type: "info",
    message: "Sciatore rilevato nelle vicinanze",
    timestamp: Date.now() - 300000, // 5 minuti fa
    read: true,
    sensorData: {
      type: "pir",
      value: "true"
    }
  },
  {
    id: "n3",
    type: "warning",
    message: "Inclinazione pericolosa rilevata",
    timestamp: Date.now() - 600000, // 10 minuti fa
    read: false,
    sensorData: {
      type: "imu",
      value: "45°"
    }
  },
  {
    id: "n4",
    type: "emergency",
    message: "Posizione di emergenza inviata ai soccorsi",
    timestamp: Date.now() - 1200000, // 20 minuti fa
    read: true,
    sensorData: {
      type: "gps",
      value: { lat: 46.4086, lng: 11.8735 }
    }
  }
];

export const mockCurrentSensorData: SensorData = {
  ultrasonic: {
    distance: 850, // 8.5 meters
    velocity: 0
  },
  pir: {
    detected: false
  },
  imu: {
    acceleration: {
      x: 0.2,
      y: -0.1,
      z: 9.8
    },
    gyro: {
      x: 0.01,
      y: 0.03,
      z: -0.02
    },
    orientation: {
      roll: 2.3,
      pitch: -5.7,
      yaw: 178.2
    },
    altitude: 2134
  },
  gps: {
    position: {
      lat: 46.4086,
      lng: 11.8735,
      altitude: 2134
    },
    speed: 12.4,
    heading: 178,
    accuracy: 3.5
  }
};

export const getCurrentUser = (): User => mockUsers[0];

export const getAllUsers = (): User[] => mockUsers;

export const getUserSessions = (userId: string): Session[] => 
  mockSessions.filter(session => session.userId === userId);

export const getNotifications = (): Notification[] => mockNotifications;

export const getCurrentSensorData = (): SensorData => mockCurrentSensorData;

// Funzioni di utilità per calcoli sulle statistiche
export const calculateTotalStats = (sessions: Session[]) => {
  return {
    totalDistance: sessions.reduce((sum, session) => sum + session.distance, 0),
    totalTime: sessions.reduce((sum, session) => sum + session.duration, 0),
    avgSpeed: sessions.reduce((sum, session) => sum + session.avgSpeed, 0) / (sessions.length || 1),
    maxSpeed: Math.max(...sessions.map(session => session.maxSpeed), 0)
  };
};

export const formatTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};
