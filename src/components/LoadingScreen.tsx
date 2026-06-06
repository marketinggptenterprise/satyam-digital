"use client";

import { useEffect, useState } from 'react';

export const LoadingScreen = () => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Simulate loading progress
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          // Start fade out slightly after progress hits 100
          setTimeout(() => setFadeOut(true), 100); // Reduced fade out delay
          // Remove component from DOM after transition finishes
          setTimeout(() => setLoading(false), 500); // Reduced total removal delay
          return 100;
        }
        return prev + 5; // Increased progress increment for faster animation
      });
    }, 10); // Reduced interval for faster progress animation

    // Immediately trigger fade out if component is mounted after a quick initial load
    // This handles cases where content loads very quickly
    const minDisplayTime = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => setLoading(false), 500); // Ensure it hides even if progress isn't 100 yet
    }, 1000); // Minimum 1 second display before attempting to hide

    return () => {
      clearInterval(timer);
      clearTimeout(minDisplayTime);
    };
  }, []);

  if (!loading) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center transition-opacity duration-500 ease-in-out ${fadeOut ? 'opacity-0' : 'opacity-100'}`}
    >
      <div className="mb-8 animate-pulse">
        <img src="/logo.png" alt="Satyam Digital" className="h-24 w-auto" />
      </div>
      
      <div className="w-64 h-1 bg-gray-100 rounded-full overflow-hidden relative">
        <div 
          className="absolute top-0 left-0 h-full bg-primary transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <p className="mt-4 text-xs font-bold text-primary tracking-[0.2em] uppercase animate-pulse">
        Loading Experience
      </p>
    </div>
  );
};