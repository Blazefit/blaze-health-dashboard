-- Blaze Health Dashboard — Database Schema
-- Run this in your Supabase SQL editor

-- ===== PROFILES =====
create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  clerk_id text unique not null,
  email text,
  full_name text,
  date_of_birth date,
  sex text check (sex in ('male', 'female')),
  blood_type text,
  height_inches numeric,
  weight_lbs numeric,
  preferences jsonb default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ===== UPLOADS =====
create table if not exists uploads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  file_name text not null,
  file_url text not null,
  file_type text not null check (file_type in ('dna', 'bloodwork_csv', 'bloodwork_pdf', 'cgm', 'garmin', 'document', 'promethease')),
  file_size_bytes bigint,
  parsed_status text default 'pending' check (parsed_status in ('pending', 'processing', 'complete', 'failed')),
  parsed_at timestamptz,
  metadata jsonb default '{}',
  created_at timestamptz default now()
);

-- ===== GENOMIC SNPS =====
create table if not exists genomic_snps (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  rsid text not null,
  chromosome text,
  position bigint,
  genotype text not null,
  gene_name text,
  variant_name text,
  category text check (category in ('methylation', 'cardiovascular', 'detox', 'metabolism', 'inflammation', 'nutrient', 'sleep', 'fitness', 'immune', 'other')),
  risk_level text check (risk_level in ('clear', 'heterozygous', 'homozygous_risk')),
  risk_allele text,
  clinical_significance text,
  actionable_note text,
  source text default 'ancestrydna',
  created_at timestamptz default now(),
  unique(user_id, rsid)
);

-- ===== BIOMARKERS =====
create table if not exists biomarkers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  date date not null,
  marker_name text not null,
  value numeric not null,
  unit text,
  ref_low numeric,
  ref_high numeric,
  optimal_low numeric,
  optimal_high numeric,
  status text check (status in ('optimal', 'normal', 'borderline', 'flagged')),
  category text check (category in ('metabolic', 'hormonal', 'thyroid', 'lipid', 'lipid_advanced', 'immune', 'nutritional', 'inflammatory', 'renal', 'hepatic', 'hematologic', 'other')),
  source text check (source in ('rythm', 'function_health', 'quest', 'labcorp', 'sanocardio', 'manual', 'upload')),
  upload_id uuid references uploads(id),
  notes text,
  created_at timestamptz default now()
);

-- ===== CGM =====
create table if not exists cgm_readings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  timestamp timestamptz not null,
  glucose_mg_dl numeric not null,
  scan_type text check (scan_type in ('auto', 'manual')),
  upload_id uuid references uploads(id),
  created_at timestamptz default now()
);

create table if not exists cgm_summaries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  period_start date not null,
  period_end date not null,
  avg_glucose numeric,
  gmi numeric,
  cv numeric,
  time_in_range_pct numeric,
  time_below_70_pct numeric,
  time_below_54_pct numeric,
  time_above_180_pct numeric,
  low_event_count integer,
  upload_id uuid references uploads(id),
  created_at timestamptz default now()
);

-- ===== GARMIN =====
create table if not exists garmin_daily (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  date date not null,
  sleep_total_minutes integer,
  sleep_deep_minutes integer,
  sleep_light_minutes integer,
  sleep_rem_minutes integer,
  sleep_awake_minutes integer,
  sleep_score integer,
  sleep_wake_events integer,
  hrv_overnight_avg numeric,
  hrv_status text,
  resting_hr integer,
  max_hr integer,
  avg_hr integer,
  steps integer,
  active_calories integer,
  total_calories integer,
  floors_climbed integer,
  intensity_minutes integer,
  distance_meters numeric,
  body_battery_high integer,
  body_battery_low integer,
  body_battery_current integer,
  training_load numeric,
  training_load_focus text,
  training_status text,
  avg_stress integer,
  max_stress integer,
  avg_spo2 numeric,
  min_spo2 numeric,
  upload_id uuid references uploads(id),
  created_at timestamptz default now(),
  unique(user_id, date)
);

-- ===== TRAINING =====
create table if not exists training_programs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  name text not null,
  description text,
  duration_weeks integer not null,
  current_week integer default 1,
  status text default 'active' check (status in ('active', 'completed', 'paused', 'archived')),
  config jsonb not null default '{}',
  program_data jsonb not null,
  ai_generated boolean default false,
  generation_prompt text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists workout_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  program_id uuid references training_programs(id),
  date date not null,
  week_number integer,
  day_of_week text,
  day_label text,
  exercises jsonb not null,
  duration_minutes integer,
  session_rpe numeric,
  notes text,
  completed boolean default false,
  created_at timestamptz default now()
);

-- ===== SUPPLEMENTS =====
create table if not exists supplement_protocols (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  name text not null,
  is_active boolean default true,
  start_date date,
  end_date date,
  supplements jsonb not null,
  contraindications jsonb default '[]',
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists supplement_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  protocol_id uuid references supplement_protocols(id),
  date date not null,
  supplement_name text not null,
  taken boolean default true,
  notes text,
  created_at timestamptz default now()
);

