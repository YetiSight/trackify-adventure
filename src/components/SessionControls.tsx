
import React from "react";
import { Button } from "@/components/ui/button";
import { useSessionStore } from "@/services/SessionService";
import { useArduinoStore } from "@/services/ArduinoService";
import { Play, Stop, RotateCcw, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const SessionControls: React.FC = () => {
  const { isActive, startSession, stopSession, resetSession } = useSessionStore();
  const { connectionState, connectionMode } = useArduinoStore();
  
  const isConnected = connectionState === "connected";
  const isThinkspeakConnected = isConnected && connectionMode === "thingspeak";

  return (
    <div className="space-y-4">
      {!isThinkspeakConnected && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Per avviare una sessione, devi prima connetterti a ThingSpeak.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="flex flex-wrap gap-3">
        <Button
          onClick={startSession}
          disabled={!isThinkspeakConnected || isActive}
          className="bg-green-600 hover:bg-green-700"
        >
          <Play className="mr-2 h-4 w-4" />
          Avvia Sessione
        </Button>
        
        <Button
          onClick={stopSession}
          disabled={!isActive}
          className="bg-red-600 hover:bg-red-700"
        >
          <Stop className="mr-2 h-4 w-4" />
          Ferma Sessione
        </Button>
        
        <Button
          onClick={resetSession}
          disabled={isActive}
          variant="outline"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset
        </Button>
      </div>
    </div>
  );
};

export default SessionControls;
