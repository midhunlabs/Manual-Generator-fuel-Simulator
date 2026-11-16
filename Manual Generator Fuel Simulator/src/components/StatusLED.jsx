import React from 'react';

/**
 * StatusLED Component
 * Renders a row of physical panel-mount indicator LEDs (Red, Yellow, Green)
 * showing current fuel status warnings.
 */
export default function StatusLED({ fuelPercentage = 0, power }) {
  // Compute individual active status
  const isRed = power && fuelPercentage < 30;
  const isYellow = power && fuelPercentage >= 30 && fuelPercentage <= 60;
  const isGreen = power && fuelPercentage > 60;

  const indicators = [
    {
      label: 'Low Fuel',
      active: isRed,
      colorClass: 'bg-rose-500 border-rose-400 shadow-[0_0_12px_#ef4444,0_0_24px_#ef4444]',
      offClass: 'bg-rose-950/40 border-rose-950 text-rose-950/30'
    },
    {
      label: 'Fuel Warning',
      active: isYellow,
      colorClass: 'bg-amber-400 border-amber-300 shadow-[0_0_12px_#facc15,0_0_24px_#facc15]',
      offClass: 'bg-amber-950/40 border-amber-950 text-amber-950/30'
    },
    {
      label: 'Fuel Normal',
      active: isGreen,
      colorClass: 'bg-emerald-500 border-emerald-450 shadow-[0_0_12px_#10b981,0_0_24px_#10b981]',
      offClass: 'bg-emerald-950/40 border-emerald-950 text-emerald-950/30'
    }
  ];

  return (
    <div className="relative p-4 bg-gradient-to-b from-[#25262d] to-[#17181c] border-t-2 border-l border-r border-[#3d3f4b] border-b-4 border-[#0b0c0f] rounded-xl shadow-2xl flex flex-col justify-between h-full min-h-[110px]">
      <div className="w-full text-center">
        <span className="text-[9px] font-mono font-bold tracking-wider text-neutral-400 uppercase">
          Status Monitors
        </span>
      </div>

      <div className="flex justify-around items-center w-full gap-4 py-2 px-3 bg-[#0d0e12] border border-neutral-800 rounded-lg shadow-inner mt-2">
        {indicators.map((ind, idx) => (
          <div key={idx} className="flex flex-col items-center gap-1.5 select-none">
            {/* Physical Bezel */}
            <div className="relative w-8 h-8 rounded-full bg-gradient-to-b from-neutral-600 via-neutral-700 to-neutral-800 p-0.5 border border-neutral-900 shadow-md flex items-center justify-center">
              {/* Inner ring inset */}
              <div className="absolute inset-0.5 rounded-full bg-neutral-950" />
              
              {/* LED Bulb */}
              <div className={`w-5 h-5 rounded-full transition-all duration-300 border ${
                ind.active ? ind.colorClass : ind.offClass
              }`} />
              
              {/* Curved glare reflection cap */}
              <div className="absolute top-1 left-2 w-2 h-1 rounded-full bg-white/20 pointer-events-none" />
            </div>
            
            {/* Label printed beneath */}
            <span className={`text-[8px] font-mono font-bold tracking-tight uppercase ${
              ind.active ? 'text-neutral-200' : 'text-neutral-500'
            }`}>
              {ind.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
