
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useArduinoStore } from "@/services/ArduinoService";
import { useSessionStore } from "@/services/SessionService";
import { generateTestSensorData } from "@/utils/testDataGenerator";
import { SensorData } from "@/types";

const TestSessionButton: React.FC = () => {
  const [isTestRunning, setIsTestRunning] = useState(false);
  const [testIntervalId, setTestIntervalId] = useState<number | null>(null);
  const { toast } = useToast();
  const { setSensorData, setConnectionState, setConnectionMode } = useArduinoStore();
  const { isActive, startSession } = useSessionStore();

  const startTestSession = () => {
    if (isTestRunning) return;
    
    // Set initial connection state to simulate ThingSpeak connection
    setConnectionState("connected");
    setConnectionMode("thingspeak");
    
    // Start the session in SessionService
    if (!isActive) {
      startSession();
    }
    
    let previousData: SensorData | undefined = undefined;
    
    // Generate new data every 2 seconds
    const intervalId = window.setInterval(() => {
      const newData = generateTestSensorData(previousData);
      setSensorData(newData);
      previousData = newData;
    }, 2000);
    
    setTestIntervalId(intervalId);
    setIsTestRunning(true);
    
    toast({
      title: "Sessione di test avviata",
      description: "I dati simulati verranno generati ogni 2 secondi",
    });
  };
  
  const stopTestSession = () => {
    if (testIntervalId !== null) {
      window.clearInterval(testIntervalId);
      setTestIntervalId(null);
      setIsTestRunning(false);
      
      toast({
        title: "Sessione di test fermata",
        description: "La generazione di dati simulati è stata interrotta",
      });
    }
  };

  return (
    <div>
      {!isTestRunning ? (
        <Button 
          onClick={startTestSession}
          className="bg-amber-600 hover:bg-amber-700"
        >
          <Play className="mr-2 h-4 w-4" />
          Avvia Sessione di Test
        </Button>
      ) : (
        <Button 
          onClick={stopTestSession}
          className="bg-amber-600 hover:bg-amber-700"
        >
          <Activity className="mr-2 h-4 w-4" />
          Ferma Test
        </Button>
      )}
    </div>
  );
};

export default TestSessionButton;
