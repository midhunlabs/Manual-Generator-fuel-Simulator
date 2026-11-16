import React, { useState, useEffect } from 'react';

/**
 * ESP32 Component
 * Renders a vector-graphic ESP32 microcontroller with a virtual SSD1306 OLED screen
 * displaying real-time ADC conversion parameters and formulas.
 */
export default function ESP32({ voltage, adcValue, fuelPercentage, power }) {
  const [pulse, setPulse] = useState(false);

  // Blink user LED every 200ms when telemetry updates
  useEffect(() => {
    if (!power) return;
    const interval = setInterval(() => {
      setPulse((prev) => !prev);
    }, 200);
    return () => clearInterval(interval);
  }, [power]);

  // Status computation
  let statusText = "STANDBY";
  let statusColor = "text-neutral-500 border-neutral-700 bg-neutral-900/40";
  if (power) {
    if (fuelPercentage < 30) {
      statusText = "LOW FUEL WARN";
      statusColor = "text-rose-500 border-rose-800/40 bg-rose-950/20";
    } else {
      statusText = "TELEMETRY OK";
      statusColor = "text-emerald-500 border-emerald-800/40 bg-emerald-950/20";
    }
  }

  return (
    <div className="relative p-6 bg-gradient-to-b from-[#25262d] to-[#17181c] border-t-2 border-l border-r border-[#3d3f4b] border-b-4 border-[#0b0c0f] rounded-xl shadow-2xl flex flex-col justify-between h-full">
      <div className="w-full">
        <span className="text-[10px] font-mono font-bold tracking-wider text-amber-500 uppercase">
          Subpanel 03: Processing
        </span>
        <h3 className="text-sm font-sans font-bold text-neutral-200 mb-4">
          ESP32 ADC Telemetry Engine
        </h3>
      </div>

      {/* Embedded Board Layout Panel */}
      <div className="flex flex-col items-center bg-[#0d0e12] border border-neutral-800 rounded-lg p-4 shadow-inner relative overflow-hidden">
        
        {/* ESP32 Matte-Black PCB Graphic */}
        <div className="relative w-[280px] h-[160px] bg-gradient-to-b from-[#181920] to-[#0f1013] border-2 border-neutral-800 rounded-lg p-3 shadow-2xl flex justify-between select-none">
          {/* Silkscreen lines */}
          <div className="absolute top-1 inset-x-3 h-[1px] bg-neutral-800" />
          <div className="absolute bottom-1 inset-x-3 h-[1px] bg-neutral-800" />

          {/* Left Pins Group */}
          <div className="flex flex-col justify-between h-full py-2">
            {[...Array(15)].map((_, i) => (
              <div key={`pin-l-${i}`} className="flex items-center gap-1">
                {/* Pin Header Metal Socket */}
                <div className="w-2.5 h-1.5 bg-gradient-to-r from-amber-500 to-amber-600 rounded-sm border border-neutral-950 shadow" />
                {/* Labels */}
                <span className={`text-[6px] font-mono font-semibold ${
                  i === 11 ? 'text-amber-500 font-extrabold' : 'text-neutral-500'
                }`}>
                  {i === 11 ? 'GPIO34' : i === 0 ? '3V3' : i === 14 ? 'GND' : `G${i*2}`}
                </span>
              </div>
            ))}
          </div>

          {/* Core WROOM-32 Chip & SSD1306 Screen Area */}
          <div className="flex-1 flex flex-col justify-between items-center px-2">
            
            {/* WROOM-32 Shield (Silver metal block with copper antenna) */}
            <div className="w-[85px] h-[55px] bg-gradient-to-br from-neutral-300 to-neutral-500 border border-neutral-600 rounded-md relative flex flex-col justify-between p-1 shadow-md">
              {/* Antenna Pattern */}
              <div className="absolute -top-1.5 left-2 right-2 h-2.5 bg-neutral-900 border border-neutral-800 rounded-sm flex flex-col justify-between py-0.5">
                <div className="h-0.5 w-full bg-[#1b1c20]" />
                <div className="h-0.5 w-full bg-[#1b1c20]" />
              </div>

              {/* Silkscreen text on chip */}
              <div className="text-[5px] font-sans font-bold text-neutral-800 text-center mt-1 uppercase tracking-tight">
                ESP32-WROOM-32
              </div>

              <div className="flex justify-between items-end">
                <span className="text-[4px] font-mono text-neutral-700">FCC ID: 2AC7Z-ESP32</span>
                <span className="text-[4px] font-mono text-neutral-700">CE</span>
              </div>
            </div>

            {/* Onboard LEDs */}
            <div className="flex gap-4 my-1.5">
              {/* Red Power LED */}
              <div className="flex flex-col items-center">
                <span className="text-[5px] font-mono text-neutral-500">PWR</span>
                <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  power 
                    ? 'bg-rose-500 shadow-[0_0_4px_#ef4444]' 
                    : 'bg-neutral-800'
                }`} />
              </div>
              
              {/* Blue User LED (GPIO2) */}
              <div className="flex flex-col items-center">
                <span className="text-[5px] font-mono text-neutral-500">IO2</span>
                <div className={`w-1.5 h-1.5 rounded-full transition-all duration-100 ${
                  power && pulse 
                    ? 'bg-sky-500 shadow-[0_0_4px_#0ea5e9]' 
                    : 'bg-neutral-800'
                }`} />
              </div>
            </div>

            {/* Virtual SSD1306 0.96" OLED screen */}
            <div className="w-[100px] h-[55px] bg-[#03060f] border border-neutral-850 rounded-sm p-1.5 font-mono text-[6px] relative shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] flex flex-col justify-between">
              {power ? (
                <>
                  <div className="flex justify-between items-center text-[#22d3ee] border-b border-[#22d3ee]/20 pb-0.5 font-bold">
                    <span>* ESP32 ADC *</span>
                    <span className="animate-pulse">RUN</span>
                  </div>
                  <div className="flex flex-col gap-0.5 text-[#67e8f9] mt-0.5">
                    <div className="flex justify-between">
                      <span>V_IN:</span>
                      <span className="font-semibold">{voltage.toFixed(3)} V</span>
                    </div>
                    <div className="flex justify-between">
                      <span>ADC:</span>
                      <span className="font-semibold">{adcValue}</span>
                    </div>
                    <div className="flex justify-between text-[#22d3ee] font-bold">
                      <span>FUEL:</span>
                      <span>{fuelPercentage}%</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-neutral-700 italic">
                  OLED OFF
                </div>
              )}
              {/* Screen shine */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
            </div>

          </div>

          {/* Right Pins Group */}
          <div className="flex flex-col justify-between h-full py-2">
            {[...Array(15)].map((_, i) => (
              <div key={`pin-r-${i}`} className="flex items-center gap-1 flex-row-reverse">
                {/* Pin Header Metal Socket */}
                <div className="w-2.5 h-1.5 bg-gradient-to-r from-amber-500 to-amber-600 rounded-sm border border-neutral-950 shadow" />
                {/* Labels */}
                <span className="text-[6px] font-mono text-neutral-500 font-semibold">
                  {i === 0 ? '5V' : i === 14 ? 'GND' : `G${i*2 + 1}`}
                </span>
              </div>
            ))}
          </div>

          {/* GPIO34 Connection Halo (Target node for wiring) */}
          {power && (
            <div className="absolute left-[33px] bottom-[37px] w-4 h-4 rounded-full border border-amber-500/80 animate-ping pointer-events-none" />
          )}
        </div>

        {/* Technical Data Readouts Below Board */}
        <div className="w-full mt-4 flex justify-between gap-2 text-[10px] font-mono">
          <div className="flex-1 bg-black/60 border border-neutral-800 p-2 rounded flex flex-col justify-center">
            <span className="text-neutral-500">ADC Value (12-bit)</span>
            <span className="text-neutral-200 font-bold text-sm">
              {power ? adcValue : '----'}
            </span>
          </div>

          <div className="flex-1 bg-black/60 border border-neutral-800 p-2 rounded flex flex-col justify-center">
            <span className="text-neutral-500">Node Status</span>
            <span className={`font-bold text-xs uppercase ${statusText !== 'STANDBY' ? 'animate-pulse' : ''} ${
              power 
                ? fuelPercentage < 30 ? 'text-rose-400' : 'text-emerald-400'
                : 'text-neutral-500'
            }`}>
              {statusText}
            </span>
          </div>
        </div>

        {/* Formula display block */}
        <div className="w-full mt-2.5 bg-neutral-900/60 border border-neutral-800/40 p-2 rounded text-[8px] font-mono text-center text-neutral-400">
          <span>ADC FORMULA: </span>
          <code className="text-amber-500 font-bold">ADC = (Voltage / 3.3) &times; 4095</code>
        </div>
      </div>
    </div>
  );
}
