'use client';
// components/ParallaxBackground.tsx
import React, { useEffect, useState } from 'react';

export default function ParallaxBackground() {
  const [offsetY, setOffsetY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setOffsetY(window.pageYOffset);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed inset-0 -z-20 overflow-hidden">
      {/* Layer 1 - slowest */}
      <div
        style={{ transform: `translateY(${offsetY * 0.2}px)` }}
        className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-purple-600 via-pink-500 to-indigo-500 opacity-30"
      />
      {/* Layer 2 - faster */}
      <div
        style={{ transform: `translateY(${offsetY * 0.5}px)` }}
        className="absolute top-0 left-0 w-full h-full bg-gradient-to-bl from-pink-400 via-red-400 to-yellow-400 opacity-20"
      />
    </div>
  );
}
