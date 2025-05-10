
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import { 
  getCurrentUser, 
  getUserSessions, 
  getCurrentSensorData,
  getNotifications
} from "@/utils/mockData";
import { Activity, Map, Ruler, Navigation } from "lucide-react";
import StatCard from "@/components/StatCard";
import MapView from "@/components/MapView";
import CurrentSessionCard from "@/components/CurrentSessionCard";
import NotificationsCard from "@/components/NotificationsCard";
import { useArduinoStore } from "@/services/ArduinoService";
import TestSessionButton from "@/components/TestSessionButton";

const Index: React.FC = () => {
  const currentUser = getCurrentUser();
  const sessions = getUserSessions(currentUser.id);
  const mockSensorData = getCurrentSensorData();
  const notifications = getNotifications();
  const { sensorData, connectionState } = useArduinoStore();
  
  // Use Arduino data if connected, otherwise use mock data
  const displayData = connectionState === "connected" && sensorData ? sensorData : mockSensorData;
  
  // Calcola la distanza attuale dalla sessione fittizia in corso
  const currentSessionDistance = displayData.gps.speed * 0.5 / 60; // km (velocità × tempo in ore)

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Ciao, {currentUser.name.split(' ')[0]}!</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Ecco i tuoi dati di tracciamento in tempo reale
            </p>
          </div>
          <TestSessionButton />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            title="Distanza attuale" 
            value={`${currentSessionDistance.toFixed(2)} km`} 
            icon={<Ruler className="h-5 w-5 text-snow-600" />}
            trend={{ value: 5.2, isPositive: true }}
          />
          
          <StatCard 
            title="Velocità attuale" 
            value={`${displayData.gps.speed.toFixed(1)} km/h`} 
            icon={<Activity className="h-5 w-5 text-snow-600" />}
            trend={{ value: 3.8, isPositive: true }}
          />
          
          <StatCard 
            title="Altitudine" 
            value={`${displayData.imu.altitude} m`} 
            icon={<Map className="h-5 w-5 text-snow-600" />}
            trend={{ value: 2.1, isPositive: false }}
          />
          
          <StatCard 
            title="Direzione" 
            value={`${displayData.gps.heading}°`} 
            icon={<Navigation className="h-5 w-5 text-snow-600" />}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <MapView />
          </div>
          
          <div className="space-y-6">
            <CurrentSessionCard sensorData={displayData} />
            <NotificationsCard notifications={notifications.slice(0, 3)} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
