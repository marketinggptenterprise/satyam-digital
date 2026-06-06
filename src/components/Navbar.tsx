"use client";

import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Settings, Search, MapPin, User as UserIcon, ShoppingCart, Menu, LogOut, UserCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { CartDrawer } from './CartDrawer';
import { LoginDialog } from './LoginDialog';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../context/AuthContext';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from './ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

export const Navbar = () => {
  const { totalItems } = useCart();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/');
    }
  };

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-primary text-white py-2 text-xs">
        <div className="container flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> Select Location</span>
            <span>Contact: +91 12345 67890</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/admin" className="hover:underline flex items-center gap-1">
              <Settings className="h-3 w-3" /> Admin Panel
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container py-4 flex items-center gap-8">
        <Link to="/" className="flex items-center shrink-0">
          <img 
            src="/logo.png" 
            alt="Satyam Digital" 
            className="h-16 w-auto object-contain" 
          />
          <div className="ml-2 leading-tight hidden lg:block">
            <span className="text-xl font-black text-primary block">SATYAM</span>
            <span className="text-sm font-bold text-secondary tracking-widest">DIGITAL</span>
          </div>
        </Link>

        <form onSubmit={handleSearch} className="flex-1 relative hidden md:block">
          <Input 
            placeholder="Search for Mobiles, Accessories, TV & more..." 
            className="w-full pl-4 pr-12 h-11 border-2 border-primary/20 focus-visible:border-primary rounded-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button type="submit" size="icon" className="absolute right-1 top-1 h-9 w-9 rounded-full bg-primary hover:bg-primary/90">
            <Search className="h-4 w-4 text-white" />
          </Button>
        </form>

        <div className="flex items-center gap-6 shrink-0">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex flex-col items-center cursor-pointer group">
                  <Avatar className="h-8 w-8 border-2 border-primary/20">
                    <AvatarImage src={user.user_metadata.avatar_url} />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">
                      {user.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-[10px] font-medium text-gray-500 group-hover:text-primary mt-1">Profile</span>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span className="font-bold">{user.user_metadata.full_name || user.email?.split('@')[0]}</span>
                    <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/profile')}>
                  <UserCircle className="mr-2 h-4 w-4" />
                  <span>My Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/profile?tab=orders')}>
                  <Package className="mr-2 h-4 w-4" />
                  <span>My Orders</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive" onClick={signOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <LoginDialog>
              <div className="flex flex-col items-center cursor-pointer group">
                <UserIcon className="h-6 w-6 text-gray-600 group-hover:text-primary" />
                <span className="text-[10px] font-medium text-gray-500 group-hover:text-primary">Login</span>
              </div>
            </LoginDialog>
          )}
          
          <CartDrawer>
            <div className="flex flex-col items-center cursor-pointer group relative">
              <ShoppingCart className="h-6 w-6 text-gray-600 group-hover:text-primary" />
              <span className="text-[10px] font-medium text-gray-500 group-hover:text-primary">Cart</span>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-secondary text-primary text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center animate-in zoom-in">
                  {totalItems}
                </span>
              )}
            </div>
          </CartDrawer>
        </div>
      </div>

      {/* Category Bar */}
      <div className="border-t bg-white hidden lg:block">
        <div className="container flex items-center gap-8 py-2">
          <Button variant="ghost" className="font-bold text-primary gap-2">
            <Menu className="h-4 w-4" /> Shop By Category
          </Button>
          <nav className="flex items-center gap-6 text-sm font-medium text-gray-700">
            <Link to="/?cat=mobiles" className="hover:text-primary">Mobiles</Link>
            <Link to="/?cat=laptops" className="hover:text-primary">Laptops</Link>
            <Link to="/?cat=electronics" className="hover:text-primary">Smart TV</Link>
            <Link to="/?cat=appliances" className="hover:text-primary">Appliances</Link>
            <Link to="/?cat=audio" className="hover:text-primary">Accessories</Link>
            <Link to="/?q=offer" className="text-red-600 font-bold">Offers</Link>
          </nav>
        </div>
      </div>
    </header>
  );
};