import type {
  Profile,
  GenomicSnp,
  Biomarker,
  CgmReading,
  CgmSummary,
  GarminDaily,
  TrainingProgram,
  SupplementProtocol,
  HealthNote,
  HealthReport,
} from "@/lib/types";

// ─── 1. Profile ──────────────────────────────────────────────────────────────

export const demoProfile: Profile = {
  id: "demo-user-001",
  clerk_id: "clerk_demo_001",
  email: "jason@crossfitblaze.com",
  full_name: "Jason Anderson",
  date_of_birth: "1988-05-15",
  sex: "male",
  blood_type: "A Rh-",
  height_inches: 72,
  weight_lbs: 184,
  preferences: { units: "imperial", theme: "dark" },
  created_at: "2025-10-01T00:00:00Z",
  updated_at: "2026-03-12T00:00:00Z",
};

// ─── 2. Genomic SNPs ────────────────────────────────────────────────────────

export const demoSnps: GenomicSnp[] = [
  {
    id: "demo-snp-001", user_id: "demo-user-001", rsid: "rs1801133",
    chromosome: "1", position: 11856378, genotype: "CT",
    gene_name: "MTHFR", variant_name: "C677T", category: "methylation",
    risk_level: "heterozygous", risk_allele: "T",
    clinical_significance: "~35% reduced enzyme activity. Mildly impaired folate metabolism.",
    actionable_note: "Supplement with methylfolate (L-5-MTHF) 1 mg/day. Avoid folic acid in fortified foods.",
    source: "promethease", created_at: "2025-10-15T00:00:00Z",
  },
  {
    id: "demo-snp-002", user_id: "demo-user-001", rsid: "rs1801131",
    chromosome: "1", position: 11854476, genotype: "AC",
    gene_name: "MTHFR", variant_name: "A1298C", category: "methylation",
    risk_level: "heterozygous", risk_allele: "C",
    clinical_significance: "Mild reduction in BH4 recycling when combined with C677T heterozygous.",
    actionable_note: "Compound heterozygous MTHFR — support with methylfolate, methylcobalamin, and riboflavin.",
    source: "promethease", created_at: "2025-10-15T00:00:00Z",
  },
  {
    id: "demo-snp-003", user_id: "demo-user-001", rsid: "rs4680",
    chromosome: "22", position: 19963748, genotype: "AG",
    gene_name: "COMT", variant_name: "Val158Met", category: "methylation",
    risk_level: "heterozygous", risk_allele: "A",
    clinical_significance: "Intermediate dopamine/catecholamine clearance rate.",
    actionable_note: "Balanced COMT activity. No specific methylation concerns beyond standard MTHFR support.",
    source: "promethease", created_at: "2025-10-15T00:00:00Z",
  },
  {
    id: "demo-snp-004", user_id: "demo-user-001", rsid: "rs1815739",
    chromosome: "11", position: 66560624, genotype: "TT",
    gene_name: "ACTN3", variant_name: "R577X", category: "fitness",
    risk_level: "homozygous_risk", risk_allele: "T",
    clinical_significance: "Complete absence of alpha-actinin-3 in fast-twitch fibers. Endurance-favored fiber composition.",
    actionable_note: "Higher training volume tolerated well. Favor hypertrophy rep ranges (8-12) over low-rep power work for strength gains.",
    source: "promethease", created_at: "2025-10-15T00:00:00Z",
  },
  {
    id: "demo-snp-005", user_id: "demo-user-001", rsid: "rs174547",
    chromosome: "11", position: 61570783, genotype: "TT",
    gene_name: "FADS1", variant_name: "FADS1", category: "metabolism",
    risk_level: "homozygous_risk", risk_allele: "T",
    clinical_significance: "Impaired conversion of ALA to EPA/DHA. Higher risk of omega-3 insufficiency.",
    actionable_note: "Supplement directly with preformed EPA/DHA (fish oil 3g/day). Plant-based omega-3 sources insufficient.",
    source: "promethease", created_at: "2025-10-15T00:00:00Z",
  },
  {
    id: "demo-snp-006", user_id: "demo-user-001", rsid: "rs9939609",
    chromosome: "16", position: 53820527, genotype: "TA",
    gene_name: "FTO", variant_name: "FTO", category: "metabolism",
    risk_level: "heterozygous", risk_allele: "A",
    clinical_significance: "Mildly increased appetite signaling and reduced satiety.",
    actionable_note: "Protein-forward meals for satiety. Structured meal timing helpful.",
    source: "promethease", created_at: "2025-10-15T00:00:00Z",
  },
  {
    id: "demo-snp-007", user_id: "demo-user-001", rsid: "rs4880",
    chromosome: "6", position: 160113872, genotype: "TT",
    gene_name: "SOD2", variant_name: "Ala16Val", category: "detox",
    risk_level: "homozygous_risk", risk_allele: "T",
    clinical_significance: "Reduced mitochondrial antioxidant defense. Increased oxidative stress susceptibility.",
    actionable_note: "Supplement with CoQ10 200mg and mixed tocopherol vitamin E. Emphasize colorful vegetables.",
    source: "promethease", created_at: "2025-10-15T00:00:00Z",
  },
  {
    id: "demo-snp-008", user_id: "demo-user-001", rsid: "rs2228570",
    chromosome: "12", position: 48272895, genotype: "CT",
    gene_name: "VDR", variant_name: "Fok1", category: "nutrient",
    risk_level: "heterozygous", risk_allele: "T",
    clinical_significance: "Moderately reduced vitamin D receptor efficiency.",
    actionable_note: "Maintain 25(OH)D above 60 ng/mL. Supplement D3 5000 IU/day with K2 MK-7.",
    source: "promethease", created_at: "2025-10-15T00:00:00Z",
  },
  {
    id: "demo-snp-009", user_id: "demo-user-001", rsid: "rs429358",
    chromosome: "19", position: 45411941, genotype: "TT",
    gene_name: "APOE", variant_name: "APOE rs429358", category: "cardiovascular",
    risk_level: "clear", risk_allele: "C",
    clinical_significance: "E3/E3 genotype — normal lipid metabolism and Alzheimer's risk.",
    actionable_note: "No APOE-specific dietary restrictions.",
    source: "promethease", created_at: "2025-10-15T00:00:00Z",
  },
  {
    id: "demo-snp-010", user_id: "demo-user-001", rsid: "rs7412",
    chromosome: "19", position: 45412079, genotype: "CC",
    gene_name: "APOE", variant_name: "APOE rs7412", category: "cardiovascular",
    risk_level: "clear", risk_allele: "T",
    clinical_significance: "Confirms E3/E3 APOE status with rs429358 TT.",
    actionable_note: "No action needed — normal APOE genotype confirmed.",
    source: "promethease", created_at: "2025-10-15T00:00:00Z",
  },
  {
    id: "demo-snp-011", user_id: "demo-user-001", rsid: "rs1800562",
    chromosome: "6", position: 26093141, genotype: "GG",
    gene_name: "HFE", variant_name: "C282Y", category: "metabolism",
    risk_level: "clear", risk_allele: "A",
    clinical_significance: "No hemochromatosis C282Y mutation. Wild-type.",
    actionable_note: "Primary HFE mutation absent. Check H63D for compound risk.",
    source: "promethease", created_at: "2025-10-15T00:00:00Z",
  },
  {
    id: "demo-snp-012", user_id: "demo-user-001", rsid: "rs1799945",
    chromosome: "6", position: 26091179, genotype: "CG",
    gene_name: "HFE", variant_name: "H63D", category: "metabolism",
    risk_level: "heterozygous", risk_allele: "G",
    clinical_significance: "Heterozygous H63D — mild iron accumulation tendency.",
    actionable_note: "Monitor ferritin every 3-6 months. Target ferritin <150 ng/mL. Consider therapeutic blood donation if elevated.",
    source: "promethease", created_at: "2025-10-15T00:00:00Z",
  },
  {
    id: "demo-snp-013", user_id: "demo-user-001", rsid: "rs1800629",
    chromosome: "6", position: 31543031, genotype: "GG",
    gene_name: "TNF", variant_name: "TNF-alpha -308", category: "inflammation",
    risk_level: "clear", risk_allele: "A",
    clinical_significance: "Normal TNF-alpha expression. No elevated baseline inflammation from this locus.",
    actionable_note: "No specific anti-inflammatory intervention needed from TNF perspective.",
    source: "promethease", created_at: "2025-10-15T00:00:00Z",
  },
  {
    id: "demo-snp-014", user_id: "demo-user-001", rsid: "rs1800795",
    chromosome: "7", position: 22766645, genotype: "GC",
    gene_name: "IL6", variant_name: "IL-6 -174", category: "inflammation",
    risk_level: "heterozygous", risk_allele: "C",
    clinical_significance: "Mildly increased IL-6 expression under stress.",
    actionable_note: "Manage training-induced inflammation with adequate recovery, omega-3, and sleep optimization.",
    source: "promethease", created_at: "2025-10-15T00:00:00Z",
  },
  {
    id: "demo-snp-015", user_id: "demo-user-001", rsid: "rs762551",
    chromosome: "15", position: 75041917, genotype: "AC",
    gene_name: "CYP1A2", variant_name: "CYP1A2*1F", category: "metabolism",
    risk_level: "heterozygous", risk_allele: "C",
    clinical_significance: "Moderate caffeine metabolizer. Neither fast nor slow.",
    actionable_note: "Limit caffeine to 200-300 mg/day. Avoid caffeine after 2 PM for sleep quality.",
    source: "promethease", created_at: "2025-10-15T00:00:00Z",
  },
  {
    id: "demo-snp-016", user_id: "demo-user-001", rsid: "rs10156191",
    chromosome: "7", position: 150556771, genotype: "CT",
    gene_name: "DAO", variant_name: "DAO rs10156191", category: "metabolism",
    risk_level: "heterozygous", risk_allele: "T",
    clinical_significance: "Reduced diamine oxidase activity — partial impairment of histamine degradation in the gut.",
    actionable_note: "Monitor histamine-rich foods. May need DAO enzyme supplementation. Relevant for peptide tolerance.",
    source: "promethease", created_at: "2025-10-15T00:00:00Z",
  },
  {
    id: "demo-snp-017", user_id: "demo-user-001", rsid: "rs11558538",
    chromosome: "2", position: 138759649, genotype: "CT",
    gene_name: "HNMT", variant_name: "HNMT Thr105Ile", category: "metabolism",
    risk_level: "heterozygous", risk_allele: "T",
    clinical_significance: "Reduced intracellular histamine N-methyltransferase. Combined with DAO het = dual histamine clearance impairment.",
    actionable_note: "Avoid GHRPs known to trigger histamine (GHRP-6, CJC-1295). Ipamorelin preferred.",
    source: "promethease", created_at: "2025-10-15T00:00:00Z",
  },
  {
    id: "demo-snp-018", user_id: "demo-user-001", rsid: "rs1801260",
    chromosome: "4", position: 56294068, genotype: "TC",
    gene_name: "CLOCK", variant_name: "CLOCK 3111T/C", category: "sleep",
    risk_level: "heterozygous", risk_allele: "C",
    clinical_significance: "Mild evening chronotype tendency. May have slightly delayed sleep onset.",
    actionable_note: "Consistent sleep schedule critical. Light exposure management in evening. Magnesium threonate before bed.",
    source: "promethease", created_at: "2025-10-15T00:00:00Z",
  },
  {
    id: "demo-snp-019", user_id: "demo-user-001", rsid: "rs6265",
    chromosome: "11", position: 27679916, genotype: "CC",
    gene_name: "BDNF", variant_name: "Val66Met", category: "other",
    risk_level: "clear", risk_allele: "T",
    clinical_significance: "Normal BDNF secretion and signaling.",
    actionable_note: "No specific intervention needed. Exercise naturally supports BDNF.",
    source: "promethease", created_at: "2025-10-15T00:00:00Z",
  },
  {
    id: "demo-snp-020", user_id: "demo-user-001", rsid: "rs2802292",
    chromosome: "6", position: 108979545, genotype: "TG",
    gene_name: "FOXO3", variant_name: "FOXO3 longevity", category: "other",
    risk_level: "heterozygous", risk_allele: "G",
    clinical_significance: "One copy of longevity-associated allele. Moderate stress resistance enhancement.",
    actionable_note: "Periodic fasting and exercise augment FOXO3 pathway activity.",
    source: "promethease", created_at: "2025-10-15T00:00:00Z",
  },
  {
    id: "demo-snp-021", user_id: "demo-user-001", rsid: "rs1695",
    chromosome: "11", position: 67352689, genotype: "AG",
    gene_name: "GSTP1", variant_name: "Ile105Val", category: "detox",
    risk_level: "heterozygous", risk_allele: "G",
    clinical_significance: "Moderately reduced glutathione S-transferase P1 activity. Impaired phase II detoxification.",
    actionable_note: "Support glutathione with NAC or liposomal glutathione. Cruciferous vegetables upregulate compensatory pathways.",
    source: "promethease", created_at: "2025-10-15T00:00:00Z",
  },
  {
    id: "demo-snp-022", user_id: "demo-user-001", rsid: "rs1800566",
    chromosome: "16", position: 69745145, genotype: "CC",
    gene_name: "NQO1", variant_name: "NQO1*2", category: "detox",
    risk_level: "clear", risk_allele: "T",
    clinical_significance: "Normal NQO1 enzyme activity. Adequate quinone detoxification.",
    actionable_note: "CoQ10 supplementation still recommended for SOD2 TT support, but NQO1 pathway is intact.",
    source: "promethease", created_at: "2025-10-15T00:00:00Z",
  },
  {
    id: "demo-snp-023", user_id: "demo-user-001", rsid: "rs1801282",
    chromosome: "3", position: 12393125, genotype: "CC",
    gene_name: "PPARG", variant_name: "Pro12Ala", category: "metabolism",
    risk_level: "clear", risk_allele: "G",
    clinical_significance: "Normal PPARG activity. Standard insulin sensitivity.",
    actionable_note: "No specific intervention. Continue balanced macronutrient approach.",
    source: "promethease", created_at: "2025-10-15T00:00:00Z",
  },
  {
    id: "demo-snp-024", user_id: "demo-user-001", rsid: "rs4988235",
    chromosome: "2", position: 136608646, genotype: "CT",
    gene_name: "LCT", variant_name: "MCM6/LCT", category: "metabolism",
    risk_level: "heterozygous", risk_allele: "C",
    clinical_significance: "Likely lactose tolerant but may have reduced tolerance with high dairy intake.",
    actionable_note: "Moderate dairy tolerated. Fermented dairy (yogurt, kefir) preferred.",
    source: "promethease", created_at: "2025-10-15T00:00:00Z",
  },
  {
    id: "demo-snp-025", user_id: "demo-user-001", rsid: "rs1042713",
    chromosome: "5", position: 148206440, genotype: "AG",
    gene_name: "ADRB2", variant_name: "Arg16Gly", category: "fitness",
    risk_level: "heterozygous", risk_allele: "G",
    clinical_significance: "Intermediate beta-2 adrenergic receptor sensitivity.",
    actionable_note: "Standard response to exercise-induced catecholamines. No specific intervention required.",
    source: "promethease", created_at: "2025-10-15T00:00:00Z",
  },
];

