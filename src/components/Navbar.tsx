"use client";

import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Settings, Search, MapPin, ShoppingCart, Menu, X, Smartphone, Tv, Laptop, Watch, Speaker, Refrigerator } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { CartDrawer } from './CartDrawer';
import { useCart } from '../hooks/useCart';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';

export const Navbar = () => {
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [logoError, setLogoError] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/');
    }
    setIsMobileSearchOpen(false);
  };

  const categoriesList = [
    { id: 'mobiles', name: 'Mobiles', icon: Smartphone },
    { id: 'laptops', name: 'Laptops', icon: Laptop },
    { id: 'electronics', name: 'Smart TV', icon: Tv },
    { id: 'appliances', name: 'Appliances', icon: Refrigerator },
    { id: 'audio', name: 'Accessories', icon: Speaker },
  ];

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-primary text-white py-2 text-xs">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 hover:text-secondary transition-colors cursor-pointer">
              <MapPin className="h-3 w-3 text-secondary" /> Kargahir, kenduadihi, Bankura - 722101
            </span>
            <span className="hidden sm:inline hover:text-secondary transition-colors cursor-pointer">Contact: +91 9932026227</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/admin" className="hover:text-secondary flex items-center gap-1 font-semibold transition-colors">
              <Settings className="h-3 w-3 text-secondary" /> Admin Panel
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 py-3 md:py-4 flex items-center justify-between gap-4">
        {/* Mobile Menu & Logo */}
        <div className="flex items-center gap-2">
          {/* Mobile Hamburger Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden h-10 w-10 hover:bg-primary/5 transition-colors">
                <Menu className="h-6 w-6 text-gray-700" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] p-0">
              <SheetHeader className="p-6 border-b bg-primary text-white">
                <SheetTitle className="text-left text-white flex items-center gap-2">
                  <span className="font-black tracking-wider">SATYAM DIGITAL</span>
                </SheetTitle>
              </SheetHeader>
              <div className="p-6 space-y-6">
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Shop By Category</h4>
                  <div className="grid gap-1">
                    {categoriesList.map((cat) => (
                      <Link
                        key={cat.id}
                        to={`/?cat=${cat.id}`}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary/5 hover:translate-x-1 transition-all text-gray-700 font-semibold"
                      >
                        <cat.icon className="h-5 w-5 text-primary" />
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="border-t pt-6 space-y-2">
                  <Link
                    to="/admin"
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary/5 hover:translate-x-1 transition-all text-gray-700 font-semibold"
                  >
                    <Settings className="h-5 w-5 text-primary" />
                    Admin Dashboard
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link to="/" className="flex items-center shrink-0 hover:scale-105 transition-transform duration-300">
            {logoError ? (
              <div className="leading-tight">
                <span className="text-lg md:text-xl font-black text-primary block">SATYAM</span>
                <span className="text-[10px] md:text-xs font-bold text-secondary tracking-widest block">DIGITAL</span>
              </div>
            ) : (
              <img
                src="/logo.png"
                alt="Satyam Digital"
                className="h-10 md:h-16 w-auto object-contain"
                onError={() => setLogoError(true)}
              />
            )}
          </Link>
        </div>

        {/* Desktop Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 max-w-2xl relative hidden md:block group">
          <Input
            placeholder="Search for Mobiles, Accessories, TV & more..."
            className="w-full pl-4 pr-12 h-11 border-2 border-primary/20 focus-visible:border-primary rounded-full bg-gray-50/50 transition-all duration-300 group-hover:border-primary/40"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button type="submit" size="icon" className="absolute right-1 top-1 h-9 w-9 rounded-full bg-primary hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all">
            <Search className="h-4 w-4 text-white" />
          </Button>
        </form>

        {/* Actions */}
        <div className="flex items-center gap-2 md:gap-4 shrink-0">
          {/* Mobile Search Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-10 w-10 hover:bg-primary/5 transition-colors"
            onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
          >
            <Search className="h-5 w-5 text-gray-700" />
          </Button>

          <div className="hover:scale-105 transition-transform duration-200">
            <CartDrawer />
          </div>
        </div>
      </div>

      {/* Mobile Search Bar (Expandable) */}
      {isMobileSearchOpen && (
        <div className="border-t p-3 bg-gray-50 md:hidden animate-in slide-in-from-top duration-200">
          <form onSubmit={handleSearch} className="relative">
            <Input
              placeholder="Search products..."
              className="w-full pl-4 pr-12 h-10 border-2 border-primary/20 focus-visible:border-primary rounded-full bg-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            <Button type="submit" size="icon" className="absolute right-1 top-1 h-8 w-8 rounded-full bg-primary hover:bg-primary/90">
              <Search className="h-3.5 w-3.5 text-white" />
            </Button>
          </form>
        </div>
      )}

      {/* Desktop Category Bar */}
      <div className="border-t bg-white hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-8 py-2">
          <Button variant="ghost" className="font-bold text-primary gap-2 hover:bg-primary/5 transition-colors">
            <Menu className="h-4 w-4" /> Shop By Category
          </Button>
          <nav className="flex items-center gap-6 text-sm font-semibold text-gray-700">
            {categoriesList.map((cat) => (
              <Link key={cat.id} to={`/?cat=${cat.id}`} className="hover:text-primary hover:scale-105 transition-all duration-200">
                {cat.name}
              </Link>
            ))}
            <Link to="/?q=offer" className="text-red-600 font-bold hover:text-red-700 hover:scale-105 transition-all duration-200">
              Offers
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};