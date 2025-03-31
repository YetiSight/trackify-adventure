
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import MapView from "@/components/MapView";
import ArduinoConnect from "@/components/ArduinoConnect";
import { getCurrentSensorData } from "@/utils/mockData";
import { useArduinoStore } from "@/services/ArduinoService";
import { Compass, Locate, Map as MapIcon, Navigation } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

const Map: React.FC = () => {
  const { sensorData, connectionState } = useArduinoStore();
  const displayData = sensorData || getCurrentSensorData();
  const isMobile = useIsMobile();
  
  return (
    <MainLayout>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Mappa</h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
              Tracciamento in tempo reale e percorsi
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <Button size={isMobile ? "sm" : "default"} variant="outline" className="flex-1 sm:flex-auto">
              <Locate className="h-4 w-4 mr-1" />
              Centrami
            </Button>
            
            <Button size={isMobile ? "sm" : "default"} variant="outline" className="flex-1 sm:flex-auto">
              <MapIcon className="h-4 w-4 mr-1" />
              Cambia Vista
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 lg:row-span-2">
            <MapView />
          </div>
          
          <div className="order-first lg:order-none mb-2 lg:mb-0">
            <ArduinoConnect />
          </div>
          
          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-3">Orientamento</h3>
              
              <div className="flex justify-center mb-4">
                <div className="relative w-24 h-24">
                  <div className="absolute inset-0 rounded-full border-2 border-snow-200 dark:border-gray-700"></div>
                  <div 
                    className="absolute w-1 h-12 bg-alpine-600 rounded-full top-0 left-1/2 -ml-0.5 origin-bottom"
                    style={{ transform: `rotate(${displayData.gps.heading}deg)` }}
                  ></div>
                  <div className="absolute top-2 left-1/2 -ml-1.5 text-xs font-semibold">N</div>
                  <div className="absolute bottom-2 left-1/2 -ml-1.5 text-xs font-semibold">S</div>
                  <div className="absolute left-2 top-1/2 -mt-1.5 text-xs font-semibold">W</div>
                  <div className="absolute right-2 top-1/2 -mt-1.5 text-xs font-semibold">E</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Direzione</span>
                  <span className="font-medium flex items-center">
                    <Navigation className="h-4 w-4 mr-1 text-snow-600" />
                    {displayData.gps.heading}°
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Pitch</span>
                  <span className="font-medium">{displayData.imu.orientation.pitch.toFixed(1)}°</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Roll</span>
                  <span className="font-medium">{displayData.imu.orientation.roll.toFixed(1)}°</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Map;
