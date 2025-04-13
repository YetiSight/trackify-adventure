
import React from "react";
import { Button } from "@/components/ui/button";
import { useSessionStore } from "@/services/SessionService";
import { useArduinoStore } from "@/services/ArduinoService";
import { Play, Square, RotateCcw, AlertTriangle, Save } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

const SessionControls: React.FC = () => {
  const { isActive, startSession, stopSession, resetSession, saveSession } = useSessionStore();
  const { connectionState, connectionMode } = useArduinoStore();
  const { toast } = useToast();
  
  const isConnected = connectionState === "connected";
  const isThinkspeakConnected = isConnected && connectionMode === "thingspeak";

  const handleTerminateSession = () => {
    if (isActive) {
      stopSession();
      toast({
        title: "Sessione terminata",
        description: "La sessione è stata salvata nel tuo profilo",
      });
    }
  };

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
          <Square className="mr-2 h-4 w-4" />
          Pausa
        </Button>

        <Button
          onClick={handleTerminateSession}
          disabled={!isActive}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Save className="mr-2 h-4 w-4" />
          Termina Sessione
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
