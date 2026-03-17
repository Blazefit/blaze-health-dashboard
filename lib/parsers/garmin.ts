import Papa from 'papaparse';
import type { GarminDaily } from '@/lib/types';

// Common Garmin CSV column name variations
const COLUMN_MAP: Record<string, string> = {
  // Date
  'date': 'date',
  'calendar date': 'date',
  'day': 'date',
  // Sleep
  'total sleep time (min)': 'sleep_total_minutes',
  'sleep duration (min)': 'sleep_total_minutes',
  'deep sleep (min)': 'sleep_deep_minutes',
  'deep sleep time (min)': 'sleep_deep_minutes',
  'light sleep (min)': 'sleep_light_minutes',
  'light sleep time (min)': 'sleep_light_minutes',
  'rem sleep (min)': 'sleep_rem_minutes',
  'rem sleep time (min)': 'sleep_rem_minutes',
  'awake time (min)': 'sleep_awake_minutes',
  'awake (min)': 'sleep_awake_minutes',
  'sleep score': 'sleep_score',
  'overall sleep score': 'sleep_score',
  // HRV
  'hrv (overnight avg)': 'hrv_overnight_avg',
  'hrv overnight avg': 'hrv_overnight_avg',
  'avg hrv': 'hrv_overnight_avg',
  'hrv status': 'hrv_status',
  // Heart Rate
  'resting heart rate': 'resting_hr',
  'resting hr': 'resting_hr',
  'min hr': 'resting_hr',
  'max heart rate': 'max_hr',
  'max hr': 'max_hr',
  'avg heart rate': 'avg_hr',
  'avg hr': 'avg_hr',
  // Activity
  'steps': 'steps',
  'total steps': 'steps',
  'active calories': 'active_calories',
  'active kilocalories': 'active_calories',
  'total calories': 'total_calories',
  'total kilocalories': 'total_calories',
  'floors climbed': 'floors_climbed',
  'floors': 'floors_climbed',
  'intensity minutes': 'intensity_minutes',
  'moderate intensity minutes': 'intensity_minutes',
  'distance (m)': 'distance_meters',
  'distance': 'distance_meters',
  // Body Battery
  'body battery high': 'body_battery_high',
  'highest body battery': 'body_battery_high',
  'body battery low': 'body_battery_low',
  'lowest body battery': 'body_battery_low',
  'body battery': 'body_battery_current',
  // Training
  'training load': 'training_load',
  'acute training load': 'training_load',
  'training load focus': 'training_load_focus',
  'training status': 'training_status',
  // Stress
  'avg stress': 'avg_stress',
  'average stress': 'avg_stress',
  'max stress': 'max_stress',
  // SpO2
  'avg spo2': 'avg_spo2',
  'average spo2 (%)': 'avg_spo2',
  'min spo2': 'min_spo2',
  'lowest spo2 (%)': 'min_spo2',
};

/**
 * Parse Garmin CSV export into daily data records
 */
export function parseGarminCsv(
  csvContent: string,
  userId: string
): Omit<GarminDaily, 'id' | 'created_at'>[] {
  const parsed = Papa.parse<Record<string, string>>(csvContent, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim().toLowerCase(),
  });

  const results: Omit<GarminDaily, 'id' | 'created_at'>[] = [];

  for (const row of parsed.data) {
    const mapped: Record<string, string | number | null> = {};

    // Map CSV columns to our schema
    for (const [csvCol, value] of Object.entries(row)) {
      const field = COLUMN_MAP[csvCol.toLowerCase()];
      if (field) {
        mapped[field] = value;
      }
    }

    if (!mapped.date) continue;

    const dateStr = String(mapped.date);
    // Parse various date formats
    const date = parseDate(dateStr);
    if (!date) continue;

    results.push({
      user_id: userId,
      date,
      sleep_total_minutes: toInt(mapped.sleep_total_minutes),
      sleep_deep_minutes: toInt(mapped.sleep_deep_minutes),
      sleep_light_minutes: toInt(mapped.sleep_light_minutes),
      sleep_rem_minutes: toInt(mapped.sleep_rem_minutes),
      sleep_awake_minutes: toInt(mapped.sleep_awake_minutes),
      sleep_score: toInt(mapped.sleep_score),
      sleep_wake_events: toInt(mapped.sleep_wake_events) || 0,
      hrv_overnight_avg: toNum(mapped.hrv_overnight_avg),
      hrv_status: String(mapped.hrv_status || ''),
      resting_hr: toInt(mapped.resting_hr),
      max_hr: toInt(mapped.max_hr),
      avg_hr: toInt(mapped.avg_hr),
      steps: toInt(mapped.steps),
      active_calories: toInt(mapped.active_calories),
      total_calories: toInt(mapped.total_calories),
      floors_climbed: toInt(mapped.floors_climbed),
      intensity_minutes: toInt(mapped.intensity_minutes),
      distance_meters: toNum(mapped.distance_meters),
      body_battery_high: toInt(mapped.body_battery_high),
      body_battery_low: toInt(mapped.body_battery_low),
      body_battery_current: toInt(mapped.body_battery_current),
      training_load: toNum(mapped.training_load),
      training_load_focus: String(mapped.training_load_focus || ''),
      training_status: String(mapped.training_status || ''),
      avg_stress: toInt(mapped.avg_stress),
      max_stress: toInt(mapped.max_stress),
      avg_spo2: toNum(mapped.avg_spo2),
      min_spo2: toNum(mapped.min_spo2),
    });
  }

  return results.sort((a, b) => a.date.localeCompare(b.date));
}

function parseDate(dateStr: string): string | null {
  // Try ISO format first
  const d = new Date(dateStr);
  if (!isNaN(d.getTime())) return d.toISOString().split('T')[0];

  // Try MM/DD/YYYY
  const parts = dateStr.split('/');
  if (parts.length === 3) {
    const [m, day, y] = parts;
    const d2 = new Date(`${y}-${m.padStart(2, '0')}-${day.padStart(2, '0')}`);
    if (!isNaN(d2.getTime())) return d2.toISOString().split('T')[0];
  }

  return null;
}

function toInt(val: string | number | null | undefined): number {
  if (val === null || val === undefined || val === '') return 0;
  const n = parseInt(String(val), 10);
  return isNaN(n) ? 0 : n;
}

function toNum(val: string | number | null | undefined): number {
  if (val === null || val === undefined || val === '') return 0;
  const n = parseFloat(String(val));
  return isNaN(n) ? 0 : n;
}
