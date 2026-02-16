import { LiveIndicator } from "./LiveIndicator";
import { Shield, RefreshCw, Bell, Menu, Siren } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export const Header = () => {
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setLastUpdate(new Date());
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <header className="sticky top-0 z-50 glass-strong border-b border-border/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-none">
              Abuja <span className="text-primary">Election</span> Monitor
            </h1>
            <p className="text-xs text-muted-foreground">Federal Capital Territory</p>
          </div>
        </Link>

        {/* Center - Live Status */}
        <div className="hidden md:flex items-center gap-4">
          <LiveIndicator />
          <span className="text-xs text-muted-foreground">
            Last update: {lastUpdate.toLocaleTimeString()}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link to="/situation-room">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs border-red-200 text-red-700 hover:bg-red-50">
              <Siren className="h-3.5 w-3.5" />
              Situation Room
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRefresh}
            className="relative"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-4 w-4" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-destructive rounded-full" />
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};
