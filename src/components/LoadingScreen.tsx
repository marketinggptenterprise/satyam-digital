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
        <div className="leading-none select-none">
          <span className="text-4xl font-black text-[#0c3c8c] dark:text-[#ffbf00] block tracking-tight">SATYAM</span>
          <span className="text-lg font-extrabold text-[#ffbf00] dark:text-white block tracking-[0.3em] mt-1.5">DIGITAL</span>
        </div>
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