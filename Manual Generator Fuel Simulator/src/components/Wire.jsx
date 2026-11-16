import React from 'react';

/**
 * Wire Component
 * Renders an animated connecting cable between hardware subpanels.
 * Animates current pulses whose speed scales with the voltage.
 * 
 * @param {boolean} active - Whether signals are flowing (power ON)
 * @param {number} voltage - Current voltage to scale animation speed
 * @param {string} type - Wire category ('analog', 'digital')
 * @param {string} direction - Flow orientation ('horizontal', 'vertical', 'curve')
 */
export default function Wire({ active = false, voltage = 0.110, type = 'analog', direction = 'horizontal' }) {
  // Speed calculation: higher voltage (up to 1.920V) makes pulses move faster
  // Interpolate duration between 2.5s (low voltage) and 0.5s (high voltage)
  const minVolts = 0.110;
  const maxVolts = 1.920;
  const clampedVolts = Math.max(minVolts, Math.min(maxVolts, voltage));
  const ratio = (clampedVolts - minVolts) / (maxVolts - minVolts);
  const duration = active ? (2.2 - ratio * 1.8).toFixed(2) : 0;

  // Pulse color
  const pulseColor = type === 'analog' ? '#f59e0b' : '#38bdf8'; // Amber for analog, Cyan for digital

  return (
    <div className="flex items-center justify-center select-none pointer-events-none z-10 w-full h-full">
      <style>{`
        @keyframes pulseFlow {
          from { stroke-dashoffset: 40; }
          to { stroke-dashoffset: 0; }
        }
        .pulse-active {
          animation: pulseFlow ${duration}s infinite linear;
        }
      `}</style>
      
      <svg
        viewBox="0 0 100 40"
        className="w-full h-10 min-w-[50px] max-w-[120px]"
        preserveAspectRatio="none"
      >
        {/* Outer insulation cover (semi-translucent shadow sleeve) */}
        <path
          d={direction === 'curve' ? 'M 0 20 Q 50 40, 100 20' : 'M 0 20 L 100 20'}
          fill="none"
          stroke="#1e293b"
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* Copper conductor core */}
        <path
          d={direction === 'curve' ? 'M 0 20 Q 50 40, 100 20' : 'M 0 20 L 100 20'}
          fill="none"
          stroke={type === 'analog' ? '#b45309' : '#0369a1'}
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Inner core wire shine line */}
        <path
          d={direction === 'curve' ? 'M 0 20 Q 50 40, 100 20' : 'M 0 20 L 100 20'}
          fill="none"
          stroke={type === 'analog' ? '#f59e0b' : '#38bdf8'}
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.6"
        />

        {/* Animated glowing pulses */}
        {active && (
          <path
            d={direction === 'curve' ? 'M 0 20 Q 50 40, 100 20' : 'M 0 20 L 100 20'}
            fill="none"
            stroke={pulseColor}
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray="6, 14"
            className="pulse-active"
            style={{
              filter: `drop-shadow(0 0 3px ${pulseColor}) drop-shadow(0 0 8px ${pulseColor})`
            }}
          />
        )}
      </svg>
    </div>
  );
}
