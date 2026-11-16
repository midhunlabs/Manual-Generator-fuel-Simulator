import React from 'react';

// Maps each character to its active segments
const SEGMENTS_MAP = {
  '0': { A: true,  B: true,  C: true,  D: true,  E: true,  F: true,  G: false },
  '1': { A: false, B: true,  C: true,  D: false, E: false, F: false, G: false },
  '2': { A: true,  B: true,  C: false, D: true,  E: true,  F: false, G: true  },
  '3': { A: true,  B: true,  C: true,  D: true,  E: false, F: false, G: true  },
  '4': { A: false, B: true,  C: true,  D: false, E: false, F: true,  G: true  },
  '5': { A: true,  B: false, C: true,  D: true,  E: false, F: true,  G: true  },
  '6': { A: true,  B: false, C: true,  D: true,  E: true,  F: true,  G: true  },
  '7': { A: true,  B: true,  C: true,  D: false, E: false, F: false, G: false },
  '8': { A: true,  B: true,  C: true,  D: true,  E: true,  F: true,  G: true  },
  '9': { A: true,  B: true,  C: true,  D: true,  E: false, F: true,  G: true  },
  '-': { A: false, B: false, C: false, D: false, E: false, F: false, G: true  },
  ' ': { A: false, B: false, C: false, D: false, E: false, F: false, G: false }
};

/**
 * SevenSegmentDigit Component
 * Renders a single LED 7-segment digit with beveling and glow.
 * 
 * @param {string} char - The digit/character to render ('0'-'9', '-', ' ')
 * @param {boolean} dp - Whether the decimal point is lit (always false per user prompt but customizable)
 */
export default function SevenSegmentDigit({ char = ' ', dp = false }) {
  const activeSegments = SEGMENTS_MAP[char] || SEGMENTS_MAP[' '];

  // SVG Paths for segments (orthogonal layout, slanted via container skew)
  const segments = [
    { id: 'A', path: 'M 10 6 L 40 6 L 36 12 L 14 12 Z' },
    { id: 'B', path: 'M 41 8 L 41 40 L 35 36 L 35 12 Z' },
    { id: 'C', path: 'M 35 48 L 41 44 L 41 76 L 35 70 Z' },
    { id: 'D', path: 'M 14 72 L 36 72 L 40 78 L 10 78 Z' },
    { id: 'E', path: 'M 9 48 L 15 44 L 15 70 L 9 76 Z' },
    { id: 'F', path: 'M 9 12 L 15 8 L 15 36 L 9 40 Z' },
    { id: 'G', path: 'M 11 41 L 14 38 L 36 38 L 39 41 L 36 44 L 14 44 Z' }
  ];

  return (
    <div className="relative p-2 bg-[#0a0a0c] border border-neutral-900 rounded shadow-inner flex justify-center items-center select-none" style={{ minWidth: '60px', height: '110px' }}>
      {/* Background shadow structure */}
      <div className="absolute inset-0 bg-radial from-[#180a06] to-[#040405] opacity-50 rounded" />
      
      {/* The skewed digit display */}
      <svg 
        viewBox="0 0 50 86" 
        className="w-full h-full relative z-10 transition-all duration-300"
        style={{ transform: 'skewX(-7deg)' }}
      >
        {/* Shadow channels/cavities for off segments */}
        <g fill="#160805" opacity="0.85">
          {segments.map((seg) => (
            <path key={`bg-${seg.id}`} d={seg.path} />
          ))}
          <circle cx="45" cy="78" r="3" />
        </g>

        {/* Lit segments */}
        <g>
          {segments.map((seg) => {
            const isLit = activeSegments[seg.id];
            return (
              <path
                key={`lit-${seg.id}`}
                d={seg.path}
                className="transition-all duration-200 ease-out"
                style={{
                  fill: isLit ? '#ff3b00' : 'transparent',
                  filter: isLit 
                    ? 'drop-shadow(0px 0px 4px rgba(255, 59, 0, 0.95)) drop-shadow(0px 0px 10px rgba(255, 59, 0, 0.6))' 
                    : 'none',
                  opacity: isLit ? 1 : 0
                }}
              />
            );
          })}

          {/* Decimal Point */}
          <circle
            cx="45"
            cy="78"
            r="3"
            className="transition-all duration-200 ease-out"
            style={{
              fill: dp ? '#ff3b00' : 'transparent',
              filter: dp 
                ? 'drop-shadow(0px 0px 4px rgba(255, 59, 0, 0.95)) drop-shadow(0px 0px 8px rgba(255, 59, 0, 0.6))' 
                : 'none',
              opacity: dp ? 1 : 0
            }}
          />
        </g>
      </svg>

      {/* Screen reflection highlight overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none rounded" />
    </div>
  );
}