// ─── 3. Biomarkers ──────────────────────────────────────────────────────────

export const demoBiomarkers: Biomarker[] = [
  // ── Panel 1: Jan 15, 2026 — Quest ──
  { id: "demo-bio-001", user_id: "demo-user-001", date: "2026-01-15", marker_name: "Ferritin", value: 227, unit: "ng/mL", ref_low: 30, ref_high: 400, optimal_low: 40, optimal_high: 150, status: "flagged", category: "hematologic", source: "quest", notes: "Elevated — HFE H63D heterozygous. Monitor and consider blood donation.", created_at: "2026-01-16T00:00:00Z" },
  { id: "demo-bio-002", user_id: "demo-user-001", date: "2026-01-15", marker_name: "LDL-P", value: 1438, unit: "nmol/L", ref_low: 0, ref_high: 1600, optimal_low: 0, optimal_high: 1000, status: "flagged", category: "lipid_advanced", source: "quest", notes: "Particle count elevated despite normal LDL-C. Pattern B discordance.", created_at: "2026-01-16T00:00:00Z" },
  { id: "demo-bio-003", user_id: "demo-user-001", date: "2026-01-15", marker_name: "Homocysteine", value: 9.3, unit: "umol/L", ref_low: 0, ref_high: 15, optimal_low: 0, optimal_high: 8, status: "borderline", category: "metabolic", source: "quest", notes: "Slightly above optimal — consistent with compound MTHFR heterozygosity.", created_at: "2026-01-16T00:00:00Z" },
  { id: "demo-bio-004", user_id: "demo-user-001", date: "2026-01-15", marker_name: "LDL-C", value: 88, unit: "mg/dL", ref_low: 0, ref_high: 130, optimal_low: 0, optimal_high: 100, status: "optimal", category: "lipid", source: "quest", created_at: "2026-01-16T00:00:00Z" },
  { id: "demo-bio-005", user_id: "demo-user-001", date: "2026-01-15", marker_name: "HDL", value: 60, unit: "mg/dL", ref_low: 40, ref_high: 200, optimal_low: 55, optimal_high: 90, status: "optimal", category: "lipid", source: "quest", created_at: "2026-01-16T00:00:00Z" },
  { id: "demo-bio-006", user_id: "demo-user-001", date: "2026-01-15", marker_name: "Triglycerides", value: 50, unit: "mg/dL", ref_low: 0, ref_high: 150, optimal_low: 0, optimal_high: 80, status: "optimal", category: "lipid", source: "quest", created_at: "2026-01-16T00:00:00Z" },
  { id: "demo-bio-007", user_id: "demo-user-001", date: "2026-01-15", marker_name: "Total Cholesterol", value: 168, unit: "mg/dL", ref_low: 100, ref_high: 200, optimal_low: 140, optimal_high: 200, status: "optimal", category: "lipid", source: "quest", created_at: "2026-01-16T00:00:00Z" },
  { id: "demo-bio-008", user_id: "demo-user-001", date: "2026-01-15", marker_name: "HbA1c", value: 5.1, unit: "%", ref_low: 4.0, ref_high: 5.7, optimal_low: 4.5, optimal_high: 5.3, status: "optimal", category: "metabolic", source: "quest", created_at: "2026-01-16T00:00:00Z" },
  { id: "demo-bio-009", user_id: "demo-user-001", date: "2026-01-15", marker_name: "TSH", value: 1.8, unit: "mIU/L", ref_low: 0.45, ref_high: 4.5, optimal_low: 1.0, optimal_high: 2.5, status: "optimal", category: "thyroid", source: "quest", created_at: "2026-01-16T00:00:00Z" },
  { id: "demo-bio-010", user_id: "demo-user-001", date: "2026-01-15", marker_name: "Free T3", value: 3.4, unit: "pg/mL", ref_low: 2.0, ref_high: 4.4, optimal_low: 3.0, optimal_high: 4.0, status: "optimal", category: "thyroid", source: "quest", created_at: "2026-01-16T00:00:00Z" },
  { id: "demo-bio-011", user_id: "demo-user-001", date: "2026-01-15", marker_name: "Total Testosterone", value: 680, unit: "ng/dL", ref_low: 264, ref_high: 916, optimal_low: 500, optimal_high: 900, status: "optimal", category: "hormonal", source: "quest", created_at: "2026-01-16T00:00:00Z" },
  { id: "demo-bio-012", user_id: "demo-user-001", date: "2026-01-15", marker_name: "Fasting Glucose", value: 82, unit: "mg/dL", ref_low: 65, ref_high: 100, optimal_low: 72, optimal_high: 90, status: "optimal", category: "metabolic", source: "quest", created_at: "2026-01-16T00:00:00Z" },
  { id: "demo-bio-013", user_id: "demo-user-001", date: "2026-01-15", marker_name: "Fasting Insulin", value: 3.2, unit: "uIU/mL", ref_low: 2.6, ref_high: 24.9, optimal_low: 2.0, optimal_high: 6.0, status: "optimal", category: "metabolic", source: "quest", created_at: "2026-01-16T00:00:00Z" },
  { id: "demo-bio-014", user_id: "demo-user-001", date: "2026-01-15", marker_name: "hs-CRP", value: 0.5, unit: "mg/L", ref_low: 0, ref_high: 3.0, optimal_low: 0, optimal_high: 1.0, status: "optimal", category: "inflammatory", source: "quest", created_at: "2026-01-16T00:00:00Z" },
  { id: "demo-bio-015", user_id: "demo-user-001", date: "2026-01-15", marker_name: "25(OH) Vitamin D", value: 62, unit: "ng/mL", ref_low: 30, ref_high: 100, optimal_low: 50, optimal_high: 80, status: "optimal", category: "nutritional", source: "quest", created_at: "2026-01-16T00:00:00Z" },
  { id: "demo-bio-016", user_id: "demo-user-001", date: "2026-01-15", marker_name: "Vitamin B12", value: 650, unit: "pg/mL", ref_low: 232, ref_high: 1245, optimal_low: 500, optimal_high: 1000, status: "optimal", category: "nutritional", source: "quest", created_at: "2026-01-16T00:00:00Z" },
  { id: "demo-bio-017", user_id: "demo-user-001", date: "2026-01-15", marker_name: "WBC", value: 5.8, unit: "K/uL", ref_low: 3.4, ref_high: 10.8, optimal_low: 4.0, optimal_high: 7.0, status: "optimal", category: "hematologic", source: "quest", created_at: "2026-01-16T00:00:00Z" },
  { id: "demo-bio-018", user_id: "demo-user-001", date: "2026-01-15", marker_name: "RBC", value: 5.0, unit: "M/uL", ref_low: 4.14, ref_high: 5.8, optimal_low: 4.5, optimal_high: 5.5, status: "optimal", category: "hematologic", source: "quest", created_at: "2026-01-16T00:00:00Z" },
  { id: "demo-bio-019", user_id: "demo-user-001", date: "2026-01-15", marker_name: "Hemoglobin", value: 15.2, unit: "g/dL", ref_low: 12.6, ref_high: 17.7, optimal_low: 14.0, optimal_high: 16.5, status: "optimal", category: "hematologic", source: "quest", created_at: "2026-01-16T00:00:00Z" },
  // ── Panel 2: Nov 10, 2025 — SanoCardio ──
  { id: "demo-bio-020", user_id: "demo-user-001", date: "2025-11-10", marker_name: "Ferritin", value: 198, unit: "ng/mL", ref_low: 30, ref_high: 400, optimal_low: 40, optimal_high: 150, status: "flagged", category: "hematologic", source: "sanocardio", notes: "Elevated — consistent with HFE H63D.", created_at: "2025-11-11T00:00:00Z" },
  { id: "demo-bio-021", user_id: "demo-user-001", date: "2025-11-10", marker_name: "LDL-P", value: 1502, unit: "nmol/L", ref_low: 0, ref_high: 1600, optimal_low: 0, optimal_high: 1000, status: "flagged", category: "lipid_advanced", source: "sanocardio", created_at: "2025-11-11T00:00:00Z" },
  { id: "demo-bio-022", user_id: "demo-user-001", date: "2025-11-10", marker_name: "Homocysteine", value: 10.1, unit: "umol/L", ref_low: 0, ref_high: 15, optimal_low: 0, optimal_high: 8, status: "borderline", category: "metabolic", source: "sanocardio", notes: "Improving with methylation protocol.", created_at: "2025-11-11T00:00:00Z" },
  { id: "demo-bio-023", user_id: "demo-user-001", date: "2025-11-10", marker_name: "LDL-C", value: 95, unit: "mg/dL", ref_low: 0, ref_high: 130, optimal_low: 0, optimal_high: 100, status: "optimal", category: "lipid", source: "sanocardio", created_at: "2025-11-11T00:00:00Z" },
  { id: "demo-bio-024", user_id: "demo-user-001", date: "2025-11-10", marker_name: "HDL", value: 58, unit: "mg/dL", ref_low: 40, ref_high: 200, optimal_low: 55, optimal_high: 90, status: "optimal", category: "lipid", source: "sanocardio", created_at: "2025-11-11T00:00:00Z" },
  { id: "demo-bio-025", user_id: "demo-user-001", date: "2025-11-10", marker_name: "Triglycerides", value: 55, unit: "mg/dL", ref_low: 0, ref_high: 150, optimal_low: 0, optimal_high: 80, status: "optimal", category: "lipid", source: "sanocardio", created_at: "2025-11-11T00:00:00Z" },
  { id: "demo-bio-026", user_id: "demo-user-001", date: "2025-11-10", marker_name: "HbA1c", value: 5.2, unit: "%", ref_low: 4.0, ref_high: 5.7, optimal_low: 4.5, optimal_high: 5.3, status: "optimal", category: "metabolic", source: "sanocardio", created_at: "2025-11-11T00:00:00Z" },
  { id: "demo-bio-027", user_id: "demo-user-001", date: "2025-11-10", marker_name: "TSH", value: 2.0, unit: "mIU/L", ref_low: 0.45, ref_high: 4.5, optimal_low: 1.0, optimal_high: 2.5, status: "optimal", category: "thyroid", source: "sanocardio", created_at: "2025-11-11T00:00:00Z" },
  { id: "demo-bio-028", user_id: "demo-user-001", date: "2025-11-10", marker_name: "Free T3", value: 3.2, unit: "pg/mL", ref_low: 2.0, ref_high: 4.4, optimal_low: 3.0, optimal_high: 4.0, status: "optimal", category: "thyroid", source: "sanocardio", created_at: "2025-11-11T00:00:00Z" },
  { id: "demo-bio-029", user_id: "demo-user-001", date: "2025-11-10", marker_name: "Fasting Glucose", value: 85, unit: "mg/dL", ref_low: 65, ref_high: 100, optimal_low: 72, optimal_high: 90, status: "optimal", category: "metabolic", source: "sanocardio", created_at: "2025-11-11T00:00:00Z" },
  { id: "demo-bio-030", user_id: "demo-user-001", date: "2025-11-10", marker_name: "hs-CRP", value: 0.8, unit: "mg/L", ref_low: 0, ref_high: 3.0, optimal_low: 0, optimal_high: 1.0, status: "optimal", category: "inflammatory", source: "sanocardio", created_at: "2025-11-11T00:00:00Z" },
  { id: "demo-bio-031", user_id: "demo-user-001", date: "2025-11-10", marker_name: "Lp(a)", value: 42, unit: "nmol/L", ref_low: 0, ref_high: 75, optimal_low: 0, optimal_high: 30, status: "borderline", category: "lipid_advanced", source: "sanocardio", notes: "Genetically determined. Monitor but limited pharmacological options.", created_at: "2025-11-11T00:00:00Z" },
];

