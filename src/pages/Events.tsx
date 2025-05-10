
import React, { useState } from "react";
import { Link } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { format, parseISO } from "date-fns";
import { it } from "date-fns/locale";
import { Calendar, Clock, MapPin } from "lucide-react";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getAllEvents, getAllSkiResorts, getEventsByResort } from "@/utils/mockData";
import { Event } from "@/types";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

// Helper function to format dates
const formatEventDate = (dateStr: string) => {
  try {
    return format(parseISO(dateStr), "d MMMM yyyy", { locale: it });
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateStr;
  }
};

const Events: React.FC = () => {
  const allResorts = getAllSkiResorts();
  const [selectedResort, setSelectedResort] = useState<string>(allResorts[0] || "");
  
  // Get events for the selected resort, or all events if no resort is selected
  const events = selectedResort ? getEventsByResort(selectedResort) : getAllEvents();

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Eventi YetiSight</h1>
          <p className="text-muted-foreground">
            Scopri gli eventi organizzati da YetiSight nei migliori impianti sciistici
          </p>
        </div>

        <Tabs defaultValue={allResorts[0]} className="w-full">
          <div className="mb-6 overflow-x-auto pb-2">
            <TabsList className="h-auto flex-wrap">
              {allResorts.map((resort) => (
                <TabsTrigger 
                  key={resort} 
                  value={resort} 
                  onClick={() => setSelectedResort(resort)}
                  className="py-2 px-4"
                >
                  {resort}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          
          {allResorts.map((resort) => (
            <TabsContent key={resort} value={resort} className="mt-0">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {getEventsByResort(resort).map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </MainLayout>
  );
};

// Event Card Component to display each event
const EventCard: React.FC<{ event: Event }> = ({ event }) => {
  const formattedDate = formatEventDate(event.date);

  return (
    <Card className="overflow-hidden flex flex-col h-full group hover:shadow-lg transition-all duration-300">
      {event.image && (
        <div className="h-48 relative overflow-hidden">
          <div 
            className="h-full w-full bg-cover bg-center absolute inset-0 transform group-hover:scale-105 transition-transform duration-500 ease-in-out"
            style={{ backgroundImage: `url(${event.image})` }}
          />
          <div className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-t from-black/80 to-transparent" />
          
          {/* Event title overlay on image */}
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <h3 className="text-xl font-bold line-clamp-2">{event.title}</h3>
            <p className="text-sm text-gray-200">{event.skiResort}</p>
          </div>
          
          {/* Sponsor badge - top right */}
          <div className="absolute top-3 right-3 bg-white rounded-full p-1 shadow-md">
            <Avatar className="h-12 w-12 border-2 border-white">
              <AvatarImage 
                src={event.sponsor.logo} 
                alt={event.sponsor.name}
                className="p-1"
                style={{ 
                  backgroundColor: event.sponsor.color || "white" 
                }}
              />
              <AvatarFallback className="text-xs">
                {event.sponsor.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      )}
      
      <CardContent className="flex-grow pt-5">
        {!event.image && (
          <div className="flex justify-between items-start mb-4">
            <div>
              <CardTitle className="text-xl mb-1">{event.title}</CardTitle>
              <CardDescription>{event.skiResort}</CardDescription>
            </div>
            <Avatar className="h-12 w-12 border-2 border-muted">
              <AvatarImage 
                src={event.sponsor.logo} 
                alt={event.sponsor.name}
                className="p-1"
                style={{ 
                  backgroundColor: event.sponsor.color || "white" 
                }}
              />
              <AvatarFallback className="text-xs">
                {event.sponsor.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        )}
        
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
          {event.description}
        </p>
        
        <div className="space-y-2 mt-2">
          <div className="flex items-center text-sm">
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center text-sm">
            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center text-sm">
            <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{event.meetingPoint}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="border-t pt-4 flex justify-between items-center">
        <Badge 
          variant="outline" 
          className="border-[1px]"
          style={{
            borderColor: event.sponsor.color || "hsl(var(--border))",
            color: event.sponsor.color || "inherit"
          }}
        >
          Sponsor: {event.sponsor.name}
        </Badge>
        <Link to={`/events/${event.id}`}>
          <Button 
            size="sm" 
            className="ml-auto"
            style={{
              backgroundColor: event.sponsor.color || "hsl(var(--primary))",
            }}
          >
            Dettagli
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default Events;
