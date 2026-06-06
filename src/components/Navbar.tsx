"use client";

import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Settings, Search, MapPin, ShoppingCart, Menu, Smartphone, Tv, Laptop, Speaker, Refrigerator, Sun, Moon } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { CartDrawer } from './CartDrawer';
import { useCart } from '../hooks/useCart';
import { useStore } from '../hooks/useStore';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { useTheme } from 'next-themes';

export const Navbar = () => {
  const { totalItems } = useCart();
  const { products, categories } = useStore();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [logoError, setLogoError] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { theme, setTheme } = useTheme();
  const suggestionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSearchQuery(searchParams.get('q') || '');
  }, [searchParams]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setShowSuggestions(val.trim().length > 0);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    
    if (window.location.pathname !== '/') {
      navigate(`/?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      const params = new URLSearchParams(window.location.search);
      if (searchQuery.trim()) {
        params.set('q', searchQuery);
      } else {
        params.delete('q');
      }
      setSearchParams(params);
    }
    setIsMobileSearchOpen(false);
  };

  const handleSuggestionClick = (productName: string) => {
    setSearchQuery(productName);
    setShowSuggestions(false);
    if (window.location.pathname !== '/') {
      navigate(`/?q=${encodeURIComponent(productName)}`);
    } else {
      const params = new URLSearchParams(window.location.search);
      params.set('q', productName);
      setSearchParams(params);
    }
    setIsMobileSearchOpen(false);
  };

  const suggestions = searchQuery.trim()
    ? products.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 8)
    : [];

  const categoriesList = [
    { id: 'mobiles', name: 'Mobiles', icon: Smartphone },
    { id: 'laptops', name: 'Laptops', icon: Laptop },
    { id: 'electronics', name: 'Smart TV', icon: Tv },
    { id: 'appliances', name: 'Appliances', icon: Refrigerator },
    { id: 'audio', name: 'Accessories', icon: Speaker },
  ];

  return (
    <header className="w-full bg-white dark:bg-zinc-900 border-b sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-primary text-white py-2 text-xs font-bold">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3 text-secondary" /> Kargahir, kenduadihi, Bankura - 722101
            </span>
            <span className="hidden sm:inline">Contact: +91 9932026227</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/admin" className="hover:text-secondary flex items-center gap-1 font-semibold transition-colors">
              <Settings className="h-3 w-3" /> Admin Panel
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 py-3 md:py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden h-10 w-10">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] p-0">
              <SheetHeader className="p-6 border-b bg-primary text-white">
                <SheetTitle className="text-left text-white">SATYAM DIGITAL</SheetTitle>
              </SheetHeader>
              <div className="p-6 space-y-6">
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Shop By Category</h4>
                  <div className="grid gap-1">
                    {categoriesList.map((cat) => (
                      <Link
                        key={cat.id}
                        to={`/?cat=${cat.id}`}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted font-semibold"
                      >
                        <cat.icon className="h-5 w-5 text-primary" />
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <Link to="/" className="flex items-center shrink-0">
            {logoError ? (
              <div className="leading-tight">
                <span className="text-lg md:text-xl font-black text-primary block">SATYAM</span>
                <span className="text-[10px] md:text-xs font-bold text-secondary tracking-widest block">DIGITAL</span>
              </div>
            ) : (
              <img
                src="/logo.png"
                alt="Satyam Digital"
                className="h-10 md:h-14 w-auto object-contain"
                onError={() => setLogoError(true)}
              />
            )}
          </Link>
        </div>

        {/* Desktop Search Bar */}
        <div ref={suggestionRef} className="flex-1 max-w-2xl relative hidden md:block">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Input
              placeholder="Search for Mobiles, Accessories, TV & more..."
              className="w-full pl-4 pr-12 h-11 border-primary/20 rounded-full bg-gray-50 focus:bg-white"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              onFocus={() => setShowSuggestions(searchQuery.trim().length > 0)}
            />
            <Button type="submit" size="icon" className="absolute right-1 top-1 h-9 w-9 rounded-full bg-primary hover:bg-primary/90">
              <Search className="h-4 w-4 text-white" />
            </Button>
          </form>

          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-zinc-900 border rounded-2xl shadow-xl overflow-hidden z-50">
              {suggestions.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleSuggestionClick(product.name)}
                  className="flex items-center gap-4 p-3 hover:bg-gray-50 dark:hover:bg-zinc-800 cursor-pointer border-b last:border-none"
                >
                  <div className="h-12 w-12 rounded-lg border bg-white p-1 flex items-center justify-center shrink-0">
                    <img src={product.images?.[0] || product.image} alt={product.name} className="h-full w-full object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold truncate">{product.name}</h4>
                    <p className="text-xs text-muted-foreground">In {categories.find(c => c.id === product.categoryId)?.name || 'Store'}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-sm font-black text-primary">₹{product.price.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            <Sun className="h-5 w-5 text-yellow-500 block dark:hidden" />
            <Moon className="h-5 w-5 hidden dark:block" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
          >
            <Search className="h-5 w-5" />
          </Button>

          <CartDrawer />
        </div>
      </div>

      {isMobileSearchOpen && (
        <div className="border-t p-3 bg-gray-50 dark:bg-zinc-800 md:hidden">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Input
              placeholder="Search products..."
              className="w-full pl-4 pr-12 rounded-full"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              autoFocus
            />
            <Button type="submit" size="icon" className="absolute right-1 top-1 h-8 w-8 rounded-full">
              <Search className="h-3.5 w-3.5" />
            </Button>
          </form>
        </div>
      )}
    </header>
  );
};