// ─── 4. CGM Readings (representative sample) ────────────────────────────────
// NOTE: In production this would contain ~1344 readings (96/day x 14 days).
// This is a representative sample of ~50 readings covering key patterns.

function cgm(id: string, ts: string, gl: number, scan: "auto" | "manual" = "auto"): CgmReading {
  return { id, user_id: "demo-user-001", timestamp: ts, glucose_mg_dl: gl, scan_type: scan, created_at: "2026-03-15T00:00:00Z" };
}

export const demoCgmReadings: CgmReading[] = [
  // Day 1 — 2026-03-01
  cgm("demo-cgm-001", "2026-03-01T06:00:00Z", 78),
  cgm("demo-cgm-002", "2026-03-01T07:30:00Z", 82),
  cgm("demo-cgm-003", "2026-03-01T08:15:00Z", 125),
  cgm("demo-cgm-004", "2026-03-01T09:00:00Z", 108),
  cgm("demo-cgm-005", "2026-03-01T10:30:00Z", 88),
  cgm("demo-cgm-006", "2026-03-01T12:30:00Z", 132),
  cgm("demo-cgm-007", "2026-03-01T13:30:00Z", 110),
  cgm("demo-cgm-008", "2026-03-01T15:00:00Z", 85),
  cgm("demo-cgm-009", "2026-03-01T18:00:00Z", 138),
  cgm("demo-cgm-010", "2026-03-01T19:30:00Z", 105),
  cgm("demo-cgm-011", "2026-03-01T22:00:00Z", 76),
  cgm("demo-cgm-012", "2026-03-01T23:30:00Z", 68),
  cgm("demo-cgm-013", "2026-03-02T02:00:00Z", 55), // overnight low
  // Day 2 — 2026-03-02
  cgm("demo-cgm-014", "2026-03-02T06:00:00Z", 80),
  cgm("demo-cgm-015", "2026-03-02T08:00:00Z", 118),
  cgm("demo-cgm-016", "2026-03-02T10:00:00Z", 90),
  cgm("demo-cgm-017", "2026-03-02T12:45:00Z", 128),
  cgm("demo-cgm-018", "2026-03-02T15:00:00Z", 84),
  cgm("demo-cgm-019", "2026-03-02T18:30:00Z", 120),
  cgm("demo-cgm-020", "2026-03-02T22:00:00Z", 79),
  // Day 3 — overnight low
  cgm("demo-cgm-021", "2026-03-03T06:30:00Z", 75),
  cgm("demo-cgm-022", "2026-03-03T12:00:00Z", 135),
  cgm("demo-cgm-023", "2026-03-03T15:00:00Z", 88),
  cgm("demo-cgm-024", "2026-03-03T21:00:00Z", 72),
  cgm("demo-cgm-025", "2026-03-04T01:30:00Z", 53), // overnight low
  // Day 5 — training day
  cgm("demo-cgm-026", "2026-03-05T06:00:00Z", 82),
  cgm("demo-cgm-027", "2026-03-05T08:00:00Z", 140),
  cgm("demo-cgm-028", "2026-03-05T10:00:00Z", 95),
  cgm("demo-cgm-029", "2026-03-05T13:00:00Z", 130),
  cgm("demo-cgm-030", "2026-03-05T16:00:00Z", 78),
  cgm("demo-cgm-031", "2026-03-05T19:00:00Z", 115),
  cgm("demo-cgm-032", "2026-03-05T23:00:00Z", 74),
  // Day 7 — overnight low
  cgm("demo-cgm-033", "2026-03-07T06:00:00Z", 76),
  cgm("demo-cgm-034", "2026-03-07T12:00:00Z", 122),
  cgm("demo-cgm-035", "2026-03-07T18:00:00Z", 110),
  cgm("demo-cgm-036", "2026-03-07T22:00:00Z", 70),
  cgm("demo-cgm-037", "2026-03-08T03:00:00Z", 56), // overnight low
  // Day 10
  cgm("demo-cgm-038", "2026-03-10T07:00:00Z", 84),
  cgm("demo-cgm-039", "2026-03-10T09:00:00Z", 120),
  cgm("demo-cgm-040", "2026-03-10T12:00:00Z", 88),
  cgm("demo-cgm-041", "2026-03-10T15:00:00Z", 92),
  cgm("demo-cgm-042", "2026-03-10T18:30:00Z", 126),
  cgm("demo-cgm-043", "2026-03-10T23:00:00Z", 78),
  // Day 12 — overnight low
  cgm("demo-cgm-044", "2026-03-12T06:00:00Z", 80),
  cgm("demo-cgm-045", "2026-03-12T12:00:00Z", 118),
  cgm("demo-cgm-046", "2026-03-12T18:00:00Z", 108),
  cgm("demo-cgm-047", "2026-03-12T22:30:00Z", 66),
  cgm("demo-cgm-048", "2026-03-13T02:30:00Z", 58), // overnight low
  // Day 14
  cgm("demo-cgm-049", "2026-03-14T07:00:00Z", 81),
  cgm("demo-cgm-050", "2026-03-14T12:00:00Z", 125),
  cgm("demo-cgm-051", "2026-03-14T18:00:00Z", 112),
  cgm("demo-cgm-052", "2026-03-14T22:00:00Z", 77),
];

