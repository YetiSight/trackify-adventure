import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { it } from "date-fns/locale";
import { Calendar, MapPin, Clock, Share, Info, Facebook, Twitter, Instagram, Link } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getEventById } from "@/utils/mockData";
import { toast } from "sonner";
import GoogleMap from "@/components/GoogleMap";

// Helper function to format dates
const formatEventDate = (dateStr: string) => {
  try {
    return format(parseISO(dateStr), "d MMMM yyyy", { locale: it });
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateStr;
  }
};

const EventDetail: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  
  const event = eventId ? getEventById(eventId) : null;
  
  if (!event) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center py-12">
          <h1 className="text-2xl font-bold mb-4">Evento non trovato</h1>
          <Button onClick={() => navigate("/events")}>Torna agli Eventi</Button>
        </div>
      </MainLayout>
    );
  }
  
  const formattedDate = formatEventDate(event.date);
  
  const handleRegister = () => {
    setIsRegistering(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsRegistering(false);
      toast.success("Iscrizione all'evento completata con successo!", {
        description: `Ti sei registrato per l'evento "${event.title}"`,
      });
    }, 1000);
  };
  
  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = `Partecipa all'evento YetiSight: ${event.title}`;
    
    let shareUrl = "";
    
    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
        break;
      case "instagram":
        // Instagram doesn't have a direct sharing URL, so we'll copy the link instead
        navigator.clipboard.writeText(url);
        toast.success("Link copiato negli appunti!", {
          description: "Ora puoi condividerlo su Instagram."
        });
        return;
      default:
        navigator.clipboard.writeText(url);
        toast.success("Link copiato negli appunti!");
        return;
    }
    
    if (shareUrl) {
      window.open(shareUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-6 px-4 sm:px-6">
        {/* Back button */}
        <Button 
          variant="outline" 
          onClick={() => navigate("/events")}
          className="mb-6"
        >
          ← Torna agli Eventi
        </Button>
        
        {/* Event hero section */}
        <div className="relative rounded-xl overflow-hidden h-64 sm:h-80 md:h-96 mb-6">
          {event.image ? (
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${event.image})` }}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/80" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20" />
          
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="flex justify-between items-end">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold mb-2">{event.title}</h1>
                <p className="text-lg opacity-90">{event.skiResort}</p>
              </div>
              <Badge 
                variant="outline" 
                className="border-2 text-white border-white/50 bg-black/30 backdrop-blur-sm"
              >
                Sponsorizzato da {event.sponsor.name}
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content column */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-bold">Dettagli Evento</h2>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <span>{formattedDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <span>{event.meetingPoint}</span>
                </div>
                
                <Separator className="my-6" />
                
                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    Descrizione
                  </h3>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {event.description}
                  </p>
                </div>
                
                <div className="pt-4">
                  <h3 className="text-lg font-semibold mb-2">Cosa portare</h3>
                  <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                    <li>Il tuo dispositivo YetiSight</li>
                    <li>Equipaggiamento da sci</li>
                    <li>Abbigliamento adeguato alle condizioni meteo</li>
                    <li>Documento d'identità</li>
                  </ul>
                </div>
              </CardContent>
              
              <CardFooter className="flex flex-col sm:flex-row gap-4 pt-2">
                <Button 
                  className="w-full sm:w-auto"
                  disabled={isRegistering}
                  onClick={handleRegister}
                  style={{
                    backgroundColor: event.sponsor.color || "hsl(var(--primary))",
                  }}
                >
                  {isRegistering ? "Registrazione..." : "Iscriviti all'evento"}
                </Button>
                
                <div className="flex items-center gap-2 ml-auto">
                  <span className="text-sm text-muted-foreground">Condividi:</span>
                  <Button size="icon" variant="ghost" onClick={() => handleShare("facebook")}>
                    <Facebook className="h-5 w-5" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => handleShare("twitter")}>
                    <Twitter className="h-5 w-5" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => handleShare("instagram")}>
                    <Instagram className="h-5 w-5" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => handleShare("link")}>
                    <Link className="h-5 w-5" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
          
          {/* Sidebar column */}
          <div className="space-y-6">
            {/* Sponsor card */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-bold">Sponsor dell'evento</h2>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex justify-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                  <div className="w-40 h-40 relative">
                    <Avatar className="w-full h-full">
                      <AvatarImage 
                        src={event.sponsor.logo} 
                        alt={event.sponsor.name} 
                        className="p-4"
                        style={{ 
                          backgroundColor: event.sponsor.color || "white",
                        }}
                      />
                      <AvatarFallback className="text-4xl">
                        {event.sponsor.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">{event.sponsor.name}</h3>
                  <p className="text-muted-foreground">
                    {event.sponsor.description || `${event.sponsor.name} è orgoglioso sponsor di questo evento YetiSight. Partecipando potrai scoprire i prodotti e le novità del brand.`}
                  </p>
                </div>
              </CardContent>
              
              <CardFooter>
                <Button 
                  variant="outline" 
                  className="w-full"
                  style={{
                    borderColor: event.sponsor.color || "hsl(var(--border))",
                    color: event.sponsor.color || "inherit"
                  }}
                  onClick={() => window.open(event.sponsor.website || "#", "_blank", "noopener,noreferrer")}
                >
                  Visita il sito dello sponsor
                </Button>
              </CardFooter>
            </Card>
            
            {/* Map location card */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-bold">Luogo dell'evento</h2>
              </CardHeader>
              
              <CardContent className="p-0">
                {event.location ? (
                  <GoogleMap 
                    location={event.location} 
                    title={`${event.title} - ${event.meetingPoint}`} 
                  />
                ) : (
                  <div className="bg-muted/50 h-48 flex items-center justify-center rounded-lg p-4">
                    <p className="text-muted-foreground text-center">
                      <MapPin className="w-6 h-6 mx-auto mb-2" />
                      {event.meetingPoint}<br/>
                      {event.skiResort}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default EventDetail;
