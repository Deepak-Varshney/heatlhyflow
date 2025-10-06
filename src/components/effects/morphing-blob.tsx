'use client';
// components/MorphingBlob.tsx
import React from 'react';

export default function MorphingBlob() {
  return (
    <svg
      className="fixed bottom-10 right-10 w-64 h-64 -z-10 opacity-50"
      viewBox="0 0 600 600"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path fill="#ec4899" fillOpacity="0.7">
        <animate
          attributeName="d"
          dur="10s"
          repeatCount="indefinite"
          values="
            M421,322Q437,394,374,443Q311,492,244,460Q177,428,131,373Q85,318,121,256Q157,194,205,151Q253,108,318,111Q383,114,401,176Q419,238,421,322Z;
            M426,327Q439,414,367,452Q295,490,227,460Q159,430,107,372Q55,314,106,259Q157,204,197,151Q237,98,304,100Q371,102,400,167Q429,232,426,327Z;
            M420,320Q430,390,374,437Q318,484,255,466Q192,448,138,390Q84,332,128,269Q172,206,216,156Q260,106,318,113Q376,120,403,179Q430,238,420,320Z;
            M421,322Q437,394,374,443Q311,492,244,460Q177,428,131,373Q85,318,121,256Q157,194,205,151Q253,108,318,111Q383,114,401,176Q419,238,421,322Z"
        />
      </path>
    </svg>
  );
}