// ─── 5. CGM Summary ─────────────────────────────────────────────────────────

export const demoCgmSummary: CgmSummary = {
  id: "demo-cgm-summary-001",
  user_id: "demo-user-001",
  period_start: "2026-03-01",
  period_end: "2026-03-14",
  avg_glucose: 84,
  gmi: 5.3,
  cv: 15.1,
  time_in_range_pct: 87,
  time_below_70_pct: 8,
  time_below_54_pct: 2,
  time_above_180_pct: 0,
  low_event_count: 6,
  created_at: "2026-03-15T00:00:00Z",
};

// ─── 6. Garmin Daily Data (30 days) ─────────────────────────────────────────

function gDay(idx: number, date: string, o: Partial<GarminDaily> = {}): GarminDaily {
  const s = (base: number, spread: number) => {
    const hash = ((idx * 73 + 17) * 37) % spread;
    return base + hash - Math.floor(spread / 2);
  };
  const sleepTotal = Math.max(390, s(425, 70));
  const sleepDeep = Math.max(50, s(65, 30));
  const sleepRem = Math.max(80, s(95, 30));
  const sleepAwake = Math.max(10, s(17, 14));
  const sleepLight = Math.max(170, sleepTotal - sleepDeep - sleepRem - sleepAwake);
  const hrv = Math.max(38, s(44, 14));
  const restHr = Math.max(56, Math.min(60, s(58, 4)));
  const steps = Math.max(5000, s(8500, 7000));
  const activeCal = Math.max(300, s(550, 500));
  return {
    id: `demo-garmin-${String(idx).padStart(3, "0")}`,
    user_id: "demo-user-001",
    date,
    sleep_total_minutes: sleepTotal,
    sleep_deep_minutes: sleepDeep,
    sleep_light_minutes: sleepLight,
    sleep_rem_minutes: sleepRem,
    sleep_awake_minutes: sleepAwake,
    sleep_score: Math.max(65, Math.min(85, s(75, 20))),
    sleep_wake_events: Math.max(1, Math.min(5, s(3, 4))),
    hrv_overnight_avg: hrv,
    hrv_status: hrv >= 45 ? "balanced" : hrv >= 40 ? "baseline" : "low",
    resting_hr: restHr,
    max_hr: Math.max(140, s(165, 40)),
    avg_hr: Math.max(60, s(72, 16)),
    steps,
    active_calories: activeCal,
    total_calories: activeCal + 1850,
    floors_climbed: Math.max(2, s(8, 12)),
    intensity_minutes: Math.max(10, s(45, 60)),
    distance_meters: Math.round(steps * 0.75),
    body_battery_high: Math.max(80, Math.min(100, s(90, 20))),
    body_battery_low: Math.max(15, Math.min(40, s(28, 20))),
    body_battery_current: Math.max(30, Math.min(90, s(55, 40))),
    training_load: Math.max(50, Math.min(120, s(85, 70))),
    training_load_focus: idx % 3 === 0 ? "anaerobic" : idx % 3 === 1 ? "high_aerobic" : "low_aerobic",
    training_status: "productive",
    avg_stress: Math.max(25, Math.min(40, s(32, 16))),
    max_stress: Math.max(45, Math.min(80, s(65, 30))),
    avg_spo2: Math.max(96, Math.min(98, s(97, 2))),
    min_spo2: Math.max(92, Math.min(96, s(94, 4))),
    created_at: "2026-03-17T00:00:00Z",
    ...o,
  };
}

export const demoGarminData: GarminDaily[] = Array.from({ length: 30 }, (_, i) => {
  const d = new Date(2026, 1, 15 + i);
  return gDay(i + 1, d.toISOString().slice(0, 10));
});

// ─── 7. Training Program ────────────────────────────────────────────────────

