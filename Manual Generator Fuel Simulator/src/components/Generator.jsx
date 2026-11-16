import React from 'react';

/**
 * Generator Component
 * Renders a high-fidelity SVG illustration of an industrial diesel generator
 * with interactive switch, animated fan, and vibrating engine housing.
 * 
 * @param {boolean} power - Current power status of the generator
 * @param {function} setPower - Callback to toggle the power status
 * @param {number} voltage - Current voltage output
 */
export default function Generator({ power, setPower, voltage }) {
  return (
    <div className="relative p-6 bg-gradient-to-b from-[#25262d] to-[#17181c] border-t-2 border-l border-r border-[#3d3f4b] border-b-4 border-[#0b0c0f] rounded-xl shadow-2xl flex flex-col items-center">
      {/* Vibration style injection */}
      <style>{`
        @keyframes engine-vibe {
          0% { transform: translate(0, 0); }
          25% { transform: translate(-0.8px, 0.8px); }
          50% { transform: translate(0.8px, -0.8px); }
          75% { transform: translate(-0.8px, -0.8px); }
          100% { transform: translate(0, 0); }
        }
        @keyframes fan-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .vibe-active {
          animation: engine-vibe 0.08s infinite linear;
        }
        .spin-active {
          animation: fan-spin 0.4s infinite linear;
        }
      `}</style>

      {/* Title block on generator */}
      <div className="w-full text-center mb-4">
        <span className="text-xs font-mono font-bold tracking-wider text-amber-500 uppercase">
          Unit 01: Prime Mover
        </span>
        <h3 className="text-sm font-sans font-bold text-neutral-200">
          Analog Engine-Generator Set
        </h3>
      </div>

      {/* Generator Chassis Container */}
      <div className="w-full h-[220px] flex items-center justify-center relative bg-[#0d0e12] border border-[#1b1c22] rounded-lg p-2 shadow-inner">
        <svg
          viewBox="0 0 320 220"
          className="w-full h-full"
        >
          {/* Defs for gradients */}
          <defs>
            <linearGradient id="metal-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#8a8d9a" />
              <stop offset="50%" stopColor="#4a4c55" />
              <stop offset="100%" stopColor="#2c2d34" />
            </linearGradient>
            <linearGradient id="yellow-cage" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#e5a93b" />
              <stop offset="50%" stopColor="#ffc75f" />
              <stop offset="100%" stopColor="#c28416" />
            </linearGradient>
            <radialGradient id="fan-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(255, 199, 95, 0.15)" />
              <stop offset="100%" stopColor="rgba(0, 0, 0, 0)" />
            </radialGradient>
          </defs>

          {/* External Cage/Frame (Yellow/Black Industrial Cage) */}
          <rect x="15" y="15" width="290" height="190" rx="6" fill="none" stroke="url(#yellow-cage)" strokeWidth="6" />
          <line x1="15" y1="70" x2="305" y2="70" stroke="url(#yellow-cage)" strokeWidth="4" opacity="0.7" />
          <line x1="15" y1="140" x2="305" y2="140" stroke="url(#yellow-cage)" strokeWidth="4" opacity="0.7" />

          {/* Vibration Mount Pads (Black Rubber Blocks at Bottom) */}
          <rect x="40" y="200" width="30" height="10" fill="#0b0b0d" rx="2" />
          <rect x="250" y="200" width="30" height="10" fill="#0b0b0d" rx="2" />

          {/* Core Engine Group (Vibrates if Power is ON) */}
          <g className={power ? 'vibe-active' : ''}>
            {/* Main Engine Block Blocky Silhouette */}
            <rect x="50" y="80" width="130" height="110" rx="4" fill="#32343b" stroke="#1c1d22" strokeWidth="2" />
            
            {/* Cylinder Head Cover */}
            <path d="M 60 80 L 170 80 L 160 55 L 70 55 Z" fill="#25262c" stroke="#1c1d22" strokeWidth="2" />
            {/* Sparkplug cap & cable */}
            <path d="M 115 55 L 115 45 C 115 35, 200 35, 220 85" fill="none" stroke={power ? '#e11d48' : '#737373'} strokeWidth="3" className="transition-all duration-300" />
            <rect x="110" y="45" width="10" height="10" rx="1" fill="#e4e4e7" />

            {/* Cooling fins details */}
            <line x1="60" y1="95" x2="180" y2="95" stroke="#1c1d22" strokeWidth="2" />
            <line x1="60" y1="110" x2="180" y2="110" stroke="#1c1d22" strokeWidth="2" />
            <line x1="60" y1="125" x2="180" y2="125" stroke="#1c1d22" strokeWidth="2" />
            <line x1="60" y1="140" x2="180" y2="140" stroke="#1c1d22" strokeWidth="2" />

            {/* Alternator/Gen Casing (Right portion) */}
            <rect x="180" y="95" width="80" height="85" rx="3" fill="url(#metal-grad)" stroke="#1a1b1f" strokeWidth="2" />
            {/* Exhaust Muffler */}
            <rect x="195" y="45" width="45" height="35" rx="2" fill="#1e1f24" stroke="#121316" strokeWidth="2" />
            <path d="M 218 45 L 218 25 M 218 25 L 225 20" fill="none" stroke="#1e1f24" strokeWidth="4" strokeLinecap="round" />

            {/* Top Mounted Fuel Tank */}
            <rect x="65" y="30" width="120" height="25" rx="4" fill="url(#metal-grad)" stroke="#1c1d22" strokeWidth="2" />
            <rect x="120" y="24" width="16" height="6" fill="#18181b" rx="1" /> {/* cap */}
            {/* Fuel Sight Glass strip */}
            <rect x="85" y="40" width="80" height="4" fill="#121316" rx="2" />
            <line x1="85" y1="42" x2="145" y2="42" stroke={power ? '#22c55e' : '#e5e7eb'} strokeWidth="2" opacity="0.8" className="transition-all duration-300" />

            {/* Generator Cooling Fan Section (Rotates inside alternator) */}
            <circle cx="220" cy="138" r="28" fill="#121316" stroke="#2c2d34" strokeWidth="2" />
            {power && <circle cx="220" cy="138" r="28" fill="url(#fan-glow)" />}
            
            {/* Fan Blades Group */}
            <g transform="translate(220, 138)">
              <g className={power ? 'spin-active' : ''} style={{ transformOrigin: '0px 0px' }}>
                <circle cx="0" cy="0" r="6" fill="#888" />
                <path d="M -4 -25 L 4 -25 L 2 0 L -2 0 Z" fill="#71717a" />
                <path d="M -4 25 L 4 25 L 2 0 L -2 0 Z" fill="#71717a" />
                <path d="M -25 -4 L -25 4 L 0 2 L 0 -2 Z" fill="#71717a" />
                <path d="M 25 -4 L 25 4 L 0 2 L 0 -2 Z" fill="#71717a" />
                <path d="M -18 -18 L -12 -12 L 0 0 Z" fill="#52525b" stroke="#52525b" strokeWidth="2" />
                <path d="M 18 18 L 12 12 L 0 0 Z" fill="#52525b" stroke="#52525b" strokeWidth="2" />
                <path d="M -18 18 L -12 12 L 0 0 Z" fill="#52525b" stroke="#52525b" strokeWidth="2" />
                <path d="M 18 -18 L 12 -12 L 0 0 Z" fill="#52525b" stroke="#52525b" strokeWidth="2" />
              </g>
            </g>
            {/* Grid overlay for fan safety */}
            <circle cx="220" cy="138" r="28" fill="none" stroke="#25262c" strokeWidth="1.5" opacity="0.6" />
            <line x1="220" y1="110" x2="220" y2="166" stroke="#25262c" strokeWidth="1" opacity="0.6" />
            <line x1="192" y1="138" x2="248" y2="138" stroke="#25262c" strokeWidth="1" opacity="0.6" />
          </g>

          {/* V-Out Electrical Terminals Section (Static on Frame) */}
          <rect x="250" y="80" width="45" height="50" rx="3" fill="#1b1c21" stroke="#374151" />
          <text x="272" y="93" fill="#9ca3af" fontSize="7" fontFamily="monospace" textAnchor="middle">V-OUT</text>
          
          {/* Red (+) Terminal */}
          <circle cx="262" cy="112" r="6" fill="#b91c1c" stroke="#7f1d1d" strokeWidth="1.5" />
          <circle cx="262" cy="112" r="2" fill="#ef4444" />
          {power && <circle cx="262" cy="112" r="8" fill="none" stroke="#ef4444" strokeWidth="1.5" opacity="0.6" className="animate-ping" />}

          {/* Black (-) Terminal */}
          <circle cx="282" cy="112" r="6" fill="#111827" stroke="#374151" strokeWidth="1.5" />
          <circle cx="282" cy="112" r="2" fill="#9ca3af" />
        </svg>

        {/* LED Indicator Light on Panel */}
        <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-black/40 px-2 py-1 rounded border border-neutral-800">
          <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
            power 
              ? 'bg-emerald-500 shadow-[0_0_8px_#10b981,0_0_15px_#10b981]' 
              : 'bg-neutral-800'
          }`} />
          <span className="text-[9px] font-mono text-neutral-400">GEN RUN</span>
        </div>

        {/* Real-time Analog Voltage Output Floating Tag */}
        {power && (
          <div className="absolute bottom-4 right-4 bg-[#10b981]/10 border border-[#10b981]/30 text-emerald-400 font-mono text-[10px] px-2 py-0.5 rounded shadow-lg animate-pulse">
            OUT: {voltage.toFixed(3)} VDC
          </div>
        )}
      </div>

      {/* Switch section */}
      <div className="mt-4 flex flex-col items-center">
        <label className="text-[10px] font-mono text-neutral-400 font-bold mb-1 uppercase tracking-wider">
          Main Power Control
        </label>
        
        {/* Physical Heavy-Duty Industrial Toggle Switch */}
        <button
          onClick={() => setPower(!power)}
          className={`relative w-12 h-16 rounded bg-gradient-to-b from-neutral-800 to-neutral-900 border border-neutral-700 p-1 flex flex-col items-center justify-between cursor-pointer focus:outline-none transition-all duration-200 active:scale-95 shadow-[0_4px_8px_rgba(0,0,0,0.6)] ${
            power ? 'border-emerald-600/50 shadow-[0_0_12px_rgba(16,185,129,0.15)]' : ''
          }`}
          aria-label="Toggle Generator Power"
        >
          {/* Rocker frame */}
          <div className="text-[7px] font-mono text-neutral-500 font-bold">ON</div>
          
          {/* Rocker button body */}
          <div className={`w-8 h-8 rounded-sm transition-all duration-300 flex items-center justify-center border-t border-b ${
            power 
              ? 'bg-gradient-to-b from-emerald-500 to-emerald-700 border-emerald-400 transform translate-y-[-2px] shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),0_2px_4px_rgba(0,0,0,0.5)]' 
              : 'bg-gradient-to-b from-neutral-600 to-neutral-700 border-neutral-500 transform translate-y-[2px] shadow-[inset_0_2px_4px_rgba(255,255,255,0.2),0_2px_2px_rgba(0,0,0,0.5)]'
          }`}>
            {/* Rocker small dot indicator */}
            <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
              power ? 'bg-emerald-200 shadow-inner' : 'bg-neutral-800 shadow-inner'
            }`} />
          </div>

          <div className="text-[7px] font-mono text-neutral-500 font-bold">OFF</div>
        </button>
      </div>
    </div>
  );
}
