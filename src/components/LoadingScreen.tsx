"use client";

import { useEffect, useState } from 'react';

export const LoadingScreen = () => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          // Start fade out slightly after progress hits 100
          setTimeout(() => setFadeOut(true), 200);
          // Remove component from DOM after transition finishes
          setTimeout(() => setLoading(false), 1000);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => clearInterval(timer);
  }, []);

  if (!loading) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-white dark:bg-zinc-950 flex flex-col items-center justify-center transition-opacity duration-700 ease-in-out ${fadeOut ? 'opacity-0' : 'opacity-100'}`}
    >
      <div className="mb-8 text-center animate-pulse">
        <img src="/logo.png" alt="Satyam Digital" className="h-20 w-auto object-contain mx-auto" />
      </div>
      
      <div className="w-64 h-1 bg-gray-100 dark:bg-zinc-900 rounded-full overflow-hidden relative">
        <div 
          className="absolute top-0 left-0 h-full bg-[#0c3c8c] dark:bg-[#ffbf00] transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <p className="mt-4 text-xs font-bold text-[#0c3c8c] dark:text-[#ffbf00] tracking-[0.2em] uppercase animate-pulse">
        Loading Experience
      </p>
    </div>
  );
};