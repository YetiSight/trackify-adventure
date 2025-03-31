
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Award, Flag, Map, Timer } from "lucide-react";
import { formatTime } from "@/utils/mockData";

interface UserStatsCardProps {
  user: User;
  totalTime?: number; // in minutes
}

const UserStatsCard: React.FC<UserStatsCardProps> = ({ user, totalTime = 0 }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Statistiche sciatore</CardTitle>
        <CardDescription>Le tue prestazioni complessive</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <h3 className="text-lg font-semibold">{user.name}</h3>
            
            <div className="flex items-center space-x-2 mt-1">
              <Award className="h-4 w-4 text-snow-600" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {user.rank ? `Posizione #${user.rank}` : "Non classificato"}
              </span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="flex flex-col items-center bg-snow-50 dark:bg-gray-800 p-3 rounded-lg">
            <Map className="h-5 w-5 text-snow-600 mb-1" />
            <span className="text-xs text-gray-500">Distanza totale</span>
            <span className="font-bold text-lg">{user.totalDistance.toFixed(1)} km</span>
          </div>
          
          <div className="flex flex-col items-center bg-snow-50 dark:bg-gray-800 p-3 rounded-lg">
            <Flag className="h-5 w-5 text-snow-600 mb-1" />
            <span className="text-xs text-gray-500">Velocità max</span>
            <span className="font-bold text-lg">{user.maxSpeed.toFixed(1)} km/h</span>
          </div>
          
          <div className="flex flex-col items-center bg-snow-50 dark:bg-gray-800 p-3 rounded-lg">
            <Timer className="h-5 w-5 text-snow-600 mb-1" />
            <span className="text-xs text-gray-500">Tempo totale</span>
            <span className="font-bold text-lg">{formatTime(totalTime)}</span>
          </div>
          
          <div className="flex flex-col items-center bg-snow-50 dark:bg-gray-800 p-3 rounded-lg">
            <Award className="h-5 w-5 text-snow-600 mb-1" />
            <span className="text-xs text-gray-500">Sessioni</span>
            <span className="font-bold text-lg">{user.totalSessions}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserStatsCard;
