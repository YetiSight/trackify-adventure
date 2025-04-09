
import React, { useState } from "react";
import { useArduinoStore } from "@/services/ArduinoService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Wifi, WifiOff, Loader2, Network, CloudOff } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const ArduinoConnect: React.FC = () => {
  const { connectionState, connectionMode, connectToArduino, disconnectFromArduino } = useArduinoStore();
  const [ipAddress, setIpAddress] = useState("192.168.1.100");
  const [port, setPort] = useState("80");
  const [mode, setMode] = useState<"direct" | "remote">("direct");
  
  const handleConnect = () => {
    connectToArduino(ipAddress, port, mode);
  };
  
  const handleDisconnect = () => {
    disconnectFromArduino();
  };
  
  const renderConnectionStatus = () => {
    switch(connectionState) {
      case "connected":
        return (
          <div className="flex items-center text-green-600 dark:text-green-500">
            <Wifi className="h-4 w-4 mr-2" />
            <span>Connesso {connectionMode === "remote" ? "(Remoto)" : "(Diretto)"}</span>
          </div>
        );
      case "connecting":
        return (
          <div className="flex items-center text-amber-600 dark:text-amber-500">
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            <span>Connessione in corso...</span>
          </div>
        );
      case "error":
        return (
          <div className="flex items-center text-red-600 dark:text-red-500">
            <WifiOff className="h-4 w-4 mr-2" />
            <span>Errore di connessione</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <WifiOff className="h-4 w-4 mr-2" />
            <span>Disconnesso</span>
          </div>
        );
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Connessione Arduino</CardTitle>
        <CardDescription>
          Connettiti ad Arduino UNO R4 WiFi per ricevere i dati in tempo reale
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Stato: </span>
            {renderConnectionStatus()}
          </div>
          
          <div className="space-y-2">
            <RadioGroup 
              value={mode} 
              onValueChange={(value) => setMode(value as "direct" | "remote")}
              className="flex mb-4 space-x-4"
              disabled={connectionState === "connected" || connectionState === "connecting"}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="direct" id="direct" />
                <Label htmlFor="direct" className="flex items-center cursor-pointer">
                  <Wifi className="h-4 w-4 mr-1" />
                  Rete locale
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="remote" id="remote" />
                <Label htmlFor="remote" className="flex items-center cursor-pointer">
                  <Network className="h-4 w-4 mr-1" />
                  Remoto
                </Label>
              </div>
            </RadioGroup>
            
            {mode === "direct" && (
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <Input
                    type="text"
                    value={ipAddress}
                    onChange={(e) => setIpAddress(e.target.value)}
                    placeholder="192.168.1.100"
                    disabled={connectionState === "connected" || connectionState === "connecting"}
                    aria-label="Indirizzo IP Arduino"
                  />
                </div>
                <div>
                  <Input
                    type="text"
                    value={port}
                    onChange={(e) => setPort(e.target.value)}
                    placeholder="80"
                    disabled={connectionState === "connected" || connectionState === "connecting"}
                    aria-label="Porta WebSocket"
                  />
                </div>
              </div>
            )}
            
            {mode === "remote" && (
              <div className="text-sm text-muted-foreground bg-muted p-2 rounded mb-2">
                La modalità remota si connette tramite un broker per accedere ad Arduino da qualsiasi rete.
                {!ipAddress && <div className="mt-1 text-amber-600">Inserisci l'ID del dispositivo</div>}
              </div>
            )}
            
            <div className="flex justify-end">
              {connectionState === "connected" || connectionState === "connecting" ? (
                <Button 
                  variant="destructive" 
                  onClick={handleDisconnect}
                >
                  Disconnetti
                </Button>
              ) : (
                <Button 
                  onClick={handleConnect}
                  variant="default"
                >
                  Connetti
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ArduinoConnect;
