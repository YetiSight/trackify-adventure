
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
    const dataPoints = path.slice(-20).map((point, index) => {
      const date = point.timestamp ? new Date(point.timestamp) : new Date();
      return {
        time: `${date.getMinutes()}:${date.getSeconds().toString().padStart(2, '0')}`,
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
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Grafico Altitudine</CardTitle>
        <CardDescription>
          Altitudine in tempo reale (m) - Max: {maxAltitude}m
        </CardDescription>
      </CardHeader>
      <CardContent className="h-64">
        <ChartContainer
          config={{
            altitude: {
              label: "Altitudine",
              theme: {
                light: "#6366f1",
                dark: "#818cf8",
              },
            },
          }}
        >
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  indicator="dot"
                  nameKey="altitude"
                  labelKey="altitude"
                />
              }
            />
            <Area 
              type="monotone" 
              dataKey="altitude" 
              stroke="#6366f1" 
              fill="#c4b5fd" 
              name="Altitudine (m)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default AltitudeChart;
