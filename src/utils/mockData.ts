import { User, Session, Notification, SensorData, Event, Sponsor } from "../types";

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

export const mockSponsors: Sponsor[] = [
  {
    id: "s1",
    name: "Red Bull",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Red_Bull_logo.svg/1200px-Red_Bull_logo.svg.png",
    color: "#1E2759",
    description: "Red Bull è un'azienda austriaca che produce la famosa bevanda energetica. Nota per sponsorizzare eventi sportivi estremi e atleti di alto livello.",
    website: "https://www.redbull.com"
  },
  {
    id: "s2",
    name: "The North Face",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/The_North_Face_logo.svg/2560px-The_North_Face_logo.svg.png",
    color: "#000000",
    description: "The North Face è un'azienda americana di abbigliamento e attrezzature per attività outdoor, specializzata in prodotti per alpinismo, sci e sport invernali.",
    website: "https://www.thenorthface.com"
  },
  {
    id: "s3",
    name: "Salomon",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Salomon_logo.svg/2560px-Salomon_logo.svg.png",
    color: "#1A1A1A",
    description: "Salomon è un'azienda francese leader nella produzione di attrezzature sportive per la montagna, specializzata in sci, scarponi e abbigliamento tecnico.",
    website: "https://www.salomon.com"
  },
  {
    id: "s4",
    name: "GoPro",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/GoPro_logo.svg/2560px-GoPro_logo.svg.png",
    color: "#00A3E1",
    description: "GoPro è un'azienda americana che produce action camera di alta qualità, perfette per catturare i tuoi momenti più avventurosi sulle piste da sci.",
    website: "https://gopro.com"
  }
];

