import React, { useState, useEffect } from 'react';

/**
 * CalibrationModal Component
 * Provides a diagnostic programmer overlay to inspect and modify calibration mapping values.
 */
export default function CalibrationModal({
  isOpen,
  onClose,
  calibrationPoints,
  onUpdatePoints
}) {
  const [localPoints, setLocalPoints] = useState([]);
  const [newVoltage, setNewVoltage] = useState('');
  const [newPercent, setNewPercent] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Sync state with props when modal opens
  useEffect(() => {
    if (isOpen) {
      // Deep copy and sort
      const sorted = [...calibrationPoints].sort((a, b) => a.voltage - b.voltage);
      setLocalPoints(sorted);
      setErrorMsg('');
    }
  }, [isOpen, calibrationPoints]);

  if (!isOpen) return null;

  // Change individual input values
  const handleCellChange = (index, field, value) => {
    const nextPoints = [...localPoints];
    const val = parseFloat(value);
    
    if (field === 'voltage') {
      nextPoints[index].voltage = isNaN(val) ? '' : Math.max(0, Math.min(3.3, val));
    } else {
      nextPoints[index].percentage = isNaN(val) ? '' : Math.max(0, Math.min(100, Math.round(val)));
    }
    setLocalPoints(nextPoints);
  };

  // Delete a point
  const handleDeletePoint = (index) => {
    if (localPoints.length <= 2) {
      setErrorMsg('A minimum of 2 calibration points is required for interpolation.');
      return;
    }
    const nextPoints = localPoints.filter((_, i) => i !== index);
    setLocalPoints(nextPoints.sort((a, b) => a.voltage - b.voltage));
    setErrorMsg('');
  };

  // Add a point
  const handleAddPoint = (e) => {
    e.preventDefault();
    const voltVal = parseFloat(newVoltage);
    const percentVal = parseInt(newPercent, 10);

    if (isNaN(voltVal) || voltVal < 0.110 || voltVal > 1.920) {
      setErrorMsg('Voltage must be between 0.110V and 1.920V.');
      return;
    }
    if (isNaN(percentVal) || percentVal < 0 || percentVal > 100) {
      setErrorMsg('Percentage must be between 0% and 100%.');
      return;
    }

    // Check if voltage already exists
    if (localPoints.some(pt => Math.abs(pt.voltage - voltVal) < 0.001)) {
      setErrorMsg('A calibration point for this voltage already exists.');
      return;
    }

    const nextPoints = [...localPoints, { voltage: voltVal, percentage: percentVal }]
      .sort((a, b) => a.voltage - b.voltage);

    setLocalPoints(nextPoints);
    setNewVoltage('');
    setNewPercent('');
    setErrorMsg('');
  };

  // Save changes
  const handleSave = () => {
    // Validate: make sure no empty inputs exist
    const hasEmpty = localPoints.some(pt => pt.voltage === '' || pt.percentage === '');
    if (hasEmpty) {
      setErrorMsg('Please fill in all calibration rows.');
      return;
    }
    
    // Sort and save
    const sorted = [...localPoints].sort((a, b) => a.voltage - b.voltage);
    
    // Ensure boundaries are preserved (specifically 0% and 100% bounds)
    if (sorted[0].percentage !== 0 || sorted[sorted.length - 1].percentage !== 100) {
      setErrorMsg('The lowest point must map to 0% and the highest point must map to 100%.');
      return;
    }

    onUpdatePoints(sorted);
    onClose();
  };

  // Set preset profiles
  const loadPreset = (presetType) => {
    if (presetType === 'linear') {
      setLocalPoints([
        { voltage: 0.110, percentage: 0 },
        { voltage: 1.920, percentage: 100 }
      ]);
    } else if (presetType === 'default') {
      setLocalPoints([
        { voltage: 0.110, percentage: 0 },
        { voltage: 0.350, percentage: 10 },
        { voltage: 0.600, percentage: 25 },
        { voltage: 0.850, percentage: 40 },
        { voltage: 1.050, percentage: 50 },
        { voltage: 1.220, percentage: 60 },
        { voltage: 1.400, percentage: 70 },
        { voltage: 1.570, percentage: 80 },
        { voltage: 1.750, percentage: 90 },
        { voltage: 1.920, percentage: 100 }
      ]);
    }
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none">
      
      {/* Programmer console frame */}
      <div className="relative w-full max-w-lg bg-gradient-to-b from-[#2a2b34] to-[#18191f] border-2 border-neutral-700 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Bezel screws */}
        <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-neutral-600 border border-neutral-900" />
        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-neutral-600 border border-neutral-900" />
        <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-neutral-600 border border-neutral-900" />
        <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-neutral-600 border border-neutral-900" />

        {/* Modal Header */}
        <div className="px-6 py-4 bg-neutral-900 border-b border-neutral-800 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <h2 className="text-sm font-mono font-bold text-neutral-100 uppercase tracking-wider">
              Diagnostic Programmer V1.0
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-300 font-bold text-sm cursor-pointer"
          >
            &#x2715;
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-4 text-xs font-mono text-neutral-300">
          
          <div className="p-3 bg-neutral-950/60 border border-neutral-850 rounded text-neutral-400">
            Configure voltage values corresponding to fuel levels. The ESP32 interpolates linearly between adjacent voltage bounds.
          </div>

          {/* Preset Buttons */}
          <div className="flex gap-2 items-center">
            <span className="text-[10px] text-neutral-500 uppercase font-bold">Profile Presets:</span>
            <button
              onClick={() => loadPreset('default')}
              className="px-2 py-1 bg-neutral-800 hover:bg-neutral-700 text-amber-500 border border-neutral-700 rounded text-[10px] cursor-pointer"
            >
              Default Curve
            </button>
            <button
              onClick={() => loadPreset('linear')}
              className="px-2 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700 rounded text-[10px] cursor-pointer"
            >
              2-Point Linear
            </button>
          </div>

          {/* Calibration Table */}
          <div className="border border-neutral-800 rounded bg-[#0b0c10] shadow-inner max-h-[220px] overflow-y-auto">
            <table className="w-full text-left border-collapse text-[10.5px]">
              <thead className="bg-neutral-900 sticky top-0 text-neutral-500">
                <tr>
                  <th className="p-2 border-b border-neutral-850">Voltage (V)</th>
                  <th className="p-2 border-b border-neutral-850">Fuel Level (%)</th>
                  <th className="p-2 border-b border-neutral-850 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-900">
                {localPoints.map((pt, idx) => (
                  <tr key={idx} className="hover:bg-neutral-950">
                    <td className="p-2">
                      <input
                        type="number"
                        step="0.001"
                        min="0.110"
                        max="1.920"
                        value={pt.voltage}
                        onChange={(e) => handleCellChange(idx, 'voltage', e.target.value)}
                        className="bg-neutral-900 border border-neutral-800 text-neutral-100 w-24 px-2 py-0.5 rounded text-center focus:outline-none focus:border-amber-500"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={pt.percentage}
                        onChange={(e) => handleCellChange(idx, 'percentage', e.target.value)}
                        className="bg-neutral-900 border border-neutral-800 text-neutral-100 w-24 px-2 py-0.5 rounded text-center focus:outline-none focus:border-amber-500"
                      />
                    </td>
                    <td className="p-2 text-center">
                      <button
                        onClick={() => handleDeletePoint(idx)}
                        className="text-rose-500 hover:text-rose-400 font-bold px-2 py-0.5 rounded cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add Point Form */}
          <form onSubmit={handleAddPoint} className="p-3 bg-neutral-900 rounded border border-neutral-850 flex gap-2 items-end justify-between">
            <div className="flex-1 flex flex-col gap-1">
              <label className="text-[9px] text-neutral-500">Voltage (V)</label>
              <input
                type="number"
                step="0.001"
                placeholder="e.g. 1.350"
                value={newVoltage}
                onChange={(e) => setNewVoltage(e.target.value)}
                className="bg-[#0b0c10] border border-neutral-800 px-2 py-1 rounded text-neutral-100 focus:outline-none"
              />
            </div>
            
            <div className="flex-1 flex flex-col gap-1">
              <label className="text-[9px] text-neutral-500">Fuel Level (%)</label>
              <input
                type="number"
                placeholder="e.g. 70"
                value={newPercent}
                onChange={(e) => setNewPercent(e.target.value)}
                className="bg-[#0b0c10] border border-neutral-800 px-2 py-1 rounded text-neutral-100 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="bg-amber-600 hover:bg-amber-500 active:scale-95 text-neutral-950 font-bold px-3 py-1.5 rounded cursor-pointer text-[10px]"
            >
              Add Node
            </button>
          </form>

          {/* Error Message */}
          {errorMsg && (
            <div className="text-[10px] text-rose-500 bg-rose-950/20 border border-rose-900/30 p-2.5 rounded">
              ERROR: {errorMsg}
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-neutral-900 border-t border-neutral-850 flex justify-between items-center">
          <span className="text-[9px] text-neutral-500">
            Total Nodes: {localPoints.length}
          </span>
          <div className="flex gap-2.5">
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-neutral-850 border border-neutral-750 text-neutral-400 hover:text-neutral-200 rounded cursor-pointer transition-all duration-150"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-neutral-950 font-bold rounded cursor-pointer transition-all duration-150 shadow-[0_0_8px_rgba(16,185,129,0.2)]"
            >
              Flash ROM
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
