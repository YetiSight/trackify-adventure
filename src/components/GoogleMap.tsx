import React from 'react';
import { Card, CardContent } from './ui/card';
import { MapPin } from 'lucide-react';

interface GoogleMapProps {
  location: {
    lat: number;
    lng: number;
  };
  title: string;
  zoom?: number;
}

const GoogleMap: React.FC<GoogleMapProps> = ({ location, title, zoom = 15 }) => {
  // Simple location visualization without using Google Maps API
  const mapSize = 600; // Size of the virtual map in pixels
  const mapCenter = { x: mapSize / 2, y: mapSize / 2 };
  
  // Calculate position based on latitude and longitude
  // This is a very simplified positioning - not accurate for real maps
  // It just shows a marker at a relative position based on the coordinates
  const markerPosition = {
    x: mapCenter.x + (location.lng * 2), // Simple scaling for visualization
    y: mapCenter.y - (location.lat * 2)  // Inverted because latitude increases northward
  };
  
  // Keep marker within bounds
  const clampedPosition = {
    x: Math.max(20, Math.min(markerPosition.x, mapSize - 20)),
    y: Math.max(20, Math.min(markerPosition.y, mapSize - 20))
  };
  
  // Calculate percentage position for the marker
  const percentX = (clampedPosition.x / mapSize) * 100;
  const percentY = (clampedPosition.y / mapSize) * 100;

  return (
    <Card>
      <CardContent className="p-0 overflow-hidden">
        <div 
          className="h-64 w-full rounded-md relative bg-slate-100 dark:bg-slate-800"
          aria-label={`Map showing the location of ${title}`}
        >
          {/* Simple world map grid background */}
          <div className="absolute inset-0 grid grid-cols-8 grid-rows-6">
            {Array(48).fill(0).map((_, i) => (
              <div key={i} className="border border-slate-200 dark:border-slate-700" />
            ))}
          </div>
          
          {/* Location marker */}
          <div 
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={{ 
              left: `${percentX}%`, 
              top: `${percentY}%` 
            }}
          >
            <div className="flex flex-col items-center">
              <MapPin className="h-8 w-8 text-red-500" />
              <div className="bg-white dark:bg-slate-900 shadow-md rounded-md p-1 text-xs mt-1">
                {title}
              </div>
            </div>
          </div>
          
          {/* Location information */}
          <div className="absolute bottom-0 left-0 right-0 bg-white/80 dark:bg-slate-900/80 p-2 text-xs">
            <div className="font-semibold">{title}</div>
            <div>Lat: {location.lat.toFixed(4)}, Lng: {location.lng.toFixed(4)}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GoogleMap;
