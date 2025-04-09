
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import MapView from "@/components/MapView";
import ArduinoConnect from "@/components/ArduinoConnect";
import { getCurrentSensorData } from "@/utils/mockData";
import { useArduinoStore } from "@/services/ArduinoService";
import { Compass, Locate, Map as MapIcon, Navigation, AlertTriangle, AlertCircle, Snowflake, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Map: React.FC = () => {
  const { sensorData, connectionState, connectionMode } = useArduinoStore();
  const displayData = sensorData || getCurrentSensorData();
  const isMobile = useIsMobile();
  const [showAlertsDialog, setShowAlertsDialog] = useState(false);
  
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

            <Button 
              size={isMobile ? "sm" : "default"} 
              variant="outline" 
              className="flex-1 sm:flex-auto text-amber-600 border-amber-300"
              onClick={() => setShowAlertsDialog(true)}
            >
              <AlertTriangle className="h-4 w-4 mr-1" />
              Segnalazioni
            </Button>
          </div>
        </div>

        {connectionState === "error" && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Impossibile connettersi all'Arduino. Verifica la connessione e prova ad utilizzare porte diverse o la modalità remota.
            </AlertDescription>
          </Alert>
        )}
        
        {connectionState === "connected" && connectionMode === "remote" && (
          <Alert className="mb-4 bg-amber-50 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400 border-amber-300">
            <Info className="h-4 w-4" />
            <AlertDescription>
              Connesso in modalità remota. Utilizzando dati simulati per dimostrare la funzionalità.
            </AlertDescription>
          </Alert>
        )}

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

        {/* Dialog for viewing all alerts */}
        <Dialog open={showAlertsDialog} onOpenChange={setShowAlertsDialog}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Segnalazioni sulla pista</DialogTitle>
            </DialogHeader>
            
            <div className="max-h-[400px] overflow-y-auto pr-2">
              {/* In a real app, this would get alerts from a shared state or API */}
              <div className="space-y-3 py-2">
                <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-md">
                  <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                  <div>
                    <div className="font-medium">Ostacolo: Ramo caduto sulla pista blu</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Segnalato da Mario - {new Date(Date.now() - 3600000).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                  <Snowflake className="h-5 w-5 text-blue-400 mt-0.5" />
                  <div>
                    <div className="font-medium">Neve sciolta: alla fine della pista rossa</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Segnalato da Luca - {new Date(Date.now() - 7200000).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <div className="font-medium">Ghiaccio: Zona ghiacciata pericolosa</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Segnalato da Alice - {new Date(Date.now() - 5400000).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-sm text-gray-500 text-center mt-4">
              Clicca sulla mappa per visualizzare le segnalazioni in tempo reale
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default Map;
