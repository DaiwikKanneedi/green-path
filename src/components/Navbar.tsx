import { Link, useLocation } from "react-router-dom";
import { Leaf, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { getTheme, setTheme, getUser } from "@/lib/storage";

export default function Navbar() {
  const location = useLocation();
  const [dark, setDark] = useState(getTheme() === "dark");
  const user = getUser();
  const isLanding = location.pathname === "/";

  useEffect(() => {
    setTheme(dark ? "dark" : "light");
  }, [dark]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2 hover-lift">
          <div className="w-9 h-9 rounded-lg eco-gradient flex items-center justify-center">
            <Leaf className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold">EcoTrack</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {isLanding && (
            <>
              <a href="#about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">About</a>
              <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">How it Works</a>
            </>
          )}
          {user && (
            <>
              <Link to="/dashboard" className={`text-sm font-medium transition-colors ${location.pathname === '/dashboard' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>Dashboard</Link>
              <Link to="/stats" className={`text-sm font-medium transition-colors ${location.pathname === '/stats' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>Stats</Link>
              <Link to="/search" className={`text-sm font-medium transition-colors ${location.pathname === '/search' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>Search</Link>
              <Link to="/profile" className={`text-sm font-medium transition-colors ${location.pathname === '/profile' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>Profile</Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => setDark(!dark)} className="p-2 rounded-lg hover:bg-secondary transition-colors">
            {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          {!user ? (
            <Link to="/onboarding">
              <Button className="eco-gradient border-0 text-primary-foreground hover:opacity-90">Start Tracking</Button>
            </Link>
          ) : null}
        </div>
      </div>
    </nav>
  );
}