-- ===== HEALTH NOTES =====
create table if not exists health_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  date date not null default current_date,
  content text not null,
  tags text[] default '{}',
  ai_summary text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ===== HEALTH REPORTS =====
create table if not exists health_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  title text not null,
  report_type text check (report_type in ('comprehensive', 'genomic', 'bloodwork', 'quarterly', 'custom')),
  status text default 'current' check (status in ('current', 'superseded', 'archived')),
  summary text,
  full_report jsonb not null,
  data_sources text[] default '{}',
  generated_at timestamptz default now(),
  model_used text,
  created_at timestamptz default now()
);

-- ===== ROW LEVEL SECURITY =====
alter table profiles enable row level security;
alter table uploads enable row level security;
alter table genomic_snps enable row level security;
alter table biomarkers enable row level security;
alter table cgm_readings enable row level security;
alter table cgm_summaries enable row level security;
alter table garmin_daily enable row level security;
alter table training_programs enable row level security;
alter table workout_logs enable row level security;
alter table supplement_protocols enable row level security;
alter table supplement_logs enable row level security;
alter table health_notes enable row level security;
alter table health_reports enable row level security;

-- RLS Policies (profiles uses clerk_id, others use user_id)
create policy "Users access own profile" on profiles
  for all using (clerk_id = auth.jwt() ->> 'sub')
  with check (clerk_id = auth.jwt() ->> 'sub');

create policy "Users access own uploads" on uploads
  for all using (user_id in (select id from profiles where clerk_id = auth.jwt() ->> 'sub'))
  with check (user_id in (select id from profiles where clerk_id = auth.jwt() ->> 'sub'));

create policy "Users access own snps" on genomic_snps
  for all using (user_id in (select id from profiles where clerk_id = auth.jwt() ->> 'sub'))
  with check (user_id in (select id from profiles where clerk_id = auth.jwt() ->> 'sub'));

create policy "Users access own biomarkers" on biomarkers
  for all using (user_id in (select id from profiles where clerk_id = auth.jwt() ->> 'sub'))
  with check (user_id in (select id from profiles where clerk_id = auth.jwt() ->> 'sub'));

create policy "Users access own cgm_readings" on cgm_readings
  for all using (user_id in (select id from profiles where clerk_id = auth.jwt() ->> 'sub'))
  with check (user_id in (select id from profiles where clerk_id = auth.jwt() ->> 'sub'));

create policy "Users access own cgm_summaries" on cgm_summaries
  for all using (user_id in (select id from profiles where clerk_id = auth.jwt() ->> 'sub'))
  with check (user_id in (select id from profiles where clerk_id = auth.jwt() ->> 'sub'));

create policy "Users access own garmin_daily" on garmin_daily
  for all using (user_id in (select id from profiles where clerk_id = auth.jwt() ->> 'sub'))
  with check (user_id in (select id from profiles where clerk_id = auth.jwt() ->> 'sub'));

create policy "Users access own training_programs" on training_programs
  for all using (user_id in (select id from profiles where clerk_id = auth.jwt() ->> 'sub'))
  with check (user_id in (select id from profiles where clerk_id = auth.jwt() ->> 'sub'));

create policy "Users access own workout_logs" on workout_logs
  for all using (user_id in (select id from profiles where clerk_id = auth.jwt() ->> 'sub'))
  with check (user_id in (select id from profiles where clerk_id = auth.jwt() ->> 'sub'));

create policy "Users access own supplement_protocols" on supplement_protocols
  for all using (user_id in (select id from profiles where clerk_id = auth.jwt() ->> 'sub'))
  with check (user_id in (select id from profiles where clerk_id = auth.jwt() ->> 'sub'));

create policy "Users access own supplement_logs" on supplement_logs
  for all using (user_id in (select id from profiles where clerk_id = auth.jwt() ->> 'sub'))
  with check (user_id in (select id from profiles where clerk_id = auth.jwt() ->> 'sub'));

create policy "Users access own health_notes" on health_notes
  for all using (user_id in (select id from profiles where clerk_id = auth.jwt() ->> 'sub'))
  with check (user_id in (select id from profiles where clerk_id = auth.jwt() ->> 'sub'));

create policy "Users access own health_reports" on health_reports
  for all using (user_id in (select id from profiles where clerk_id = auth.jwt() ->> 'sub'))
  with check (user_id in (select id from profiles where clerk_id = auth.jwt() ->> 'sub'));

-- ===== INDEXES =====
create index idx_biomarkers_user_date on biomarkers(user_id, date);
create index idx_biomarkers_marker on biomarkers(marker_name);
create index idx_cgm_user_timestamp on cgm_readings(user_id, timestamp);
create index idx_garmin_user_date on garmin_daily(user_id, date);
create index idx_snps_user_rsid on genomic_snps(user_id, rsid);
create index idx_notes_user_date on health_notes(user_id, date);
create index idx_workout_logs_program on workout_logs(program_id);
