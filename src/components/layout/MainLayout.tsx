
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Compass, 
  TrendingUp, 
  User, 
  Home, 
  Bell, 
  Menu, 
  X,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { getNotifications } from "@/utils/mockData";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();
  const { toast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const notifications = getNotifications();
  const unreadCount = notifications.filter(n => !n.read).length;

  const navItems = [
    {
      name: "Dashboard",
      path: "/",
      icon: <Home className="h-5 w-5" />
    },
    {
      name: "Classifica",
      path: "/leaderboard",
      icon: <TrendingUp className="h-5 w-5" />
    },
    {
      name: "Mappa",
      path: "/map",
      icon: <Compass className="h-5 w-5" />
    },
    {
      name: "Social",
      path: "/social",
      icon: <Users className="h-5 w-5" />
    },
    {
      name: "Profilo",
      path: "/profile",
      icon: <User className="h-5 w-5" />
    }
  ];

  const toggleMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const showNotification = () => {
    if (unreadCount > 0) {
      toast({
        title: "Notifiche non lette",
        description: `Hai ${unreadCount} notifiche non lette`,
        variant: "default",
      });
    } else {
      toast({
        title: "Nessuna notifica",
        description: "Non hai nuove notifiche",
        variant: "default",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-snow-200 dark:border-gray-800 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <img src="/logo.svg" alt="SafeSight" className="h-8 w-8" />
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-snow-700 to-alpine-600">
              SafeSight
            </h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={showNotification}
              className="relative"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-alpine-500 text-white text-xs flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon"
              className="md:hidden"
              onClick={toggleMenu}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar - Desktop */}
        <aside className="hidden md:block w-64 bg-snow-50 dark:bg-gray-900 border-r border-snow-200 dark:border-gray-800">
          <nav className="p-4 space-y-2 sticky top-16">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? "bg-snow-700 text-white"
                    : "hover:bg-snow-100 dark:hover:bg-gray-800"
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm md:hidden">
            <div className="fixed inset-y-0 left-0 w-3/4 max-w-xs bg-white dark:bg-gray-900 z-50 animate-slide-in">
              <div className="p-4 space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      location.pathname === item.path
                        ? "bg-snow-700 text-white"
                        : "hover:bg-snow-100 dark:hover:bg-gray-800"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                ))}
              </div>
            </div>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setMobileMenuOpen(false)}
            ></div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6">
          <div className="container mx-auto max-w-6xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
