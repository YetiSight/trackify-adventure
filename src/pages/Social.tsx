
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { MapPin, Users, Share } from "lucide-react";
import { useArduinoStore } from "@/services/ArduinoService";
import { getCurrentSensorData } from "@/utils/mockData";
import NearbySkiers from "@/components/NearbySkiers";
import { useToast } from "@/hooks/use-toast";

const Social: React.FC = () => {
  const { sensorData, connectionState } = useArduinoStore();
  const displayData = sensorData || getCurrentSensorData();
  const [sharingLocation, setSharingLocation] = useState(false);
  const [showNearbySkiers, setShowNearbySkiers] = useState(false);
  const { toast } = useToast();
  
  const handleShareLocation = (checked: boolean) => {
    setSharingLocation(checked);
    
    if (checked) {
      toast({
        title: "Posizione condivisa",
        description: "Gli altri sciatori possono ora vedere la tua posizione",
        variant: "default",
      });
      
      // Se abbiamo appena attivato la condivisione, mostriamo automaticamente gli sciatori vicini
      setShowNearbySkiers(true);
    } else {
      toast({
        title: "Condivisione posizione disattivata",
        description: "La tua posizione non è più visibile agli altri sciatori",
        variant: "default",
      });
    }
  };

  return (
    <MainLayout>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Social</h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
              Condividi la tua posizione e trova altri sciatori
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share className="h-5 w-5 text-snow-600" />
                Condividi posizione
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="font-medium">Condivisione posizione</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Attiva per permettere agli altri sciatori di vedere la tua posizione sulla mappa
                    </p>
                  </div>
                  <Switch 
                    checked={sharingLocation}
                    onCheckedChange={handleShareLocation}
                  />
                </div>

                {connectionState !== "connected" && (
                  <div className="flex items-center p-3 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900 rounded-lg">
                    <div className="ml-3 text-sm">
                      <h3 className="font-medium text-amber-800 dark:text-amber-200">Arduino non connesso</h3>
                      <p className="text-amber-700 dark:text-amber-300 mt-1">
                        Connetti il tuo Arduino per condividere la tua posizione GPS reale
                      </p>
                    </div>
                  </div>
                )}

                {sharingLocation && (
                  <div className="p-4 bg-snow-50 dark:bg-gray-800 rounded-lg">
                    <h4 className="font-semibold mb-2">La tua posizione attuale:</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
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
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-snow-600" />
                Sciatori vicini
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="font-medium">Visualizza sciatori vicini</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Mostra altri sciatori che stanno condividendo la loro posizione
                    </p>
                  </div>
                  <Switch 
                    checked={showNearbySkiers}
                    onCheckedChange={setShowNearbySkiers}
                    disabled={!sharingLocation}
                  />
                </div>

                {!sharingLocation && (
                  <div className="flex items-center p-3 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900 rounded-lg">
                    <div className="ml-3 text-sm">
                      <h3 className="font-medium text-amber-800 dark:text-amber-200">Condivisione non attiva</h3>
                      <p className="text-amber-700 dark:text-amber-300 mt-1">
                        Per vedere gli altri sciatori, devi prima condividere la tua posizione
                      </p>
                    </div>
                  </div>
                )}

                {sharingLocation && showNearbySkiers && (
                  <NearbySkiers yourPosition={displayData.gps.position} />
                )}
              </div>
            </CardContent>
          </Card>

          {sharingLocation && showNearbySkiers && (
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-snow-600" />
                    Mappa sciatori
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="relative w-full h-[300px] sm:h-[400px] bg-snow-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden rounded-b-lg">
                    {/* Map placeholder with skiers */}
                    <div className="absolute inset-0 bg-sky-50 dark:bg-gray-900 opacity-50 overflow-hidden">
                      <div className="w-full h-full relative grid grid-cols-4 grid-rows-4 opacity-30">
                        {Array.from({ length: 16 }).map((_, i) => (
                          <div key={i} className="border border-snow-200 dark:border-gray-700"></div>
                        ))}
                      </div>
                      {/* Your position */}
                      <div className="absolute"
                          style={{
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            animation: "pulse 2s infinite"
                          }}>
                        <MapPin className="h-6 w-6 sm:h-8 sm:w-8 text-alpine-600" />
                      </div>
                      
                      {/* Mock nearby skiers */}
                      <div className="absolute"
                          style={{
                            top: "45%",
                            left: "48%",
                            animation: "pulse 2s infinite"
                          }}>
                        <MapPin className="h-6 w-6 text-amber-500" />
                      </div>
                      <div className="absolute"
                          style={{
                            top: "52%",
                            left: "53%",
                            animation: "pulse 2s infinite"
                          }}>
                        <MapPin className="h-6 w-6 text-blue-500" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Social;
