// Profile
export interface Profile {
  id: string;
  clerk_id: string;
  email: string;
  full_name: string;
  date_of_birth: string;
  sex: 'male' | 'female';
  blood_type: string;
  height_inches: number;
  weight_lbs: number;
  preferences: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

// Upload
export interface Upload {
  id: string;
  user_id: string;
  file_name: string;
  file_url: string;
  file_type: 'dna' | 'bloodwork_csv' | 'bloodwork_pdf' | 'cgm' | 'garmin' | 'document' | 'promethease';
  file_size_bytes: number;
  parsed_status: 'pending' | 'processing' | 'complete' | 'failed';
  parsed_at: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

// SNP types
export type SnpCategory =
  | 'methylation'
  | 'cardiovascular'
  | 'detox'
  | 'metabolism'
  | 'inflammation'
  | 'nutrient'
  | 'sleep'
  | 'fitness'
  | 'immune'
  | 'other';

export type RiskLevel = 'clear' | 'heterozygous' | 'homozygous_risk';

export interface GenomicSnp {
  id: string;
  user_id: string;
  rsid: string;
  chromosome: string;
  position: number;
  genotype: string;
  gene_name: string;
  variant_name: string;
  category: SnpCategory;
  risk_level: RiskLevel;
  risk_allele: string;
  clinical_significance: string;
  actionable_note: string;
  source: string;
  created_at: string;
}

export interface SnpReference {
  rsid: string;
  gene: string;
  variant_name?: string;
  chromosome: string;
  position: number;
  category: SnpCategory;
  risk_allele: string;
  normal_genotype: string;
  description: string;
  clinical_significance: string;
  actionable_recommendation: string;
}

// Biomarker types
export type BiomarkerStatus = 'optimal' | 'normal' | 'borderline' | 'flagged';

export type BiomarkerCategory =
  | 'metabolic'
  | 'hormonal'
  | 'thyroid'
  | 'lipid'
  | 'lipid_advanced'
  | 'immune'
  | 'nutritional'
  | 'inflammatory'
  | 'renal'
  | 'hepatic'
  | 'hematologic'
  | 'other';

export type BiomarkerSource =
  | 'rythm'
  | 'function_health'
  | 'quest'
  | 'labcorp'
  | 'sanocardio'
  | 'manual'
  | 'upload';

export interface Biomarker {
  id: string;
  user_id: string;
  date: string;
  marker_name: string;
  value: number;
  unit: string;
  ref_low: number;
  ref_high: number;
  optimal_low: number;
  optimal_high: number;
  status: BiomarkerStatus;
  category: BiomarkerCategory;
  source: BiomarkerSource;
  upload_id?: string;
  notes?: string;
  created_at: string;
}

export interface BiomarkerRange {
  name: string;
  unit: string;
  category: string;
  standard: { low: number; high: number };
  functional: { low: number; high: number };
  notes?: string;
}

// CGM
export interface CgmReading {
  id: string;
  user_id: string;
  timestamp: string;
  glucose_mg_dl: number;
  scan_type: 'auto' | 'manual';
  upload_id?: string;
  created_at: string;
}

export interface CgmSummary {
  id: string;
  user_id: string;
  period_start: string;
  period_end: string;
  avg_glucose: number;
  gmi: number;
  cv: number;
  time_in_range_pct: number;
  time_below_70_pct: number;
  time_below_54_pct: number;
  time_above_180_pct: number;
  low_event_count: number;
  upload_id?: string;
  created_at: string;
}

// Garmin
export interface GarminDaily {
  id: string;
  user_id: string;
  date: string;
  sleep_total_minutes: number;
  sleep_deep_minutes: number;
  sleep_light_minutes: number;
  sleep_rem_minutes: number;
  sleep_awake_minutes: number;
  sleep_score: number;
  sleep_wake_events: number;
  hrv_overnight_avg: number;
  hrv_status: string;
  resting_hr: number;
  max_hr: number;
  avg_hr: number;
  steps: number;
  active_calories: number;
  total_calories: number;
  floors_climbed: number;
  intensity_minutes: number;
  distance_meters: number;
  body_battery_high: number;
  body_battery_low: number;
  body_battery_current: number;
  training_load: number;
  training_load_focus: string;
  training_status: string;
  avg_stress: number;
  max_stress: number;
  avg_spo2: number;
  min_spo2: number;
  upload_id?: string;
  created_at: string;
}

// Training
export interface TrainingProgram {
  id: string;
  user_id: string;
  name: string;
  description: string;
  duration_weeks: number;
  current_week: number;
  status: 'active' | 'completed' | 'paused' | 'archived';
  config: TrainingConfig;
  program_data: ProgramWeek[];
  ai_generated: boolean;
  generation_prompt?: string;
  created_at: string;
  updated_at: string;
}

export interface TrainingConfig {
  bench_1rm: number;
  squat_1rm: number;
  deadlift_1rm?: number;
  rounding: number;
  constraints: string[];
  genomic_notes?: string;
  phase_structure?: string;
}

export interface ProgramWeek {
  week: number;
  phase: string;
  days: ProgramDay[];
}

export interface ProgramDay {
  day_of_week: string;
  label: string;
  exercises: ProgramExercise[];
}

export interface ProgramExercise {
  name: string;
  sets: ProgramSet[];
  notes?: string;
}

export interface ProgramSet {
  set_number: number;
  reps: number;
  percentage?: number;
  weight?: number;
  rpe?: number;
  type: 'warmup' | 'working' | 'primer' | 'backoff';
}

export interface WorkoutLog {
  id: string;
  user_id: string;
  program_id?: string;
  date: string;
  week_number?: number;
  day_of_week: string;
  day_label: string;
  exercises: LoggedExercise[];
  duration_minutes?: number;
  session_rpe?: number;
  notes?: string;
  completed: boolean;
  created_at: string;
}

export interface LoggedExercise {
  name: string;
  sets: LoggedSet[];
}

export interface LoggedSet {
  set_number: number;
  target_reps: number;
  target_weight: number;
  actual_reps?: number;
  actual_weight?: number;
  rpe?: number;
  notes?: string;
}

// Supplements
export interface SupplementProtocol {
  id: string;
  user_id: string;
  name: string;
  is_active: boolean;
  start_date?: string;
  end_date?: string;
  supplements: Supplement[];
  contraindications: Contraindication[];
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Supplement {
  name: string;
  dose: string;
  unit: string;
  timing: 'morning' | 'with_meal' | 'bedtime' | 'pre_workout' | 'post_workout' | 'active';
  frequency: string;
  genomic_rationale?: string;
  notes?: string;
  is_peptide: boolean;
  cycle_on_weeks?: number;
  cycle_off_weeks?: number;
}

export interface Contraindication {
  compound: string;
  reason: string;
  confirmed_date: string;
}

export interface SupplementLog {
  id: string;
  user_id: string;
  protocol_id?: string;
  date: string;
  supplement_name: string;
  taken: boolean;
  notes?: string;
  created_at: string;
}

// Health Notes
export interface HealthNote {
  id: string;
  user_id: string;
  date: string;
  content: string;
  tags: string[];
  ai_summary?: string;
  created_at: string;
  updated_at: string;
}

// Reports
export type ReportType = 'comprehensive' | 'genomic' | 'bloodwork' | 'quarterly' | 'custom';
export type ReportStatus = 'current' | 'superseded' | 'archived';

export interface HealthReport {
  id: string;
  user_id: string;
  title: string;
  report_type: ReportType;
  status: ReportStatus;
  summary?: string;
  full_report: ReportContent;
  data_sources: string[];
  generated_at: string;
  model_used: string;
  created_at: string;
}

export interface ReportContent {
  executive_summary: string;
  key_findings: ReportFinding[];
  data_source_analysis: Record<string, string>;
  cross_references: CrossReference[];
  risk_assessment: RiskItem[];
  recommendations: Recommendation[];
  follow_up_schedule: FollowUp[];
}

export interface ReportFinding {
  title: string;
  severity: 'high' | 'medium' | 'low';
  description: string;
  data_points: string[];
}

export interface CrossReference {
  genomic_marker: string;
  biomarker: string;
  finding: string;
  recommendation: string;
}

export interface RiskItem {
  area: string;
  level: 'high' | 'medium' | 'low';
  description: string;
  mitigations: string[];
}

export interface Recommendation {
  category: string;
  action: string;
  rationale: string;
  priority: 'high' | 'medium' | 'low';
}

export interface FollowUp {
  test: string;
  rationale: string;
  timing: string;
}