export const demoTrainingProgram: TrainingProgram = {
  id: "demo-program-001",
  user_id: "demo-user-001",
  name: "Sheiko-Style Hypertrophy Bench — 14 Week",
  description: "14-week Sheiko-influenced bench press hypertrophy program. No axial loading. ACTN3 TT: higher volume, moderate intensity emphasis.",
  duration_weeks: 14,
  current_week: 7,
  status: "active",
  config: {
    bench_1rm: 285,
    squat_1rm: 335,
    rounding: 5,
    constraints: ["no_axial_loading"],
    genomic_notes: "ACTN3 TT = endurance fiber type, higher volume recommended. SOD2 TT = increased oxidative stress — ensure adequate recovery.",
    phase_structure: "Weeks 1-4 accumulation, 5-10 transmutation, 11-14 realization",
  },
  ai_generated: true,
  generation_prompt: "14-week Sheiko-style bench hypertrophy program. No axial loading. Bench 1RM 285.",
  program_data: [
    // ── Week 6 ──
    {
      week: 6, phase: "transmutation",
      days: [
        { day_of_week: "Monday", label: "Bench Volume A", exercises: [
          { name: "Bench Press", notes: "Controlled eccentric, pause on chest", sets: [
            { set_number: 1, reps: 10, weight: 45, type: "warmup" },
            { set_number: 2, reps: 8, weight: 95, type: "warmup" },
            { set_number: 3, reps: 5, weight: 135, type: "warmup" },
            { set_number: 4, reps: 3, weight: 175, type: "warmup" },
            { set_number: 5, reps: 8, weight: 195, percentage: 68, type: "working" },
            { set_number: 6, reps: 8, weight: 195, percentage: 68, type: "working" },
            { set_number: 7, reps: 8, weight: 195, percentage: 68, type: "working" },
            { set_number: 8, reps: 8, weight: 195, percentage: 68, type: "working" },
          ]},
          { name: "Close-Grip Bench Press", sets: [
            { set_number: 1, reps: 10, weight: 170, type: "working" },
            { set_number: 2, reps: 10, weight: 170, type: "working" },
            { set_number: 3, reps: 10, weight: 170, type: "working" },
          ]},
          { name: "Incline DB Press", sets: [
            { set_number: 1, reps: 12, weight: 55, type: "working" },
            { set_number: 2, reps: 12, weight: 55, type: "working" },
            { set_number: 3, reps: 12, weight: 55, type: "working" },
          ]},
        ]},
        { day_of_week: "Tuesday", label: "Lower / Accessories A", exercises: [
          { name: "Bulgarian Split Squat", sets: [
            { set_number: 1, reps: 10, weight: 50, type: "working" },
            { set_number: 2, reps: 10, weight: 50, type: "working" },
            { set_number: 3, reps: 10, weight: 50, type: "working" },
          ]},
          { name: "GHR", sets: [
            { set_number: 1, reps: 12, weight: 0, type: "working" },
            { set_number: 2, reps: 12, weight: 0, type: "working" },
            { set_number: 3, reps: 12, weight: 0, type: "working" },
          ]},
          { name: "Pull-Ups", sets: [
            { set_number: 1, reps: 8, weight: 0, type: "working" },
            { set_number: 2, reps: 8, weight: 0, type: "working" },
            { set_number: 3, reps: 8, weight: 0, type: "working" },
          ]},
          { name: "Barbell Curl", sets: [
            { set_number: 1, reps: 12, weight: 65, type: "working" },
            { set_number: 2, reps: 12, weight: 65, type: "working" },
            { set_number: 3, reps: 12, weight: 65, type: "working" },
          ]},
        ]},
        { day_of_week: "Wednesday", label: "Bench Intensity A", exercises: [
          { name: "Bench Press", notes: "Heavier day", sets: [
            { set_number: 1, reps: 10, weight: 45, type: "warmup" },
            { set_number: 2, reps: 8, weight: 95, type: "warmup" },
            { set_number: 3, reps: 5, weight: 135, type: "warmup" },
            { set_number: 4, reps: 3, weight: 185, type: "warmup" },
            { set_number: 5, reps: 6, weight: 205, percentage: 72, type: "working" },
            { set_number: 6, reps: 6, weight: 205, percentage: 72, type: "working" },
            { set_number: 7, reps: 6, weight: 205, percentage: 72, type: "working" },
            { set_number: 8, reps: 6, weight: 205, percentage: 72, type: "working" },
          ]},
          { name: "Floor Press", sets: [
            { set_number: 1, reps: 8, weight: 180, type: "working" },
            { set_number: 2, reps: 8, weight: 180, type: "working" },
            { set_number: 3, reps: 8, weight: 180, type: "working" },
          ]},
          { name: "DB Flyes", sets: [
            { set_number: 1, reps: 15, weight: 30, type: "working" },
            { set_number: 2, reps: 15, weight: 30, type: "working" },
            { set_number: 3, reps: 15, weight: 30, type: "working" },
          ]},
        ]},
        { day_of_week: "Thursday", label: "Lower / Accessories B", exercises: [
          { name: "Hip Thrust", sets: [
            { set_number: 1, reps: 10, weight: 225, type: "working" },
            { set_number: 2, reps: 10, weight: 225, type: "working" },
            { set_number: 3, reps: 10, weight: 225, type: "working" },
          ]},
          { name: "Leg Press", sets: [
            { set_number: 1, reps: 12, weight: 360, type: "working" },
            { set_number: 2, reps: 12, weight: 360, type: "working" },
            { set_number: 3, reps: 12, weight: 360, type: "working" },
          ]},
          { name: "Chest-Supported Row", sets: [
            { set_number: 1, reps: 10, weight: 70, type: "working" },
            { set_number: 2, reps: 10, weight: 70, type: "working" },
            { set_number: 3, reps: 10, weight: 70, type: "working" },
          ]},
          { name: "Hammer Curl", sets: [
            { set_number: 1, reps: 12, weight: 35, type: "working" },
            { set_number: 2, reps: 12, weight: 35, type: "working" },
            { set_number: 3, reps: 12, weight: 35, type: "working" },
          ]},
        ]},
        { day_of_week: "Friday", label: "Bench Volume B", exercises: [
          { name: "Bench Press", notes: "Volume backoff day", sets: [
            { set_number: 1, reps: 10, weight: 45, type: "warmup" },
            { set_number: 2, reps: 8, weight: 95, type: "warmup" },
            { set_number: 3, reps: 5, weight: 135, type: "warmup" },
            { set_number: 4, reps: 3, weight: 175, type: "warmup" },
            { set_number: 5, reps: 10, weight: 185, percentage: 65, type: "working" },
            { set_number: 6, reps: 10, weight: 185, percentage: 65, type: "working" },
            { set_number: 7, reps: 10, weight: 185, percentage: 65, type: "working" },
          ]},
          { name: "Spoto Press", sets: [
            { set_number: 1, reps: 8, weight: 170, type: "working" },
            { set_number: 2, reps: 8, weight: 170, type: "working" },
            { set_number: 3, reps: 8, weight: 170, type: "working" },
          ]},
        ]},
        { day_of_week: "Saturday", label: "Lower / Accessories C", exercises: [
          { name: "Bulgarian Split Squat", sets: [
            { set_number: 1, reps: 12, weight: 45, type: "working" },
            { set_number: 2, reps: 12, weight: 45, type: "working" },
            { set_number: 3, reps: 12, weight: 45, type: "working" },
          ]},
          { name: "GHR", sets: [
            { set_number: 1, reps: 10, weight: 10, type: "working" },
            { set_number: 2, reps: 10, weight: 10, type: "working" },
            { set_number: 3, reps: 10, weight: 10, type: "working" },
          ]},
          { name: "Pendlay Row", sets: [
            { set_number: 1, reps: 8, weight: 155, type: "working" },
            { set_number: 2, reps: 8, weight: 155, type: "working" },
            { set_number: 3, reps: 8, weight: 155, type: "working" },
          ]},
          { name: "Face Pull", sets: [
            { set_number: 1, reps: 15, weight: 40, type: "working" },
            { set_number: 2, reps: 15, weight: 40, type: "working" },
            { set_number: 3, reps: 15, weight: 40, type: "working" },
          ]},
        ]},
      ],
    },
    // ── Week 7 (current) ──
    {
      week: 7, phase: "transmutation",
      days: [
        { day_of_week: "Monday", label: "Bench Volume A", exercises: [
          { name: "Bench Press", notes: "Controlled eccentric, pause on chest", sets: [
            { set_number: 1, reps: 10, weight: 45, type: "warmup" },
            { set_number: 2, reps: 8, weight: 95, type: "warmup" },
            { set_number: 3, reps: 5, weight: 135, type: "warmup" },
            { set_number: 4, reps: 3, weight: 185, type: "warmup" },
            { set_number: 5, reps: 8, weight: 200, percentage: 70, type: "working" },
            { set_number: 6, reps: 8, weight: 200, percentage: 70, type: "working" },
            { set_number: 7, reps: 8, weight: 200, percentage: 70, type: "working" },
            { set_number: 8, reps: 8, weight: 200, percentage: 70, type: "working" },
          ]},
          { name: "Close-Grip Bench Press", sets: [
            { set_number: 1, reps: 10, weight: 175, type: "working" },
            { set_number: 2, reps: 10, weight: 175, type: "working" },
            { set_number: 3, reps: 10, weight: 175, type: "working" },
          ]},
          { name: "Incline DB Press", sets: [
            { set_number: 1, reps: 12, weight: 60, type: "working" },
            { set_number: 2, reps: 12, weight: 60, type: "working" },
            { set_number: 3, reps: 12, weight: 60, type: "working" },
          ]},
        ]},
        { day_of_week: "Tuesday", label: "Lower / Accessories A", exercises: [
          { name: "Bulgarian Split Squat", sets: [
            { set_number: 1, reps: 10, weight: 55, type: "working" },
            { set_number: 2, reps: 10, weight: 55, type: "working" },
            { set_number: 3, reps: 10, weight: 55, type: "working" },
          ]},
          { name: "GHR", sets: [
            { set_number: 1, reps: 12, weight: 0, type: "working" },
            { set_number: 2, reps: 12, weight: 0, type: "working" },
            { set_number: 3, reps: 12, weight: 0, type: "working" },
          ]},
          { name: "Pull-Ups", sets: [
            { set_number: 1, reps: 8, weight: 10, type: "working" },
            { set_number: 2, reps: 8, weight: 10, type: "working" },
            { set_number: 3, reps: 8, weight: 10, type: "working" },
          ]},
          { name: "Barbell Curl", sets: [
            { set_number: 1, reps: 12, weight: 65, type: "working" },
            { set_number: 2, reps: 12, weight: 65, type: "working" },
            { set_number: 3, reps: 12, weight: 65, type: "working" },
          ]},
        ]},
        { day_of_week: "Wednesday", label: "Bench Intensity A", exercises: [
          { name: "Bench Press", notes: "Heavier day", sets: [
            { set_number: 1, reps: 10, weight: 45, type: "warmup" },
            { set_number: 2, reps: 8, weight: 95, type: "warmup" },
            { set_number: 3, reps: 5, weight: 135, type: "warmup" },
            { set_number: 4, reps: 3, weight: 185, type: "warmup" },
            { set_number: 5, reps: 6, weight: 210, percentage: 74, type: "working" },
            { set_number: 6, reps: 6, weight: 210, percentage: 74, type: "working" },
            { set_number: 7, reps: 6, weight: 210, percentage: 74, type: "working" },
            { set_number: 8, reps: 6, weight: 210, percentage: 74, type: "working" },
          ]},
          { name: "Floor Press", sets: [
            { set_number: 1, reps: 8, weight: 185, type: "working" },
            { set_number: 2, reps: 8, weight: 185, type: "working" },
            { set_number: 3, reps: 8, weight: 185, type: "working" },
          ]},
          { name: "DB Flyes", sets: [
            { set_number: 1, reps: 15, weight: 35, type: "working" },
            { set_number: 2, reps: 15, weight: 35, type: "working" },
            { set_number: 3, reps: 15, weight: 35, type: "working" },
          ]},
        ]},
        { day_of_week: "Thursday", label: "Lower / Accessories B", exercises: [
          { name: "Hip Thrust", sets: [
            { set_number: 1, reps: 10, weight: 235, type: "working" },
            { set_number: 2, reps: 10, weight: 235, type: "working" },
            { set_number: 3, reps: 10, weight: 235, type: "working" },
          ]},
          { name: "Leg Press", sets: [
            { set_number: 1, reps: 12, weight: 380, type: "working" },
            { set_number: 2, reps: 12, weight: 380, type: "working" },
            { set_number: 3, reps: 12, weight: 380, type: "working" },
          ]},
          { name: "Chest-Supported Row", sets: [
            { set_number: 1, reps: 10, weight: 75, type: "working" },
            { set_number: 2, reps: 10, weight: 75, type: "working" },
            { set_number: 3, reps: 10, weight: 75, type: "working" },
          ]},
          { name: "Hammer Curl", sets: [
            { set_number: 1, reps: 12, weight: 35, type: "working" },
            { set_number: 2, reps: 12, weight: 35, type: "working" },
            { set_number: 3, reps: 12, weight: 35, type: "working" },
          ]},
        ]},
        { day_of_week: "Friday", label: "Bench Heavy Primer + Volume", exercises: [
          { name: "Bench Press", notes: "Heavy primer then volume work", sets: [
            { set_number: 1, reps: 10, weight: 45, type: "warmup" },
            { set_number: 2, reps: 8, weight: 95, type: "warmup" },
            { set_number: 3, reps: 5, weight: 135, type: "warmup" },
            { set_number: 4, reps: 3, weight: 185, type: "warmup" },
            { set_number: 5, reps: 1, weight: 225, type: "warmup" },
            { set_number: 6, reps: 3, weight: 240, percentage: 84, type: "primer", rpe: 8 },
            { set_number: 7, reps: 10, weight: 195, percentage: 68, type: "working" },
            { set_number: 8, reps: 10, weight: 195, percentage: 68, type: "working" },
            { set_number: 9, reps: 10, weight: 195, percentage: 68, type: "working" },
          ]},
          { name: "Spoto Press", notes: "1-inch off chest pause", sets: [
            { set_number: 1, reps: 8, weight: 175, type: "working" },
            { set_number: 2, reps: 8, weight: 175, type: "working" },
            { set_number: 3, reps: 8, weight: 175, type: "working" },
          ]},
        ]},
        { day_of_week: "Saturday", label: "Lower / Accessories C", exercises: [
          { name: "Bulgarian Split Squat", sets: [
            { set_number: 1, reps: 12, weight: 50, type: "working" },
            { set_number: 2, reps: 12, weight: 50, type: "working" },
            { set_number: 3, reps: 12, weight: 50, type: "working" },
          ]},
          { name: "GHR", sets: [
            { set_number: 1, reps: 10, weight: 10, type: "working" },
            { set_number: 2, reps: 10, weight: 10, type: "working" },
            { set_number: 3, reps: 10, weight: 10, type: "working" },
          ]},
          { name: "Pendlay Row", sets: [
            { set_number: 1, reps: 8, weight: 160, type: "working" },
            { set_number: 2, reps: 8, weight: 160, type: "working" },
            { set_number: 3, reps: 8, weight: 160, type: "working" },
          ]},
          { name: "Face Pull", sets: [
            { set_number: 1, reps: 15, weight: 45, type: "working" },
            { set_number: 2, reps: 15, weight: 45, type: "working" },
            { set_number: 3, reps: 15, weight: 45, type: "working" },
          ]},
        ]},
      ],
    },
    // ── Week 8 ──
    {
      week: 8, phase: "transmutation",
      days: [
        { day_of_week: "Monday", label: "Bench Volume A", exercises: [
          { name: "Bench Press", notes: "Controlled eccentric, pause on chest", sets: [
            { set_number: 1, reps: 10, weight: 45, type: "warmup" },
            { set_number: 2, reps: 8, weight: 95, type: "warmup" },
            { set_number: 3, reps: 5, weight: 135, type: "warmup" },
            { set_number: 4, reps: 3, weight: 185, type: "warmup" },
            { set_number: 5, reps: 8, weight: 205, percentage: 72, type: "working" },
            { set_number: 6, reps: 8, weight: 205, percentage: 72, type: "working" },
            { set_number: 7, reps: 8, weight: 205, percentage: 72, type: "working" },
            { set_number: 8, reps: 8, weight: 205, percentage: 72, type: "working" },
          ]},
          { name: "Close-Grip Bench Press", sets: [
            { set_number: 1, reps: 10, weight: 180, type: "working" },
            { set_number: 2, reps: 10, weight: 180, type: "working" },
            { set_number: 3, reps: 10, weight: 180, type: "working" },
          ]},
          { name: "Incline DB Press", sets: [
            { set_number: 1, reps: 12, weight: 60, type: "working" },
            { set_number: 2, reps: 12, weight: 60, type: "working" },
            { set_number: 3, reps: 12, weight: 60, type: "working" },
          ]},
        ]},
        { day_of_week: "Tuesday", label: "Lower / Accessories A", exercises: [
          { name: "Bulgarian Split Squat", sets: [
            { set_number: 1, reps: 10, weight: 55, type: "working" },
            { set_number: 2, reps: 10, weight: 55, type: "working" },
            { set_number: 3, reps: 10, weight: 55, type: "working" },
          ]},
          { name: "GHR", sets: [
            { set_number: 1, reps: 12, weight: 10, type: "working" },
            { set_number: 2, reps: 12, weight: 10, type: "working" },
            { set_number: 3, reps: 12, weight: 10, type: "working" },
          ]},
          { name: "Pull-Ups", sets: [
            { set_number: 1, reps: 8, weight: 15, type: "working" },
            { set_number: 2, reps: 8, weight: 15, type: "working" },
            { set_number: 3, reps: 8, weight: 15, type: "working" },
          ]},
          { name: "Barbell Curl", sets: [
            { set_number: 1, reps: 12, weight: 70, type: "working" },
            { set_number: 2, reps: 12, weight: 70, type: "working" },
            { set_number: 3, reps: 12, weight: 70, type: "working" },
          ]},
        ]},
        { day_of_week: "Wednesday", label: "Bench Intensity A", exercises: [
          { name: "Bench Press", notes: "Heavier day", sets: [
            { set_number: 1, reps: 10, weight: 45, type: "warmup" },
            { set_number: 2, reps: 8, weight: 95, type: "warmup" },
            { set_number: 3, reps: 5, weight: 135, type: "warmup" },
            { set_number: 4, reps: 3, weight: 185, type: "warmup" },
            { set_number: 5, reps: 6, weight: 215, percentage: 75, type: "working" },
            { set_number: 6, reps: 6, weight: 215, percentage: 75, type: "working" },
            { set_number: 7, reps: 6, weight: 215, percentage: 75, type: "working" },
            { set_number: 8, reps: 6, weight: 215, percentage: 75, type: "working" },
          ]},
          { name: "Floor Press", sets: [
            { set_number: 1, reps: 8, weight: 190, type: "working" },
            { set_number: 2, reps: 8, weight: 190, type: "working" },
            { set_number: 3, reps: 8, weight: 190, type: "working" },
          ]},
          { name: "DB Flyes", sets: [
            { set_number: 1, reps: 15, weight: 35, type: "working" },
            { set_number: 2, reps: 15, weight: 35, type: "working" },
            { set_number: 3, reps: 15, weight: 35, type: "working" },
          ]},
        ]},
        { day_of_week: "Thursday", label: "Lower / Accessories B", exercises: [
          { name: "Hip Thrust", sets: [
            { set_number: 1, reps: 10, weight: 245, type: "working" },
            { set_number: 2, reps: 10, weight: 245, type: "working" },
            { set_number: 3, reps: 10, weight: 245, type: "working" },
          ]},
          { name: "Leg Press", sets: [
            { set_number: 1, reps: 12, weight: 400, type: "working" },
            { set_number: 2, reps: 12, weight: 400, type: "working" },
            { set_number: 3, reps: 12, weight: 400, type: "working" },
          ]},
          { name: "Chest-Supported Row", sets: [
            { set_number: 1, reps: 10, weight: 75, type: "working" },
            { set_number: 2, reps: 10, weight: 75, type: "working" },
            { set_number: 3, reps: 10, weight: 75, type: "working" },
          ]},
          { name: "Hammer Curl", sets: [
            { set_number: 1, reps: 12, weight: 40, type: "working" },
            { set_number: 2, reps: 12, weight: 40, type: "working" },
            { set_number: 3, reps: 12, weight: 40, type: "working" },
          ]},
        ]},
        { day_of_week: "Friday", label: "Bench Heavy Primer + Volume", exercises: [
          { name: "Bench Press", notes: "Heavy primer then volume", sets: [
            { set_number: 1, reps: 10, weight: 45, type: "warmup" },
            { set_number: 2, reps: 8, weight: 95, type: "warmup" },
            { set_number: 3, reps: 5, weight: 135, type: "warmup" },
            { set_number: 4, reps: 3, weight: 185, type: "warmup" },
            { set_number: 5, reps: 1, weight: 225, type: "warmup" },
            { set_number: 6, reps: 3, weight: 245, percentage: 86, type: "primer", rpe: 8.5 },
            { set_number: 7, reps: 10, weight: 200, percentage: 70, type: "working" },
            { set_number: 8, reps: 10, weight: 200, percentage: 70, type: "working" },
            { set_number: 9, reps: 10, weight: 200, percentage: 70, type: "working" },
          ]},
          { name: "Spoto Press", notes: "1-inch off chest pause", sets: [
            { set_number: 1, reps: 8, weight: 180, type: "working" },
            { set_number: 2, reps: 8, weight: 180, type: "working" },
            { set_number: 3, reps: 8, weight: 180, type: "working" },
          ]},
        ]},
        { day_of_week: "Saturday", label: "Lower / Accessories C", exercises: [
          { name: "Bulgarian Split Squat", sets: [
            { set_number: 1, reps: 12, weight: 50, type: "working" },
            { set_number: 2, reps: 12, weight: 50, type: "working" },
            { set_number: 3, reps: 12, weight: 50, type: "working" },
          ]},
          { name: "GHR", sets: [
            { set_number: 1, reps: 10, weight: 15, type: "working" },
            { set_number: 2, reps: 10, weight: 15, type: "working" },
            { set_number: 3, reps: 10, weight: 15, type: "working" },
          ]},
          { name: "Pendlay Row", sets: [
            { set_number: 1, reps: 8, weight: 165, type: "working" },
            { set_number: 2, reps: 8, weight: 165, type: "working" },
            { set_number: 3, reps: 8, weight: 165, type: "working" },
          ]},
          { name: "Face Pull", sets: [
            { set_number: 1, reps: 15, weight: 45, type: "working" },
            { set_number: 2, reps: 15, weight: 45, type: "working" },
            { set_number: 3, reps: 15, weight: 45, type: "working" },
          ]},
        ]},
      ],
    },
  ],
  created_at: "2025-12-15T00:00:00Z",
  updated_at: "2026-03-10T00:00:00Z",
};

