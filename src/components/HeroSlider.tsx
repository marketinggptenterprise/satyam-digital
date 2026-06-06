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
              <div className="relative bg-gradient-to-r from-primary/95 to-blue-900/95 backdrop-blur-md h-[350px] md:h-[420px] flex flex-col md:flex-row items-center overflow-hidden">
                
                {/* Left Content Side */}
                <div className="flex-1 px-6 py-8 md:py-0 md:px-16 max-w-xl relative z-10 flex flex-col justify-center h-full">
                  <Badge className="bg-secondary text-primary dark:bg-zinc-900 dark:text-yellow-400 font-bold mb-4 hover:bg-secondary hover:text-primary rounded-full px-3 py-1 w-fit">
                    {banner.badge}
                  </Badge>
                  <h1 className="text-2xl md:text-5xl font-black text-white mb-3 leading-tight">
                    {banner.title}
                  </h1>
                  <p className="text-white/80 font-medium text-xs md:text-base mb-6 line-clamp-2">
                    {banner.subtitle}
                  </p>
                  <Button asChild className="bg-secondary text-primary hover:bg-secondary/90 hover:text-primary font-black px-6 py-5 md:px-8 md:py-6 rounded-full hover:scale-105 transition-all text-sm md:text-lg shadow-lg w-fit">
                    <a href="tel:+919932026227">SHOP NOW</a>
                  </Button>
                </div>

                {/* Right Image Side (Contained, PNG-style format) */}
                <div className="w-full md:w-1/2 h-[180px] md:h-full flex items-center justify-center p-4 md:p-10 relative z-10">
                  <div className="w-full h-full max-w-[280px] md:max-w-[400px] max-h-[160px] md:max-h-[320px] bg-white/10 dark:bg-white/5 backdrop-blur-md rounded-2xl p-4 md:p-6 border border-white/10 flex items-center justify-center shadow-inner hover:scale-105 transition-transform duration-500">
                    <img 
                      src={banner.image} 
                      alt={banner.title} 
                      className="max-h-full max-w-full object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.3)]"
                    />
                  </div>
                </div>

                {/* Decorative Background Glow */}
                <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-secondary/20 rounded-full blur-3xl pointer-events-none" />
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