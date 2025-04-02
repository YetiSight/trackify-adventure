
import React from 'react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Bell } from 'lucide-react';
import { Button } from './ui/button';
import { Notification } from '@/types';
import { AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

interface NotificationsDropdownProps {
  notifications: Notification[];
}

const NotificationItem: React.FC<{ notification: Notification }> = ({ notification }) => {
  const getIcon = () => {
    switch (notification.type) {
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case "emergency":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Info className="h-4 w-4 text-snow-500" />;
    }
  };

  const getContainerClass = () => {
    switch (notification.type) {
      case "warning":
        return "border-l-2 border-amber-500 bg-amber-50 dark:bg-amber-950/20";
      case "emergency":
        return "border-l-2 border-red-500 bg-red-50 dark:bg-red-950/20";
      default:
        return "border-l-2 border-snow-500 bg-snow-50 dark:bg-snow-950/10";
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
    <div className={`p-2 my-1 rounded-md ${getContainerClass()}`}>
      <div className="flex items-start space-x-2">
        <div className="mt-0.5">{getIcon()}</div>
        <div className="flex-1">
          <p className="text-xs font-medium">{notification.message}</p>
          <div className="flex justify-between items-center mt-0.5">
            <span className="text-xs text-gray-500">{getTime()}</span>
            {!notification.read && (
              <span className="bg-alpine-500 text-white text-xs px-1.5 py-0.5 rounded-full text-[10px]">
                Nuovo
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const NotificationsDropdown: React.FC<NotificationsDropdownProps> = ({ notifications }) => {
  const unreadCount = notifications.filter(n => !n.read).length;
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="relative"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-alpine-500 text-white text-xs flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 max-h-[80vh] overflow-auto">
        <DropdownMenuLabel className="font-bold">
          Notifiche
          {unreadCount > 0 && (
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({unreadCount} non lette)
            </span>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length > 0 ? (
          <div className="px-1 py-1 max-h-[50vh] overflow-y-auto">
            {notifications.map((notification) => (
              <NotificationItem key={notification.id} notification={notification} />
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-sm text-gray-500">
            Nessuna notifica
          </div>
        )}
        <DropdownMenuSeparator />
        <div className="p-2 text-center">
          <Link 
            to="/notifications" 
            className="text-xs text-blue-600 hover:underline"
          >
            Vedi tutte le notifiche
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationsDropdown;
