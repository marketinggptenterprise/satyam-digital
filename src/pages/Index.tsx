"use client";

import { useSearchParams } from 'react-router-dom';
import { useStore } from '../hooks/useStore';
import { Navbar } from '../components/Navbar';
import { ProductCard } from '../components/ProductCard';
import { HeroSlider } from '../components/HeroSlider';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Smartphone, Tv, Laptop, Watch, Speaker, Refrigerator, X } from 'lucide-react';
import { Input } from '../components/ui/input';

const Index = () => {
  const { products, categories, brands, banners } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const selectedCategory = searchParams.get('cat');
  const searchQuery = searchParams.get('q');

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory ? p.categoryId === selectedCategory : true;
    const matchesSearch = searchQuery 
      ? p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesCategory && matchesSearch;
  });

  const quickLinks = [
    { id: 'mobiles', name: 'Mobiles', icon: Smartphone },
    { id: 'laptops', name: 'Laptops', icon: Laptop },
    { id: 'smart-tv', name: 'Smart TV', icon: Tv }, // Updated ID and name
    { id: 'appliances', name: 'Appliances', icon: Refrigerator },
    { id: 'watches', name: 'Watches', icon: Watch },
    { id: 'accessories', name: 'Accessories', icon: Speaker }, // Updated ID and name
  ];

  const clearFilters = () => {
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-gray-900 dark:text-gray-100 transition-colors duration-300 relative overflow-hidden">
      {/* Background Decorative Blobs for Liquid Glass Effect */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full filter blur-[120px] opacity-20 dark:opacity-30 pointer-events-none animate-pulse duration-[8000ms]" />
      
      <Navbar />
      
      {/* Hero Slider - Only show on home page without filters */}
      {!selectedCategory && !searchQuery && <HeroSlider banners={banners} />}

      {/* Quick Category Links */}
      <section className="container py-8 relative z-10">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {quickLinks.map((link) => (
            <div 
              key={link.id}
              onClick={() => setSearchParams({ cat: link.id })}
              className={`group flex flex-col items-center p-4 rounded-2xl bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl border-2 cursor-pointer hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 ${selectedCategory === link.id ? 'border-primary bg-white/60 dark:bg-zinc-900/60' : 'border-white/20 dark:border-zinc-800/30'}`}
            >
              <div className="h-12 w-12 rounded-full bg-primary/5 flex items-center justify-center mb-2 transition-transform duration-300 group-hover:scale-110">
                <link.icon className="h-6 w-6 text-primary" />
              </div>
              <span className="relative text-xs font-bold text-gray-700 dark:text-gray-300 py-1 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 group-hover:after:origin-bottom-left group-hover:after:scale-x-100">
                {link.name}
              </span>
            </div>
          ))}
        </div>
      </section>

      <main className="container py-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-black text-gray-800 dark:text-white flex items-center gap-2">
              <span className="w-2 h-8 bg-primary rounded-full"></span>
              {searchQuery ? `Search results for "${searchQuery}"` : selectedCategory ? `${categories.find(c => c.id === selectedCategory)?.name || 'Products'}` : 'Trending Products'}
            </h2>
            {(selectedCategory || searchQuery) && (
              <Button variant="link" onClick={clearFilters} className="p-0 h-auto text-xs text-muted-foreground gap-1 mt-1 hover:text-primary transition-colors">
                <X className="h-3 w-3" /> Clear all filters
              </Button>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Badge 
              variant={!selectedCategory ? "default" : "outline"}
              className="cursor-pointer px-4 py-1 hover:scale-105 transition-transform duration-200 rounded-full"
              onClick={() => {
                const params = new URLSearchParams(searchParams);
                params.delete('cat');
                setSearchParams(params);
              }}
            >
              All
            </Badge>
            {categories.map(cat => (
              <Badge 
                key={cat.id}
                variant={selectedCategory === cat.id ? "default" : "outline"}
                className="cursor-pointer px-4 py-1 hover:scale-105 transition-transform duration-200 rounded-full"
                onClick={() => {
                  const params = new URLSearchParams(searchParams);
                  params.set('cat', cat.id);
                  setSearchParams(params);
                }}
              >
                {cat.name}
              </Badge>
            ))}
          </div>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid gap-6 grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
            {filteredProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product}
                category={categories.find(c => c.id === product.categoryId)}
                brand={brands.find(b => b.id === product.brandId)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl border border-white/20 dark:border-zinc-800/30 rounded-3xl p-20 text-center shadow-sm">
            <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Input className="h-10 w-10 text-muted-foreground" placeholder="Search..." />
            </div>
            <p className="text-xl font-bold text-gray-800 dark:text-white">No products found</p>
            <p className="text-muted-foreground mt-2">Try adjusting your search or filters to find what you're looking for.</p>
            <Button onClick={clearFilters} className="mt-6 bg-primary hover:scale-105 transition-transform duration-200 rounded-xl">View All Products</Button>
          </div>
        )}
      </main>

      {/* Features Section */}
      <section className="bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl border-t border-white/20 dark:border-zinc-800/30 mt-12 py-12 transition-colors duration-300 relative z-10">
        <div className="container grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { title: 'Free Delivery', desc: 'On orders above ₹999' },
            { title: 'Easy Returns', desc: '7 Days return policy' },
            { title: 'Secure Payment', desc: '100% safe transactions' },
            { title: '24/7 Support', desc: 'Dedicated help center' },
          ].map((feat, i) => (
            <div key={i} className="text-center group cursor-pointer">
              <h4 className="font-bold text-primary group-hover:scale-105 transition-transform duration-300">{feat.title}</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="bg-primary/90 text-white dark:text-zinc-950 py-12 transition-colors duration-300 relative z-10 backdrop-blur-md border-t border-white/10 dark:border-zinc-800/20">
        <div className="container grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="bg-white p-2 rounded-xl">
                <img 
                  src="/logo.png" 
                  alt="Satyam Digital" 
                  className="h-12 w-auto object-contain" 
                />
              </div>
              <div className="ml-2 leading-tight">
                <span className="text-lg font-black text-white dark:text-zinc-950 block">SATYAM</span>
                <span className="text-xs font-bold text-secondary dark:text-zinc-800 tracking-widest">DIGITAL</span>
              </div>
            </div>
            <p className="text-sm text-white/80 dark:text-zinc-950/90">
              Satyam Digital is your trusted partner for all things electronic. We bring you the best brands at the best prices.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-white dark:text-zinc-950">Quick Links</h4>
            <ul className="text-sm text-white/70 dark:text-zinc-950/80 space-y-2">
              {['About Us', 'Contact Us', 'Store Locator', 'Careers'].map((link, idx) => (
                <li key={idx} className="relative w-fit hover:text-secondary dark:hover:text-zinc-800 hover:translate-x-1 transition-all duration-200 cursor-pointer py-1 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-secondary dark:after:bg-zinc-800 after:transition-transform after:duration-300 hover:after:origin-bottom-left hover:after:scale-x-100">
                  {link}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-white dark:text-zinc-950">Policies</h4>
            <ul className="text-sm text-white/70 dark:text-zinc-950/80 space-y-2">
              {['Privacy Policy', 'Terms & Conditions', 'Shipping Policy', 'Return Policy'].map((link, idx) => (
                <li key={idx} className="relative w-fit hover:text-secondary dark:hover:text-zinc-800 hover:translate-x-1 transition-all duration-200 cursor-pointer py-1 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-secondary dark:after:bg-zinc-800 after:transition-transform after:duration-300 hover:after:origin-bottom-left hover:after:scale-x-100">
                  {link}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-white dark:text-zinc-950">Newsletter</h4>
            <p className="text-sm text-white/70 dark:text-zinc-950/80 mb-4">Subscribe to get latest updates and offers.</p>
            <div className="flex gap-2">
              <input className="bg-white/10 dark:bg-zinc-950/10 border-none rounded-xl px-4 py-2 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-secondary dark:focus:ring-zinc-800 text-white dark:text-zinc-950 placeholder:text-white/50 dark:placeholder:text-zinc-950/50" placeholder="Email" />
              <button className="bg-secondary dark:bg-zinc-900 text-primary dark:text-yellow-400 font-bold px-4 py-2 rounded-xl text-sm hover:scale-105 transition-transform duration-200">Join</button>
            </div>
          </div>
        </div>
        <div className="container border-t border-white/10 dark:border-zinc-950/20 mt-12 pt-8 text-center text-sm text-white/50 dark:text-zinc-950/60">
          <p>© 2024 Satyam Digital. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;