"use client";

import { useSearchParams } from 'react-router-dom';
import { useStore } from '../hooks/useStore';
import { Navbar } from '../components/Navbar';
import { ProductCard } from '../components/ProductCard';
import { HeroSlider } from '../components/HeroSlider';
import { Badge } from '../components/ui/badge';
import { Smartphone, Tv, Laptop, Watch, Speaker, Refrigerator, X } from 'lucide-react';
import { Button } from '../components/ui/button';

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
    { id: 'electronics', name: 'Smart TV', icon: Tv },
    { id: 'laptops', name: 'Laptops', icon: Laptop },
    { id: 'watches', name: 'Watches', icon: Watch },
    { id: 'audio', name: 'Audio', icon: Speaker },
    { id: 'appliances', name: 'Appliances', icon: Refrigerator },
  ];

  const clearFilters = () => {
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-[#f4f4f4]">
      <Navbar />
      
      {/* Hero Slider - Only show on home page without filters */}
      {!selectedCategory && !searchQuery && <HeroSlider banners={banners} />}

      {/* Quick Category Links */}
      <section className="container py-8">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {quickLinks.map((link) => (
            <div 
              key={link.id}
              onClick={() => setSearchParams({ cat: link.id })}
              className={`flex flex-col items-center p-4 rounded-2xl bg-white shadow-sm cursor-pointer hover:shadow-md transition-all border-2 ${selectedCategory === link.id ? 'border-primary' : 'border-transparent'}`}
            >
              <div className="h-12 w-12 rounded-full bg-primary/5 flex items-center justify-center mb-2">
                <link.icon className="h-6 w-6 text-primary" />
              </div>
              <span className="text-xs font-bold text-gray-700">{link.name}</span>
            </div>
          ))}
        </div>
      </section>

      <main className="container py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-black text-gray-800 flex items-center gap-2">
              <span className="w-2 h-8 bg-primary rounded-full"></span>
              {searchQuery ? `Search results for "${searchQuery}"` : selectedCategory ? `${categories.find(c => c.id === selectedCategory)?.name || 'Products'}` : 'Trending Products'}
            </h2>
            {(selectedCategory || searchQuery) && (
              <Button variant="link" onClick={clearFilters} className="p-0 h-auto text-xs text-muted-foreground gap-1 mt-1">
                <X className="h-3 w-3" /> Clear all filters
              </Button>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Badge 
              variant={!selectedCategory ? "default" : "outline"}
              className="cursor-pointer px-4 py-1"
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
                className="cursor-pointer px-4 py-1"
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
          <div className="bg-white rounded-2xl p-20 text-center shadow-sm">
            <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-10 w-10 text-muted-foreground" />
            </div>
            <p className="text-xl font-bold text-gray-800">No products found</p>
            <p className="text-muted-foreground mt-2">Try adjusting your search or filters to find what you're looking for.</p>
            <Button onClick={clearFilters} className="mt-6 bg-primary">View All Products</Button>
          </div>
        )}
      </main>

      {/* Features Section */}
      <section className="bg-white border-t mt-12 py-12">
        <div className="container grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { title: 'Free Delivery', desc: 'On orders above ₹999' },
            { title: 'Easy Returns', desc: '7 Days return policy' },
            { title: 'Secure Payment', desc: '100% safe transactions' },
            { title: '24/7 Support', desc: 'Dedicated help center' },
          ].map((feat, i) => (
            <div key={i} className="text-center">
              <h4 className="font-bold text-primary">{feat.title}</h4>
              <p className="text-xs text-gray-500">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="bg-primary text-white py-12">
        <div className="container grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="bg-white p-2 rounded-lg">
                <img 
                  src="/logo.png" 
                  alt="Satyam Digital" 
                  className="h-12 w-auto object-contain" 
                />
              </div>
              <div className="ml-2 leading-tight">
                <span className="text-lg font-black text-white block">SATYAM</span>
                <span className="text-xs font-bold text-secondary tracking-widest">DIGITAL</span>
              </div>
            </div>
            <p className="text-sm text-white/60">
              Satyam Digital is your trusted partner for all things electronic. We bring you the best brands at the best prices.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="text-sm text-white/60 space-y-2">
              <li>About Us</li>
              <li>Contact Us</li>
              <li>Store Locator</li>
              <li>Careers</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Policies</h4>
            <ul className="text-sm text-white/60 space-y-2">
              <li>Privacy Policy</li>
              <li>Terms & Conditions</li>
              <li>Shipping Policy</li>
              <li>Return Policy</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Newsletter</h4>
            <p className="text-sm text-white/60 mb-4">Subscribe to get latest updates and offers.</p>
            <div className="flex gap-2">
              <input className="bg-white/10 border-none rounded-lg px-4 py-2 text-sm flex-1" placeholder="Email" />
              <button className="bg-secondary text-primary font-bold px-4 py-2 rounded-lg text-sm">Join</button>
            </div>
          </div>
        </div>
        <div className="container border-t border-white/10 mt-12 pt-8 text-center text-sm text-white/40">
          <p>© 2024 Satyam Digital. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;