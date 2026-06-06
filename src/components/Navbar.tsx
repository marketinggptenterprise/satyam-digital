import { Link } from 'react-router-dom';
import { Settings, Home } from 'lucide-react';
import { Button } from './ui/button';

export const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <img src="/logo.png" alt="Satyam Digital Logo" className="h-10 w-auto object-contain" />
          <span className="text-xl font-bold tracking-tight hidden sm:inline-block">Satyam Digital</span>
        </Link>
        
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <Home className="h-4 w-4" />
              Store
            </Button>
          </Link>
          <Link to="/admin">
            <Button variant="outline" size="sm" className="gap-2">
              <Settings className="h-4 w-4" />
              Admin Panel
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};