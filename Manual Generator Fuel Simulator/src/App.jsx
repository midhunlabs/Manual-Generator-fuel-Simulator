import React, { useState, useEffect } from 'react';
import Generator from './components/Generator';
import VoltageControls from './components/VoltageControls';
import VoltageMeter from './components/VoltageMeter';
import ESP32 from './components/ESP32';
import Wire from './components/Wire';
import ThreeDigitDisplay from './components/ThreeDigitDisplay';
import FuelGauge from './components/FuelGauge';
import FuelTank from './components/FuelTank';
import StatusLED from './components/StatusLED';
import SerialMonitor from './components/SerialMonitor';
import CalibrationModal from './components/CalibrationModal';
import { defaultCalibrationPoints } from './utils/fuelLookup';
import { voltageToFuel } from './utils/voltageToFuel';
import './App.css';

/**
 * App - Main Controller Dashboard
 * Lays out the physical rackmount panel structure and manages telemetry loops.
 */
export default function App() {
  const [voltage, setVoltage] = useState(0.110);
  const [fuelPercentage, setFuelPercentage] = useState(0);
  const [adcValue, setAdcValue] = useState(0);
  const [power, setPower] = useState(false);
  const [calibrationPoints, setCalibrationPoints] = useState(defaultCalibrationPoints);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [autoDemo, setAutoDemo] = useState(false);

  // Sync telemetry calculations on voltage/power changes
  useEffect(() => {
    if (power) {
      const calculatedAdc = Math.round((voltage / 3.3) * 4095);
      const calculatedFuel = voltageToFuel(voltage, calibrationPoints);
      
      setAdcValue(calculatedAdc);
      setFuelPercentage(calculatedFuel);
    } else {
      // Hardware shutdown states
      setAdcValue(0);
      setFuelPercentage(0);
      setAutoDemo(false);
    }
  }, [voltage, power, calibrationPoints]);

  // Handle the automatic voltage demo sweep
  useEffect(() => {
    if (!autoDemo || !power) return;

    let direction = 1; // 1 = increasing, -1 = decreasing
    const sweepSpeed = 0.012; // VDC per tick

    const interval = setInterval(() => {
      setVoltage((prev) => {
        let next = prev + direction * sweepSpeed;
        if (next >= 1.920) {
          next = 1.920;
          direction = -1;
        } else if (next <= 0.110) {
          next = 0.110;
          direction = 1;
        }
        return parseFloat(next.toFixed(3));
      });
    }, 100);

    return () => clearInterval(interval);
  }, [autoDemo, power]);

  // Handle calibration profile update
  const handleUpdatePoints = (newPoints) => {
    setCalibrationPoints(newPoints);
    
    // Adjust voltage dynamically if it lies outside the new bounds
    const sorted = [...newPoints].sort((a, b) => a.voltage - b.voltage);
    const minV = sorted[0].voltage;
    const maxV = sorted[sorted.length - 1].voltage;
    
    if (voltage < minV) setVoltage(minV);
    else if (voltage > maxV) setVoltage(maxV);
  };

  return (
    <div className="w-full min-h-screen bg-[#111216] px-4 py-8 md:px-8 select-none flex flex-col justify-between">
      
      {/* Outer Panel Shell Grid Frame */}
      <div className="w-full max-w-7xl mx-auto bg-gradient-to-b from-[#21232a] to-[#121317] border-[6px] border-neutral-700 rounded-3xl p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.9),inset_0_2px_4px_rgba(255,255,255,0.15)] flex flex-col gap-6 relative">
        
        {/* Decorative corner brackets (metal plate aesthetic) */}
        <div className="absolute top-4 left-4 w-4 h-4 rounded-full bg-neutral-900 border-2 border-neutral-700 shadow-inner flex items-center justify-center font-bold text-[8px] text-neutral-500">I</div>
        <div className="absolute top-4 right-4 w-4 h-4 rounded-full bg-neutral-900 border-2 border-neutral-700 shadow-inner flex items-center justify-center font-bold text-[8px] text-neutral-500">II</div>
        <div className="absolute bottom-4 left-4 w-4 h-4 rounded-full bg-neutral-900 border-2 border-neutral-700 shadow-inner flex items-center justify-center font-bold text-[8px] text-neutral-500">III</div>
        <div className="absolute bottom-4 right-4 w-4 h-4 rounded-full bg-neutral-900 border-2 border-neutral-700 shadow-inner flex items-center justify-center font-bold text-[8px] text-neutral-500">IV</div>

        {/* Header Console Row */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-[#0a0a0d] border border-neutral-850 rounded-xl p-4 md:px-6 relative overflow-hidden shadow-inner gap-4">
          
          {/* Warning Safety Stripes Left */}
          <div className="absolute left-0 inset-y-0 w-3 hazard-stripes opacity-40 hidden md:block" />
          
          <div className="flex flex-col md:pl-6 text-center md:text-left">
            <span className="text-[10px] font-mono font-bold tracking-widest text-amber-500 uppercase">
              Embedded Hardware Laboratory Rig
            </span>
            <h1 className="text-xl md:text-2xl font-orbitron font-extrabold text-neutral-100 uppercase tracking-wide m-0">
              Generator Fuel Monitoring Station
            </h1>
          </div>

          <div className="flex flex-wrap justify-center gap-3 items-center">
            {/* System Status Indicators */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#121319] border border-neutral-800 rounded font-mono text-[9px] text-neutral-400">
              <span className={`w-2 h-2 rounded-full ${power ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-rose-600 animate-pulse'}`} />
              CORE BUS: {power ? 'ACTIVE' : 'OFFLINE'}
            </div>
            
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#121319] border border-neutral-800 rounded font-mono text-[9px] text-neutral-400">
              <span className="w-2 h-2 rounded-full bg-sky-500 shadow-[0_0_8px_#0ea5e9]" />
              AUX POWER: 5.0V
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 active:scale-95 text-neutral-950 font-mono font-bold text-[10px] uppercase rounded shadow-[0_0_10px_rgba(245,158,11,0.2)] border border-amber-500 cursor-pointer transition-all duration-150"
            >
              Calibrate Map
            </button>
          </div>
        </div>

        {/* Warning Stripes Line Divider */}
        <div className="h-1.5 hazard-stripes rounded-full opacity-60" />

        {/* SECTION 1: Hardware Signal Flow Chain */}
        <div className="flex flex-col lg:flex-row items-stretch justify-between gap-6 p-6 bg-[#0b0c0f] border border-neutral-850 rounded-2xl shadow-inner relative">
          
          {/* Subtitle tag overlay */}
          <div className="absolute top-2 left-6 text-[8px] font-mono text-neutral-600 uppercase tracking-widest pointer-events-none">
            Stage 01: Physical & Logical Wiring Loop
          </div>

          {/* Generator box wrapper */}
          <div className="flex-1 min-w-[280px] mt-2">
            <Generator power={power} setPower={setPower} voltage={voltage} />
          </div>

          {/* Connect Wire 1 (Gen to ESP32) */}
          <div className="hidden lg:flex flex-col justify-center items-center w-[8%] min-w-[40px]">
            <span className="text-[7px] font-mono text-amber-500 mb-1">A-IN (GPIO34)</span>
            <Wire active={power} voltage={voltage} type="analog" direction="horizontal" />
            <span className="text-[7px] font-mono text-neutral-600 mt-1">VOLT SIGNAL</span>
          </div>

          {/* ESP32 micro-controller board wrapper */}
          <div className="flex-[1.2] min-w-[290px] mt-2">
            <ESP32 power={power} voltage={voltage} adcValue={adcValue} fuelPercentage={fuelPercentage} />
          </div>

          {/* Connect Wire 2 (ESP32 to 7-Segment) */}
          <div className="hidden lg:flex flex-col justify-center items-center w-[8%] min-w-[40px]">
            <span className="text-[7px] font-mono text-sky-500 mb-1">D-OUT (I2C)</span>
            <Wire active={power} voltage={voltage} type="digital" direction="horizontal" />
            <span className="text-[7px] font-mono text-neutral-600 mt-1">DATA stream</span>
          </div>

          {/* 7 Segment display wrapper */}
          <div className="flex-[0.8] flex items-center justify-center mt-2">
            <ThreeDigitDisplay fuelPercentage={fuelPercentage} />
          </div>

        </div>

        {/* SECTION 2: Secondary Visualizers Dashboard Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <FuelTank fuelPercentage={fuelPercentage} power={power} />
          <FuelGauge fuelPercentage={fuelPercentage} power={power} />
          <VoltageMeter voltage={voltage} power={power} />
          <StatusLED fuelPercentage={fuelPercentage} power={power} />
        </div>

        {/* SECTION 3: Logs & Regulator Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          
          {/* Regulator Subpanel (1/3 width) */}
          <div className="lg:col-span-1">
            <VoltageControls
              voltage={voltage}
              setVoltage={setVoltage}
              power={power}
              autoDemo={autoDemo}
              setAutoDemo={setAutoDemo}
            />
          </div>

          {/* Serial Monitor console (2/3 width) */}
          <div className="lg:col-span-2">
            <SerialMonitor
              voltage={voltage}
              adcValue={adcValue}
              fuelPercentage={fuelPercentage}
              power={power}
            />
          </div>

        </div>

        {/* Footer Info */}
        <div className="flex flex-col md:flex-row justify-between items-center text-[10px] font-mono text-neutral-500 pt-4 border-t border-neutral-850 gap-2">
          <span>Simulation Target: ESP-WROOM-32 DevKitC V4 | ADC Pin: GPIO34 (ADC1_CH6)</span>
          <span>© Embedded Hardware Lab Simulator - College Expo Exhibition Prototype</span>
        </div>

      </div>

      {/* Diagnostics / Modal Table */}
      <CalibrationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        calibrationPoints={calibrationPoints}
        onUpdatePoints={handleUpdatePoints}
      />
    </div>
  );
}
