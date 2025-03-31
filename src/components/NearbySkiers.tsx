
import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GeoPoint } from "@/types";
import { MapPin } from "lucide-react";

// Mocked data for nearby skiers
const MOCK_NEARBY_SKIERS = [
  {
    id: "1",
    name: "Marco R.",
    distance: 120, // metri
    position: { lat: 46.5336, lng: 11.9482 },
    avatar: "/placeholder.svg"
  },
  {
    id: "2",
    name: "Sofia T.",
    distance: 230, // metri
    position: { lat: 46.5339, lng: 11.9487 },
    avatar: "/placeholder.svg"
  },
  {
    id: "3",
    name: "Giovanni B.",
    distance: 345, // metri
    position: { lat: 46.5341, lng: 11.9471 },
    avatar: "/placeholder.svg"
  }
];

interface NearbySkiersProps {
  yourPosition: GeoPoint;
}

const NearbySkiers: React.FC<NearbySkiersProps> = ({ yourPosition }) => {
  const [nearbySkiers, setNearbySkiers] = useState(MOCK_NEARBY_SKIERS);
  
  // In a real app, we would fetch nearby skiers based on your position
  useEffect(() => {
    // Simulating fetching nearby skiers
    const fetchNearbySkiers = () => {
      // Here we would make an API call with yourPosition to get actual nearby skiers
      console.log("Fetching nearby skiers with position:", yourPosition);
      // For now, we'll just use the mock data with slight randomization
      setNearbySkiers(MOCK_NEARBY_SKIERS.map(skier => ({
        ...skier,
        distance: Math.floor(skier.distance + (Math.random() * 100 - 50))
      })));
    };
    
    fetchNearbySkiers();
    // In a real app, we would refresh this data periodically
    const intervalId = setInterval(fetchNearbySkiers, 10000);
    
    return () => clearInterval(intervalId);
  }, [yourPosition]);
  
  return (
    <div className="space-y-3">
      {nearbySkiers.map(skier => (
        <div 
          key={skier.id}
          className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg border border-snow-200 dark:border-gray-600"
        >
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={skier.avatar} alt={skier.name} />
              <AvatarFallback>{skier.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{skier.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {skier.distance}m di distanza
              </p>
            </div>
          </div>
          <MapPin className="h-4 w-4 text-snow-600" />
        </div>
      ))}
    </div>
  );
};

export default NearbySkiers;
