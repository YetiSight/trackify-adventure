
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import { getNotifications } from "@/utils/mockData";
import { AlertCircle, AlertTriangle, Info } from "lucide-react";

const Notifications: React.FC = () => {
  const notifications = getNotifications();

  const getIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case "emergency":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Info className="h-5 w-5 text-snow-500" />;
    }
  };

  const getContainerClass = (type: string) => {
    switch (type) {
      case "warning":
        return "border-l-4 border-amber-500 bg-amber-50 dark:bg-amber-950/20";
      case "emergency":
        return "border-l-4 border-red-500 bg-red-50 dark:bg-red-950/20";
      default:
        return "border-l-4 border-snow-500 bg-snow-50 dark:bg-snow-950/10";
    }
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Notifiche</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Tutte le tue notifiche di sicurezza
          </p>
        </div>

        <div className="space-y-4">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`p-4 rounded-md shadow-sm ${getContainerClass(notification.type)}`}
              >
                <div className="flex items-start space-x-3">
                  <div className="mt-0.5">{getIcon(notification.type)}</div>
                  <div className="flex-1">
                    <p className="font-medium">{notification.message}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-gray-500">
                        {formatTimestamp(notification.timestamp)}
                      </span>
                      {!notification.read && (
                        <span className="bg-alpine-500 text-white text-xs px-2 py-1 rounded-full">
                          Nuovo
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-gray-500">
              Nessuna notifica disponibile
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Notifications;
