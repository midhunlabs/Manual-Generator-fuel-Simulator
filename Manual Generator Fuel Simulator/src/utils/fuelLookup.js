// Default calibration points for voltage-to-fuel percentage lookup
// Maps specific voltage (VDC) to fuel percentage (%)
export const defaultCalibrationPoints = [
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
];
