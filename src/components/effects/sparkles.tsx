'use client';
// components/Sparkles.tsx
import React from 'react';

export default function Sparkles() {
  return (
    <div className="pointer-events-none fixed inset-0 z-50">
      {[...Array(30)].map((_, i) => (
        <div
          key={i}
          className="absolute bg-pink-400 rounded-full opacity-75 animate-sparkle"
          style={{
            width: '4px',
            height: '4px',
            top: `${Math.random() * 100}vh`,
            left: `${Math.random() * 100}vw`,
            animationDelay: `${Math.random() * 3}s`,
          }}
        />
      ))}
    </div>
  );
}
