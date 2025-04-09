
import React, { useState, useEffect } from "react";
import { useArduinoStore } from "@/services/ArduinoService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Wifi, WifiOff, Loader2, Network, Shield, ShieldAlert, WifiAlert, AlertTriangle, Clock } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";

const DEFAULT_PORTS = {
  secure: "443",
  insecure: "80"
};

const ArduinoConnect: React.FC = () => {
  const { connectionState, connectionMode, secureMode, errorType, connectToArduino, disconnectFromArduino, reconnectWithInsecure } = useArduinoStore();
  const [ipAddress, setIpAddress] = useState("192.168.1.100");
  const [port, setPort] = useState(DEFAULT_PORTS.secure);
  const [mode, setMode] = useState<"direct" | "remote">("direct");
  const [secureConnection, setSecureConnection] = useState<boolean>(true);
  const { toast } = useToast();
  
  // Update port when secure mode changes
  useEffect(() => {
    setPort(secureConnection ? DEFAULT_PORTS.secure : DEFAULT_PORTS.insecure);
  }, [secureConnection]);
  
  const handleConnect = () => {
    connectToArduino(ipAddress, port, mode, secureConnection ? "secure" : "insecure");
  };
  
  const handleDisconnect = () => {
    disconnectFromArduino();
  };
  
  const handleToggleSecure = (checked: boolean) => {
    setSecureConnection(checked);
  };
  
  const handleTryInsecure = () => {
    reconnectWithInsecure(ipAddress, DEFAULT_PORTS.insecure);
    setSecureConnection(false);
    setPort(DEFAULT_PORTS.insecure);
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
        let errorIcon = <WifiOff className="h-4 w-4 mr-2" />;
        let errorText = "Errore di connessione";
        
        if (errorType === "timeout") {
          errorIcon = <Clock className="h-4 w-4 mr-2" />;
          errorText = "Timeout di connessione";
        } else if (errorType === "network") {
          errorIcon = <WifiAlert className="h-4 w-4 mr-2" />;
          errorText = "Errore di rete";
        } else if (errorType === "forbidden") {
          errorIcon = <AlertTriangle className="h-4 w-4 mr-2" />;
          errorText = "Accesso negato";
        }
        
        return (
          <div className="flex items-center text-red-600 dark:text-red-500">
            {errorIcon}
            <span>{errorText}</span>
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
                      placeholder={secureConnection ? "443" : "80"}
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
                            {secureConnection ? <Shield className="h-4 w-4 text-green-600" /> : <ShieldAlert className="h-4 w-4 text-amber-600" />}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs max-w-xs">
                            {secureConnection 
                              ? "Usa connessione WebSocket sicura (WSS). Richiede che l'Arduino supporti SSL/TLS (porta 443)." 
                              : "Usa connessione WebSocket non sicura (WS). Potrebbe essere bloccata dal browser in modalità HTTPS."}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Switch 
                    checked={secureConnection}
                    onCheckedChange={handleToggleSecure}
                    disabled={connectionState === "connected" || connectionState === "connecting"}
                  />
                </div>
                
                {isHttps && !secureConnection && (
                  <div className="text-xs text-amber-600 bg-amber-50 dark:bg-amber-900/20 p-2 rounded">
                    Attenzione: Il browser potrebbe bloccare connessioni WS non sicure quando la pagina è caricata in HTTPS. 
                    Se la connessione fallisce, prova ad usare WSS (porta 443) o la modalità remota.
                  </div>
                )}
                
                {connectionState === "error" && secureMode === "secure" && (
                  <div className="text-xs text-blue-600 bg-blue-50 dark:bg-blue-900/20 p-2 rounded-md flex items-start gap-2 mt-2">
                    <div className="pt-0.5">
                      <AlertTriangle className="h-4 w-4 text-blue-500" />
                    </div>
                    <div>
                      <span className="font-medium">Suggerimento:</span> La connessione sicura (WSS) ha fallito. L'Arduino potrebbe non supportare connessioni sicure.
                      <div className="mt-1">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-7 text-xs border-blue-300 text-blue-700"
                          onClick={handleTryInsecure}
                        >
                          Prova connessione non sicura (WS)
                        </Button>
                      </div>
                    </div>
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
