import React from 'react';

/**
 * FuelTank Component
 * Renders a vertical transparent glass cylinder with dynamic color-shifting fuel,
 * animated liquid surface waves, and graduated calibration markings.
 */
export default function FuelTank({ fuelPercentage = 0, power }) {
  // Determine color theme based on level
  let liquidColorClass = "from-emerald-500 to-emerald-700 stroke-emerald-400";
  let glowColor = "rgba(16, 185, 129, 0.4)";
  
  if (fuelPercentage <= 30) {
    liquidColorClass = "from-rose-500 to-rose-700 stroke-rose-400";
    glowColor = "rgba(239, 68, 68, 0.4)";
  } else if (fuelPercentage <= 60) {
    liquidColorClass = "from-amber-500 to-amber-600 stroke-amber-450";
    glowColor = "rgba(245, 158, 11, 0.4)";
  }

  // Calculate height percentage (0 to 100)
  const fillHeight = Math.max(0, Math.min(100, fuelPercentage));

  return (
    <div className="relative p-6 bg-gradient-to-b from-[#25262d] to-[#17181c] border-t-2 border-l border-r border-[#3d3f4b] border-b-4 border-[#0b0c0f] rounded-xl shadow-2xl flex flex-col items-center h-full justify-between">
      <div className="w-full text-center">
        <span className="text-[10px] font-mono font-bold tracking-wider text-amber-500 uppercase">
          Indicator 02
        </span>
        <h3 className="text-sm font-sans font-bold text-neutral-200 mb-4">
          Cylinder Fuel Tank
        </h3>
      </div>

      {/* Wave animation styling */}
      <style>{`
        @keyframes waveMove {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .liquid-wave {
          animation: waveMove 3s infinite linear;
        }
      `}</style>

      {/* Physical glass tank assembly */}
      <div className="relative w-[110px] h-[220px] bg-gradient-to-r from-[#1b1c22] via-[#0b0b0d] to-[#1b1c22] border-2 border-neutral-800 rounded-xl p-2 shadow-inner flex justify-center">
        
        {/* Metal bracket straps (top/bottom) */}
        <div className="absolute -left-2 top-4 w-[126px] h-3 bg-gradient-to-b from-neutral-700 to-neutral-900 border border-neutral-950 rounded shadow" />
        <div className="absolute -left-2 bottom-4 w-[126px] h-3 bg-gradient-to-b from-neutral-700 to-neutral-900 border border-neutral-950 rounded shadow" />
        
        {/* Bolts on brackets */}
        <div className="absolute top-[20px] -left-1 w-1.5 h-1.5 rounded-full bg-neutral-600 border border-neutral-900 shadow-inner" />
        <div className="absolute top-[20px] -right-1 w-1.5 h-1.5 rounded-full bg-neutral-600 border border-neutral-900 shadow-inner" />
        <div className="absolute bottom-[20px] -left-1 w-1.5 h-1.5 rounded-full bg-neutral-600 border border-neutral-900 shadow-inner" />
        <div className="absolute bottom-[20px] -right-1 w-1.5 h-1.5 rounded-full bg-neutral-600 border border-neutral-900 shadow-inner" />

        {/* Graduations/Ticks Scale on Glass Wall (Left and Right) */}
        <div className="absolute left-3 inset-y-6 flex flex-col justify-between text-[7px] font-mono text-neutral-500 pointer-events-none select-none z-20">
          <span>- 100%</span>
          <span>- 80%</span>
          <span>- 60%</span>
          <span>- 40%</span>
          <span>- 20%</span>
          <span>- 0%</span>
        </div>

        {/* Glass Tube Container */}
        <div className="w-[60px] h-full rounded-lg border border-neutral-800/40 relative overflow-hidden bg-black/80 shadow-[inset_0_0_20px_rgba(0,0,0,0.95)]">
          {/* Inner vertical grid line details */}
          <div className="absolute inset-y-0 left-1/2 w-[1px] bg-neutral-900 border-dashed" />
          
          {/* Liquid Container */}
          <div
            className="absolute bottom-0 inset-x-0 transition-all duration-700 ease-out"
            style={{ height: `${fillHeight}%` }}
          >
            {/* The liquid itself */}
            <div className={`w-full h-full bg-gradient-to-t ${liquidColorClass} relative`}>
              
              {/* Wave surface SVG */}
              <div className="absolute -top-[7px] left-0 w-[200%] h-3 pointer-events-none">
                <svg viewBox="0 0 120 12" className="w-full h-full fill-current liquid-wave" style={{ color: fillHeight > 0 ? 'inherit' : 'transparent' }}>
                  {/* Two sine cycles for seamless looping */}
                  <path d="M0,6 Q15,10 30,6 T60,6 Q75,10 90,6 T120,6 L120,12 L0,12 Z" />
                </svg>
              </div>

              {/* Bubbles / Internal particles */}
              <div className="absolute inset-0 overflow-hidden opacity-30">
                <div className="absolute bottom-4 left-2 w-1.5 h-1.5 rounded-full bg-white/20 animate-bounce" style={{ animationDuration: '2.5s' }} />
                <div className="absolute bottom-12 right-3 w-1 h-1 rounded-full bg-white/20 animate-bounce" style={{ animationDuration: '3s' }} />
                <div className="absolute bottom-20 left-4 w-2 h-2 rounded-full bg-white/20 animate-bounce" style={{ animationDuration: '1.8s' }} />
              </div>
            </div>

            {/* Side glow overlay */}
            <div 
              className="absolute inset-0 pointer-events-none blur-sm opacity-50"
              style={{
                background: `linear-gradient(to right, ${glowColor} 0%, transparent 20%, transparent 80%, ${glowColor} 100%)`
              }}
            />
          </div>

          {/* Glass glare highlight line */}
          <div className="absolute top-0 bottom-0 left-1.5 w-1 bg-gradient-to-r from-white/10 to-transparent pointer-events-none z-10" />
          <div className="absolute top-0 bottom-0 right-1.5 w-1.5 bg-gradient-to-l from-white/5 via-white/2 to-transparent pointer-events-none z-10" />
        </div>
      </div>

      {/* Numeric Indicator panel below */}
      <div className="text-center font-mono mt-3 select-none">
        <span className="text-[9px] text-neutral-500 block">FUEL QUANTITY</span>
        <span className={`text-sm font-bold tracking-tight transition-all duration-300 ${
          power 
            ? fuelPercentage <= 30 ? 'text-rose-400' : 'text-emerald-400'
            : 'text-neutral-500'
        }`}>
          {fuelPercentage.toFixed(0)}% CAPACITY
        </span>
      </div>
    </div>
  );
}
