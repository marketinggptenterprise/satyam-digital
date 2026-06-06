"use client";

import { useSearchParams } from 'react-router-dom';
import { useStore } from '../hooks/useStore';
import { Navbar } from '../components/Navbar';
import { ProductCard } from '../components/ProductCard';
import { HeroSlider } from '../components/HeroSlider';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Smartphone, Tv, Laptop, Watch, Speaker, Refrigerator, X, Percent } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Banner } from '../types/store';

const Index = () => {
  const { products, categories, brands, banners } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const selectedCategory = searchParams.get('cat');
  const searchQuery = searchParams.get('q');

  // Offers section logic: "if I have a discount then if I click on featured product it will automatically show in the offers section"
  // When q=offer is active, we filter products that are featured AND have a discount > 0.
  const isOffersSection = searchQuery?.toLowerCase() === 'offer';

  const filteredProducts = products.filter(p => {
    if (isOffersSection) {
      return p.isFeatured && p.discountPercent && p.discountPercent > 0;
    }

    const matchesCategory = selectedCategory ? p.categoryId === selectedCategory : true;
    const matchesSearch = searchQuery 
      ? p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesCategory && matchesSearch;
  });

  // Hero Banner logic: "if the product is on sale and offer it should show in the hero banner section"
  // We map featured products with a discount into Banner format and combine them with custom banners.
  const productBanners: Banner[] = products
    .filter(p => p.isFeatured && p.discountPercent && p.discountPercent > 0)
    .map(p => ({
      id: `prod-banner-${p.id}`,
      title: p.name,
      subtitle: p.description,
      badge: `${p.discountPercent}% OFF SPECIAL OFFER`,
      image: p.images?.[0] || p.image,
      link: `/product/${p.id}`
    }));

  const allBanners = [...banners, ...productBanners];

  const quickLinks = [
    { id: 'mobiles', name: 'Mobiles', icon: Smartphone },
    { id: 'laptops', name: 'Laptops', icon: Laptop },
    { id: 'smart-tv', name: 'Smart TV', icon: Tv },
    { id: 'appliances', name: 'Appliances', icon: Refrigerator },
    { id: 'watches', name: 'Watches', icon: Watch },
    { id: 'accessories', name: 'Accessories', icon: Speaker },
  ];

  const clearFilters = () => {
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-gray-900 dark:text-gray-100 transition-colors duration-300 relative overflow-hidden">
      <Navbar />
      
      {/* Hero Slider - Only show on home page without filters */}
      {!selectedCategory && !searchQuery && <HeroSlider banners={allBanners} />}

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
              {isOffersSection 
                ? "Special Offers & Discounts" 
                : searchQuery 
                  ? `Search results for "${searchQuery}"` 
                  : selectedCategory 
                    ? `${categories.find(c => c.id === selectedCategory)?.name || 'Products'}` 
                    : 'Trending Products'}
            </h2>
            {(selectedCategory || searchQuery) && (
              <Button variant="link" onClick={clearFilters} className="p-0 h-auto text-xs text-muted-foreground gap-1 mt-1 hover:text-primary transition-colors">
                <X className="h-3 w-3" /> Clear all filters
              </Button>
            )}
          </div>
          
          {/* Custom Styled Badges matching the image */}
          <div className="flex flex-wrap gap-2.5 items-center">
            {/* All Badge */}
            <Badge 
              className={`cursor-pointer px-5 py-1.5 text-xs font-bold rounded-full transition-all duration-200 hover:scale-105 border-none ${
                !selectedCategory && !isOffersSection 
                  ? "bg-secondary text-primary shadow-md" 
                  : "bg-zinc-950 text-white border border-blue-900/80 hover:bg-zinc-900"
              }`}
              onClick={clearFilters}
            >
              All
            </Badge>

            {/* Offers Badge */}
            <Badge 
              className={`cursor-pointer px-5 py-1.5 text-xs font-bold rounded-full transition-all duration-200 hover:scale-105 ${
                isOffersSection 
                  ? "bg-red-600 text-white border-none shadow-md" 
                  : "bg-red-950/30 text-red-500 border border-red-900/50 hover:bg-red-950/50"
              }`}
              onClick={() => setSearchParams({ q: 'offer' })}
            >
              <span className="mr-1">%</span> Offers
            </Badge>

            {/* Category Badges */}
            {categories.map(cat => {
              const isActive = selectedCategory === cat.id;
              return (
                <Badge 
                  key={cat.id}
                  className={`cursor-pointer px-5 py-1.5 text-xs font-bold rounded-full transition-all duration-200 hover:scale-105 ${
                    isActive 
                      ? "bg-primary text-white border-none shadow-md" 
                      : "bg-zinc-950 text-white border border-blue-900/80 hover:bg-zinc-900"
                  }`}
                  onClick={() => {
                    const params = new URLSearchParams(searchParams);
                    params.set('cat', cat.id);
                    params.delete('q'); // Clear search query when switching categories
                    setSearchParams(params);
                  }}
                >
                  {cat.name}
                </Badge>
              );
            })}
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
            <h4 className="font-bold mb-4 text-white dark:text-zinc-950">Our Location</h4>
            <div className="rounded-2xl overflow-hidden border border-white/10 dark:border-zinc-950/20 shadow-md h-48 w-full">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d273.607536578055!2d87.03014488807364!3d23.228502759623666!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f7af0c720efa6d%3A0xbfe247afaaa9c5b0!2sSATYAM%20DIGITAL!5e1!3m2!1sen!2sin!4v1780749294186!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              />
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