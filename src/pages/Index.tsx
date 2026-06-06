import { useState } from 'react';
import { useStore } from '../hooks/useStore';
import { Navbar } from '../components/Navbar';
import { ProductCard } from '../components/ProductCard';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Search, Filter } from 'lucide-react';

const Index = () => {
  const { products, categories, brands } = useStore();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                         p.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory ? p.categoryId === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-primary py-20 text-primary-foreground overflow-hidden">
        <div className="container relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl mb-6">
              Your One-Stop Shop for Digital Excellence
            </h1>
            <p className="text-xl text-primary-foreground/80 mb-8">
              Discover the latest in mobiles, home appliances, and electronics at Satyam Digital. Quality products, unbeatable prices.
            </p>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
          <Search className="w-full h-full" />
        </div>
      </section>

      <main className="container py-12">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Sidebar Filters */}
          <aside className="w-full md:w-64 space-y-8">
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Filter className="h-4 w-4" /> Categories
              </h3>
              <div className="flex flex-wrap md:flex-col gap-2">
                <Badge 
                  variant={selectedCategory === null ? "default" : "outline"}
                  className="cursor-pointer px-4 py-2 text-sm"
                  onClick={() => setSelectedCategory(null)}
                >
                  All Products
                </Badge>
                {categories.map(cat => (
                  <Badge 
                    key={cat.id}
                    variant={selectedCategory === cat.id ? "default" : "outline"}
                    className="cursor-pointer px-4 py-2 text-sm"
                    onClick={() => setSelectedCategory(cat.id)}
                  >
                    {cat.name}
                  </Badge>
                ))}
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1 space-y-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Search products..." 
                className="pl-10 h-12 text-lg"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
              <div className="text-center py-20">
                <p className="text-xl text-muted-foreground">No products found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="border-t py-12 bg-muted/30">
        <div className="container text-center text-muted-foreground">
          <p>© 2024 Satyam Digital. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;