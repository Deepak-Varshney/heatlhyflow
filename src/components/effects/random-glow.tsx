'use client';

import React from 'react';

interface RandomGlowProps {
  speed?: number; // seconds, default 20
  size?: number; // px, default 400
  color?: string; // CSS color or var, default var(--primary)
  blur?: number; // px, default 120
  opacity?: number; // 0 to 1, default 0.3
}

export default function RandomGlowMoving({
  speed = 50,
  size = 400,
  color = 'var(--primary)',
  blur = 120,
  opacity = 0.3,
}: RandomGlowProps) {
  const animationName = `edgeGlow_${speed}_${size}_${blur}_${Math.floor(opacity * 100)}`;

  return (
    <>
      <style>
        {`
          @keyframes ${animationName} {
            0% {
              top: 0%;
              left: 50%;
              transform: translate(-50%, 0);
            }
            25% {
              top: 50%;
              left: 100%;
              transform: translate(-100%, -50%);
            }
            50% {
              top: 100%;
              left: 50%;
              transform: translate(-50%, -100%);
            }
            75% {
              top: 50%;
              left: 100%;
              transform: translate(-100%, -50%);
            }
            100% {
              top: 0%;
              left: 50%;
              transform: translate(-50%, 0);
            }
          }
        `}
      </style>
      <div
        className="rounded-full pointer-events-none"
        style={{
          position: 'absolute',
          width: `${size}px`,
          height: `${size}px`,
          backgroundColor: color,
          filter: `blur(${blur}px)`,
          opacity: opacity,
          animation: `${animationName} ${speed}s linear infinite`,
          zIndex: 0,
        }}
      />
    </>
  );
}
