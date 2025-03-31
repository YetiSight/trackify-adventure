
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Notification } from "@/types";
import { AlertCircle, AlertTriangle, Info } from "lucide-react";

interface NotificationsCardProps {
  notifications: Notification[];
}

const NotificationItem: React.FC<{ notification: Notification }> = ({ notification }) => {
  const getIcon = () => {
    switch (notification.type) {
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case "emergency":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Info className="h-5 w-5 text-snow-500" />;
    }
  };

  const getContainerClass = () => {
    switch (notification.type) {
      case "warning":
        return "border-l-4 border-amber-500 bg-amber-50 dark:bg-amber-950/20";
      case "emergency":
        return "border-l-4 border-red-500 bg-red-50 dark:bg-red-950/20";
      default:
        return "border-l-4 border-snow-500 bg-snow-50 dark:bg-snow-950/10";
    }
  };

  const getTime = () => {
    const now = Date.now();
    const diff = now - notification.timestamp;
    
    // Meno di un minuto
    if (diff < 60000) {
      return "Adesso";
    }
    // Meno di un'ora
    if (diff < 3600000) {
      return `${Math.floor(diff / 60000)} min fa`;
    }
    // Meno di un giorno
    if (diff < 86400000) {
      return `${Math.floor(diff / 3600000)} ore fa`;
    }
    // Altrimenti
    return `${Math.floor(diff / 86400000)} giorni fa`;
  };

  return (
    <div className={`p-3 mb-3 rounded-md ${getContainerClass()}`}>
      <div className="flex items-start space-x-3">
        <div className="mt-0.5">{getIcon()}</div>
        <div className="flex-1">
          <p className="text-sm font-medium">{notification.message}</p>
          <div className="flex justify-between items-center mt-1">
            <span className="text-xs text-gray-500">{getTime()}</span>
            {!notification.read && (
              <span className="bg-alpine-500 text-white text-xs px-2 py-0.5 rounded-full">
                Nuovo
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const NotificationsCard: React.FC<NotificationsCardProps> = ({ notifications }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifiche</CardTitle>
        <CardDescription>Aggiornamenti dai sensori</CardDescription>
      </CardHeader>
      <CardContent>
        {notifications.length > 0 ? (
          <div className="max-h-[300px] overflow-y-auto pr-1 scrollbar-hide">
            {notifications.map((notification) => (
              <NotificationItem key={notification.id} notification={notification} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-4">Nessuna notifica</p>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationsCard;
