
import React, { useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ArduinoConnect from "@/components/ArduinoConnect";
import SessionStats from "@/components/SessionStats";
import SessionControls from "@/components/SessionControls";
import SpeedChart from "@/components/SpeedChart";
import ConnectionStatus from "@/components/ConnectionStatus";
import { useSessionUpdater } from "@/services/SessionService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import MapView from "@/components/MapView";

const Session: React.FC = () => {
  // Inizializza l'aggiornamento automatico della sessione
  useSessionUpdater();
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sessione in Tempo Reale</h1>
          <p className="text-muted-foreground mt-1">
            Connettiti a ThingSpeak, avvia la sessione e monitora le tue statistiche in tempo reale
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <div>
                  <CardTitle>Connessione e Controlli</CardTitle>
                  <CardDescription>
                    Connettiti a ThingSpeak e gestisci la tua sessione
                  </CardDescription>
                </div>
                <ConnectionStatus />
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <ArduinoConnect />
              <Separator />
              <SessionControls />
            </CardContent>
          </Card>
          
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Statistiche Sessione</CardTitle>
              <CardDescription>
                Dati in tempo reale della sessione corrente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SessionStats />
            </CardContent>
          </Card>
          
          <Card className="lg:col-span-2">
            <Tabs defaultValue="chart">
              <CardHeader className="pb-0">
                <div className="flex justify-between items-center">
                  <CardTitle>Visualizzazione Dati</CardTitle>
                  <TabsList>
                    <TabsTrigger value="chart">Grafico</TabsTrigger>
                    <TabsTrigger value="map">Mappa</TabsTrigger>
                  </TabsList>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <TabsContent value="chart" className="mt-0">
                  <SpeedChart />
                </TabsContent>
                <TabsContent value="map" className="mt-0">
                  <div className="h-[400px] w-full rounded-md overflow-hidden border">
                    <MapView />
                  </div>
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Session;
