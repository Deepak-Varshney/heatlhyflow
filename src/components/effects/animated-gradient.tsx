'use client';

// components/AnimatedGradient.tsx
import React from 'react';

export default function AnimatedGradient() {
  return (
    <div className="fixed inset-0 -z-30 animate-gradient bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 bg-[length:400%_400%]" />
  );
}