export const mockEvents: Event[] = [
  {
    id: "e1",
    title: "Gara di discesa libera SafeSight",
    description: "Partecipa alla gara di discesa libera sponsorizzata da Red Bull. Premi per i primi 3 classificati. Registra la tua discesa con l'app SafeSight!\n\nL'evento è aperto a sciatori di tutti i livelli, con categorie separate per principianti, intermedi ed esperti. I partecipanti dovranno indossare il dispositivo SafeSight per monitorare la loro performance e garantire la sicurezza durante la discesa.\n\nVieni a metterti alla prova e dimostra le tue abilità sugli sci!",
    date: "2024-07-15",
    time: "10:00",
    skiResort: "Cortina d'Ampezzo",
    meetingPoint: "Stazione di partenza Ski Area Faloria",
    sponsor: mockSponsors[0],
    image: "https://images.unsplash.com/photo-1519677583113-44abba31621b"
  },
  {
    id: "e2",
    title: "Workshop Sicurezza in montagna",
    description: "Workshop gratuito sulla sicurezza in montagna con esperti del settore. Impara a utilizzare SafeSight per aumentare la tua sicurezza sulle piste.\n\nDurante il workshop verranno trattati temi come la prevenzione degli incidenti, le tecniche di autosoccorso e l'utilizzo delle funzionalità avanzate dell'app SafeSight per monitorare l'ambiente circostante e rilevare potenziali pericoli.\n\nIl workshop è adatto sia ai principianti che agli sciatori esperti.",
    date: "2024-07-20",
    time: "14:30",
    skiResort: "Cortina d'Ampezzo",
    meetingPoint: "Centro servizi Ski Area Tofana",
    sponsor: mockSponsors[1],
    image: "https://images.unsplash.com/photo-1506197061617-7f5c0b093236"
  },
  {
    id: "e3",
    title: "SafeSight Snow Night",
    description: "Serata sulla neve con discesa notturna assistita dal sistema SafeSight. DJ set e rinfresco offerto da Salomon.\n\nVivi l'emozione di sciare sotto le stelle con la sicurezza garantita dal sistema di rilevamento SafeSight. Le piste saranno illuminate e monitorate dai nostri operatori per garantire la massima sicurezza.\n\nDopo la discesa, unisciti a noi per un rinfresco e musica con DJ set presso il rifugio Patascoss.",
    date: "2024-07-25",
    time: "19:00",
    skiResort: "Madonna di Campiglio",
    meetingPoint: "Rifugio Patascoss",
    sponsor: mockSponsors[2],
    image: "https://images.unsplash.com/photo-1517824806704-9040b037703b"
  },
  {
    id: "e4",
    title: "Test Equipment SafeSight",
    description: "Prova gratuita dei sensori SafeSight con i nostri tecnici. Scopri come migliorare la tua sicurezza sulle piste.\n\nI nostri esperti ti guideranno nell'installazione e configurazione del sistema SafeSight sui tuoi dispositivi. Potrai testare tutte le funzionalità avanzate come il rilevamento ostacoli, la rilevazione di movimenti anomali e il sistema di allarme di emergenza.\n\nPrendi parte a una breve sessione di test sulle piste per sperimentare il sistema in azione!",
    date: "2024-07-30",
    time: "09:30",
    skiResort: "Madonna di Campiglio",
    meetingPoint: "Ufficio Ski Pass Centrale",
    sponsor: mockSponsors[3],
    image: "https://images.unsplash.com/photo-1548345332-61a73e8c5581"
  },
  {
    id: "e5",
    title: "Competizione Freeride",
    description: "Gara di freeride con tracciamento SafeSight. Partecipazione gratuita per tutti gli utenti dell'app.\n\nMetti alla prova le tue abilità in fuoripista in totale sicurezza grazie alla tecnologia SafeSight. I partecipanti saranno valutati per tecnica, stile e creatività. Il sistema SafeSight monitorerà il percorso e le performance, fornendo dati dettagliati che saranno utilizzati per la classifica finale.\n\nIscrizione gratuita per tutti gli utenti dell'app SafeSight!",
    date: "2024-08-05",
    time: "11:00",
    skiResort: "Livigno",
    meetingPoint: "Carosello 3000",
    sponsor: mockSponsors[0],
    image: "https://images.unsplash.com/photo-1515598379512-b4323386706c"
  },
  {
    id: "e6",
    title: "Demo Day - Novità SafeSight",
    description: "Presentazione delle nuove funzionalità dell'app SafeSight con possibilità di test sul campo.\n\nScopri in anteprima le nuove funzionalità dell'app SafeSight e prova sul campo i nuovi sensori di rilevamento avanzato. I nostri ingegneri saranno disponibili per rispondere a tutte le tue domande e raccogliere feedback per migliorare ulteriormente il sistema.\n\nPartecipando riceverai un coupon sconto del 20% per l'acquisto o l'aggiornamento del tuo dispositivo SafeSight.",
    date: "2024-08-10",
    time: "10:00",
    skiResort: "Livigno",
    meetingPoint: "Centro Servizi Mottolino",
    sponsor: mockSponsors[1],
    image: "https://images.unsplash.com/photo-1565992441121-4367c2967103"
  }
];

export const events = mockEvents;

events.forEach((event, index) => {
  // Coordinate di esempio per vari impianti sciistici
  const sampleLocations = [
    { lat: 46.5295, lng: 11.9363 }, // Val Gardena
    { lat: 46.4039, lng: 11.8735 }, // Canazei
    { lat: 46.5404, lng: 10.1350 }, // Bormio
    { lat: 45.9372, lng: 6.8697 },  // Chamonix
    { lat: 45.0081, lng: 6.1183 },  // Sestriere
    { lat: 46.2150, lng: 10.0872 }, // Ponte di Legno
  ];
  
  const locationIndex = index % sampleLocations.length;
  event.location = sampleLocations[locationIndex];
});

export const getCurrentUser = (): User => mockUsers[0];

export const getAllUsers = (): User[] => mockUsers;

export const getUserSessions = (userId: string): Session[] => 
  mockSessions.filter(session => session.userId === userId);

export const getNotifications = (): Notification[] => mockNotifications;

export const getCurrentSensorData = (): SensorData => mockCurrentSensorData;

export const getAllEvents = (): Event[] => mockEvents;

export const getEventsByResort = (skiResort: string): Event[] => 
  mockEvents.filter(event => event.skiResort === skiResort);

export const getAllSkiResorts = (): string[] => 
  [...new Set(mockEvents.map(event => event.skiResort))];

export const getEventById = (eventId: string): Event | undefined => 
  mockEvents.find(event => event.id === eventId);

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
