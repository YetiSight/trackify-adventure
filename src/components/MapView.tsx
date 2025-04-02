
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useArduinoStore } from "@/services/ArduinoService";
import { getCurrentSensorData } from "@/utils/mockData";
import { MapPin, AlertTriangle, Snowflake, Mountain, AlertCircle } from "lucide-react";
import { PistaAlert, GeoPoint } from "@/types";
import AlertReporter from "./AlertReporter";
import { useToast } from "@/hooks/use-toast";

// Mock data for slope alerts
const initialAlerts: PistaAlert[] = [
  {
    id: "alert-1",
    type: "obstacle",
    description: "Ramo caduto sulla pista blu",
    position: { lat: 46.5132, lng: 11.3381 },
    reportedBy: "Mario",
    timestamp: Date.now() - 3600000, // 1 hour ago
    active: true,
  },
  {
    id: "alert-2",
    type: "melting_snow",
    description: "Neve sciolta alla fine della pista rossa",
    position: { lat: 46.5152, lng: 11.3391 },
    reportedBy: "Luca",
    timestamp: Date.now() - 7200000, // 2 hours ago
    active: true,
  },
  {
    id: "alert-3",
    type: "ice",
    description: "Zona ghiacciata pericolosa",
    position: { lat: 46.5172, lng: 11.3371 },
    reportedBy: "Alice",
    timestamp: Date.now() - 5400000, // 1.5 hours ago
    active: true,
  },
];

const MapView = () => {
  const { connectionState, sensorData } = useArduinoStore();
  const [displayData, setDisplayData] = useState(getCurrentSensorData());
  const [alerts, setAlerts] = useState<PistaAlert[]>(initialAlerts);
  const { toast } = useToast();
  
  // Use real data if connected, otherwise use mock data
  useEffect(() => {
    if (connectionState === "connected" && sensorData) {
      setDisplayData(sensorData);
    } else {
      setDisplayData(getCurrentSensorData());
    }
  }, [connectionState, sensorData]);

  const handleReportAlert = (alertData: Omit<PistaAlert, "id" | "timestamp" | "active">) => {
    const newAlert: PistaAlert = {
      id: `alert-${Date.now()}`,
      timestamp: Date.now(),
      active: true,
      ...alertData,
    };
    
    setAlerts([newAlert, ...alerts]);
    
    toast({
      title: "Segnalazione ricevuta",
      description: `Hai segnalato un problema: ${alertData.description}`,
    });
  };

  const getAlertIcon = (type: PistaAlert["type"]) => {
    switch (type) {
      case "obstacle":
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case "melting_snow":
        return <Snowflake className="h-5 w-5 text-blue-400" />;
      case "dune":
        return <Mountain className="h-5 w-5 text-amber-500" />;
      case "ice":
        return <AlertCircle className="h-5 w-5 text-blue-600" />;
      case "fog":
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
    }
  };

  const getAlertTooltip = (alert: PistaAlert) => {
    const date = new Date(alert.timestamp);
    const timeString = date.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
    
    const typeMap: Record<PistaAlert["type"], string> = {
      obstacle: "Ostacolo",
      melting_snow: "Neve sciolta",
      dune: "Dune di neve",
      ice: "Ghiaccio",
      fog: "Nebbia"
    };
    
    return `${typeMap[alert.type]}: ${alert.description}\nSegnalato da: ${alert.reportedBy} alle ${timeString}`;
  };
  
  // For a real map implementation, you would use a library like Leaflet or Google Maps
  // Here we're showing a placeholder with coordinates
  const renderMapPlaceholder = () => {
    return (
      <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] bg-snow-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden rounded-lg">
        <div className="text-center z-10 bg-white/80 dark:bg-gray-800/80 p-4 sm:p-6 rounded-lg max-w-[90%]">
          {connectionState === "connected" ? (
            <>
              <h3 className="text-xl sm:text-2xl font-semibold text-snow-800 dark:text-snow-200 mb-2">
                Dati GPS in tempo reale
              </h3>
              <p className="text-sm sm:text-base text-snow-600 dark:text-snow-400 mb-4">
                Connessione ad Arduino stabilita! Ricevendo dati GPS...
              </p>
            </>
          ) : (
            <>
              <h3 className="text-xl sm:text-2xl font-semibold text-snow-800 dark:text-snow-200 mb-2">
                Mappa in caricamento
              </h3>
              <p className="text-sm sm:text-base text-snow-600 dark:text-snow-400 mb-4">
                Connetti Arduino per visualizzare dati in tempo reale
              </p>
            </>
          )}
          
          <div className="grid grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm">
            <div className="bg-white dark:bg-gray-700 p-2 rounded">
              <div className="text-gray-500 dark:text-gray-400">Latitudine</div>
              <div className="font-mono font-medium">
                {displayData.gps.position.lat.toFixed(6)}°
              </div>
            </div>
            <div className="bg-white dark:bg-gray-700 p-2 rounded">
              <div className="text-gray-500 dark:text-gray-400">Longitudine</div>
              <div className="font-mono font-medium">
                {displayData.gps.position.lng.toFixed(6)}°
              </div>
            </div>
            <div className="bg-white dark:bg-gray-700 p-2 rounded">
              <div className="text-gray-500 dark:text-gray-400">Altitudine</div>
              <div className="font-mono font-medium">
                {displayData.imu.altitude} m
              </div>
            </div>
            <div className="bg-white dark:bg-gray-700 p-2 rounded">
              <div className="text-gray-500 dark:text-gray-400">Velocità</div>
              <div className="font-mono font-medium">
                {displayData.gps.speed.toFixed(1)} km/h
              </div>
            </div>
          </div>

          <div className="mt-4">
            <AlertReporter 
              currentPosition={displayData.gps.position} 
              onReportAlert={handleReportAlert} 
            />
          </div>
        </div>
        
        {/* Map background with fake position indicator and alerts */}
        <div className="absolute inset-0 bg-sky-50 dark:bg-gray-900 opacity-50 overflow-hidden">
          <div className="w-full h-full relative grid grid-cols-4 grid-rows-4 opacity-30">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className="border border-snow-200 dark:border-gray-700"></div>
            ))}
          </div>
          
          {/* User position marker */}
          <div className="absolute"
              style={{
                top: `${50 - Math.random() * 10}%`,
                left: `${50 - Math.random() * 10}%`,
                animation: "pulse 2s infinite",
                zIndex: 5
              }}>
            <MapPin className="h-6 w-6 sm:h-8 sm:w-8 text-alpine-600" />
          </div>
          
          {/* Alert markers */}
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="absolute"
              style={{
                top: `${30 + (alert.position.lat - 46.51) * 1000}%`,
                left: `${40 + (alert.position.lng - 11.33) * 1000}%`,
                zIndex: 10
              }}
              title={getAlertTooltip(alert)}
            >
              <div className="animate-pulse">
                {getAlertIcon(alert.type)}
              </div>
              <div className="bg-white dark:bg-gray-800 rounded px-1 py-0.5 text-[10px] shadow-md mt-1 whitespace-nowrap overflow-hidden max-w-[100px] text-ellipsis">
                {alert.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardContent className="p-0">
        <div className="map-container w-full overflow-hidden">
          {renderMapPlaceholder()}
        </div>
      </CardContent>
    </Card>
  );
};

export default MapView;
