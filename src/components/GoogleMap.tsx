
import React, { useEffect, useRef } from 'react';
import { Card, CardContent } from './ui/card';

interface GoogleMapProps {
  location: {
    lat: number;
    lng: number;
  };
  title: string;
  zoom?: number;
}

const GoogleMap: React.FC<GoogleMapProps> = ({ location, title, zoom = 15 }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    // Function to initialize the map
    const initMap = () => {
      if (mapRef.current && !mapInstance.current) {
        mapInstance.current = new google.maps.Map(mapRef.current, {
          center: location,
          zoom: zoom,
          mapTypeControl: false,
          fullscreenControl: true,
          streetViewControl: false,
          zoomControl: true,
        });

        // Add a marker for the location
        new google.maps.Marker({
          position: location,
          map: mapInstance.current,
          title: title,
          animation: google.maps.Animation.DROP,
        });
      }
    };

    // Load Google Maps API if not already loaded
    if (window.google && window.google.maps) {
      initMap();
    } else {
      const googleMapsApiKey = 'YOUR_API_KEY_HERE'; // Replace with your Google Maps API key
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&callback=initGoogleMap`;
      script.async = true;
      script.defer = true;
      
      // Add the callback function to window object
      window.initGoogleMap = initMap;
      document.head.appendChild(script);
      
      return () => {
        // Clean up
        if (window.initGoogleMap) {
          delete window.initGoogleMap;
        }
        document.head.removeChild(script);
      };
    }
  }, [location, title, zoom]);

  return (
    <Card>
      <CardContent className="p-0 overflow-hidden">
        <div 
          ref={mapRef} 
          className="h-64 w-full rounded-md" 
          aria-label={`Map showing the location of ${title}`}
        />
      </CardContent>
    </Card>
  );
};

export default GoogleMap;
