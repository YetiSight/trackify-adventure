
declare namespace google {
  namespace maps {
    class Map {
      constructor(mapDiv: Element, opts?: MapOptions);
      setCenter(latLng: LatLng): void;
      setZoom(zoom: number): void;
    }

    class Marker {
      constructor(opts?: MarkerOptions);
      setMap(map: Map | null): void;
      setPosition(latLng: LatLng): void;
      setTitle(title: string): void;
    }

    interface MapOptions {
      center?: LatLng;
      zoom?: number;
      mapTypeControl?: boolean;
      fullscreenControl?: boolean;
      streetViewControl?: boolean;
      zoomControl?: boolean;
    }

    interface MarkerOptions {
      position?: LatLng;
      map?: Map;
      title?: string;
      animation?: Animation;
    }

    class LatLng {
      constructor(lat: number, lng: number);
      lat(): number;
      lng(): number;
    }

    enum Animation {
      DROP,
      BOUNCE
    }
  }
}

declare global {
  interface Window {
    google: typeof google;
    initGoogleMap: () => void;
  }
}

export {};
