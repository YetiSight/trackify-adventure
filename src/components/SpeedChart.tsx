
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useSessionStore } from "@/services/SessionService";
import { Pause } from "lucide-react";

const SpeedChart: React.FC = () => {
  const { isActive, path } = useSessionStore();
  const [chartData, setChartData] = useState<Array<{ time: string; speed: number }>>([]);
  
  // Trasforma i dati del percorso in dati per il grafico
  useEffect(() => {
    if (path.length === 0) return;
    
    // Prendi gli ultimi 20 punti per il grafico
    const dataPoints = path.slice(-20).map((point, index) => {
      const date = point.timestamp ? new Date(point.timestamp) : new Date();
      return {
        time: `${date.getMinutes()}:${date.getSeconds().toString().padStart(2, '0')}`,
        speed: point.speed || 0
      };
    });
    
    setChartData(dataPoints);
  }, [path]);

  if (path.length < 2) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Grafico Velocità</CardTitle>
          <CardDescription>
            Il grafico verrà mostrato dopo il primo spostamento
          </CardDescription>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <Pause className="h-10 w-10 mx-auto mb-2" />
            <p>In attesa di dati sufficienti...</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Grafico Velocità</CardTitle>
        <CardDescription>
          Velocità in tempo reale (km/h)
        </CardDescription>
      </CardHeader>
      <CardContent className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Area 
              type="monotone" 
              dataKey="speed" 
              stroke="#3b82f6" 
              fill="#93c5fd" 
              name="Velocità (km/h)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default SpeedChart;
