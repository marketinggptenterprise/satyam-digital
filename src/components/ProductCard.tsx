import { useState } from 'react';
import { Product, Category, Brand } from '../types/store';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ShoppingCart, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { showSuccess } from '../utils/toast';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
  category?: Category;
  brand?: Brand;
}

export const ProductCard = ({ product, category, brand }: ProductCardProps) => {
  const { addToCart } = useCart();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Calculate selling price based on discount percentage
  const hasDiscount = product.discountPercent && product.discountPercent > 0;
  const sellingPrice = hasDiscount 
    ? product.price * (1 - (product.discountPercent || 0) / 100) 
    : product.price;
  const originalPrice = product.price;

  // Ensure product.images is an array and filter out non-string or empty images
  const safeImages = Array.isArray(product.images) ? product.images : [];
  const filteredImages = safeImages.filter(img => typeof img === 'string' && img.trim() !== '');
  const imagesList = filteredImages.length > 0 ? filteredImages : [product.image];

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.inStock === false) return;
    addToCart(product);
    showSuccess(`${product.name} added to cart!`);
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentImageIndex((prev) => (prev + 1) % imagesList.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentImageIndex((prev) => (prev - 1 + imagesList.length) % imagesList.length);
  };

  return (
    <Card className="group relative bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl border border-white/20 dark:border-zinc-800/30 shadow-[0_8px_32px_0_rgba(0,0,0,0.04)] hover:shadow-[0_8px_32px_0_rgba(0,0,0,0.12)] hover:-translate-y-1.5 transition-all duration-300 rounded-2xl overflow-hidden flex flex-col h-full">
      <Link to={`/product/${product.id}`} className="block flex-grow">
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
          {product.inStock === false ? (
            <Badge variant="destructive" className="font-bold text-[10px] border-none rounded-full px-2.5 py-0.5">
              OUT OF STOCK
            </Badge>
          ) : hasDiscount ? (
            <Badge className="bg-red-500 text-white font-bold text-[10px] border-none rounded-full px-2.5 py-0.5">
              {product.discountPercent}% OFF
            </Badge>
          ) : (
            <Badge className="bg-secondary text-primary font-bold text-[10px] border-none rounded-full px-2.5 py-0.5">
              OFFER
            </Badge>
          )}
        </div>
        
        {/* Image Carousel */}
        <div className="aspect-square p-4 overflow-hidden bg-white/50 dark:bg-white/5 backdrop-blur-md relative flex items-center justify-center shrink-0 border-b border-white/10 dark:border-zinc-800/20">
          <img 
            src={imagesList[currentImageIndex]} 
            alt={product.name} 
            className={`h-full w-full object-contain transition-transform duration-500 group-hover:scale-105 ${product.inStock === false ? 'opacity-50' : ''}`}
          />
          
          {imagesList.length > 1 && (
            <>
              <button 
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/10 hover:bg-black/30 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button 
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/10 hover:bg-black/30 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              
              {/* Dots indicator */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
                {imagesList.map((_, idx) => (
                  <span 
                    key={idx} 
                    className={`h-1.5 w-1.5 rounded-full transition-all ${idx === currentImageIndex ? 'bg-primary w-3' : 'bg-gray-300/60'}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <CardContent className="p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1 mb-1.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="h-3 w-3 fill-secondary text-secondary" />
              ))}
              <span className="text-[10px] text-gray-400 ml-1">(4.5)</span>
            </div>
            
            <p className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1">
              {brand?.name}
            </p>
            
            <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100 line-clamp-2 h-10 mb-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
          </div>

          <div>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-lg font-black text-primary">
                ₹{sellingPrice.toLocaleString('en-IN')}
              </span>
              {hasDiscount && (
                <span className="text-xs text-gray-400 line-through">
                  ₹{originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Link>
      <div className="p-5 pt-0 mt-auto">
        <Button 
          onClick={handleAddToCart}
          disabled={product.inStock === false}
          className={`w-full font-bold rounded-xl gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-md ${
            product.inStock === false 
              ? 'bg-gray-300 text-gray-500 dark:bg-zinc-800 dark:text-zinc-500 cursor-not-allowed' 
              : 'bg-primary hover:bg-primary/90 text-white'
          }`}
        >
          <ShoppingCart className="h-4 w-4" /> {product.inStock === false ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </div>
    </Card>
  );
};