// ─── 8. Supplement Protocol ─────────────────────────────────────────────────

export const demoSupplementProtocol: SupplementProtocol = {
  id: "demo-protocol-001",
  user_id: "demo-user-001",
  name: "Current Optimization Protocol",
  is_active: true,
  start_date: "2025-11-20",
  supplements: [
    { name: "Methylfolate (L-5-MTHF)", dose: "1", unit: "mg", timing: "morning", frequency: "daily", genomic_rationale: "MTHFR C677T + A1298C compound heterozygous — bypasses impaired folate conversion.", is_peptide: false },
    { name: "Methylcobalamin (B12)", dose: "5000", unit: "mcg", timing: "morning", frequency: "daily", genomic_rationale: "Supports methylation cycle alongside methylfolate. Homocysteine 9.3 trending down.", is_peptide: false },
    { name: "Vitamin D3", dose: "5000", unit: "IU", timing: "morning", frequency: "daily", genomic_rationale: "VDR Fok1 heterozygous — reduced receptor efficiency. Target 25(OH)D >60 ng/mL.", is_peptide: false },
    { name: "Vitamin K2 MK-7", dose: "200", unit: "mcg", timing: "morning", frequency: "daily", notes: "Synergistic with D3 for calcium metabolism and arterial health.", is_peptide: false },
    { name: "Magnesium Glycinate", dose: "400", unit: "mg", timing: "morning", frequency: "daily", notes: "Split dose — 200mg morning, 200mg bedtime.", is_peptide: false },
    { name: "CoQ10 (Ubiquinol)", dose: "200", unit: "mg", timing: "morning", frequency: "daily", genomic_rationale: "SOD2 TT homozygous — reduced mitochondrial antioxidant defense.", is_peptide: false },
    { name: "EPA/DHA Fish Oil", dose: "3", unit: "g", timing: "with_meal", frequency: "daily", genomic_rationale: "FADS1 TT homozygous — impaired ALA to EPA/DHA conversion. Must supplement preformed omega-3.", is_peptide: false },
    { name: "Vitamin E (Mixed Tocopherols)", dose: "400", unit: "IU", timing: "with_meal", frequency: "daily", genomic_rationale: "SOD2 TT + GSTP1 heterozygous — supports lipid-soluble antioxidant defense.", is_peptide: false },
    { name: "Magnesium L-Threonate", dose: "2", unit: "g", timing: "bedtime", frequency: "daily", notes: "Crosses blood-brain barrier. Supports sleep quality and CLOCK heterozygous management.", is_peptide: false },
    { name: "Zinc Picolinate", dose: "30", unit: "mg", timing: "bedtime", frequency: "daily", notes: "Supports testosterone maintenance and immune function. Take away from calcium.", is_peptide: false },
    { name: "Boron", dose: "6", unit: "mg", timing: "bedtime", frequency: "daily", notes: "Supports free testosterone, vitamin D metabolism, and bone density.", is_peptide: false },
    { name: "Ipamorelin", dose: "200", unit: "mcg", timing: "active", frequency: "5 on / 2 off", notes: "Subcutaneous injection. GHRP with minimal histamine release — safe given DAO/HNMT genotype.", is_peptide: true, cycle_on_weeks: 12, cycle_off_weeks: 4 },
    { name: "BPC-157", dose: "250", unit: "mcg", timing: "active", frequency: "daily", notes: "Subcutaneous injection. Tissue repair and GI support. No histamine concerns.", is_peptide: true, cycle_on_weeks: 8, cycle_off_weeks: 4 },
  ],
  contraindications: [
    { compound: "CJC-1295", reason: "Confirmed histamine reaction — DAO heterozygous (rs10156191 CT) + HNMT heterozygous (rs11558538 CT). Dual histamine clearance impairment. Flushing, elevated HR, GI distress within 20 min of injection. Ipamorelin only for GHRP.", confirmed_date: "2025-11-20" },
  ],
  notes: "Protocol designed around compound MTHFR heterozygosity, SOD2 TT oxidative stress, FADS1 TT omega-3 impairment, VDR heterozygous, and dual histamine SNPs.",
  created_at: "2025-11-20T00:00:00Z",
  updated_at: "2026-03-10T00:00:00Z",
};

