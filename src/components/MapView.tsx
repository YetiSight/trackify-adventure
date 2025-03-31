
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useArduinoStore } from "@/services/ArduinoService";
import { getCurrentSensorData } from "@/utils/mockData";
import { MapPin } from "lucide-react";

const MapView = () => {
  const { connectionState, sensorData } = useArduinoStore();
  const [displayData, setDisplayData] = useState(getCurrentSensorData());
  
  // Use real data if connected, otherwise use mock data
  useEffect(() => {
    if (connectionState === "connected" && sensorData) {
      setDisplayData(sensorData);
    } else {
      setDisplayData(getCurrentSensorData());
    }
  }, [connectionState, sensorData]);
  
  // For a real map implementation, you would use a library like Leaflet or Google Maps
  // Here we're showing a placeholder with coordinates
  const renderMapPlaceholder = () => {
    return (
      <div className="relative w-full h-[400px] bg-snow-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden rounded-lg">
        <div className="text-center z-10 bg-white/80 dark:bg-gray-800/80 p-6 rounded-lg">
          {connectionState === "connected" ? (
            <>
              <h3 className="text-2xl font-semibold text-snow-800 dark:text-snow-200 mb-2">
                Dati GPS in tempo reale
              </h3>
              <p className="text-snow-600 dark:text-snow-400 mb-4">
                Connessione ad Arduino stabilita! Ricevendo dati GPS...
              </p>
            </>
          ) : (
            <>
              <h3 className="text-2xl font-semibold text-snow-800 dark:text-snow-200 mb-2">
                Mappa in caricamento
              </h3>
              <p className="text-snow-600 dark:text-snow-400 mb-4">
                Connetti Arduino per visualizzare dati in tempo reale
              </p>
            </>
          )}
          
          <div className="grid grid-cols-2 gap-4 text-sm">
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
        </div>
        
        {/* Map background with fake position indicator */}
        <div className="absolute inset-0 bg-sky-50 dark:bg-gray-900 opacity-50 overflow-hidden">
          <div className="w-full h-full relative grid grid-cols-4 grid-rows-4 opacity-30">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className="border border-snow-200 dark:border-gray-700"></div>
            ))}
          </div>
          <div className="absolute"
              style={{
                top: `${50 - Math.random() * 10}%`,
                left: `${50 - Math.random() * 10}%`,
                animation: "pulse 2s infinite"
              }}>
            <MapPin className="h-8 w-8 text-alpine-600" />
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardContent className="p-0">
        <div className="map-container">
          {renderMapPlaceholder()}
        </div>
      </CardContent>
    </Card>
  );
};

export default MapView;
