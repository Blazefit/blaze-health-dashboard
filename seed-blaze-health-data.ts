/**
 * Blaze Health Dashboard — Real Data Seed Script
 * 
 * Run this with: npx tsx seed-blaze-health-data.ts
 * 
 * This script populates the Supabase database with Jason Anderson's actual health data
 * compiled from genomic analysis, blood work, CGM readings, training programs,
 * supplement protocols, and clinical notes.
 * 
 * Prerequisites:
 * - Supabase project running with all migrations applied
 * - .env file with NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
 * - A profile record already exists (created via Clerk sign-up)
 * 
 * Usage:
 *   1. Place this file in your project root
 *   2. Run: npx tsx seed-blaze-health-data.ts
 *   3. Or give this entire file to Claude Code and say "run this seed script to populate my database"
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Service role bypasses RLS for seeding
);

// ============================================================
// HELPER: Get or create the user profile
// ============================================================
async function getOrCreateProfile() {
  // Try to find existing profile
  const { data: existing } = await supabase
    .from('profiles')
    .select('id')
    .limit(1)
    .single();

  if (existing) return existing.id;

  // Create profile if none exists
  const { data: profile, error } = await supabase
    .from('profiles')
    .insert({
      clerk_id: 'seed_user_jason',
      full_name: 'Jason Anderson',
      email: 'jason@crossfitblaze.com',
      date_of_birth: '1987-08-01',
      sex: 'male',
      blood_type: 'A Rh-',
      height_inches: 72,
      weight_lbs: 184,
      preferences: {
        units: 'imperial',
        timezone: 'America/New_York',
        functional_ranges: true
      }
    })
    .select('id')
    .single();

  if (error) throw new Error(`Failed to create profile: ${error.message}`);
  return profile!.id;
}

// ============================================================
// 1. GENOMIC SNP DATA
// All genotypes verified from AncestryDNA V2.0 + Promethease
// ============================================================
const genomicSnps = [
  // === METHYLATION ===
  { rsid: 'rs1801133', gene_name: 'MTHFR', variant_name: 'C677T', chromosome: '1', genotype: 'GG', category: 'methylation', risk_level: 'clear', risk_allele: 'T', clinical_significance: 'Major methylation enzyme. GG = full enzyme activity. This is a genetic strength.', actionable_note: 'No action needed. MTHFR C677T is clear.' },
  { rsid: 'rs1801131', gene_name: 'MTHFR', variant_name: 'A1298C', chromosome: '1', genotype: 'GT', category: 'methylation', risk_level: 'heterozygous', risk_allele: 'G', clinical_significance: 'Second MTHFR variant. Heterozygous reduces activity ~15-20%. Compound effect with other methylation variants.', actionable_note: 'Mild impact alone but contributes to methylation cascade burden.' },
  { rsid: 'rs1801394', gene_name: 'MTRR', variant_name: 'A66G', chromosome: '5', genotype: 'AG', category: 'methylation', risk_level: 'heterozygous', risk_allele: 'G', clinical_significance: 'Methionine synthase reductase. Heterozygous impairs B12 recycling in methylation cycle.', actionable_note: 'Contributes to methylation bottleneck. Methylcobalamin preferred over cyanocobalamin.' },
  { rsid: 'rs1805087', gene_name: 'MTR', variant_name: 'A2756G', chromosome: '1', genotype: 'AG', category: 'methylation', risk_level: 'heterozygous', risk_allele: 'G', clinical_significance: 'Methionine synthase. Heterozygous affects homocysteine-to-methionine conversion.', actionable_note: 'Part of the methylation cascade. Confirmed by homocysteine 9.3 (above functional optimal <8).' },
  { rsid: 'rs234706', gene_name: 'CBS', variant_name: 'C699T', chromosome: '21', genotype: 'CC', category: 'methylation', risk_level: 'clear', clinical_significance: 'Cystathionine beta-synthase. CC = normal transsulfuration pathway.', actionable_note: 'CBS primary variant is clear.' },
  { rsid: 'rs2236225', gene_name: 'MTHFD1', variant_name: 'G1958A', chromosome: '14', genotype: 'AA', category: 'methylation', risk_level: 'homozygous_risk', risk_allele: 'A', clinical_significance: 'Methylenetetrahydrofolate dehydrogenase. Homozygous AA = significant folate cycle impairment. This is the PRIMARY methylation bottleneck.', actionable_note: 'Key finding: MTHFD1 AA is the main driver of elevated homocysteine (9.3). Methylfolate supplementation indicated. Issue is folate-side, NOT B12-side (MMA 98 = adequate B12 utilization).' },
  { rsid: 'rs1051266', gene_name: 'SLC19A1', variant_name: 'RFC1 80A>G', chromosome: '21', genotype: 'AG', category: 'methylation', risk_level: 'heterozygous', risk_allele: 'A', clinical_significance: 'Reduced folate carrier. Heterozygous may slightly reduce cellular folate transport.', actionable_note: 'Mild contributor to folate utilization. Supports methylfolate over folic acid.' },

  // === CARDIOVASCULAR ===
  { rsid: 'rs5186', gene_name: 'AGTR1', variant_name: 'A1166C', chromosome: '3', genotype: 'CC', category: 'cardiovascular', risk_level: 'homozygous_risk', risk_allele: 'C', clinical_significance: 'Angiotensin II receptor type 1. Homozygous CC = elevated cardiovascular and renal risk. HOWEVER: not expressing as hypertension — BP is normal to slightly low.', actionable_note: 'PRIMARY cardiovascular risk gene. CV risk is particle-mediated (LDL-P 1438, Small LDL 253) not BP-mediated. Monitor LDL-P, renal function (creatinine 1.28/eGFR 73). Omega-3 supplementation critical.' },
  { rsid: 'rs429358', gene_name: 'APOE', variant_name: 'E4 marker', chromosome: '19', genotype: 'TT', category: 'cardiovascular', risk_level: 'clear', clinical_significance: 'APOE E4 allele marker. TT = no E4 alleles. Combined with rs7412 CC, indicates E3/E3 (neutral risk).', actionable_note: 'APOE E3/E3 confirmed via proxy markers. Neutral Alzheimer/CV risk from APOE.' },
  { rsid: 'rs7412', gene_name: 'APOE', variant_name: 'E2 marker', chromosome: '19', genotype: 'CC', category: 'cardiovascular', risk_level: 'clear', clinical_significance: 'APOE E2 allele marker. CC = no E2 alleles. Combined with rs429358 TT, confirms E3/E3.', actionable_note: 'See APOE haplotype note above.' },

  // === DETOX & GLUTATHIONE ===
  { rsid: 'rs4680', gene_name: 'COMT', variant_name: 'Val158Met', chromosome: '22', genotype: 'AG', category: 'detox', risk_level: 'heterozygous', risk_allele: 'A', clinical_significance: 'Catechol-O-methyltransferase. AG = intermediate activity (Val/Met). Balanced dopamine/norepinephrine clearance. Neither warrior nor worrier extreme.', actionable_note: 'Moderate catecholamine metabolism. Adaptogens and stress management beneficial but not urgent. Tolerable for stimulants in moderation.' },
  { rsid: 'rs1695', gene_name: 'GSTP1', variant_name: 'I105V', chromosome: '11', genotype: 'AA', category: 'detox', risk_level: 'clear', clinical_significance: 'Phase II glutathione conjugation. AA = normal enzyme activity.', actionable_note: 'Phase II detox intact.' },
  { rsid: 'rs1800566', gene_name: 'NQO1', variant_name: '*2 Pro187Ser', chromosome: '16', genotype: 'AG', category: 'detox', risk_level: 'heterozygous', risk_allele: 'T', clinical_significance: 'NAD(P)H quinone dehydrogenase 1. Heterozygous mildly reduces quinone detox capacity.', actionable_note: 'Mild impact. V3 report grouped as clear but heterozygous carrier.' },
  { rsid: 'rs762551', gene_name: 'CYP1A2', variant_name: '*1F', chromosome: '15', genotype: 'AA', category: 'detox', risk_level: 'clear', clinical_significance: 'Cytochrome P450 1A2. AA = fast caffeine metabolizer. Processes caffeine rapidly.', actionable_note: 'Fast caffeine metabolism. Coffee is well-tolerated and may be cardioprotective for this genotype.' },
  { rsid: 'rs4880', gene_name: 'SOD2', variant_name: 'A16V', chromosome: '6', genotype: 'AA', category: 'detox', risk_level: 'clear', clinical_significance: 'Superoxide dismutase 2. AA = normal mitochondrial antioxidant defense.', actionable_note: 'Mitochondrial SOD2 is intact.' },
  // GGT1 — not a standard rsID but confirmed homozygous from analysis
  { rsid: 'GGT1_homo', gene_name: 'GGT1', variant_name: 'A>G', chromosome: '22', genotype: 'GG', category: 'detox', risk_level: 'homozygous_risk', risk_allele: 'G', clinical_significance: 'Gamma-glutamyltransferase 1. Homozygous GG = impaired glutathione recycling. Serum GGT 16 U/L (very low) is consistent with reduced enzyme activity.', actionable_note: 'Glutathione recycling impaired. NAC or liposomal glutathione supplementation indicated. Compounded by elevated ferritin (oxidative stress) and AGTR1 CC (cardiovascular load).' },

  // === METABOLISM ===
  { rsid: 'rs174547', gene_name: 'FADS1', variant_name: 'C>T', chromosome: '11', genotype: 'TT', category: 'metabolism', risk_level: 'homozygous_risk', risk_allele: 'T', clinical_significance: 'Fatty acid desaturase 1. Homozygous TT = CANNOT convert plant ALA to EPA/DHA. OmegaCheck confirms: 3% (HIGH RISK, optimal >5.5%), EPA 0.3%, omega-6:omega-3 ratio 10.3:1.', actionable_note: 'CRITICAL FINDING: Must consume preformed EPA/DHA (fish oil or algal oil). Plant omega-3 sources (flax, chia, walnuts) are useless for this genotype. Target 2-4g EPA+DHA daily. This is the single most actionable finding.' },
  { rsid: 'rs9939609', gene_name: 'FTO', variant_name: 'T>A', chromosome: '16', genotype: 'AT', category: 'metabolism', risk_level: 'heterozygous', risk_allele: 'A', clinical_significance: 'Fat mass and obesity associated gene. Heterozygous = moderate obesity predisposition. Currently lean (184 lb / 6\'0") so well-managed.', actionable_note: 'One copy of risk allele. Currently lean — high activity level and diet are overriding the genetic tendency. Continue strength training and protein-forward eating.' },
  { rsid: 'rs1801282', gene_name: 'PPARG', variant_name: 'Pro12Ala', chromosome: '3', genotype: 'CC', category: 'metabolism', risk_level: 'clear', clinical_significance: 'Peroxisome proliferator-activated receptor gamma. CC = normal insulin signaling and fat cell differentiation.', actionable_note: 'Normal insulin sensitivity genetics. Confirmed by ultra-low fasting insulin (1.2 uIU/mL).' },
  { rsid: 'rs4988235', gene_name: 'MCM6/LCT', variant_name: '-13910C>T', chromosome: '2', genotype: 'CT', category: 'metabolism', risk_level: 'clear', clinical_significance: 'Lactase persistence. CT = lactase persistent (can digest dairy). European variant.', actionable_note: 'Dairy tolerance confirmed genetically.' },

  // === NUTRIENT ABSORPTION ===
  { rsid: 'rs2228570', gene_name: 'VDR', variant_name: 'FokI', chromosome: '12', genotype: 'CT', category: 'nutrient', risk_level: 'heterozygous', risk_allele: 'T', clinical_significance: 'Vitamin D receptor FokI variant. Heterozygous may slightly reduce VDR efficiency.', actionable_note: 'See VDR TaqI below — the TaqI variant is the more significant one.' },
  { rsid: 'rs731236', gene_name: 'VDR', variant_name: 'TaqI', chromosome: '12', genotype: 'AA', category: 'nutrient', risk_level: 'homozygous_risk', risk_allele: 'A', clinical_significance: 'Vitamin D receptor TaqI. Homozygous AA = impaired VDR function. Requires higher 25(OH)D levels (60-80 ng/mL) for equivalent biological effect. Current level 38-40 ng/mL is FUNCTIONALLY DEFICIENT despite appearing "sufficient" by standard ranges.', actionable_note: 'D3 10,000 IU + K2 MK-7 200 mcg daily with fattiest meal. Retest 25(OH)D at 8 weeks targeting 60-80 ng/mL. Micro Ingredients D3+K2 softgel identified as top pick.' },
  { rsid: 'rs1544410', gene_name: 'VDR', variant_name: 'BsmI', chromosome: '12', genotype: 'CC', category: 'nutrient', risk_level: 'clear', clinical_significance: 'VDR BsmI variant. CC = normal.', actionable_note: 'This VDR variant is clear.' },
  { rsid: 'rs1800562', gene_name: 'HFE', variant_name: 'C282Y', chromosome: '6', genotype: 'GG', category: 'nutrient', risk_level: 'clear', clinical_significance: 'Hemochromatosis gene primary variant. GG = no hemochromatosis risk. Ferritin elevation (227) is dietary (high ribeye intake), not genetic iron overload.', actionable_note: 'HFE clear. Ferritin 227 is from dietary iron. Blood donation 2-3x/year to bring to 100-150.' },
  { rsid: 'rs1799945', gene_name: 'HFE', variant_name: 'H63D', chromosome: '6', genotype: 'CC', category: 'nutrient', risk_level: 'clear', clinical_significance: 'HFE secondary variant. CC = clear.', actionable_note: 'Both HFE variants clear.' },
  { rsid: 'rs602662', gene_name: 'FUT2', variant_name: 'Secretor', chromosome: '19', genotype: 'AG', category: 'nutrient', risk_level: 'heterozygous', risk_allele: 'A', clinical_significance: 'Fucosyltransferase 2. Heterozygous secretor status. Affects gut microbiome composition and B12 absorption.', actionable_note: 'Heterozygous FUT2 may reduce some nutrient absorption. B12 status adequate per MMA but worth monitoring.' },

  // === INFLAMMATION ===
  { rsid: 'rs1800629', gene_name: 'TNF-alpha', variant_name: 'G-308A', chromosome: '6', genotype: 'AG', category: 'inflammation', risk_level: 'heterozygous', risk_allele: 'A', clinical_significance: 'Tumor necrosis factor alpha. Heterozygous = elevated TNF-alpha expression, pro-inflammatory tendency. Baseline hs-CRP 0.5 (good), post half-marathon 2.1.', actionable_note: 'Baseline inflammation controlled. Exercise transiently elevates. Anti-inflammatory diet and omega-3 supplementation important.' },
  { rsid: 'rs1800795', gene_name: 'IL-6', variant_name: '-174G>C', chromosome: '7', genotype: 'CG', category: 'inflammation', risk_level: 'heterozygous', risk_allele: 'C', clinical_significance: 'Interleukin-6. Heterozygous alters IL-6 response and inflammation modulation.', actionable_note: 'Combined TNF-alpha het + IL-6 het = moderate genetic inflammatory tendency. Managed well with current lifestyle.' },
  { rsid: 'rs1800896', gene_name: 'IL-10', variant_name: '-1082A>G', chromosome: '1', genotype: 'TC', category: 'inflammation', risk_level: 'clear', clinical_significance: 'Interleukin-10. Anti-inflammatory cytokine production appears intact.', actionable_note: 'IL-10 anti-inflammatory capacity is normal. Good counterbalance to TNF/IL-6 heterozygous states.' },

  // === SLEEP & CIRCADIAN ===
  { rsid: 'rs1801260', gene_name: 'CLOCK', variant_name: '3111T>C', chromosome: '4', genotype: 'TT', category: 'sleep', risk_level: 'clear', clinical_significance: 'CLOCK gene. TT = normal circadian rhythm genetics. Night waking is NOT circadian disruption.', actionable_note: 'CLOCK is normal. Night waking confirmed via CGM as counter-regulatory hormone surges from nocturnal hypoglycemia, not circadian disruption.' },
  { rsid: 'rs6265', gene_name: 'BDNF', variant_name: 'Val66Met', chromosome: '11', genotype: 'CC', category: 'sleep', risk_level: 'clear', clinical_significance: 'Brain-derived neurotrophic factor. CC (Val/Val) = normal BDNF secretion and neuroplasticity.', actionable_note: 'BDNF is intact. Exercise-induced BDNF upregulation is maximally effective.' },
  { rsid: 'rs1800544', gene_name: 'ADRA2A', variant_name: '-1291C>G', chromosome: '10', genotype: 'CC', category: 'sleep', risk_level: 'clear', clinical_significance: 'Alpha-2A adrenergic receptor. CC = normal adrenergic signaling.', actionable_note: 'Adrenergic system genetics are normal.' },

  // === FITNESS ===
  { rsid: 'rs1815739', gene_name: 'ACTN3', variant_name: 'R577X', chromosome: '11', genotype: 'TT', category: 'fitness', risk_level: 'homozygous_risk', risk_allele: 'T', clinical_significance: 'Alpha-actinin-3. Homozygous TT (XX) = complete absence of fast-twitch muscle fiber protein. Endurance fiber dominant. Matches half-marathon athletic history. Promethease MAG 2.2.', actionable_note: 'Endurance genetics confirmed. For HYPERTROPHY goals: higher training volume is indicated (more sets, more reps) because fast-twitch recruitment is limited. Heavy primer sets (80-85%) once/week maintain CNS adaptation. Recovery is the bottleneck, not performance.' },
  { rsid: 'rs2802292', gene_name: 'FOXO3', variant_name: 'C>T', chromosome: '6', genotype: 'GT', category: 'fitness', risk_level: 'heterozygous', risk_allele: 'T', clinical_significance: 'Forkhead box O3. Heterozygous for the longevity-associated T allele. Associated with extended lifespan and stress resistance.', actionable_note: 'One copy of the longevity allele. Favorable for long-term health outlook.' },

  // === THYROID (from Promethease cross-reference) ===
  { rsid: 'rs965513', gene_name: 'FOXE1', variant_name: 'Thyroid', chromosome: '9', genotype: 'AA', category: 'metabolism', risk_level: 'homozygous_risk', risk_allele: 'A', clinical_significance: 'FOXE1 forkhead transcription factor. Homozygous AA = impaired thyroid development/function and connective tissue vulnerability. Confirmed by: Free T3 2.44 (below functional range 3.4+), anodontia (complete tooth loss = connective tissue phenotype).', actionable_note: 'Thyroid conversion issue, not autoimmune (TPO <1, TgAb <1). Free T3 optimization needed. T3 Rx discussion with provider indicated.' },

  // === IMMUNE / HISTAMINE ===
  // Note: DAO and HNMT were NOT on the Ancestry chip, but histamine clearance impairment
  // was FUNCTIONALLY confirmed by CJC-1295 reaction
  { rsid: 'DAO_functional', gene_name: 'DAO', variant_name: 'Functional test', chromosome: 'N/A', genotype: 'N/A', category: 'immune', risk_level: 'homozygous_risk', risk_allele: 'N/A', clinical_significance: 'Diamine oxidase. NOT on Ancestry chip but impaired histamine clearance FUNCTIONALLY CONFIRMED by adverse reaction to CJC-1295 (histamine-releasing peptide).', actionable_note: 'CJC-1295 is CONTRAINDICATED. Ipamorelin only for GHRP. Consider DAO supplementation with histamine-rich foods.' },
];

// ============================================================
// 2. BLOOD WORK DATA
// Quest Diagnostics Jan 22, 2026 + SanoCardio Nov 20, 2025
// ============================================================
const biomarkers = [
  // === LIPIDS (Quest Jan 2026) ===
  { date: '2026-01-22', marker_name: 'Total Cholesterol', value: 163, unit: 'mg/dL', ref_low: 100, ref_high: 199, optimal_low: 120, optimal_high: 200, status: 'optimal', category: 'lipid', source: 'quest' },
  { date: '2026-01-22', marker_name: 'LDL-C', value: 88, unit: 'mg/dL', ref_low: 0, ref_high: 99, optimal_low: 0, optimal_high: 100, status: 'optimal', category: 'lipid', source: 'quest' },
  { date: '2026-01-22', marker_name: 'HDL', value: 60, unit: 'mg/dL', ref_low: 40, ref_high: 999, optimal_low: 50, optimal_high: 100, status: 'optimal', category: 'lipid', source: 'quest' },
  { date: '2026-01-22', marker_name: 'Triglycerides', value: 50, unit: 'mg/dL', ref_low: 0, ref_high: 149, optimal_low: 0, optimal_high: 100, status: 'optimal', category: 'lipid', source: 'quest' },
  { date: '2026-01-22', marker_name: 'VLDL', value: 10, unit: 'mg/dL', ref_low: 5, ref_high: 40, optimal_low: 5, optimal_high: 30, status: 'optimal', category: 'lipid', source: 'quest' },

  // === ADVANCED LIPIDS (SanoCardio Nov 2025) ===
  { date: '2025-11-20', marker_name: 'LDL-P', value: 1438, unit: 'nmol/L', ref_low: 0, ref_high: 1299, optimal_low: 0, optimal_high: 1000, status: 'flagged', category: 'lipid_advanced', source: 'sanocardio', notes: 'Atherogenic particle pattern despite normal standard lipids. AGTR1 CC + FADS1 TT driving this.' },
  { date: '2025-11-20', marker_name: 'Small LDL-P', value: 253, unit: 'nmol/L', ref_low: 0, ref_high: 149, optimal_low: 0, optimal_high: 100, status: 'flagged', category: 'lipid_advanced', source: 'sanocardio' },
  { date: '2025-11-20', marker_name: 'LDL Peak Size', value: 219.3, unit: 'Å', ref_low: 220, ref_high: 285, optimal_low: 225, optimal_high: 285, status: 'flagged', category: 'lipid_advanced', source: 'sanocardio', notes: 'Below 220 = Pattern B (small dense). Omega-3 deficit is primary driver.' },

  // === METABOLIC (Quest Jan 2026) ===
  { date: '2026-01-22', marker_name: 'Fasting Glucose', value: 70, unit: 'mg/dL', ref_low: 65, ref_high: 99, optimal_low: 75, optimal_high: 90, status: 'borderline', category: 'metabolic', source: 'quest', notes: 'Low end. Consistent with CGM pattern of hypoglycemia.' },
  { date: '2026-01-22', marker_name: 'Fasting Insulin', value: 1.2, unit: 'uIU/mL', ref_low: 2.6, ref_high: 24.9, optimal_low: 2, optimal_high: 5, status: 'borderline', category: 'metabolic', source: 'quest', notes: 'Ultra-low insulin. Extreme insulin sensitivity. Contributes to hypoglycemia pattern.' },
  { date: '2026-01-22', marker_name: 'HbA1c', value: 5.3, unit: '%', ref_low: 4.0, ref_high: 5.6, optimal_low: 4.5, optimal_high: 5.3, status: 'optimal', category: 'metabolic', source: 'quest' },
  { date: '2026-01-22', marker_name: 'Leptin', value: 0.4, unit: 'ng/mL', ref_low: 2.0, ref_high: 5.6, optimal_low: 2.0, optimal_high: 10, status: 'flagged', category: 'metabolic', source: 'quest', notes: 'Extremely lean. Ultra-low leptin + low insulin = minimal glycogen reserve buffer, driving nocturnal hypoglycemia.' },

  // === INFLAMMATORY (Quest Jan 2026) ===
  { date: '2026-01-22', marker_name: 'Ferritin', value: 227, unit: 'ng/mL', ref_low: 30, ref_high: 400, optimal_low: 50, optimal_high: 150, status: 'flagged', category: 'inflammatory', source: 'quest', notes: 'HFE clear — not hemochromatosis. Dietary iron from daily ribeye. Donate blood 2-3x/year to reduce. Independent CV risk factor compounded by GGT1 glutathione recycling issue.' },
  { date: '2026-01-22', marker_name: 'Homocysteine', value: 9.3, unit: 'umol/L', ref_low: 0, ref_high: 13.5, optimal_low: 0, optimal_high: 8, status: 'borderline', category: 'inflammatory', source: 'quest', notes: 'Above functional optimal (<8). Confirms MTHFD1 AA + MTRR/MTR/MTHFR A1298C methylation cascade bottleneck. Folate-side issue, not B12.' },
  { date: '2026-01-22', marker_name: 'hs-CRP', value: 0.5, unit: 'mg/L', ref_low: 0, ref_high: 3.0, optimal_low: 0, optimal_high: 1.0, status: 'optimal', category: 'inflammatory', source: 'quest', notes: 'Baseline inflammation well-controlled. Post half-marathon was 2.1 (transient).' },
  { date: '2026-01-22', marker_name: 'MMA', value: 98, unit: 'nmol/L', ref_low: 0, ref_high: 378, optimal_low: 0, optimal_high: 270, status: 'optimal', category: 'inflammatory', source: 'quest', notes: 'Methylmalonic acid. Normal = adequate B12 utilization. Ribeye consumption supplying sufficient B12.' },

  // === RENAL (Quest Jan 2026) ===
  { date: '2026-01-22', marker_name: 'Creatinine', value: 1.28, unit: 'mg/dL', ref_low: 0.7, ref_high: 1.33, optimal_low: 0.7, optimal_high: 1.2, status: 'borderline', category: 'renal', source: 'quest', notes: 'High end likely from muscle mass + high protein diet rather than kidney disease. Track longitudinally given AGTR1 CC affecting renal blood flow.' },
  { date: '2026-01-22', marker_name: 'eGFR', value: 73, unit: 'mL/min/1.73m2', ref_low: 60, ref_high: 999, optimal_low: 90, optimal_high: 120, status: 'borderline', category: 'renal', source: 'quest', notes: 'Slightly below optimal. Likely creatinine-driven artifact from high muscle mass. Cystatin C-based eGFR would be more accurate.' },
  { date: '2026-01-22', marker_name: 'BUN', value: 18, unit: 'mg/dL', ref_low: 6, ref_high: 20, optimal_low: 10, optimal_high: 16, status: 'normal', category: 'renal', source: 'quest' },

  // === HEPATIC (Quest Jan 2026) ===
  { date: '2026-01-22', marker_name: 'Bilirubin Total', value: 1.4, unit: 'mg/dL', ref_low: 0.1, ref_high: 1.2, optimal_low: 0.1, optimal_high: 1.2, status: 'borderline', category: 'hepatic', source: 'quest', notes: 'Likely Gilbert syndrome (benign UGT1A1 variant). Mildly elevated unconjugated bilirubin. Actually slightly cardioprotective (bilirubin is an antioxidant).' },
  { date: '2026-01-22', marker_name: 'GGT', value: 16, unit: 'U/L', ref_low: 0, ref_high: 65, optimal_low: 10, optimal_high: 30, status: 'optimal', category: 'hepatic', source: 'quest', notes: 'Very low. Consistent with GGT1 homozygous variant (reduced enzyme activity).' },
  { date: '2026-01-22', marker_name: 'ALT', value: 22, unit: 'U/L', ref_low: 0, ref_high: 44, optimal_low: 10, optimal_high: 26, status: 'optimal', category: 'hepatic', source: 'quest' },
  { date: '2026-01-22', marker_name: 'AST', value: 28, unit: 'U/L', ref_low: 0, ref_high: 40, optimal_low: 10, optimal_high: 26, status: 'normal', category: 'hepatic', source: 'quest' },

  // === THYROID (Quest Jan 2026 + SanoCardio Nov 2025) ===
  { date: '2026-01-22', marker_name: 'TSH', value: 2.12, unit: 'mIU/L', ref_low: 0.45, ref_high: 4.5, optimal_low: 1.0, optimal_high: 2.0, status: 'normal', category: 'thyroid', source: 'quest' },
  { date: '2026-01-22', marker_name: 'Free T3', value: 3.2, unit: 'pg/mL', ref_low: 2.0, ref_high: 4.4, optimal_low: 3.0, optimal_high: 4.0, status: 'normal', category: 'thyroid', source: 'quest' },
  { date: '2025-11-20', marker_name: 'Free T3', value: 2.44, unit: 'pg/mL', ref_low: 2.0, ref_high: 4.4, optimal_low: 3.0, optimal_high: 4.0, status: 'flagged', category: 'thyroid', source: 'sanocardio', notes: 'Below functional range (3.4+). FOXE1 AA thyroid conversion issue, NOT autoimmune (TPO <1, TgAb <1).' },
  { date: '2026-01-22', marker_name: 'Free T4', value: 1.3, unit: 'ng/dL', ref_low: 0.82, ref_high: 1.77, optimal_low: 1.1, optimal_high: 1.8, status: 'optimal', category: 'thyroid', source: 'quest' },
  { date: '2026-01-22', marker_name: 'TPO Antibodies', value: 0.5, unit: 'IU/mL', ref_low: 0, ref_high: 9, status: 'optimal', category: 'thyroid', source: 'quest', notes: '<1 = no autoimmune thyroid disease.' },

  // === HORMONAL (Quest Jan 2026, using known consistent value) ===
  { date: '2026-01-22', marker_name: 'Testosterone Total', value: 730, unit: 'ng/dL', ref_low: 264, ref_high: 916, optimal_low: 600, optimal_high: 900, status: 'optimal', category: 'hormonal', source: 'quest', notes: 'Consistent across multiple tests (~730). Lab draw post half-marathon was lower (transient).' },

  // === OMEGA-3 (SanoCardio Nov 2025) ===
  { date: '2025-11-20', marker_name: 'OmegaCheck', value: 3.0, unit: '%', ref_low: 5.5, ref_high: 999, optimal_low: 5.5, optimal_high: 12, status: 'flagged', category: 'nutritional', source: 'sanocardio', notes: 'HIGH RISK. Confirms FADS1 TT — cannot convert plant omega-3. EPA 0.3%, DPA 0.6%. Omega-6:Omega-3 ratio 10.3:1.' },
  { date: '2025-11-20', marker_name: 'Vitamin D 25(OH)', value: 40, unit: 'ng/mL', ref_low: 30, ref_high: 100, optimal_low: 60, optimal_high: 80, status: 'borderline', category: 'nutritional', source: 'sanocardio', notes: 'Standard lab says "sufficient" but VDR TaqI AA requires 60-80 for equivalent biological effect. Functionally deficient.' },
];

// ============================================================
// 3. CGM SUMMARY DATA
// FreeStyle Libre 3, Feb 24 - Mar 9, 2026
// ============================================================
const cgmSummary = {
  period_start: '2026-02-24',
  period_end: '2026-03-09',
  avg_glucose: 84,
  gmi: 5.3,
  cv: 15.1,
  time_in_range_pct: 87,
  time_below_70_pct: 8,
  time_below_54_pct: 2,
  time_above_180_pct: 0,
  low_event_count: 29,
};

// ============================================================
// 4. TRAINING PROGRAM
// Sheiko Hypertrophy Bench (14 weeks), currently Week 7
// ============================================================
const trainingProgram = {
  name: 'Sheiko Hypertrophy Bench — 14 Week',
  description: 'Converted Sheiko Bench Press Only program targeting 8-15 reps with heavy primer on Wed. 6 days/week: Mon/Wed/Fri bench + squat, Tue/Thu/Sat accessories. Wed includes 80-85% primer for CNS adaptation.',
  duration_weeks: 14,
  current_week: 7,
  status: 'active',
  ai_generated: false,
  config: {
    bench_1rm: 205,
    squat_1rm: 140,
    rounding: 5,
    constraints: ['no_axial_loading', 'no_barbell_back_squat', 'no_deadlift'],
    acceptable_substitutes: ['goblet_squat', 'bulgarian_split_squat', 'ghr', 'hip_thrust', 'leg_press', 'belt_squat', 'walking_lunge'],
    genomic_notes: 'ACTN3 TT = endurance fiber dominant. Higher volume indicated for hypertrophy. Fast-twitch recruitment limited, so more total sets needed. Recovery is the bottleneck (BPC-157/TB-500 in protocol).',
    wednesday_primer: { percentage_range: [80, 85], rep_range: [3, 5], sets: 2, purpose: 'CNS adaptation to heavy loads while keeping bulk of work in hypertrophy range' },
    thursday_movements: ['goblet_squat', 'bulgarian_split_squat', 'ghr', 'hip_thrust', 'calf_raise', 'walking_lunge'],
  },
  program_data: {
    note: 'Full 14-week program data. Each week has 6 days. See the exported Sheiko_Hypertrophy_Program.xlsx for complete sets/reps/percentages.',
    week_7_sample: {
      monday: {
        label: 'Sheiko Bench + Squat',
        exercises: [
          { name: 'Bench Press', sets: '40%x10, 50%x8, 60%x8x3, 65%x8x3', notes: 'Primary hypertrophy day' },
          { name: 'Squat (Goblet)', sets: '55%x8x5', notes: 'Use 140 lb 1RM for %' },
          { name: 'Chest Flys', sets: '3x12' },
          { name: 'Back (Rows)', sets: '4x10' },
        ]
      },
      tuesday: {
        label: 'Arms & Delts',
        exercises: [
          { name: 'Lateral Raises', sets: '4x15' },
          { name: 'Hammer Curls', sets: '4x12' },
          { name: 'Overhead Tri Extension', sets: '4x12' },
          { name: 'Face Pulls', sets: '4x15' },
          { name: 'Rear Delt Flys', sets: '3x15' },
        ]
      },
      wednesday: {
        label: 'Heavy Primer + Bench Hypertrophy',
        exercises: [
          { name: 'Bench Press (Heavy Primer)', sets: '80%x3x2', notes: '165 lb — CNS adaptation, NOT to failure' },
          { name: 'Bench Press (Hypertrophy)', sets: '55%x8, 65%x8x2, 70%x8x3, 65%x10x2', notes: 'Main volume work' },
          { name: 'Squat (Goblet)', sets: '60%x8x5', notes: '85 lb goblet squats' },
          { name: 'Board Press', sets: '3x8' },
          { name: 'Back (Rows)', sets: '4x10' },
          { name: 'Good Mornings', sets: '5x10' },
        ]
      },
      thursday: {
        label: 'Lower Body (No Axial Loading)',
        exercises: [
          { name: 'Goblet Squats', sets: '4x12' },
          { name: 'Bulgarian Split Squats', sets: '3x10 each' },
          { name: 'GHR (Glute Ham Raise)', sets: '4x10' },
          { name: 'Hip Thrusts', sets: '4x12' },
          { name: 'Walking Lunges', sets: '3x12 each' },
          { name: 'Calf Raises', sets: '4x15' },
        ]
      },
      friday: {
        label: 'Sheiko Bench + Squat',
        exercises: [
          { name: 'Bench Press', sets: '40%x10, 50%x8, 55%x8x2, 65%x8x2, 60%x10x2' },
          { name: 'Squat (Goblet)', sets: '55%x8x4' },
          { name: 'Board Press', sets: '3x8' },
          { name: 'Back (Rows)', sets: '4x10' },
        ]
      },
      saturday: {
        label: 'Upper Back',
        exercises: [
          { name: 'Pull-ups', sets: '4x8' },
          { name: 'Pendlay Rows', sets: '4x10' },
          { name: 'Face Pulls', sets: '4x15' },
          { name: 'Rear Delt Flys', sets: '3x15' },
          { name: 'Shrugs', sets: '3x12' },
        ]
      }
    }
  }
};

// ============================================================
// 5. SUPPLEMENT PROTOCOL
// ============================================================
const supplementProtocol = {
  name: 'Genomic-Targeted Protocol — March 2026',
  is_active: true,
  start_date: '2026-03-01',
  supplements: [
    { name: 'Protein Shake', dose: '1 serving', unit: 'scoop', timing: 'morning', frequency: 'daily', genomic_rationale: 'Baseline protein for muscle synthesis. ACTN3 TT needs higher protein for hypertrophy.', notes: 'Separate from SPIKE mineral powder.', is_peptide: false },
    { name: 'SPIKE MB-0.1 Mineral Powder', dose: '1 serving', unit: 'packet', timing: 'throughout_day', frequency: 'daily', genomic_rationale: 'Mineral support including chromium. Separated from protein shake to reduce calcium-mineral competition and improve chromium delivery.', notes: 'Sip throughout day. Finish well before bedtime magnesium.', is_peptide: false },
    { name: 'Somatropin', dose: 'reduced', unit: 'IU', timing: 'morning', frequency: 'daily', genomic_rationale: 'GH support at reduced dose (stepping down per transition protocol).', notes: 'Reduced rather than eliminated per protocol transition plan.', is_peptide: true },
    { name: 'Vitamin D3', dose: '10000', unit: 'IU', timing: 'with_meal', frequency: 'daily', genomic_rationale: 'VDR TaqI AA = impaired vitamin D receptor. Requires 60-80 ng/mL for equivalent biological effect. Current 25(OH)D: 38-40 (functionally deficient).', notes: 'Must take with fattiest meal for absorption. Micro Ingredients D3+K2 softgel.', is_peptide: false },
    { name: 'K2 MK-7', dose: '200', unit: 'mcg', timing: 'with_meal', frequency: 'daily', genomic_rationale: 'Paired with high-dose D3 to direct calcium to bones, not arteries. Critical given AGTR1 CC cardiovascular risk.', notes: 'Take with D3 at fattiest meal.', is_peptide: false },
    { name: 'Selenomethionine', dose: 'per protocol', unit: 'mcg', timing: 'with_meal', frequency: 'daily', genomic_rationale: 'Thyroid support (FOXE1 AA), antioxidant defense.', is_peptide: false },
    { name: 'Magnesium Glycinate', dose: 'per protocol', unit: 'mg', timing: 'bedtime', frequency: 'daily', genomic_rationale: 'Sleep support, muscle recovery, methylation cofactor. Glycinate form for calming effect + bioavailability.', notes: 'Take well before next morning SPIKE dose to avoid mineral competition.', is_peptide: false },
    { name: 'Ipamorelin', dose: 'per cycle', unit: 'mcg', timing: 'bedtime', frequency: 'cycled', genomic_rationale: 'Growth hormone releasing peptide. Preferred over CJC-1295 due to confirmed histamine reaction. Supports GH axis during somatropin taper.', notes: 'Pre-bed on empty stomach. 30 min before bedtime snack if using.', is_peptide: true, cycle_on_weeks: 8, cycle_off_weeks: 4 },
    { name: 'KLOW', dose: 'per protocol', unit: '', timing: 'active', frequency: 'daily', genomic_rationale: 'Peptide compound — active in current protocol.', is_peptide: true },
    { name: 'NAD+', dose: 'per protocol', unit: 'mg', timing: 'active', frequency: 'daily', genomic_rationale: 'Cellular energy and DNA repair. Supports mitochondrial function. GGT1 homozygous makes NAD+ recycling especially important.', is_peptide: false },
    { name: 'MOTS-c', dose: 'per protocol', unit: 'mg', timing: 'active', frequency: '3x/week', genomic_rationale: 'Mitochondrial-derived peptide. Improves metabolic function, exercise capacity, and insulin sensitivity. FADS1 TT impairs fuel switching — MOTS-c helps compensate.', is_peptide: true, cycle_on_weeks: 12, cycle_off_weeks: 4 },
  ],
  contraindications: [
    { compound: 'CJC-1295', reason: 'Confirmed histamine reaction. Likely impaired histamine clearance not captured on Ancestry chip (DAO/HNMT markers not available). Caused acute histamine-release symptoms.', confirmed_date: '2026-03-09' }
  ],
  notes: 'SPIKE mineral powder separated from morning protein shake (mineral competition). D3/K2 requires dietary fat for absorption. Mg glycinate at bedtime, well before next SPIKE dose. Copper-to-zinc ratio flagged for ongoing monitoring given separate zinc supplementation. 25(OH)D retest at ~8 weeks targeting 60-80 ng/mL.',
};

// ============================================================
// 6. HEALTH NOTES
// ============================================================
const healthNotes = [
  { date: '2026-03-15', content: 'Started separating SPIKE mineral powder from morning protein shake. Sipping throughout the day now to reduce calcium-mineral competition and support chromium delivery. Magnesium glycinate moved to bedtime only, finished well before next morning SPIKE dose.', tags: ['supplements', 'protocol_change'] },
  { date: '2026-03-13', content: 'Added heavy primer sets (80-85% x 3-5 reps) to Wednesday bench session before hypertrophy volume. Hypertrophy-range percentages alone (55-75%) are insufficient for CNS adaptation. Need heavy exposure to maintain neural drive and keep strength ceiling climbing, which in turn makes the hypertrophy loads heavier over time. ACTN3 TT endurance fiber genetics make this even more important.', tags: ['training', 'protocol_change'] },
  { date: '2026-03-11', content: 'V3 Comprehensive Genomic Health Intelligence Report completed. Integrated DNA (434,818 SNPs) + Promethease (12,603 genotypes) + Quest blood panel + SanoCardio panel + FreeStyle Libre CGM (14-day). Key findings: (1) FADS1 TT = cannot convert ALA to EPA/DHA, confirmed by OmegaCheck 3%, (2) AGTR1 CC = primary CV risk via atherogenic LDL particle pattern (LDL-P 1438, Small LDL 253), (3) MTHFD1 AA = methylation bottleneck confirmed by homocysteine 9.3, (4) Nocturnal hypoglycemia confirmed via CGM as cause of night waking (not circadian — CLOCK gene is normal), (5) FOXE1 AA = thyroid conversion issue (Free T3 2.44).', tags: ['genomics', 'key_finding'] },
  { date: '2026-03-09', content: 'Confirmed histamine reaction to CJC-1295. This was an acute histamine-release event consistent with impaired histamine clearance. DAO and HNMT markers are NOT on the Ancestry chip, so this was a functional confirmation that genetics alone couldn\'t provide. Ipamorelin alone is the preferred GHRP going forward. CJC-1295 is permanently contraindicated.', tags: ['adverse_reaction', 'peptides', 'key_finding'] },
  { date: '2026-03-09', content: 'AncestryDNA V2.0 data uploaded and fully analyzed. 434,818 SNPs on chip, 51 of 100 targeted markers found. Key homozygous risk variants: FADS1 TT (omega-3 conversion failure), AGTR1 CC (cardiovascular), MTHFD1 AA (methylation), VDR TaqI AA (vitamin D receptor), ACTN3 TT (endurance fiber), GGT1 GG (glutathione recycling), FOXE1 AA (thyroid/connective tissue). APOE confirmed E3/E3 via proxy markers.', tags: ['genomics'] },
  { date: '2026-03-01', content: '25(OH)D retest scheduled approximately 8 weeks out to assess vitamin D protocol efficacy. Current level 38-40 ng/mL, targeting 60-80 ng/mL with 10,000 IU D3 + 200 mcg K2 MK-7 daily with fattiest meal. VDR TaqI AA genotype requires higher serum levels for equivalent biological activity.', tags: ['lab_scheduled', 'supplements'] },
  { date: '2026-02-24', content: 'Started 14-day FreeStyle Libre 3 CGM wear period. Purpose: baseline glucose monitoring given post-meal energy crashes and middle-of-night waking. Will correlate with dietary patterns and sleep data.', tags: ['cgm', 'general'] },
  { date: '2026-01-22', content: 'Quest Diagnostics comprehensive blood panel drawn. Fasting. Key results pending analysis: ferritin elevated at 227 (dietary iron from daily ribeye, HFE clear), LDL-P needs SanoCardio cross-reference, homocysteine 9.3 (above functional optimal). Testosterone 730 consistent with prior readings (post half-marathon draw was artificially lower).', tags: ['general'] },
];

// ============================================================
// 7. HEALTH REPORTS
// ============================================================
const healthReports = [
  {
    title: 'Comprehensive Genomic Health Intelligence Report — V3 Integrated',
    report_type: 'comprehensive',
    status: 'current',
    summary: 'Integrated analysis of 434,818 SNPs (AncestryDNA V2.0), 12,603 Promethease genotypes, Quest Diagnostics comprehensive panel (Jan 2026), SanoCardio panel (Nov 2025), and 14-day FreeStyle Libre 3 CGM data (Feb-Mar 2026). Five critical cross-validated findings: (1) FADS1 TT omega-3 conversion failure confirmed by OmegaCheck 3%, (2) AGTR1 CC cardiovascular risk expressing as atherogenic particle pattern not hypertension, (3) MTHFD1 AA methylation bottleneck confirmed by homocysteine 9.3, (4) Nocturnal hypoglycemia causing night waking via counter-regulatory hormone surges (not circadian disruption), (5) FOXE1 AA thyroid conversion issue confirmed by Free T3 2.44.',
    data_sources: ['ancestrydna', 'promethease', 'quest_jan2026', 'sanocardio_nov2025', 'libre_cgm_feb2026'],
    model_used: 'claude-opus-4-6',
    generated_at: '2026-03-11T12:00:00Z',
    full_report: {
      executive_summary: 'Jason Anderson, 38M, presents a complex but highly actionable genomic-metabolic profile. Five data sources were integrated to identify and validate critical health findings. The genome reveals key vulnerabilities in omega-3 metabolism (FADS1 TT), cardiovascular signaling (AGTR1 CC), methylation (MTHFD1 AA), vitamin D utilization (VDR TaqI AA), and thyroid function (FOXE1 AA). Blood work and CGM data confirm these genetic predictions are actively expressing. The most urgent finding is nocturnal hypoglycemia (29 events in 14 days) driven by ultra-low insulin/leptin with FADS1-impaired fuel substrate switching.',
      key_findings: [
        'FADS1 TT + OmegaCheck 3% = confirmed omega-3 conversion failure. Must supplement preformed EPA/DHA.',
        'AGTR1 CC + LDL-P 1438 + Small LDL 253 = atherogenic particle pattern despite normal standard lipids. Primary CV risk.',
        'MTHFD1 AA + Homocysteine 9.3 = methylation bottleneck on folate side (not B12). Methylfolate indicated.',
        'CGM: 29 low events in 14 days, 8% time below 70 mg/dL. Evening/overnight lows (53-58 range) causing night waking via counter-regulatory hormone surges.',
        'FOXE1 AA + Free T3 2.44 = thyroid conversion issue. Not autoimmune (TPO <1). T3 optimization needed.',
        'VDR TaqI AA + 25(OH)D 40 ng/mL = functionally deficient despite appearing sufficient. Target 60-80 ng/mL.',
        'Ferritin 227 + HFE clear = dietary iron overload from ribeye. Blood donation 2-3x/year.',
        'CJC-1295 histamine reaction = impaired histamine clearance (DAO/HNMT not on chip). Ipamorelin only.',
      ]
    }
  },
  {
    title: 'Initial Genomic Analysis',
    report_type: 'genomic',
    status: 'superseded',
    summary: 'Preliminary analysis of AncestryDNA data covering 51 targeted SNP markers. Identified key risk variants. Superseded by V3 integrated report.',
    data_sources: ['ancestrydna'],
    model_used: 'claude-opus-4-6',
    generated_at: '2026-03-09T18:00:00Z',
    full_report: { note: 'Superseded by V3 comprehensive report.' }
  }
];

// ============================================================
// MAIN SEED FUNCTION
// ============================================================
async function seed() {
  console.log('🌱 Starting Blaze Health data seed...\n');

  // Get or create profile
  const userId = await getOrCreateProfile();
  console.log(`✅ Profile ID: ${userId}\n`);

  // 1. Seed Genomic SNPs
  console.log('🧬 Seeding genomic SNP data...');
  const snpRows = genomicSnps.map(snp => ({ ...snp, user_id: userId, source: 'ancestrydna' }));
  const { error: snpError } = await supabase.from('genomic_snps').upsert(snpRows, { onConflict: 'user_id,rsid' });
  if (snpError) console.error('  SNP error:', snpError.message);
  else console.log(`  ✅ ${snpRows.length} SNPs loaded`);

  // 2. Seed Biomarkers
  console.log('🩸 Seeding blood work biomarkers...');
  const bioRows = biomarkers.map(b => ({ ...b, user_id: userId }));
  const { error: bioError } = await supabase.from('biomarkers').insert(bioRows);
  if (bioError) console.error('  Biomarker error:', bioError.message);
  else console.log(`  ✅ ${bioRows.length} biomarkers loaded`);

  // 3. Seed CGM Summary
  console.log('📊 Seeding CGM summary...');
  const { error: cgmError } = await supabase.from('cgm_summaries').insert({ ...cgmSummary, user_id: userId });
  if (cgmError) console.error('  CGM error:', cgmError.message);
  else console.log('  ✅ CGM summary loaded');

  // 4. Seed Training Program
  console.log('🏋️ Seeding training program...');
  const { error: trainError } = await supabase.from('training_programs').insert({ ...trainingProgram, user_id: userId });
  if (trainError) console.error('  Training error:', trainError.message);
  else console.log('  ✅ Training program loaded');

  // 5. Seed Supplement Protocol
  console.log('💊 Seeding supplement protocol...');
  const { error: suppError } = await supabase.from('supplement_protocols').insert({ ...supplementProtocol, user_id: userId });
  if (suppError) console.error('  Supplement error:', suppError.message);
  else console.log('  ✅ Supplement protocol loaded');

  // 6. Seed Health Notes
  console.log('📝 Seeding health notes...');
  const noteRows = healthNotes.map(n => ({ ...n, user_id: userId }));
  const { error: noteError } = await supabase.from('health_notes').insert(noteRows);
  if (noteError) console.error('  Notes error:', noteError.message);
  else console.log(`  ✅ ${noteRows.length} health notes loaded`);

  // 7. Seed Health Reports
  console.log('📋 Seeding health reports...');
  const reportRows = healthReports.map(r => ({ ...r, user_id: userId }));
  const { error: repError } = await supabase.from('health_reports').insert(reportRows);
  if (repError) console.error('  Reports error:', repError.message);
  else console.log(`  ✅ ${reportRows.length} health reports loaded`);

  console.log('\n🎉 Seed complete! Your Blaze Health dashboard should now show real data.');
  console.log('\nData loaded:');
  console.log(`  • ${snpRows.length} genomic SNPs (methylation, cardiovascular, detox, metabolism, inflammation, sleep, fitness, immune)`);
  console.log(`  • ${bioRows.length} biomarkers (Quest Jan 2026 + SanoCardio Nov 2025)`);
  console.log('  • 1 CGM summary (Libre 3, Feb 24 - Mar 9, 2026)');
  console.log('  • 1 training program (Sheiko Hypertrophy 14-week, Week 7)');
  console.log('  • 1 supplement protocol (11 compounds + contraindications)');
  console.log(`  • ${noteRows.length} health notes`);
  console.log(`  • ${reportRows.length} health reports`);
  console.log('\n⚠️  Note: Garmin data not included — upload a Garmin CSV export through the dashboard to populate sleep/HRV/activity data.');
  console.log('⚠️  Note: Individual CGM readings not included — upload your Libre CSV through the dashboard for the full glucose trace.');
}

seed().catch(console.error);
