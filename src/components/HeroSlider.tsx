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
      <div className="overflow-hidden rounded-3xl border border-white/40 dark:border-zinc-800/40 shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)]" ref={emblaRef}>
        <div className="flex">
          {banners.map((banner) => (
            <div key={banner.id} className="flex-[0_0_100%] min-w-0 relative">
              {/* macOS Pure Glass Effect Container */}
              <div className="relative bg-white/40 dark:bg-zinc-900/40 backdrop-blur-3xl h-[300px] md:h-[400px] flex items-center overflow-hidden border border-white/20 dark:border-zinc-800/20">
                <div className="px-8 md:px-16 max-w-xl relative z-10">
                  <Badge className="bg-primary/10 text-primary dark:bg-secondary/10 dark:text-secondary font-bold mb-4 rounded-full px-3 py-1 border border-primary/20 dark:border-secondary/20">
                    {banner.badge}
                  </Badge>
                  <h1 className="text-3xl md:text-6xl font-black text-slate-900 dark:text-white mb-4 leading-tight">
                    {banner.title.split(' ').map((word, i) => (
                      <span key={i} className={i === 2 ? "text-primary dark:text-secondary" : ""}>{word} </span>
                    ))}
                  </h1>
                  <p className="text-slate-600 dark:text-slate-300 font-medium text-sm md:text-lg mb-8 line-clamp-2">
                    {banner.subtitle}
                  </p>
                  <Button asChild className="bg-primary hover:bg-primary/90 text-white dark:bg-secondary dark:text-primary dark:hover:bg-secondary/90 font-black px-8 py-6 rounded-full hover:scale-105 transition-all text-lg shadow-lg">
                    <a href="tel:+919932026227">SHOP NOW</a>
                  </Button>
                </div>
                <div className="absolute right-0 bottom-0 w-full md:w-1/2 h-full opacity-20 md:opacity-100 flex items-center justify-center p-8">
                  <img 
                    src={banner.image} 
                    alt={banner.title} 
                    className="h-full w-full object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.1)] dark:drop-shadow-[0_15px_30px_rgba(0,0,0,0.4)]"
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
        className="absolute left-10 top-1/2 -translate-y-1/2 rounded-full bg-white/40 dark:bg-zinc-900/40 border border-white/40 dark:border-zinc-800/40 text-slate-800 dark:text-white hover:bg-white/60 dark:hover:bg-zinc-800/60 opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex backdrop-blur-md shadow-md"
        onClick={scrollPrev}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button 
        variant="outline" 
        size="icon" 
        className="absolute right-10 top-1/2 -translate-y-1/2 rounded-full bg-white/40 dark:bg-zinc-900/40 border border-white/40 dark:border-zinc-800/40 text-slate-800 dark:text-white hover:bg-white/60 dark:hover:bg-zinc-800/60 opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex backdrop-blur-md shadow-md"
        onClick={scrollNext}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>
    </section>
  );
};