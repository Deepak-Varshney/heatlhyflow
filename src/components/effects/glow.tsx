'use client';

import { useEffect, useState } from 'react';

export default function RandomGlow() {
  const [position, setPosition] = useState({
    top: '10%',
    left: '50%',
  });

  useEffect(() => {
    // Random % positions for top & left
    const randomTop = Math.floor(Math.random() * 90); // 0–90%
    const randomLeft = Math.floor(Math.random() * 90); // 0–90%

    setPosition({
      top: `${randomTop}%`,
      left: `${randomLeft}%`,
    });
  }, []);

  return (
    <div
      className="absolute w-[400px] h-[400px] bg-[color:var(--primary)] opacity-25 rounded-full blur-[160px] animate-pulse-slow z-0 transition-all duration-500"
      style={{
        top: position.top,
        left: position.left,
        transform: 'translate(-50%, -50%)',
      }}
    />
  );
}
