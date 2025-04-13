
import React from "react";
import { useArduinoStore } from "@/services/ArduinoService";
import { predefinedChannels } from "@/services/ThingSpeakService";
import { Badge } from "@/components/ui/badge";
import { Wifi, AlertTriangle, Clock, Gauge } from "lucide-react";

const ConnectionStatus: React.FC = () => {
  const { 
    connectionState, 
    connectionMode, 
    lastUpdated,
    thingspeakChannelId
  } = useArduinoStore();
  
  const getConnectedChannelName = () => {
    if (!thingspeakChannelId) return "ThingSpeak";
    const channel = predefinedChannels.find(c => c.id === thingspeakChannelId);
    return channel ? channel.name : `Canale ${thingspeakChannelId}`;
  };
  
  const getTimeSinceLastUpdate = () => {
    if (!lastUpdated) return "N/A";
    
    const secondsAgo = Math.floor((Date.now() - lastUpdated) / 1000);
    
    if (secondsAgo < 60) {
      return `${secondsAgo}s fa`;
    } else if (secondsAgo < 3600) {
      return `${Math.floor(secondsAgo / 60)}m fa`;
    } else {
      return `${Math.floor(secondsAgo / 3600)}h fa`;
    }
  };
  
  if (connectionState === "connected" && connectionMode === "thingspeak") {
    return (
      <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1.5">
          <Gauge className="h-3.5 w-3.5" />
          Connesso a {getConnectedChannelName()}
        </Badge>
        
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5" />
          Ultimo aggiornamento: {getTimeSinceLastUpdate()}
        </Badge>
      </div>
    );
  }
  
  return (
    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 flex items-center gap-1.5">
      <AlertTriangle className="h-3.5 w-3.5" />
      Non connesso a ThingSpeak
    </Badge>
  );
};

export default ConnectionStatus;
