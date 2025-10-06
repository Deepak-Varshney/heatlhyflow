'use client';

// components/CursorTrail.tsx
import React, { useEffect } from 'react';

interface CursorTrailProps {
  className?: string;
}

export default function CursorTrail({ className }: CursorTrailProps) {
  useEffect(() => {
    const particles: HTMLElement[] = [];

    function createParticle(x: number, y: number) {
      const particle = document.createElement('div');
      particle.className = 'cursor-particle';
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      document.body.appendChild(particle);
      particles.push(particle);

      setTimeout(() => {
        particle.remove();
        particles.splice(particles.indexOf(particle), 1);
      }, 500);
    }

    function onMouseMove(e: MouseEvent) {
      createParticle(e.clientX, e.clientY);
    }

    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  return <div className={className} />;
}
