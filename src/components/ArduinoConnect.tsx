
import React, { useState } from "react";
import { useArduinoStore } from "@/services/ArduinoService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Wifi, WifiOff, Loader2, Network, Shield, ShieldAlert } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const ArduinoConnect: React.FC = () => {
  const { connectionState, connectionMode, connectToArduino, disconnectFromArduino } = useArduinoStore();
  const [ipAddress, setIpAddress] = useState("192.168.1.100");
  const [port, setPort] = useState("80");
  const [mode, setMode] = useState<"direct" | "remote">("direct");
  const [secureMode, setSecureMode] = useState<"secure" | "insecure">("secure");
  
  const handleConnect = () => {
    connectToArduino(ipAddress, port, mode, secureMode);
  };
  
  const handleDisconnect = () => {
    disconnectFromArduino();
  };
  
  const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';
  
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
              <>
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
                
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm">Connessione sicura</span>
                            {secureMode === "secure" ? <Shield className="h-4 w-4 text-green-600" /> : <ShieldAlert className="h-4 w-4 text-amber-600" />}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs max-w-xs">
                            {secureMode === "secure" 
                              ? "Usa connessione WebSocket sicura (WSS). Richiede che l'Arduino supporti SSL/TLS (porta 443)." 
                              : "Usa connessione WebSocket non sicura (WS). Potrebbe essere bloccata dal browser in modalità HTTPS."}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Switch 
                    checked={secureMode === "secure"}
                    onCheckedChange={(checked) => setSecureMode(checked ? "secure" : "insecure")}
                    disabled={connectionState === "connected" || connectionState === "connecting"}
                  />
                </div>
                
                {isHttps && secureMode === "insecure" && (
                  <div className="text-xs text-amber-600 bg-amber-50 dark:bg-amber-900/20 p-2 rounded">
                    Attenzione: Il browser potrebbe bloccare connessioni WS non sicure quando la pagina è caricata in HTTPS. 
                    Se la connessione fallisce, prova ad usare WSS (porta 443) o la modalità remota.
                  </div>
                )}

                <div className="text-xs text-muted-foreground mt-1">
                  <p>Porte consigliate:</p>
                  <ul className="list-disc pl-4 mt-1 space-y-0.5">
                    <li>Porta 80: WebSocket standard (WS)</li>
                    <li>Porta 443: WebSocket sicuro (WSS)</li>
                    <li>Porta 81, 8080, 8081: Alternative comuni</li>
                  </ul>
                </div>
              </>
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
