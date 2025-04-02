
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Compass, 
  TrendingUp, 
  User, 
  Home, 
  Menu, 
  X,
  Users,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { getNotifications } from "@/utils/mockData";
import NotificationsDropdown from "@/components/NotificationsDropdown";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const notifications = getNotifications();

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
      name: "Eventi",
      path: "/events",
      icon: <Calendar className="h-5 w-5" />
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

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-snow-200 dark:border-gray-800 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <img src="/logo.svg" alt="SafeSight" className="h-8 w-8" />
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-snow-700 to-alpine-600">
              SafeSight
            </h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <NotificationsDropdown notifications={notifications} />
            
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
