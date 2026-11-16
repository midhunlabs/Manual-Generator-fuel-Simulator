/**
 * Converts a voltage reading to a fuel percentage (0-100%)
 * using linear interpolation against a lookup table.
 * 
 * @param {number} voltage - Current voltage reading
 * @param {Array<{voltage: number, percentage: number}>} lookupTable - Calibration points
 * @returns {number} - Interpolated fuel percentage (0-100)
 */
export function voltageToFuel(voltage, lookupTable) {
  if (!lookupTable || lookupTable.length === 0) return 0;

  // Ensure points are sorted by voltage
  const sortedTable = [...lookupTable].sort((a, b) => a.voltage - b.voltage);

  const minPoint = sortedTable[0];
  const maxPoint = sortedTable[sortedTable.length - 1];

  // Boundary checks
  if (voltage <= minPoint.voltage) return minPoint.percentage;
  if (voltage >= maxPoint.voltage) return maxPoint.percentage;

  // Find the interval containing the voltage
  for (let i = 0; i < sortedTable.length - 1; i++) {
    const p1 = sortedTable[i];
    const p2 = sortedTable[i + 1];

    if (voltage >= p1.voltage && voltage <= p2.voltage) {
      const voltageDiff = p2.voltage - p1.voltage;
      if (voltageDiff === 0) return p1.percentage;

      // Linear interpolation
      const interpolationFactor = (voltage - p1.voltage) / voltageDiff;
      const fuelPercentage = p1.percentage + interpolationFactor * (p2.percentage - p1.percentage);
      
      return Math.round(fuelPercentage);
    }
  }

  return 0;
}
