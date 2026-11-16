import React from 'react';
import SevenSegmentDigit from './SevenSegmentDigit';

/**
 * ThreeDigitDisplay Component
 * Displays a 3-digit number representing Fuel Percentage.
 * 
 * @param {number} fuelPercentage - Fuel percentage from 0 to 100
 */
export default function ThreeDigitDisplay({ fuelPercentage = 0 }) {
  // Clamp value between 0 and 999, then zero-pad to length 3
  const value = Math.max(0, Math.min(999, Math.round(fuelPercentage)));
  const displayValue = value.toString().padStart(3, '0');

  return (
    <div className="flex flex-col items-center">
      {/* Physical plastic/metallic housing bezel */}
      <div className="relative p-4 bg-gradient-to-b from-[#2a2b33] to-[#1b1c21] border-t-2 border-l border-r border-[#424450] border-b-4 border-[#0e0f12] rounded-xl shadow-[0_10px_25px_rgba(0,0,0,0.8),inset_0_2px_4px_rgba(255,255,255,0.15)] select-none">
        
        {/* Recessed inner acrylic display frame */}
        <div className="relative p-2 bg-gradient-to-b from-[#040406] to-[#0d0d12] border-2 border-[#121318] rounded-lg shadow-[inset_0_4px_8px_rgba(0,0,0,0.9)] flex gap-2">
          
          <SevenSegmentDigit char={displayValue[0]} />
          <SevenSegmentDigit char={displayValue[1]} />
          <SevenSegmentDigit char={displayValue[2]} />
          
          {/* Subtle glow overflow onto the dark background */}
          <div className="absolute inset-0 bg-[#ff3b00]/3 opacity-10 pointer-events-none rounded-lg blur-md" />
        </div>

        {/* Small screw accents to enforce the industrial aesthetic */}
        <div className="absolute top-1.5 left-2 w-1.5 h-1.5 rounded-full bg-gradient-to-br from-neutral-500 to-neutral-800 border border-neutral-900 shadow-inner" />
        <div className="absolute top-1.5 right-2 w-1.5 h-1.5 rounded-full bg-gradient-to-br from-neutral-500 to-neutral-800 border border-neutral-900 shadow-inner" />
        <div className="absolute bottom-1.5 left-2 w-1.5 h-1.5 rounded-full bg-gradient-to-br from-neutral-500 to-neutral-800 border border-neutral-900 shadow-inner" />
        <div className="absolute bottom-1.5 right-2 w-1.5 h-1.5 rounded-full bg-gradient-to-br from-neutral-500 to-neutral-800 border border-neutral-900 shadow-inner" />
      </div>
      
      {/* Technical label printed underneath */}
      <span className="mt-2 text-[10px] font-mono font-bold tracking-wider text-neutral-400 uppercase select-none">
        Fuel Level Digital Readout
      </span>
    </div>
  );
}
