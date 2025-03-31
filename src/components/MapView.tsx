
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const MapView = () => {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="map-container">
          <div className="absolute inset-0 bg-snow-100 dark:bg-gray-800 flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-2xl font-semibold text-snow-800 dark:text-snow-200 mb-2">Mappa in caricamento</h3>
              <p className="text-snow-600 dark:text-snow-400">
                Questa è un'area di visualizzazione della mappa che mostrerebbe la posizione e il percorso in tempo reale
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MapView;
