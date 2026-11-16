import React, { useRef, useEffect } from 'react';

/**
 * VoltageControls Component
 * Provides manual voltage adjustment inputs (buttons, slider),
 * a reset button, and an auto-demo sweep switch.
 */
export default function VoltageControls({
  voltage,
  setVoltage,
  power,
  autoDemo,
  setAutoDemo
}) {
  const incrementInterval = useRef(null);
  const decrementInterval = useRef(null);

  // Constants
  const MIN_VOLTAGE = 0.110;
  const MAX_VOLTAGE = 1.920;
  const STEP = 0.005; // Manual step size

  // Clean up intervals on unmount
  useEffect(() => {
    return () => {
      stopIncrement();
      stopDecrement();
    };
  }, []);

  // Handle manual steps
  const handleIncrement = () => {
    setVoltage((prev) => {
      const next = prev + STEP;
      return next >= MAX_VOLTAGE ? MAX_VOLTAGE : parseFloat(next.toFixed(3));
    });
  };

  const handleDecrement = () => {
    setVoltage((prev) => {
      const next = prev - STEP;
      return next <= MIN_VOLTAGE ? MIN_VOLTAGE : parseFloat(next.toFixed(3));
    });
  };

  // Holding Increase
  const startIncrement = () => {
    if (!power || autoDemo) return;
    handleIncrement();
    incrementInterval.current = setInterval(handleIncrement, 50);
  };

  const stopIncrement = () => {
    if (incrementInterval.current) {
      clearInterval(incrementInterval.current);
      incrementInterval.current = null;
    }
  };

  // Holding Decrease
  const startDecrement = () => {
    if (!power || autoDemo) return;
    handleDecrement();
    decrementInterval.current = setInterval(handleDecrement, 50);
  };

  const stopDecrement = () => {
    if (decrementInterval.current) {
      clearInterval(decrementInterval.current);
      decrementInterval.current = null;
    }
  };

  // Reset Voltage
  const handleReset = () => {
    if (!power) return;
    setAutoDemo(false);
    setVoltage(0.110);
  };

  // Slider change handler
  const handleSliderChange = (e) => {
    if (!power) return;
    setAutoDemo(false);
    setVoltage(parseFloat(parseFloat(e.target.value).toFixed(3)));
  };

  return (
    <div className="relative p-6 bg-gradient-to-b from-[#25262d] to-[#17181c] border-t-2 border-l border-r border-[#3d3f4b] border-b-4 border-[#0b0c0f] rounded-xl shadow-2xl flex flex-col justify-between h-full">
      <div className="w-full">
        <span className="text-[10px] font-mono font-bold tracking-wider text-amber-500 uppercase">
          Subpanel 02: Signals
        </span>
        <h3 className="text-sm font-sans font-bold text-neutral-200 mb-4">
          Generator Output Regulator
        </h3>
      </div>

      {/* Main Slider Section */}
      <div className="flex flex-col gap-2 p-4 bg-[#0d0e12] border border-neutral-800 rounded-lg shadow-inner mb-4">
        <div className="flex justify-between items-center text-[10px] font-mono text-neutral-400">
          <span>MIN: {MIN_VOLTAGE.toFixed(3)}V</span>
          <span className="text-amber-500 font-bold">REGULATED VOLTAGE</span>
          <span>MAX: {MAX_VOLTAGE.toFixed(3)}V</span>
        </div>
        
        <input
          type="range"
          min={MIN_VOLTAGE}
          max={MAX_VOLTAGE}
          step="0.001"
          value={power ? voltage : MIN_VOLTAGE}
          onChange={handleSliderChange}
          disabled={!power}
          className={`w-full h-2 rounded-lg appearance-none cursor-pointer bg-neutral-800 accent-amber-500 ${
            !power ? 'opacity-30 cursor-not-allowed' : ''
          }`}
          style={{
            background: `linear-gradient(to right, #f59e0b 0%, #f59e0b ${((voltage - MIN_VOLTAGE) / (MAX_VOLTAGE - MIN_VOLTAGE)) * 100}%, #262626 ${((voltage - MIN_VOLTAGE) / (MAX_VOLTAGE - MIN_VOLTAGE)) * 100}%, #262626 100%)`
          }}
        />
        
        <div className="text-center text-xs font-mono text-neutral-300">
          Target Value: <span className="text-amber-500 font-bold">{power ? voltage.toFixed(3) : '0.000'} VDC</span>
        </div>
      </div>

      {/* Pushbutton Controls Group */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Decrease button */}
        <button
          onMouseDown={startDecrement}
          onMouseUp={stopDecrement}
          onMouseLeave={stopDecrement}
          onTouchStart={startDecrement}
          onTouchEnd={stopDecrement}
          disabled={!power || autoDemo}
          className={`relative h-12 rounded border-b-4 select-none font-mono font-bold text-xs uppercase transition-all duration-100 flex items-center justify-center gap-1 active:translate-y-[2px] active:border-b-0 ${
            power && !autoDemo
              ? 'bg-neutral-800 border-neutral-900 border-b-neutral-950 text-rose-500 hover:bg-neutral-750 active:bg-neutral-900'
              : 'bg-neutral-900 border-neutral-950 text-neutral-600 cursor-not-allowed opacity-50'
          }`}
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5" />
          </svg>
          Dec Volt
        </button>

        {/* Increase button */}
        <button
          onMouseDown={startIncrement}
          onMouseUp={stopIncrement}
          onMouseLeave={stopIncrement}
          onTouchStart={startIncrement}
          onTouchEnd={stopIncrement}
          disabled={!power || autoDemo}
          className={`relative h-12 rounded border-b-4 select-none font-mono font-bold text-xs uppercase transition-all duration-100 flex items-center justify-center gap-1 active:translate-y-[2px] active:border-b-0 ${
            power && !autoDemo
              ? 'bg-neutral-800 border-neutral-900 border-b-neutral-950 text-emerald-500 hover:bg-neutral-750 active:bg-neutral-900'
              : 'bg-neutral-900 border-neutral-950 text-neutral-600 cursor-not-allowed opacity-50'
          }`}
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Inc Volt
        </button>
      </div>

      {/* Mode Switches Bottom Area */}
      <div className="flex gap-3">
        {/* Reset Button */}
        <button
          onClick={handleReset}
          disabled={!power}
          className={`flex-1 h-10 rounded border font-mono font-bold text-xs uppercase transition-all duration-150 active:scale-95 flex items-center justify-center gap-1 ${
            power
              ? 'bg-gradient-to-b from-rose-900/40 to-rose-950/60 border-rose-800 text-rose-400 hover:bg-rose-900/50'
              : 'bg-neutral-900 border-neutral-950 text-neutral-600 cursor-not-allowed opacity-50'
          }`}
        >
          Reset (Min)
        </button>

        {/* Auto Demo Switch Button */}
        <button
          onClick={() => power && setAutoDemo(!autoDemo)}
          disabled={!power}
          className={`flex-1 h-10 rounded border font-mono font-bold text-xs uppercase transition-all duration-200 active:scale-95 flex items-center justify-center gap-1.5 ${
            power
              ? autoDemo
                ? 'bg-amber-500/20 border-amber-500 text-amber-400 font-black shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200 hover:border-neutral-700'
              : 'bg-neutral-900 border-neutral-950 text-neutral-600 cursor-not-allowed opacity-50'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${
            power && autoDemo ? 'bg-amber-400 animate-pulse' : 'bg-neutral-700'
          }`} />
          Auto Demo
        </button>
      </div>
    </div>
  );
}
