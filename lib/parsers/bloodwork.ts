import Papa from 'papaparse';
import { getRange } from '@/lib/ranges';
import type { Biomarker, BiomarkerStatus, BiomarkerCategory, BiomarkerSource } from '@/lib/types';

interface ParsedRow {
  marker_name: string;
  value: number;
  unit: string;
  ref_low?: number;
  ref_high?: number;
  date?: string;
}

// Column name mappings for different lab formats
const COLUMN_MAPS: Record<string, Record<string, string>> = {
  rythm: {
    'Test Name': 'marker_name',
    'Result': 'value',
    'Unit': 'unit',
    'Reference Low': 'ref_low',
    'Reference High': 'ref_high',
    'Collection Date': 'date',
  },
  function_health: {
    'Biomarker': 'marker_name',
    'Value': 'value',
    'Units': 'unit',
    'Low': 'ref_low',
    'High': 'ref_high',
    'Date': 'date',
  },
  generic: {
    'marker_name': 'marker_name',
    'name': 'marker_name',
    'test': 'marker_name',
    'marker': 'marker_name',
    'value': 'value',
    'result': 'value',
    'unit': 'unit',
    'units': 'unit',
    'ref_low': 'ref_low',
    'reference_low': 'ref_low',
    'low': 'ref_low',
    'ref_high': 'ref_high',
    'reference_high': 'ref_high',
    'high': 'ref_high',
    'date': 'date',
    'collection_date': 'date',
  },
};

/**
 * Auto-detect CSV format based on column headers
 */
function detectFormat(headers: string[]): string {
  const headerSet = new Set(headers.map((h) => h.trim()));

  if (headerSet.has('Test Name') && headerSet.has('Result')) return 'rythm';
  if (headerSet.has('Biomarker') && headerSet.has('Value')) return 'function_health';
  return 'generic';
}

/**
 * Map row values using detected column mapping
 */
function mapRow(
  row: Record<string, string>,
  columnMap: Record<string, string>
): ParsedRow | null {
  const mapped: Record<string, string> = {};

  for (const [csvCol, fieldName] of Object.entries(columnMap)) {
    if (row[csvCol] !== undefined) {
      mapped[fieldName] = row[csvCol];
    }
  }

  if (!mapped.marker_name || !mapped.value) return null;

  const value = parseFloat(mapped.value);
  if (isNaN(value)) return null;

  return {
    marker_name: mapped.marker_name.trim(),
    value,
    unit: mapped.unit?.trim() || '',
    ref_low: mapped.ref_low ? parseFloat(mapped.ref_low) : undefined,
    ref_high: mapped.ref_high ? parseFloat(mapped.ref_high) : undefined,
    date: mapped.date?.trim(),
  };
}

/**
 * Determine biomarker status based on value and ranges
 */
function determineStatus(
  value: number,
  refLow: number,
  refHigh: number,
  optLow?: number,
  optHigh?: number
): BiomarkerStatus {
  if (optLow !== undefined && optHigh !== undefined) {
    if (value >= optLow && value <= optHigh) return 'optimal';
  }
  if (value >= refLow && value <= refHigh) return 'normal';
  const margin = (refHigh - refLow) * 0.1;
  if (
    (value < refLow && value >= refLow - margin) ||
    (value > refHigh && value <= refHigh + margin)
  ) {
    return 'borderline';
  }
  return 'flagged';
}

/**
 * Determine biomarker category from marker name
 */
function categorizeMarker(name: string): BiomarkerCategory {
  const range = getRange(name);
  if (range) return range.category as BiomarkerCategory;
  return 'other';
}

/**
 * Parse blood work CSV and return biomarker objects
 */
export function parseBloodworkCsv(
  csvContent: string,
  userId: string,
  source: BiomarkerSource = 'upload',
  overrideDate?: string
): Omit<Biomarker, 'id' | 'created_at'>[] {
  const parsed = Papa.parse<Record<string, string>>(csvContent, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim(),
  });

  if (parsed.errors.length > 0 && parsed.data.length === 0) {
    throw new Error(`CSV parsing failed: ${parsed.errors[0].message}`);
  }

  const headers = parsed.meta.fields || [];
  const format = detectFormat(headers);
  const columnMap = COLUMN_MAPS[format];

  const results: Omit<Biomarker, 'id' | 'created_at'>[] = [];

  for (const row of parsed.data) {
    const mapped = mapRow(row, columnMap);
    if (!mapped) continue;

    const range = getRange(mapped.marker_name);
    const refLow = mapped.ref_low ?? range?.standard.low ?? 0;
    const refHigh = mapped.ref_high ?? range?.standard.high ?? 999;
    const optLow = range?.functional.low;
    const optHigh = range?.functional.high;

    const status = determineStatus(mapped.value, refLow, refHigh, optLow, optHigh);
    const date = overrideDate || mapped.date || new Date().toISOString().split('T')[0];

    results.push({
      user_id: userId,
      date,
      marker_name: mapped.marker_name,
      value: mapped.value,
      unit: mapped.unit || range?.unit || '',
      ref_low: refLow,
      ref_high: refHigh,
      optimal_low: optLow ?? refLow,
      optimal_high: optHigh ?? refHigh,
      status,
      category: categorizeMarker(mapped.marker_name),
      source,
      notes: '',
    });
  }

  return results;
}
