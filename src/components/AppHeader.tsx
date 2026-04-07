import { Monitor, Users2, Settings, HelpCircle, Keyboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";

export function AppHeader() {
  const location = useLocation();
  const pageName = location.pathname === "/" ? "Dashboard" : location.pathname.slice(1).replace(/[-/]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <header className="h-14 border-b border-border bg-card/80 backdrop-blur-sm flex items-center justify-between px-6 sticky top-0 z-30">
      <h2 className="text-base font-semibold text-foreground">{pageName}</h2>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Monitor className="w-4 h-4 text-muted-foreground" />
        </Button>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Users2 className="w-4 h-4 text-muted-foreground" />
        </Button>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <HelpCircle className="w-4 h-4 text-muted-foreground" />
        </Button>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Keyboard className="w-4 h-4 text-muted-foreground" />
        </Button>
        <Button className="ml-2 bg-primary text-primary-foreground text-xs h-8 px-4">
          Book Demo
        </Button>
      </div>
    </header>
  );
}
