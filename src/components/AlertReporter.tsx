
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PistaAlert, GeoPoint } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle } from "lucide-react";

interface AlertReporterProps {
  currentPosition: GeoPoint;
  onReportAlert: (alert: Omit<PistaAlert, "id" | "timestamp" | "active">) => void;
}

const AlertReporter: React.FC<AlertReporterProps> = ({
  currentPosition,
  onReportAlert,
}) => {
  const [open, setOpen] = useState(false);
  const [alertType, setAlertType] = useState<PistaAlert["type"]>("obstacle");
  const [description, setDescription] = useState("");
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!description.trim()) {
      toast({
        title: "Errore",
        description: "Inserisci una descrizione per continuare",
        variant: "destructive",
      });
      return;
    }

    onReportAlert({
      type: alertType,
      description,
      position: currentPosition,
      reportedBy: "Utente corrente", // In a real app, this would be the current user's name or ID
    });

    toast({
      title: "Segnalazione inviata",
      description: "La tua segnalazione è stata pubblicata sulla mappa",
    });

    setOpen(false);
    setDescription("");
    setAlertType("obstacle");
  };

  const getAlertTypeLabel = (type: PistaAlert["type"]) => {
    switch (type) {
      case "obstacle":
        return "Ostacolo";
      case "melting_snow":
        return "Neve sciolta";
      case "dune":
        return "Dune di neve";
      case "ice":
        return "Ghiaccio";
      case "fog":
        return "Nebbia";
      default:
        return type;
    }
  };

  return (
    <>
      <Button 
        onClick={() => setOpen(true)} 
        className="bg-amber-500 hover:bg-amber-600"
        size="sm"
      >
        <AlertTriangle className="h-4 w-4 mr-2" />
        Segnala problema
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Segnala un problema sulla pista</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="alert-type">Tipo di problema</Label>
              <Select
                value={alertType}
                onValueChange={(value: PistaAlert["type"]) => setAlertType(value)}
              >
                <SelectTrigger id="alert-type">
                  <SelectValue placeholder="Seleziona il tipo di problema" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="obstacle">{getAlertTypeLabel("obstacle")}</SelectItem>
                  <SelectItem value="melting_snow">{getAlertTypeLabel("melting_snow")}</SelectItem>
                  <SelectItem value="dune">{getAlertTypeLabel("dune")}</SelectItem>
                  <SelectItem value="ice">{getAlertTypeLabel("ice")}</SelectItem>
                  <SelectItem value="fog">{getAlertTypeLabel("fog")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Descrizione</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descrivi brevemente il problema che hai riscontrato..."
                rows={3}
              />
            </div>

            <div className="text-xs text-muted-foreground">
              <strong>Posizione attuale:</strong> Lat: {currentPosition.lat.toFixed(6)}, Lng: {currentPosition.lng.toFixed(6)}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Annulla
            </Button>
            <Button onClick={handleSubmit}>Invia segnalazione</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AlertReporter;
