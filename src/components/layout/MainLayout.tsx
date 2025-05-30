
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
  Calendar,
  Activity,
  LogIn
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

  // Mock authentication state - In a real app, this would come from your auth system
  const isAuthenticated = true; // Set to false to test unauthenticated view

  const navItems = [
    {
      name: "Dashboard",
      path: "/",
      icon: <Home className="h-5 w-5" />
    },
    {
      name: "Sessione",
      path: "/session",
      icon: <Activity className="h-5 w-5" />
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
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/bb761e52-8397-43ce-9518-ec654d50bd09.png" 
              alt="YetiSight" 
              className="h-10" 
            />
          </div>
          
          <div className="flex items-center space-x-2">
            {isAuthenticated ? (
              <>
                <NotificationsDropdown notifications={notifications} />
                
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="md:hidden"
                  onClick={toggleMenu}
                >
                  {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="outline" size="sm" className="hidden sm:flex">
                    <LogIn className="h-4 w-4 mr-2" />
                    Accedi
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">Registrati</Button>
                </Link>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="md:hidden"
                  onClick={toggleMenu}
                >
                  {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              </div>
            )}
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
                
                {!isAuthenticated && (
                  <div className="mt-6 px-4">
                    <Link to="/login">
                      <Button variant="outline" className="w-full mb-2">
                        <LogIn className="h-4 w-4 mr-2" />
                        Accedi
                      </Button>
                    </Link>
                    <Link to="/register">
                      <Button className="w-full">Registrati</Button>
                    </Link>
                  </div>
                )}
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
