
import React from "react";
import { SensorData } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Gauge, Thermometer, Navigation, LocateFixed } from "lucide-react";

interface CurrentSessionCardProps {
  sensorData: SensorData;
}

const CurrentSessionCard: React.FC<CurrentSessionCardProps> = ({ sensorData }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sessione Attuale</CardTitle>
        <CardDescription>Dati in tempo reale dai sensori</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-snow-50 dark:bg-gray-800 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <Gauge className="h-5 w-5 text-snow-700 dark:text-snow-400" />
                <h4 className="font-medium">Velocità</h4>
              </div>
              <span className="text-2xl font-bold text-snow-700 dark:text-snow-300">
                {sensorData.gps.speed.toFixed(1)} <span className="text-sm font-normal">km/h</span>
              </span>
            </div>
            <Progress value={(sensorData.gps.speed / 100) * 100} className="h-1.5" />
          </div>

          <div className="bg-snow-50 dark:bg-gray-800 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <Thermometer className="h-5 w-5 text-snow-700 dark:text-snow-400" />
                <h4 className="font-medium">Altitudine</h4>
              </div>
              <span className="text-2xl font-bold text-snow-700 dark:text-snow-300">
                {sensorData.imu.altitude} <span className="text-sm font-normal">m</span>
              </span>
            </div>
            <Progress value={(sensorData.imu.altitude / 3000) * 100} className="h-1.5" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-snow-50 dark:bg-gray-800 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Navigation className="h-5 w-5 text-snow-700 dark:text-snow-400" />
              <h4 className="font-medium">Orientamento</h4>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <span className="text-xs text-gray-500 block">Roll</span>
                <span className="font-medium">{sensorData.imu.orientation.roll.toFixed(1)}°</span>
              </div>
              <div>
                <span className="text-xs text-gray-500 block">Pitch</span>
                <span className="font-medium">{sensorData.imu.orientation.pitch.toFixed(1)}°</span>
              </div>
              <div>
                <span className="text-xs text-gray-500 block">Direzione</span>
                <span className="font-medium">{sensorData.gps.heading.toFixed(0)}°</span>
              </div>
            </div>
          </div>

          <div className="bg-snow-50 dark:bg-gray-800 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <LocateFixed className="h-5 w-5 text-snow-700 dark:text-snow-400" />
              <h4 className="font-medium">Posizione GPS</h4>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <span className="text-gray-500 block">Lat</span>
                <span className="font-medium">{sensorData.gps.position.lat.toFixed(4)}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Lng</span>
                <span className="font-medium">{sensorData.gps.position.lng.toFixed(4)}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Precisione</span>
                <span className="font-medium">±{sensorData.gps.accuracy}m</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-snow-50 dark:bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
            <h4 className="font-medium">Sensori di prossimità</h4>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-xs text-gray-500 block">Distanza oggetti</span>
              <span className="font-medium">{(sensorData.ultrasonic.distance / 100).toFixed(1)}m</span>
              {sensorData.ultrasonic.distance < 300 && (
                <span className="ml-2 text-xs px-2 py-0.5 bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300 rounded-full">
                  Vicino!
                </span>
              )}
            </div>
            <div>
              <span className="text-xs text-gray-500 block">Movimento rilevato</span>
              <span className="font-medium">
                {sensorData.pir.detected ? (
                  <span className="text-amber-600 dark:text-amber-400">Sì</span>
                ) : (
                  <span className="text-gray-500">No</span>
                )}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrentSessionCard;
