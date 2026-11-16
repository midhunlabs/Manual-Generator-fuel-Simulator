import React from 'react';

/**
 * VoltageMeter Component
 * Displays the current generator voltage in a backlit industrial LCD readout.
 */
export default function VoltageMeter({ voltage = 0.110, power }) {
  return (
    <div className="relative p-4 bg-gradient-to-b from-[#25262d] to-[#17181c] border-t-2 border-l border-r border-[#3d3f4b] border-b-4 border-[#0b0c0f] rounded-xl shadow-2xl flex flex-col justify-between h-full min-h-[110px]">
      <div className="w-full text-center">
        <span className="text-[9px] font-mono font-bold tracking-wider text-neutral-400 uppercase">
          Telemetry Readout
        </span>
      </div>

      {/* Recessed Green-Backlit LCD Window */}
      <div className="relative mt-2 p-2.5 bg-[#05110c] border-2 border-[#121317] rounded-lg shadow-[inset_0_4px_8px_rgba(0,0,0,0.9)] flex flex-col items-center justify-center overflow-hidden min-h-[50px] select-none">
        
        {/* LCD Backlight Glow */}
        <div className={`absolute inset-0 bg-[#00ff88]/5 transition-opacity duration-500 blur-md ${
          power ? 'opacity-100' : 'opacity-0'
        }`} />

        {/* Digital numbers */}
        <div className="relative z-10 flex flex-col items-center">
          <span className={`font-mono text-lg font-black tracking-widest transition-all duration-300 ${
            power 
              ? 'text-[#00ffaa] drop-shadow-[0_0_6px_rgba(0,255,170,0.8)]' 
              : 'text-[#002211] opacity-40'
          }`}>
            {power ? voltage.toFixed(3) : '0.000'} VDC
          </span>
          
          <span className={`text-[7px] font-mono font-bold tracking-widest uppercase mt-0.5 transition-all duration-300 ${
            power ? 'text-[#00ffaa]/60' : 'text-[#002211]/30'
          }`}>
            Generator Output
          </span>
        </div>

        {/* Diagonal LCD glare overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
      </div>
    </div>
  );
}
