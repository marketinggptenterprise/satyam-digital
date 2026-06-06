import { useState } from 'react';
import { Product, Category, Brand } from '../types/store';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ShoppingCart, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { showSuccess } from '../utils/toast';

interface ProductCardProps {
  product: Product;
  category?: Category;
  brand?: Brand;
}

export const ProductCard = ({ product, category, brand }: ProductCardProps) => {
  const { addToCart } = useCart();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const discountPrice = product.price * 1.2;

  const imagesList = product.images && product.images.filter(img => img.trim() !== '').length > 0
    ? product.images.filter(img => img.trim() !== '')
    : [product.image];

  const handleAddToCart = () => {
    addToCart(product);
    showSuccess(`${product.name} added to cart!`);
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % imagesList.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + imagesList.length) % imagesList.length);
  };

  return (
    <Card className="group relative bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl border border-white/20 dark:border-zinc-800/30 shadow-[0_8px_32px_0_rgba(0,0,0,0.04)] hover:shadow-[0_8px_32px_0_rgba(0,0,0,0.12)] hover:-translate-y-1.5 transition-all duration-300 rounded-2xl overflow-hidden flex flex-col h-full">
      <div className="absolute top-3 left-3 z-10">
        <Badge className="bg-secondary text-primary font-bold text-[10px] border-none rounded-full px-2.5 py-0.5">
          OFFER
        </Badge>
      </div>
      
      {/* Image Carousel */}
      <div className="aspect-square p-4 overflow-hidden bg-white/50 dark:bg-white/5 backdrop-blur-md relative flex items-center justify-center shrink-0 border-b border-white/10 dark:border-zinc-800/20">
        <img 
          src={imagesList[currentImageIndex]} 
          alt={product.name} 
          className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
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

      <CardContent className="p-5 flex flex-col flex-grow justify-between">
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
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-gray-400 line-through">
              ₹{discountPrice.toLocaleString('en-IN')}
            </span>
          </div>

          <Button 
            onClick={handleAddToCart}
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold rounded-xl gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-md"
          >
            <ShoppingCart className="h-4 w-4" /> Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
</dyad-file>

<dyad-write path="src/components/HeroSlider.tsx" description="Updating the HeroSlider to use a premium glassmorphic container with smooth transitions">
"use client";

import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { Banner } from '../types/store';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroSliderProps {
  banners: Banner[];
}

export const HeroSlider = ({ banners }: HeroSliderProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000 })]);

  const scrollPrev = React.useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = React.useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  if (!banners || banners.length === 0) return null;

  return (
    <section className="container py-6 relative group">
      <div className="overflow-hidden rounded-3xl border border-white/20 dark:border-zinc-800/30 shadow-2xl" ref={emblaRef}>
        <div className="flex">
          {banners.map((banner) => (
            <div key={banner.id} className="flex-[0_0_100%] min-w-0 relative">
              <div className="relative bg-gradient-to-r from-primary/90 to-blue-950/90 backdrop-blur-md h-[300px] md:h-[400px] flex items-center overflow-hidden">
                <div className="px-8 md:px-16 max-w-xl relative z-10">
                  <Badge className="bg-secondary text-primary font-bold mb-4 hover:bg-secondary hover:text-primary rounded-full px-3 py-1">{banner.badge}</Badge>
                  <h1 className="text-3xl md:text-6xl font-black text-white mb-4 leading-tight">
                    {banner.title.split(' ').map((word, i) => (
                      <span key={i} className={i === 2 ? "text-secondary" : ""}>{word} </span>
                    ))}
                  </h1>
                  <p className="text-white/80 text-sm md:text-lg mb-8 line-clamp-2">
                    {banner.subtitle}
                  </p>
                  <Button className="bg-secondary text-primary hover:bg-secondary/90 hover:text-primary font-black px-8 py-6 rounded-full hover:scale-105 transition-all text-lg shadow-lg">
                    SHOP NOW
                  </Button>
                </div>
                <div className="absolute right-0 bottom-0 w-full md:w-1/2 h-full opacity-30 md:opacity-100">
                  <img 
                    src={banner.image} 
                    alt={banner.title} 
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Button 
        variant="outline" 
        size="icon" 
        className="absolute left-10 top-1/2 -translate-y-1/2 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/30 opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex backdrop-blur-md"
        onClick={scrollPrev}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button 
        variant="outline" 
        size="icon" 
        className="absolute right-10 top-1/2 -translate-y-1/2 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/30 opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex backdrop-blur-md"
        onClick={scrollNext}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>
    </section>
  );
};