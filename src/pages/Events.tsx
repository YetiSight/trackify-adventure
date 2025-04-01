
import React, { useState } from "react";
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
          <h1 className="text-3xl font-bold mb-2">Eventi SafeSight</h1>
          <p className="text-muted-foreground">
            Scopri gli eventi organizzati da SafeSight nei migliori impianti sciistici
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
    <Card className="overflow-hidden flex flex-col h-full">
      {event.image && (
        <div 
          className="h-40 bg-cover bg-center relative"
          style={{ backgroundImage: `url(${event.image})` }}
        >
          <div 
            className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 to-transparent"
          />
        </div>
      )}
      
      <CardHeader className={event.image ? "-mt-12 relative z-10" : ""}>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className={event.image ? "text-white" : ""}>
              {event.title}
            </CardTitle>
            <CardDescription className={event.image ? "text-gray-200" : ""}>
              {event.skiResort}
            </CardDescription>
          </div>
          <div 
            className="h-10 w-16 bg-white rounded flex items-center justify-center p-1"
            style={{ 
              backgroundColor: event.sponsor.color || "white" 
            }}
          >
            <img 
              src={event.sponsor.logo} 
              alt={`${event.sponsor.name} logo`} 
              className="max-h-full max-w-full object-contain"
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground mb-4">
          {event.description}
        </p>
        
        <div className="space-y-2">
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
        <Badge variant="outline" className="border-2">
          Sponsor: {event.sponsor.name}
        </Badge>
        <Button size="sm">Dettagli</Button>
      </CardFooter>
    </Card>
  );
};

export default Events;
