import Papa from 'papaparse';
import type { CgmReading, CgmSummary } from '@/lib/types';

/**
 * Parse FreeStyle Libre CSV export
 * The Libre CSV typically has columns like:
 * Device, Serial Number, Device Timestamp, Record Type, Historic Glucose mg/dL, Scan Glucose mg/dL, ...
 */
export function parseCgmCsv(
  csvContent: string,
  userId: string
): { readings: Omit<CgmReading, 'id' | 'created_at'>[]; summary: Omit<CgmSummary, 'id' | 'created_at'> } {
  // Try to detect header row (Libre CSVs sometimes have metadata rows before the actual header)
  const lines = csvContent.split('\n');
  let headerIndex = 0;
  for (let i = 0; i < Math.min(lines.length, 10); i++) {
    if (
      lines[i].toLowerCase().includes('timestamp') ||
      lines[i].toLowerCase().includes('glucose') ||
      lines[i].toLowerCase().includes('record type')
    ) {
      headerIndex = i;
      break;
    }
  }

  const dataContent = lines.slice(headerIndex).join('\n');

  const parsed = Papa.parse<Record<string, string>>(dataContent, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim().toLowerCase(),
  });

  const readings: Omit<CgmReading, 'id' | 'created_at'>[] = [];
  const headers = parsed.meta.fields || [];

  // Find glucose and timestamp columns
  const timestampCol = headers.find(
    (h) => h.includes('timestamp') || h.includes('date') || h.includes('time')
  );
  const glucoseCol = headers.find(
    (h) =>
      h.includes('historic glucose') ||
      h.includes('glucose mg/dl') ||
      h.includes('glucose') ||
      h.includes('value')
  );
  const scanCol = headers.find((h) => h.includes('scan glucose'));
  const typeCol = headers.find((h) => h.includes('record type') || h.includes('type'));

  if (!timestampCol || !glucoseCol) {
    throw new Error(
      'Could not find timestamp and glucose columns in CSV. Expected columns containing "timestamp" and "glucose".'
    );
  }

  for (const row of parsed.data) {
    const timestamp = row[timestampCol];
    let glucose = parseFloat(row[glucoseCol]);
    const scanGlucose = scanCol ? parseFloat(row[scanCol]) : NaN;
    const recordType = typeCol ? row[typeCol] : '';

    // Use scan glucose if historic is missing
    if (isNaN(glucose) && !isNaN(scanGlucose)) {
      glucose = scanGlucose;
    }

    if (!timestamp || isNaN(glucose)) continue;

    // Parse timestamp (Libre uses various formats)
    const parsedDate = new Date(timestamp);
    if (isNaN(parsedDate.getTime())) continue;

    const scanType =
      recordType?.includes('scan') || !isNaN(scanGlucose) ? 'manual' : 'auto';

    readings.push({
      user_id: userId,
      timestamp: parsedDate.toISOString(),
      glucose_mg_dl: glucose,
      scan_type: scanType as 'auto' | 'manual',
    });
  }

  // Sort by timestamp
  readings.sort((a, b) => a.timestamp.localeCompare(b.timestamp));

  // Compute summary stats
  const summary = computeCgmSummary(readings, userId);

  return { readings, summary };
}

/**
 * Compute CGM summary statistics from readings
 */
function computeCgmSummary(
  readings: Omit<CgmReading, 'id' | 'created_at'>[],
  userId: string
): Omit<CgmSummary, 'id' | 'created_at'> {
  if (readings.length === 0) {
    return {
      user_id: userId,
      period_start: new Date().toISOString().split('T')[0],
      period_end: new Date().toISOString().split('T')[0],
      avg_glucose: 0,
      gmi: 0,
      cv: 0,
      time_in_range_pct: 0,
      time_below_70_pct: 0,
      time_below_54_pct: 0,
      time_above_180_pct: 0,
      low_event_count: 0,
    };
  }

  const values = readings.map((r) => r.glucose_mg_dl);
  const total = values.length;

  // Basic stats
  const avg = values.reduce((s, v) => s + v, 0) / total;
  const stdDev = Math.sqrt(
    values.reduce((s, v) => s + Math.pow(v - avg, 2), 0) / total
  );
  const cv = (stdDev / avg) * 100;

  // GMI (Glucose Management Indicator) = 3.31 + 0.02392 × mean glucose
  const gmi = 3.31 + 0.02392 * avg;

  // Time in range percentages
  const below54 = values.filter((v) => v < 54).length;
  const below70 = values.filter((v) => v < 70).length;
  const above180 = values.filter((v) => v > 180).length;
  const inRange = values.filter((v) => v >= 70 && v <= 180).length;

  // Count low events (consecutive readings below 70 count as one event)
  let lowEventCount = 0;
  let inLowEvent = false;
  for (const v of values) {
    if (v < 70 && !inLowEvent) {
      lowEventCount++;
      inLowEvent = true;
    } else if (v >= 70) {
      inLowEvent = false;
    }
  }

  const dates = readings.map((r) => r.timestamp.split('T')[0]);

  return {
    user_id: userId,
    period_start: dates[0],
    period_end: dates[dates.length - 1],
    avg_glucose: Math.round(avg * 10) / 10,
    gmi: Math.round(gmi * 10) / 10,
    cv: Math.round(cv * 10) / 10,
    time_in_range_pct: Math.round((inRange / total) * 1000) / 10,
    time_below_70_pct: Math.round((below70 / total) * 1000) / 10,
    time_below_54_pct: Math.round((below54 / total) * 1000) / 10,
    time_above_180_pct: Math.round((above180 / total) * 1000) / 10,
    low_event_count: lowEventCount,
  };
}