// ─── 9. Health Notes ────────────────────────────────────────────────────────

export const demoNotes: HealthNote[] = [
  {
    id: "demo-note-001", user_id: "demo-user-001", date: "2026-03-10",
    content: "Switched from CJC-1295/Ipamorelin combo to Ipamorelin-only after histamine reaction on Nov 18. Reaction included flushing, tachycardia (HR 120+), and GI cramping within 20 minutes of subcutaneous injection. Genomic review confirmed DAO rs10156191 CT + HNMT rs11558538 CT = dual histamine clearance impairment. CJC-1295 is a known histamine liberator. Ipamorelin alone at 200mcg has been well-tolerated for 16 weeks with no histamine symptoms. Added to contraindications list.",
    tags: ["adverse_reaction", "supplements", "genomics"],
    ai_summary: "CJC-1295 discontinued due to histamine reaction linked to DAO/HNMT heterozygosity. Ipamorelin-only well-tolerated.",
    created_at: "2026-03-10T00:00:00Z", updated_at: "2026-03-10T00:00:00Z",
  },
  {
    id: "demo-note-002", user_id: "demo-user-001", date: "2026-03-05",
    content: "Added heavy primer set (240x3) once per week on Friday bench day. Goal: neural priming for heavier loads while keeping overall volume high per Sheiko methodology. Week 7 target is 240x3 at RPE 8. The subsequent volume work (195x10x3) feels noticeably smoother after the primer. ACTN3 TT genotype means fast-twitch fibers are already endurance-oriented, so the primer bridges the gap to peak strength without overtaxing recovery. Planning to progress primer to 250x2 by week 10.",
    tags: ["training", "key_finding"],
    ai_summary: "Heavy primer set added to Friday bench — neural priming approach for ACTN3 TT genotype. 240x3 at RPE 8.",
    created_at: "2026-03-05T00:00:00Z", updated_at: "2026-03-05T00:00:00Z",
  },
  {
    id: "demo-note-003", user_id: "demo-user-001", date: "2026-02-28",
    content: "CGM showing consistent overnight lows 53-58 mg/dL on 4-5 nights out of 14. Events cluster between 1:00-3:30 AM. Daytime glucose stable 75-110 with post-meal spikes 120-140 (appropriate). FADS1 TT genotype may contribute via impaired fatty acid metabolism affecting overnight gluconeogenesis substrate availability. HbA1c 5.1% and fasting glucose 82 rule out hypoglycemia pathology — this appears to be reactive/physiological. Considering adding slow-digesting carb (sweet potato) at dinner and casein protein before bed. Will re-evaluate on next 14-day CGM cycle.",
    tags: ["cgm", "genomics", "key_finding"],
    ai_summary: "Overnight CGM lows 53-58 on ~35% of nights. Likely physiological, potentially linked to FADS1 TT. Testing dietary intervention.",
    created_at: "2026-02-28T00:00:00Z", updated_at: "2026-02-28T00:00:00Z",
  },
  {
    id: "demo-note-004", user_id: "demo-user-001", date: "2026-02-20",
    content: "Ferritin trending up from 198 to 227 ng/mL despite no iron supplementation. HFE H63D heterozygous confirms mild iron accumulation tendency. Diet includes red meat 3-4x/week which may be contributing. Action items: (1) reduce red meat to 2x/week, (2) increase tea/coffee with meals to inhibit iron absorption, (3) schedule therapeutic phlebotomy consult, (4) target ferritin <150 ng/mL. Next draw March 15 will confirm trend.",
    tags: ["supplements", "lab_scheduled"],
    ai_summary: "Ferritin elevated 227 — HFE H63D driven. Dietary iron reduction and phlebotomy consult planned. Target <150.",
    created_at: "2026-02-20T00:00:00Z", updated_at: "2026-02-20T00:00:00Z",
  },
  {
    id: "demo-note-005", user_id: "demo-user-001", date: "2026-02-15",
    content: "ACTN3 TT genotype confirmed via Promethease raw data analysis — complete absence of alpha-actinin-3 in fast-twitch muscle fibers. This explains historical difficulty with low-rep heavy singles and better response to higher volume training. Switched bench programming from traditional 5x5 periodization to Sheiko-style higher volume (4x8, 4x6 working sets) with weekly heavy primer. Early results positive: bench moved from estimated 275 to 285 1RM over 6 weeks without testing a true max. Volume tolerance is noticeably high — recovery between sessions is adequate at 6x/week frequency.",
    tags: ["genomics", "training"],
    ai_summary: "ACTN3 TT confirmed. Shifted to high-volume Sheiko approach — bench 1RM improved 275 to 285 in 6 weeks.",
    created_at: "2026-02-15T00:00:00Z", updated_at: "2026-02-15T00:00:00Z",
  },
  {
    id: "demo-note-006", user_id: "demo-user-001", date: "2026-02-10",
    content: "Quarterly lab panel scheduled March 15 through Quest Diagnostics. Panel includes: CBC, CMP, lipid panel with LDL-P/Lp(a), homocysteine, ferritin/iron studies, thyroid (TSH/FT3/FT4), testosterone (total/free), fasting insulin, HbA1c, hs-CRP, 25(OH)D, B12/folate, magnesium RBC. Key things to watch: (1) ferritin trend — need to see it dropping toward 150, (2) homocysteine — methylation protocol should have it closer to 8, (3) LDL-P — still elevated despite good LDL-C, may need to discuss citrus bergamot or low-dose statin, (4) 25(OH)D — confirm maintenance above 60.",
    tags: ["lab_scheduled"],
    ai_summary: "March 15 Quest panel scheduled. Watching ferritin, homocysteine, LDL-P, and vitamin D trends.",
    created_at: "2026-02-10T00:00:00Z", updated_at: "2026-02-10T00:00:00Z",
  },
];

// ─── 10. Health Reports ─────────────────────────────────────────────────────

