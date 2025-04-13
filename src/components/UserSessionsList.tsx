
import React from "react";
import { Session } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Map, Ruler, Clock } from "lucide-react";
import { formatTime } from "@/utils/mockData";

interface UserSessionsListProps {
  sessions: Session[];
}

const getSlopeColor = (level: string | undefined) => {
  switch (level) {
    case "easy": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300";
    case "medium": return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300";
    case "hard": return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300";
    case "extreme": return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300";
    default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300";
  }
};

const UserSessionsList: React.FC<UserSessionsListProps> = ({ sessions }) => {
  // Verifica se sessions è undefined o null
  const validSessions = sessions ? sessions : [];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sessioni recenti</CardTitle>
        <CardDescription>Le tue ultime attività registrate</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {validSessions && validSessions.length > 0 ? (
            validSessions.map((session) => (
              <div 
                key={session.id} 
                className="border border-snow-100 dark:border-gray-800 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-snow-600" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{session.date}</span>
                  </div>
                  <Badge className={getSlopeColor(session.slopeLevel)}>
                    {session.slopeLevel && session.slopeLevel.charAt(0).toUpperCase() + session.slopeLevel.slice(1)}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                      <Ruler className="w-4 h-4" />
                      <span>Distanza</span>
                    </div>
                    <span className="font-semibold">{session.distance} km</span>
                  </div>
                  
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span>Durata</span>
                    </div>
                    <span className="font-semibold">{formatTime(session.duration)}</span>
                  </div>
                  
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                      <Map className="w-4 h-4" />
                      <span>Altitudine max</span>
                    </div>
                    <span className="font-semibold">{session.maxAltitude} m</span>
                  </div>
                  
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                      <Map className="w-4 h-4" />
                      <span>Velocità max</span>
                    </div>
                    <span className="font-semibold">{session.maxSpeed} km/h</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-gray-500">
              Nessuna sessione registrata
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserSessionsList;
