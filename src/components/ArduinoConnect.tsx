
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  WifiOff, 
  Wifi, 
  AlertTriangle, 
  Loader2, 
  CloudOff, 
  Cloud, 
  ChevronDown,
  Lock,
  Unlock,
  Gauge
} from "lucide-react";
import { useArduinoStore } from "@/services/ArduinoService";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { predefinedChannels } from "@/services/ThingSpeakService";

const ArduinoConnect: React.FC = () => {
  const [ipAddress, setIpAddress] = useState("");
  const [port, setPort] = useState("80");
  const [showDialog, setShowDialog] = useState(false);
  const [activeTab, setActiveTab] = useState<"direct" | "remote" | "thingspeak">("direct");
  const [thingspeakChannel, setThingspeakChannel] = useState<string>("custom");
  const [thingspeakChannelId, setThingspeakChannelId] = useState("");
  const [thingspeakApiKey, setThingspeakApiKey] = useState("");
  
  const { 
    connectionState, 
    connectToArduino, 
    disconnectFromArduino,

    connectionMode,
    secureMode,
    errorType,
    thingspeakChannelId: connectedChannelId
  } = useArduinoStore();
  
  const handleConnection = () => {
    if (connectionState === "connected" || connectionState === "connecting") {
      disconnectFromArduino();
      return;
    }
    
    if (activeTab === "direct") {
      // For direct connections, use the IP and port
      connectToArduino(ipAddress, port, "direct", secureMode);
    } else if (activeTab === "remote") {
      // For remote mode, use a placeholder
      connectToArduino("remote", "80", "remote");
    } else if (activeTab === "thingspeak") {
      // For ThingSpeak, determine if using predefined or custom
      if (thingspeakChannel === "custom") {
        connectToArduino(thingspeakChannelId, thingspeakApiKey, "thingspeak");
      } else {
        // Using a predefined channel
        const channelId = parseInt(thingspeakChannel);
        const channel = predefinedChannels.find(c => c.id === channelId);
        if (channel) {
          connectToArduino(channel.id.toString(), channel.apiKey, "thingspeak");
        }
      }
    }
  };
  
  // Determine the connection status indicator
  const getStatusIndicator = () => {
    switch (connectionState) {
      case "connected":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1.5">
            {connectionMode === "direct" ? <Wifi className="h-3.5 w-3.5" /> : 
             connectionMode === "remote" ? <Cloud className="h-3.5 w-3.5" /> : 
             <Gauge className="h-3.5 w-3.5" />}
            Connesso
          </Badge>
        );
      case "connecting":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1.5">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Connessione...
          </Badge>
        );
      case "error":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 flex items-center gap-1.5">
            <AlertTriangle className="h-3.5 w-3.5" />
            Errore
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200 flex items-center gap-1.5">
            {connectionMode === "direct" ? <WifiOff className="h-3.5 w-3.5" /> : 
             connectionMode === "remote" ? <CloudOff className="h-3.5 w-3.5" /> : 
             <Gauge className="h-3.5 w-3.5" />}
            Disconnesso
          </Badge>
        );
    }
  };
  
  // Get button text based on connection state
  const getButtonText = () => {
    if (connectionState === "connected") {
      return "Disconnetti";
    } else if (connectionState === "connecting") {
      return "Connessione...";
    } else {
      return "Connetti";
    }
  };
  
  // Helper to determine if form is valid
  const isFormValid = () => {
    if (activeTab === "direct") {
      return ipAddress.trim() !== "";
    } else if (activeTab === "thingspeak") {
      if (thingspeakChannel === "custom") {
        return thingspeakChannelId.trim() !== "" && thingspeakApiKey.trim() !== "";
      }
      return true; // Predefined channel is selected
    }
    return true; // Remote mode doesn't need inputs
  };

  // Find a human-readable name for the connected ThingSpeak channel
  const getConnectedChannelName = () => {
    if (!connectedChannelId) return "";
    const channel = predefinedChannels.find(c => c.id === connectedChannelId);
    return channel ? channel.name : `Canale ${connectedChannelId}`;
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Connessione Arduino</CardTitle>
            <CardDescription>
              Collegati all'Arduino per dati in tempo reale
            </CardDescription>
          </div>
          {getStatusIndicator()}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="direct" disabled={connectionState === "connecting"}>
              Diretta
            </TabsTrigger>
            <TabsTrigger value="remote" disabled={connectionState === "connecting"}>
              Remota
            </TabsTrigger>
            <TabsTrigger value="thingspeak" disabled={connectionState === "connecting"}>
              ThingSpeak
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="direct" className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2">
                <Input
                  placeholder="Indirizzo IP (es. 192.168.1.100)"
                  value={ipAddress}
                  onChange={(e) => setIpAddress(e.target.value)}
                  disabled={connectionState === "connecting" || connectionState === "connected"}
                />
              </div>
              <Select
                value={port}
                onValueChange={setPort}
                disabled={connectionState === "connecting" || connectionState === "connected"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Porta" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="80">Porta 80</SelectItem>
                  <SelectItem value="81">Porta 81</SelectItem>
                  <SelectItem value="8080">Porta 8080</SelectItem>
                  <SelectItem value="8081">Porta 8081</SelectItem>
                  <SelectItem value="443">Porta 443 (SSL)</SelectItem>
                  <SelectItem value="3000">Porta 3000</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {errorType === "network" && secureMode === "secure" && (
              <Alert variant="destructive" className="py-2">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  Errore di connessione sicura. Prova la connessione non sicura o un'altra porta.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>
          
          <TabsContent value="remote" className="space-y-4">
            <Alert className="py-2 bg-blue-50 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300 border-blue-200">
              <AlertDescription className="text-xs">
                La modalità remota utilizza dati simulati per dimostrare le funzionalità dell'app
                quando non è disponibile una connessione diretta all'Arduino.
              </AlertDescription>
            </Alert>
          </TabsContent>
          
          <TabsContent value="thingspeak" className="space-y-4">
            <div className="space-y-3">
              <Select
                value={thingspeakChannel}
                onValueChange={setThingspeakChannel}
                disabled={connectionState === "connecting" || connectionState === "connected"}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleziona un canale" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="custom">Canale personalizzato</SelectItem>
                  {predefinedChannels.map(channel => (
                    <SelectItem key={channel.id} value={channel.id.toString()}>
                      {channel.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {thingspeakChannel === "custom" && (
                <div className="space-y-3">
                  <Input
                    placeholder="ID Canale (es. 2271252)"
                    value={thingspeakChannelId}
                    onChange={(e) => setThingspeakChannelId(e.target.value)}
                    disabled={connectionState === "connecting" || connectionState === "connected"}
                  />
                  <Input
                    placeholder="API Key di Lettura"
                    value={thingspeakApiKey}
                    onChange={(e) => setThingspeakApiKey(e.target.value)}
                    disabled={connectionState === "connecting" || connectionState === "connected"}
                  />
                </div>
              )}
              
              {connectionMode === "thingspeak" && connectionState === "connected" && (
                <Alert className="py-2 bg-green-50 text-green-800 border-green-200">
                  <Gauge className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    Connesso a ThingSpeak: {getConnectedChannelName()}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-between mt-4">
          <Button
            variant="outline"
            size="sm"
            type="button"
            onClick={() => setShowDialog(true)}
            disabled={connectionState === "connecting"}
          >
            Aiuto <ChevronDown className="h-4 w-4 ml-1" />
          </Button>
          
          <Button
            onClick={handleConnection}
            disabled={connectionState === "connecting" || !isFormValid()}
            className={connectionState === "connected" ? "bg-red-600 hover:bg-red-700" : ""}
          >
            {connectionState === "connecting" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {getButtonText()}
          </Button>
        </div>
        
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Aiuto per la connessione ad Arduino</DialogTitle>
              <DialogDescription>
                Ecco come connettere la tua applicazione a diverse fonti di dati
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="direct" className="w-full">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="direct">Connessione Diretta</TabsTrigger>
                <TabsTrigger value="remote">Modalità Remota</TabsTrigger>
                <TabsTrigger value="thingspeak">ThingSpeak</TabsTrigger>
              </TabsList>
              
              <TabsContent value="direct" className="space-y-4">
                <div className="space-y-2 text-sm">
                  <h3 className="font-medium">Connessione Diretta all'Arduino</h3>
                  <p>Questa modalità richiede che l'Arduino:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Sia connesso alla stessa rete WiFi del tuo dispositivo</li>
                    <li>Abbia un server WebSocket in esecuzione</li>
                    <li>Sia accessibile tramite indirizzo IP e porta</li>
                  </ul>
                  
                  <h3 className="font-medium mt-3">Porte comuni</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Porta 80: WebSocket standard</li>
                    <li>Porta 81, 8080, 8081: Porte alternative</li>
                    <li>Porta 443: Per connessioni sicure SSL/TLS</li>
                  </ul>
                </div>
              </TabsContent>
              
              <TabsContent value="remote" className="space-y-4">
                <div className="space-y-2 text-sm">
                  <h3 className="font-medium">Modalità Remota (simulazione)</h3>
                  <p>Questa modalità simula una connessione all'Arduino generando dati di esempio.</p>
                  <p className="mt-2">Utile per:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Testare l'applicazione senza hardware fisico</li>
                    <li>Dimostrare le funzionalità dell'app</li>
                    <li>Situazioni in cui la connessione diretta non è possibile</li>
                  </ul>
                </div>
              </TabsContent>
              
              <TabsContent value="thingspeak" className="space-y-4">
                <div className="space-y-2 text-sm">
                  <h3 className="font-medium">Connessione a ThingSpeak</h3>
                  <p>ThingSpeak è una piattaforma di IoT che permette di raccogliere e analizzare dati da dispositivi.</p>
                  
                  <h3 className="font-medium mt-3">Come usare ThingSpeak</h3>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>Seleziona un canale predefinito dall'elenco, oppure</li>
                    <li>Inserisci manualmente l'ID del canale e l'API Key di lettura</li>
                  </ol>
                  
                  <h3 className="font-medium mt-3">Informazioni importanti</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>I dati vengono aggiornati ogni 15 secondi (limite di ThingSpeak)</li>
                    <li>Serve una connessione Internet per accedere ai dati</li>
                    <li>L'Arduino deve essere configurato per inviare dati a ThingSpeak</li>
                  </ul>
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default ArduinoConnect;