export const demoReports: HealthReport[] = [
  {
    id: "demo-report-001",
    user_id: "demo-user-001",
    title: "Comprehensive Health Integration Report — Q1 2026",
    report_type: "comprehensive",
    status: "current",
    summary: "Integrated analysis across genomic, blood biomarker, CGM, wearable, and training data. Four priority findings identified with actionable cross-references.",
    full_report: {
      executive_summary: "This report integrates genomic data (25 SNPs), two blood panels (Quest Jan 2026, SanoCardio Nov 2025), 14 days of CGM, 30 days of Garmin wearable data, and the current Sheiko-style training program. Overall health trajectory is positive with several optimization opportunities. Key areas: (1) Ferritin elevation driven by HFE H63D requires active management. (2) Overnight CGM hypoglycemic events correlate with FADS1 TT impaired fatty acid metabolism. (3) LDL particle count remains discordant with LDL-C suggesting small dense LDL predominance. (4) Methylation optimization via compound MTHFR support is showing measurable progress — homocysteine reduced to 9.3 over 4 months.",
      key_findings: [
        {
          title: "Elevated Ferritin — HFE H63D Iron Accumulation",
          severity: "high",
          description: "Ferritin increased from 198 to 227 ng/mL despite no iron supplementation. HFE H63D heterozygous confirms genetic predisposition. Sustained ferritin >200 increases oxidative stress risk compounded by SOD2 TT.",
          data_points: [
            "Ferritin: 198 (Nov 2025) -> 227 (Jan 2026)",
            "HFE C282Y: GG (clear) — rules out classical hemochromatosis",
            "HFE H63D: CG (heterozygous) — mild iron accumulation",
            "SOD2: TT (homozygous risk) — elevated ferritin compounds oxidative stress",
          ],
        },
        {
          title: "Overnight CGM Hypoglycemic Events — FADS1 Connection",
          severity: "medium",
          description: "Glucose dips to 53-58 mg/dL on 4-5 of 14 nights, clustering 1:00-3:30 AM. FADS1 TT may reduce overnight gluconeogenesis substrate from lipid sources. HbA1c 5.1% confirms non-pathological.",
          data_points: [
            "CGM: 6 low events (<54) over 14 days",
            "Time below 70: 8%, below 54: 2%",
            "FADS1: TT (homozygous risk)",
            "HbA1c: 5.1%, Fasting glucose: 82",
          ],
        },
        {
          title: "LDL Particle Discordance",
          severity: "medium",
          description: "LDL-C 88 mg/dL optimal but LDL-P 1438 nmol/L exceeds functional threshold of 1000. Discordance suggests small dense LDL predominance. Lp(a) 42 nmol/L adds modest additional risk. APOE E3/E3 is neutral.",
          data_points: [
            "LDL-C: 88 (optimal) vs LDL-P: 1438 (elevated)",
            "LDL-P trend: 1502 (Nov) -> 1438 (Jan)",
            "Lp(a): 42 nmol/L (borderline)",
            "TG/HDL ratio: 0.83 (excellent)",
          ],
        },
        {
          title: "Methylation Optimization — Compound MTHFR Response",
          severity: "low",
          description: "Homocysteine decreased from 10.1 to 9.3 with methylfolate + methylcobalamin. Compound MTHFR heterozygosity being adequately addressed. Target <8.",
          data_points: [
            "Homocysteine: 10.1 (Nov) -> 9.3 (Jan)",
            "MTHFR C677T: CT, A1298C: AC",
            "B12: 650 pg/mL (optimal with supplementation)",
          ],
        },
      ],
      data_source_analysis: {
        genomics: "25 SNPs across methylation, cardiovascular, detox, metabolism, inflammation, nutrient, sleep, fitness, and immune. Key homozygous risk: ACTN3 TT, FADS1 TT, SOD2 TT. Notable heterozygous: compound MTHFR, HFE H63D, dual DAO+HNMT histamine, CYP1A2, VDR Fok1.",
        bloodwork: "Two panels compared. Metabolic excellent (HbA1c 5.1%, insulin 3.2). Inflammatory low (hs-CRP 0.5). Three flagged: ferritin rising, LDL-P elevated, homocysteine borderline but improving.",
        cgm: "14-day sensor. Avg glucose 84, GMI 5.3%, CV 15.1%. Time in range 87%. Primary concern: overnight hypoglycemic events.",
        wearable: "30 days Garmin. Sleep avg 420 min, score 70-80. HRV 38-51. Resting HR 56-60. Training load productive.",
        training: "Week 7 of 14-week Sheiko bench hypertrophy. Bench 1RM 285. No axial loading. 6x/week frequency with excellent volume tolerance (ACTN3 TT).",
      },
      cross_references: [
        {
          genomic_marker: "HFE H63D (rs1799945 CG)",
          biomarker: "Ferritin 227 ng/mL",
          finding: "Heterozygous H63D confirms genetic iron accumulation. Ferritin rising despite no supplementation.",
          recommendation: "Therapeutic phlebotomy 1-2x. Reduce red meat to 2x/week. Tannin-rich beverages with meals. Target <150. Recheck March 15.",
        },
        {
          genomic_marker: "FADS1 (rs174547 TT)",
          biomarker: "CGM overnight lows 53-58 mg/dL",
          finding: "Impaired fatty acid desaturation may reduce lipid-derived gluconeogenesis substrates during overnight fasting.",
          recommendation: "Add slow-digesting carb + casein at dinner/bedtime. Continue EPA/DHA 3g. Rerun CGM after dietary change.",
        },
        {
          genomic_marker: "MTHFR C677T + A1298C (compound het)",
          biomarker: "Homocysteine 9.3 umol/L",
          finding: "Compound heterozygosity reduces methylation capacity ~40-50%. Homocysteine trending down but still above optimal.",
          recommendation: "Continue methylfolate 1mg + methylcobalamin 5000mcg. Consider adding riboflavin 25mg and TMG 500mg if not <8 by next panel.",
        },
      ],
      risk_assessment: [
        {
          area: "Iron Overload",
          level: "medium",
          description: "HFE H63D heterozygous with rising ferritin. Not hemochromatosis but requires active management.",
          mitigations: ["Therapeutic phlebotomy", "Dietary iron reduction", "Ferritin monitoring every 3 months"],
        },
        {
          area: "Cardiovascular — LDL-P",
          level: "medium",
          description: "Discordant LDL-P despite excellent metabolic markers.",
          mitigations: ["Consider citrus bergamot 500mg BID", "Increase EPA/DHA (already 3g)", "Discuss low-dose rosuvastatin if no improvement by Q2"],
        },
        {
          area: "Nocturnal Hypoglycemia",
          level: "low",
          description: "Physiological overnight lows — suboptimal for recovery and sleep quality.",
          mitigations: ["Bedtime slow-carb + casein", "Repeat CGM after dietary intervention"],
        },
      ],
      recommendations: [
        {
          category: "Lab / Monitoring",
          action: "Complete Quest panel March 15 with ferritin, homocysteine, LDL-P, and full metabolic panel.",
          rationale: "Confirm ferritin and homocysteine trend directions after 2 months of intervention.",
          priority: "high",
        },
        {
          category: "Supplementation",
          action: "Add riboflavin (B2) 25mg daily as MTHFR cofactor. Consider TMG 500mg if homocysteine remains >8.",
          rationale: "Riboflavin is a direct cofactor for MTHFR enzyme activity.",
          priority: "medium",
        },
        {
          category: "Nutrition",
          action: "Add slow-digesting carb + casein at dinner for overnight glucose. Reduce red meat to 2x/week for ferritin.",
          rationale: "Dual intervention targeting overnight glucose stability (FADS1 TT) and iron accumulation (HFE H63D).",
          priority: "medium",
        },
      ],
      follow_up_schedule: [
        {
          test: "Comprehensive blood panel (Quest)",
          rationale: "Track ferritin, homocysteine, LDL-P trends. Confirm methylation protocol efficacy.",
          timing: "March 15, 2026 (scheduled)",
        },
        {
          test: "14-day CGM cycle",
          rationale: "Re-evaluate overnight glucose patterns after dietary intervention.",
          timing: "April 2026 (after 4 weeks of dietary change)",
        },
      ],
    },
    data_sources: ["genomics", "bloodwork_quest_jan2026", "bloodwork_sanocardio_nov2025", "cgm_mar2026", "garmin_30day", "training_program"],
    generated_at: "2026-03-12T00:00:00Z",
    model_used: "claude-opus-4-6",
    created_at: "2026-03-12T00:00:00Z",
  },
  {
    id: "demo-report-002",
    user_id: "demo-user-001",
    title: "Genomic Risk Profile — Initial Analysis",
    report_type: "genomic",
    status: "superseded",
    summary: "Initial genomic analysis of 25 SNPs. Superseded by comprehensive report integrating all data sources.",
    full_report: {
      executive_summary: "Analysis of 25 genomic variants across 10 categories. Three homozygous risk variants (ACTN3, FADS1, SOD2) with significant implications for training, omega-3 supplementation, and antioxidant support. Compound MTHFR heterozygosity requires methylation support. Dual histamine clearance impairment (DAO + HNMT) has implications for peptide selection. HFE H63D requires ferritin monitoring.",
      key_findings: [
        {
          title: "Triple Homozygous Risk — ACTN3, FADS1, SOD2",
          severity: "high",
          description: "Three homozygous risk variants affecting fitness, metabolism, and detoxification. Each requires specific intervention.",
          data_points: [
            "ACTN3 TT — endurance fiber type, higher volume training",
            "FADS1 TT — impaired omega-3 conversion, direct EPA/DHA required",
            "SOD2 TT — reduced mitochondrial antioxidant, CoQ10 + vitamin E recommended",
          ],
        },
        {
          title: "Dual Histamine Clearance Impairment",
          severity: "medium",
          description: "Both DAO (extracellular) and HNMT (intracellular) histamine degradation pathways are heterozygous, creating compound impairment relevant to peptide therapy.",
          data_points: [
            "DAO rs10156191: CT (heterozygous)",
            "HNMT rs11558538: CT (heterozygous)",
          ],
        },
      ],
      data_source_analysis: {
        genomics: "25 SNPs from Promethease raw data. Comprehensive coverage of methylation, cardiovascular, detox, metabolism, inflammation, nutrient, sleep, fitness, and immune categories.",
      },
      cross_references: [],
      risk_assessment: [
        {
          area: "Oxidative Stress",
          level: "medium",
          description: "SOD2 TT + GSTP1 heterozygous creates dual-pathway oxidative stress vulnerability.",
          mitigations: ["CoQ10 200mg daily", "Mixed tocopherol vitamin E 400 IU", "Cruciferous vegetables for sulforaphane"],
        },
      ],
      recommendations: [
        {
          category: "Supplementation",
          action: "Implement methylation support: methylfolate 1mg, methylcobalamin 5000mcg, riboflavin 25mg daily.",
          rationale: "Compound MTHFR heterozygosity requires bypass of impaired folate metabolism.",
          priority: "high",
        },
        {
          category: "Training",
          action: "Switch to high-volume training methodology. Favor 6-12 rep ranges.",
          rationale: "ACTN3 TT genotype = endurance fiber composition. Higher volume yields better adaptations.",
          priority: "high",
        },
        {
          category: "Peptides",
          action: "Avoid GHRP-6 and CJC-1295 due to histamine liberation risk. Use Ipamorelin if desired.",
          rationale: "Dual DAO/HNMT heterozygosity creates histamine intolerance risk with histamine-liberating peptides.",
          priority: "medium",
        },
      ],
      follow_up_schedule: [
        {
          test: "Comprehensive blood panel",
          rationale: "Establish biomarker baselines to correlate with genomic findings.",
          timing: "Within 30 days",
        },
      ],
    },
    data_sources: ["genomics"],
    generated_at: "2026-02-01T00:00:00Z",
    model_used: "claude-opus-4-6",
    created_at: "2026-02-01T00:00:00Z",
  },
];
