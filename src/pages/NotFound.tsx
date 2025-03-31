
import React from "react";
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-snow-50 dark:bg-gray-900 p-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <h1 className="text-7xl font-bold text-snow-700 dark:text-snow-300 mb-4">404</h1>
          <div className="w-16 h-1 bg-alpine-500 mx-auto mb-6"></div>
          <h2 className="text-2xl font-semibold mb-3">Pagina non trovata</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            La pagina che stai cercando non esiste o è stata spostata.
          </p>
        </div>
        
        <div className="space-y-3">
          <Link to="/">
            <Button className="w-full">
              <Home className="h-4 w-4 mr-2" /> Torna alla Home
            </Button>
          </Link>
          <Button variant="outline" className="w-full" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Torna Indietro
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
