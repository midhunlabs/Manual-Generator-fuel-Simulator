import React from 'react';

/**
 * FuelGauge Component
 * Renders a circular mechanical analog gauge displaying fuel percentage (0-100%).
 * 
 * @param {number} fuelPercentage - Current fuel level (0-100)
 * @param {boolean} power - Power status
 */
export default function FuelGauge({ fuelPercentage = 0, power }) {
  // If no power, gauge needle falls back to rest (slightly below 0%, e.g., -125 degrees)
  const targetPercent = power ? fuelPercentage : 0;
  
  // Needle math: 240 degree sweep from -120deg (0%) to +120deg (100%)
  const minAngle = -120;
  const maxAngle = 120;
  const angle = minAngle + (targetPercent / 100) * (maxAngle - minAngle);

  return (
    <div className="relative p-6 bg-gradient-to-b from-[#25262d] to-[#17181c] border-t-2 border-l border-r border-[#3d3f4b] border-b-4 border-[#0b0c0f] rounded-xl shadow-2xl flex flex-col items-center">
      <div className="w-full text-center">
        <span className="text-[10px] font-mono font-bold tracking-wider text-amber-500 uppercase">
          Indicator 01
        </span>
        <h3 className="text-sm font-sans font-bold text-neutral-200 mb-4">
          Analog Fuel Level Gauge
        </h3>
      </div>

      {/* Outer Dial housing */}
      <div className="relative w-[180px] h-[180px] rounded-full bg-gradient-to-b from-[#3a3c46] via-[#1b1c22] to-[#0c0d10] p-1.5 shadow-[0_12px_25px_rgba(0,0,0,0.8),inset_0_2px_4px_rgba(255,255,255,0.2)]">
        
        {/* Chrome bezel border ring */}
        <div className="absolute inset-1 rounded-full border border-neutral-700 pointer-events-none" />

        {/* Dial Face Plate */}
        <div className="w-full h-full rounded-full bg-[#0e0f14] relative overflow-hidden flex items-center justify-center shadow-[inset_0_4px_10px_rgba(0,0,0,0.9)]">
          
          <svg viewBox="0 0 200 200" className="w-full h-full relative z-10 select-none">
            {/* Gradients */}
            <defs>
              <linearGradient id="red-zone" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#b91c1c" />
              </linearGradient>
              <linearGradient id="yellow-zone" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#eab308" />
                <stop offset="100%" stopColor="#ca8a04" />
              </linearGradient>
              <linearGradient id="green-zone" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#22c55e" />
                <stop offset="100%" stopColor="#15803d" />
              </linearGradient>
            </defs>

            {/* Colored arcs representing fuel zones */}
            {/* Arc radius = 75, centered at 100,100 */}
            {/* Red Zone (0-30%): -120deg to -48deg */}
            <path
              d="M 35.0 137.5 A 75 75 0 0 1 49.8 49.8"
              fill="none"
              stroke="url(#red-zone)"
              strokeWidth="6"
              strokeLinecap="round"
            />
            {/* Yellow Zone (30-60%): -48deg to +24deg */}
            <path
              d="M 49.8 49.8 A 75 75 0 0 1 131.4 35.0"
              fill="none"
              stroke="url(#yellow-zone)"
              strokeWidth="6"
            />
            {/* Green Zone (60-100%): +24deg to +120deg */}
            <path
              d="M 131.4 35.0 A 75 75 0 0 1 165.0 137.5"
              fill="none"
              stroke="url(#green-zone)"
              strokeWidth="6"
              strokeLinecap="round"
            />

            {/* Graduation/Tick Marks */}
            {[...Array(11)].map((_, i) => {
              const tickAngle = -120 + i * 24; // 11 ticks from -120 to +120
              const isMajor = i % 2 === 0;
              const rad = (tickAngle * Math.PI) / 180;
              const x1 = 100 + 78 * Math.sin(rad);
              const y1 = 100 - 78 * Math.cos(rad);
              const x2 = 100 + (isMajor ? 68 : 72) * Math.sin(rad);
              const y2 = 100 - (isMajor ? 68 : 72) * Math.cos(rad);
              return (
                <line
                  key={`tick-${i}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#4b5563"
                  strokeWidth={isMajor ? '2' : '1'}
                />
              );
            })}

            {/* Scale Labels */}
            <text x="32" y="152" fill="#6b7280" fontSize="10" fontFamily="monospace" textAnchor="middle">E</text>
            <text x="100" y="24" fill="#6b7280" fontSize="10" fontFamily="monospace" textAnchor="middle">1/2</text>
            <text x="168" y="152" fill="#6b7280" fontSize="10" fontFamily="monospace" textAnchor="middle">F</text>

            <text x="100" y="70" fill="#374151" fontSize="14" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle" tracking-widest="3">
              FUEL
            </text>

            {/* Real-time Numeric HUD inside face */}
            <text x="100" y="155" fill={power ? '#f59e0b' : '#374151'} fontSize="16" fontWeight="bold" fontFamily="monospace" textAnchor="middle" className="transition-all duration-300">
              {power ? `${Math.round(fuelPercentage)}%` : '---'}
            </text>

            {/* Rotating Needle Assembly */}
            <g
              transform={`translate(100, 100) rotate(${angle})`}
              className="transition-transform duration-500 ease-out"
            >
              {/* Pointer Needle (pointing straight up at 0deg relative to system) */}
              <polygon
                points="-3,0 0,-85 3,0"
                fill="#dc2626"
                filter="drop-shadow(0 2px 4px rgba(0,0,0,0.5))"
              />
              {/* Tail counterbalance */}
              <rect x="-2" y="0" width="4" height="20" fill="#dc2626" />
              {/* Center copper screw assembly */}
              <circle cx="0" cy="0" r="10" fill="#b45309" stroke="#78350f" strokeWidth="2" />
              <circle cx="0" cy="0" r="4" fill="#f59e0b" />
            </g>
            {/* Center glass reflection */}
            <circle cx="100" cy="100" r="100" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
          </svg>
          {/* Glass reflection cover */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none rounded-full" />
        </div>
      </div>
    </div>
  );
}
