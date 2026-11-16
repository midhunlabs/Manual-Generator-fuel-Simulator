import React, { useState, useEffect, useRef } from 'react';

/**
 * SerialMonitor Component
 * Renders an Arduino IDE style scrollable terminal outputting hardware logging details.
 */
export default function SerialMonitor({ voltage, adcValue, fuelPercentage, power }) {
  const [logs, setLogs] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const [baudRate, setBaudRate] = useState('115200');
  const [autoscroll, setAutoscroll] = useState(false); // Default to manual scrolling (false)
  const terminalEndRef = useRef(null);

  // Generate telemetry logs every 200ms when power is active and not paused
  useEffect(() => {
    if (!power || isPaused) return;

    const interval = setInterval(() => {
      const timestamp = new Date().toLocaleTimeString().split(' ')[0];
      const entry = `[${timestamp}] Voltage : ${voltage.toFixed(3)} V | ADC : ${adcValue} | Fuel : ${fuelPercentage}%`;
      
      setLogs((prev) => {
        // Keep logs capped at 100 entries to prevent memory leak
        const nextLogs = [...prev, entry];
        if (nextLogs.length > 100) nextLogs.shift();
        return nextLogs;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [power, isPaused, voltage, adcValue, fuelPercentage]);

  // Autoscroll to bottom only if autoscroll is enabled
  useEffect(() => {
    if (autoscroll && terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, autoscroll]);

  // Clear logs
  const clearConsole = () => {
    setLogs([]);
  };

  return (
    <div className="relative p-6 bg-gradient-to-b from-[#25262d] to-[#17181c] border-t-2 border-l border-r border-[#3d3f4b] border-b-4 border-[#0b0c0f] rounded-xl shadow-2xl flex flex-col justify-between h-[280px] w-full">
      {/* Header bar styled like IDE window */}
      <div className="w-full flex justify-between items-center pb-2 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/40">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          </div>
          <span className="text-xs font-mono font-bold text-neutral-200">
            Serial Monitor - COM3
          </span>
        </div>

        {/* Arduino IDE Controls */}
        <div className="flex gap-2">
          {/* Baud rate dropdown */}
          <select 
            value={baudRate} 
            onChange={(e) => setBaudRate(e.target.value)}
            className="bg-neutral-900 border border-neutral-800 text-[10px] font-mono text-neutral-300 px-2 py-0.5 rounded cursor-pointer focus:outline-none"
          >
            <option value="9600">9600 baud</option>
            <option value="19200">19200 baud</option>
            <option value="57600">57600 baud</option>
            <option value="115200">115200 baud</option>
          </select>

          {/* Pause Button */}
          <button
            onClick={() => setIsPaused(!isPaused)}
            className={`px-2 py-0.5 border text-[10px] font-mono rounded select-none cursor-pointer transition-all duration-150 ${
              isPaused 
                ? 'bg-amber-500/20 border-amber-600 text-amber-400 font-bold' 
                : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200'
            }`}
          >
            {isPaused ? 'Resume' : 'Pause'}
          </button>

          {/* Clear Button */}
          <button
            onClick={clearConsole}
            className="px-2 py-0.5 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-400 hover:text-neutral-200 text-[10px] font-mono rounded select-none cursor-pointer"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Terminal Area */}
      <div className="flex-1 bg-[#090a0f] border border-neutral-950 rounded-lg mt-3 p-3 overflow-y-auto font-mono text-[10.5px] leading-relaxed text-neutral-400 scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-transparent shadow-inner">
        {logs.length > 0 ? (
          <div className="flex flex-col">
            {logs.map((log, index) => (
              <div key={index} className="border-b border-neutral-950 py-0.5">
                <span className="text-neutral-600 font-semibold mr-1.5">&gt;&gt;</span>
                <span className={log.includes('WARN') ? 'text-rose-400' : 'text-emerald-400'}>{log}</span>
              </div>
            ))}
            <div ref={terminalEndRef} />
          </div>
        ) : (
          <div className="h-full w-full flex flex-col items-center justify-center text-neutral-600 italic">
            <span>{power ? 'Connecting to board...' : 'Board offline. Power ON to open stream.'}</span>
            {power && <span className="text-[9px] mt-1 not-italic">({baudRate} baud active)</span>}
          </div>
        )}
      </div>

      {/* Footer statistics */}
      <div className="w-full flex justify-between items-center mt-2 text-[9px] font-mono text-neutral-500">
        <label className="flex items-center gap-1 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={autoscroll}
            onChange={(e) => setAutoscroll(e.target.checked)}
            className="rounded bg-neutral-900 border-neutral-800 text-amber-500 focus:ring-0 focus:ring-offset-0 w-2.5 h-2.5 cursor-pointer"
          />
          <span>Autoscroll</span>
        </label>
        <span>Line ending: Both NL & CR | Connection status: {power ? 'CONNECTED' : 'DISCONNECTED'}</span>
      </div>
    </div>
  );
}
