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
                  <Badge className="bg-secondary text-primary dark:bg-zinc-900 dark:text-yellow-400 font-bold mb-4 hover:bg-secondary hover:text-primary rounded-full px-3 py-1">{banner.badge}</Badge>
                  <h1 className="text-3xl md:text-6xl font-black text-white dark:text-zinc-950 mb-4 leading-tight">
                    {banner.title.split(' ').map((word, i) => (
                      <span key={i} className={i === 2 ? "text-secondary dark:text-blue-900" : ""}>{word} </span>
                    ))}
                  </h1>
                  <p className="text-white/80 dark:text-black font-medium text-sm md:text-lg mb-8 line-clamp-2">
                    {banner.subtitle}
                  </p>
                  <Button className="bg-secondary text-primary dark:bg-zinc-900 dark:text-yellow-400 hover:bg-secondary/90 hover:text-primary font-black px-8 py-6 rounded-full hover:scale-105 transition-all text-lg shadow-lg">
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