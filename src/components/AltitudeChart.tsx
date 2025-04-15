
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useSessionStore } from "@/services/SessionService";
import { Mountain } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const AltitudeChart: React.FC = () => {
  const { isActive, path, maxAltitude } = useSessionStore();
  const [chartData, setChartData] = useState<Array<{ time: string; altitude: number }>>([]);
  
  // Transform path data into chart data
  useEffect(() => {
    if (path.length === 0) return;
    
    // Take the last 20 points for the chart
    const dataPoints = path.slice(-20).map((point) => {
      const date = point.timestamp ? new Date(point.timestamp) : new Date();
      const formattedTime = `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
      return {
        time: formattedTime,
        altitude: point.altitude || 0
      };
    });
    
    setChartData(dataPoints);
  }, [path]);

  if (path.length < 2) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Grafico Altitudine</CardTitle>
          <CardDescription>
            Il grafico verrà mostrato dopo il primo spostamento
          </CardDescription>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <Mountain className="h-10 w-10 mx-auto mb-2" />
            <p>In attesa di dati sufficienti...</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Calculate min and max for Y-axis to create a better visualization
  const minAltitude = Math.max(0, Math.min(...chartData.map(d => d.altitude)) - 10);
  const maxYAxis = Math.max(...chartData.map(d => d.altitude)) + 10;
  
  return (
    <Card className="w-full h-full">
      <CardHeader className="pb-2">
        <CardTitle>Grafico Altitudine</CardTitle>
        <CardDescription>
          Altitudine in tempo reale (m) - Max: {maxAltitude}m
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis 
                domain={[minAltitude, maxYAxis]}
                tickFormatter={(value) => `${value}m`}
              />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white p-2 border border-gray-200 shadow-sm rounded-md">
                        <p className="font-medium">{`${payload[0].value}m`}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area 
                type="monotone" 
                dataKey="altitude" 
                stroke="#6366f1" 
                fill="#c4b5fd" 
                name="Altitudine"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default AltitudeChart;
