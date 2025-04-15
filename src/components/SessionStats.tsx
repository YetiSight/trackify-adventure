
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Gauge, Timer, Route, ArrowUp, Activity, Mountain, AlertTriangle } from "lucide-react";
import { useSessionStore } from "@/services/SessionService";
import StatCard from "@/components/StatCard";

const SessionStats: React.FC = () => {
  const { 
    isActive, 
    duration, 
    distance, 
    averageSpeed, 
    maxSpeed, 
    currentSpeed,
    maxAltitude,
    collisionRisks 
  } = useSessionStore();

  // Formatta la durata in formato mm:ss o hh:mm:ss
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <StatCard
        title="Durata"
        value={formatDuration(duration)}
        icon={<Timer className="h-5 w-5 text-blue-600" />}
        color="blue"
      />
      
      <StatCard
        title="Distanza"
        value={`${distance.toFixed(2)} km`}
        icon={<Route className="h-5 w-5 text-green-600" />}
        color="green"
      />
      
      <StatCard
        title="Velocità Attuale"
        value={`${currentSpeed.toFixed(1)} km/h`}
        icon={<Gauge className="h-5 w-5 text-red-600" />}
        color="red"
      />
      
      <StatCard
        title="Velocità Media"
        value={`${averageSpeed.toFixed(1)} km/h`}
        icon={<Activity className="h-5 w-5 text-purple-600" />}
        color="purple"
      />
      
      <StatCard
        title="Velocità Max"
        value={`${maxSpeed.toFixed(1)} km/h`}
        icon={<ArrowUp className="h-5 w-5 text-amber-600" />}
        color="amber"
      />
      
      <StatCard
        title="Altitudine Max"
        value={`${maxAltitude.toFixed(0)} m`}
        icon={<Mountain className="h-5 w-5 text-indigo-600" />}
        color="indigo"
      />
      
      <StatCard
        title="Rischi Collisione"
        value={collisionRisks}
        icon={<AlertTriangle className="h-5 w-5 text-orange-600" />}
        color="orange"
      />
    </div>
  );
};

export default SessionStats;
