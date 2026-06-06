"use client";

import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Settings, Search, MapPin, ShoppingCart, Menu, X, Smartphone, Tv, Laptop, Watch, Speaker, Refrigerator, Sun, Moon } from 'lucide-react';
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

  // Sync search input with URL search params if they change externally
  useEffect(() => {
    setSearchQuery(searchParams.get('q') || '');
  }, [searchParams]);

  // Close suggestions when clicking outside
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

  // Filter products for suggestions
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
    <header className="w-full bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border-b border-white/20 dark:border-zinc-800/50 sticky top-0 z-50 transition-all duration-300">
      {/* Top Bar */}
      <div className="bg-primary/90 text-white dark:text-zinc-950 py-2 text-xs font-bold backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 hover:text-secondary dark:hover:text-zinc-800 transition-colors cursor-pointer">
              <MapPin className="h-3 w-3 text-secondary dark:text-zinc-800" /> Kargahir, kenduadihi, Bankura - 722101
            </span>
            <span className="hidden sm:inline hover:text-secondary dark:hover:text-zinc-800 transition-colors cursor-pointer">Contact: +91 9932026227</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/admin" className="hover:text-secondary dark:hover:text-zinc-800 flex items-center gap-1 font-semibold transition-colors">
              <Settings className="h-3 w-3 text-secondary dark:text-zinc-800" /> Admin Panel
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
              <Button variant="ghost" size="icon" className="lg:hidden h-10 w-10 hover:bg-primary/5 transition-colors rounded-full">
                <Menu className="h-6 w-6 text-gray-700 dark:text-gray-200" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] p-0 dark:bg-zinc-900/95 backdrop-blur-xl border-r border-white/10 dark:border-zinc-800/50">
              <SheetHeader className="p-6 border-b bg-primary/90 text-white dark:text-zinc-950 backdrop-blur-md">
                <SheetTitle className="text-left text-white dark:text-zinc-950 flex items-center gap-2">
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
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary/10 hover:translate-x-1 transition-all text-gray-700 dark:text-gray-200 font-semibold"
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
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary/10 hover:translate-x-1 transition-all text-gray-700 dark:text-gray-200 font-semibold"
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
                className="h-10 md:h-16 w-auto object-contain dark:brightness-110"
                onError={() => setLogoError(true)}
              />
            )}
          </Link>
        </div>

        {/* Desktop Search Bar */}
        <div ref={suggestionRef} className="flex-1 max-w-2xl relative hidden md:block">
          <form onSubmit={handleSearchSubmit} className="relative group">
            <Input
              placeholder="Search for Mobiles, Accessories, TV & more..."
              className="w-full pl-4 pr-12 h-11 border border-white/20 dark:border-zinc-800/50 rounded-full bg-white/40 dark:bg-zinc-800/40 backdrop-blur-md dark:text-white transition-all duration-300 focus:bg-white/60 dark:focus:bg-zinc-800/60 focus:border-primary/50"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              onFocus={() => setShowSuggestions(searchQuery.trim().length > 0)}
            />
            <Button type="submit" size="icon" className="absolute right-1 top-1 h-9 w-9 rounded-full bg-primary hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all">
              <Search className="h-4 w-4 text-white dark:text-zinc-950" />
            </Button>
          </form>

          {/* Dropdown Suggestions */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-white/20 dark:border-zinc-800/50 rounded-2xl shadow-2xl overflow-hidden z-50 max-h-[400px] overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
              {suggestions.map((product) => {
                const categoryName = categories.find(c => c.id === product.categoryId)?.name || 'Accessories';
                return (
                  <div
                    key={product.id}
                    onClick={() => handleSuggestionClick(product.name)}
                    className="flex items-center gap-4 p-3 hover:bg-white/50 dark:hover:bg-zinc-800/50 cursor-pointer transition-colors border-b last:border-none border-white/10 dark:border-zinc-800/30"
                  >
                    <div className="h-12 w-12 rounded-lg bg-white/80 border border-white/20 dark:border-zinc-800/30 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                      <img 
                        src={product.images?.[0] || product.image} 
                        alt={product.name} 
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-gray-800 dark:text-gray-100 truncate">
                        {product.name}
                      </h4>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        In <span className="text-primary font-semibold">{categoryName}</span>
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-sm font-black text-primary">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 md:gap-4 shrink-0">
          {/* Dark Mode Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 hover:bg-primary/5 transition-colors rounded-full"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            <Sun className="h-5 w-5 text-yellow-500 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 text-white rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          {/* Mobile Search Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-10 w-10 hover:bg-primary/5 transition-colors rounded-full"
            onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
          >
            <Search className="h-5 w-5 text-gray-700 dark:text-gray-200" />
          </Button>

          <div className="hover:scale-105 transition-transform duration-200">
            <CartDrawer />
          </div>
        </div>
      </div>

      {/* Mobile Search Bar (Expandable) */}
      {isMobileSearchOpen && (
        <div className="border-t p-3 bg-white/50 dark:bg-zinc-800/50 backdrop-blur-md md:hidden animate-in slide-in-from-top duration-200">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Input
              placeholder="Search products..."
              className="w-full pl-4 pr-12 h-10 border border-white/20 dark:border-zinc-700/30 rounded-full bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md dark:text-white"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              autoFocus
            />
            <Button type="submit" size="icon" className="absolute right-1 top-1 h-8 w-8 rounded-full bg-primary hover:bg-primary/90">
              <Search className="h-3.5 w-3.5 text-white dark:text-zinc-950" />
            </Button>
          </form>
        </div>
      )}

      {/* Desktop Category Bar */}
      <div className="border-t bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md hidden lg:block transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-8 py-2">
          <Button variant="ghost" className="font-bold text-primary gap-2 hover:bg-primary/5 transition-colors rounded-xl">
            <Menu className="h-4 w-4" /> Shop By Category
          </Button>
          <nav className="flex items-center gap-6 text-sm font-semibold text-gray-700 dark:text-gray-200">
            {categoriesList.map((cat) => (
              <Link 
                key={cat.id} 
                to={`/?cat=${cat.id}`} 
                className="relative py-1 hover:text-primary hover:scale-105 transition-all duration-200 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 hover:after:origin-bottom-left hover:after:scale-x-100"
              >
                {cat.name}
              </Link>
            ))}
            <Link 
              to="/?q=offer" 
              className="relative py-1 text-red-600 font-bold hover:text-red-700 hover:scale-105 transition-all duration-200 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-red-600 after:transition-transform after:duration-300 hover:after:origin-bottom-left hover:after:scale-x-100"
            >
              Offers
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};