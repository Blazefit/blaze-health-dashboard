'use client';

import { useState } from 'react';
import { useDemo } from '@/hooks/useDemo';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { ReportCard } from '@/components/reports/ReportCard';
import { ReportViewer } from '@/components/reports/ReportViewer';
import { FileText, Sparkles, X } from 'lucide-react';
import { HealthReport, ReportType } from '@/lib/types';

const DEMO_REPORTS: HealthReport[] = [
  {
    id: 'report-1',
    user_id: 'demo',
    title: 'Comprehensive Health Intelligence Report — Q1 2026',
    report_type: 'comprehensive',
    status: 'current',
    data_sources: ['genomics', 'bloodwork', 'cgm', 'garmin', 'supplements'],
    generated_at: '2026-03-12T09:00:00Z',
    model_used: 'claude-opus-4',
    created_at: '2026-03-12T09:00:00Z',
    full_report: {
      executive_summary:
        'Overall health trajectory is strong with several actionable optimization opportunities. Genomic analysis reveals ACTN3 TT fast-twitch dominance and MTHFR C677T heterozygosity that are directly influencing observed bloodwork patterns and training response. CGM data shows excellent daytime glycemic control (avg 92 mg/dL, 94% TIR) but recurrent nocturnal hypoglycemia warranting protocol adjustment. Ferritin has declined 35% over 90 days, likely driven by high training volume and suboptimal iron absorption linked to confirmed TMPRSS6 variant. CJC-1295 adverse reaction logged March 10 — HNMT and MAO-B genomic findings provide mechanistic explanation. Recommend prioritizing iron repletion, nocturnal carbohydrate timing, and peptide protocol revision.',
      key_findings: [
        {
          title: 'Nocturnal Hypoglycemia Pattern',
          severity: 'high',
          description:
            'CGM data shows recurrent glucose lows of 53–58 mg/dL between 2–4 AM on high training load days. Pattern consistent with glycogen depletion plus ACTN3-driven GLUT4 upregulation. Immediate nutritional intervention recommended.',
          data_points: [
            'Avg nocturnal low: 55 mg/dL (10 events over 28 days)',
            'Correlation: 100% of events preceded by training load > 180 TSS',
            'ACTN3 TT genotype — elevated GLUT4 expression confirmed',
            'Daytime TIR: 94% — excellent; nocturnal TIR: 71% — needs improvement',
          ],
        },
        {
          title: 'Declining Ferritin Trend',
          severity: 'high',
          description:
            'Ferritin has fallen from 94 to 61 ng/mL across three consecutive draws. TMPRSS6 rs855791 variant reduces hepcidin suppression, impairing dietary iron absorption. Training-induced hemolysis compounding the deficit.',
          data_points: [
            'Ferritin: 94 → 78 → 61 ng/mL (Q3–Q1)',
            'TMPRSS6 rs855791 AT — reduced iron absorption efficiency',
            'Hemoglobin stable at 15.2 g/dL — pre-anemic phase',
            'Transferrin saturation: 22% (borderline)',
          ],
        },
        {
          title: 'MTHFR C677T Methylation Impact',
          severity: 'medium',
          description:
            'Heterozygous MTHFR C677T reduces folate-to-methylfolate conversion by ~40%. Homocysteine trending upward at 11.2 µmol/L. Methylated B-vitamin supplementation showing partial response.',
          data_points: [
            'MTHFR C677T heterozygous — ~40% enzyme reduction',
            'Homocysteine: 11.2 µmol/L (trending up from 9.8)',
            'Currently on methylfolate 1mg + methylcobalamin 1mg',
            'Consider increasing to 5-MTHF 2mg with B6-P5P',
          ],
        },
        {
          title: 'CJC-1295 Histamine Adverse Reaction',
          severity: 'medium',
          description:
            'Confirmed histamine response to CJC-1295 injection on March 10. Genomic findings support mechanistic explanation via HNMT and MAO-B reduced activity variants. Peptide protocol suspended pending re-evaluation.',
          data_points: [
            'HNMT rs11558538 — reduced histamine N-methyltransferase activity',
            'MAO-B rs1799836 — reduced monoamine oxidase B activity',
            'Symptoms: flushing, mild urticaria, 30-min onset post-injection',
            'Consider BPC-157 or Ipamorelin as lower-histamine alternatives',
          ],
        },
      ],
      cross_references: [
        {
          genomic_marker: 'ACTN3 TT',
          biomarker: 'CGM Nocturnal Glucose',
          finding:
            'Fast-twitch fiber dominance drives elevated GLUT4 expression, increasing glucose uptake post-exercise and causing overnight lows on heavy training days.',
          recommendation:
            'Add 20–30g slow-digesting carbohydrates (e.g., oats, sweet potato) 30–60 min before bed on training days with TSS > 150.',
        },
        {
          genomic_marker: 'TMPRSS6 rs855791',
          biomarker: 'Ferritin 61 ng/mL',
          finding:
            'Reduced hepcidin suppression from TMPRSS6 variant limits dietary iron absorption efficiency, compounding training-induced iron losses.',
          recommendation:
            'Switch to heme iron supplement (e.g., Proferrin) rather than non-heme. Take with 500mg vitamin C. Recheck ferritin in 6 weeks.',
        },
        {
          genomic_marker: 'MTHFR C677T',
          biomarker: 'Homocysteine 11.2 µmol/L',
          finding:
            'Reduced 5-MTHFR enzyme activity impairs remethylation of homocysteine, elevating cardiovascular and neurological risk if uncorrected.',
          recommendation:
            'Increase 5-MTHF to 2mg, add riboflavin 100mg (MTHFR cofactor), ensure B12 methylcobalamin 2mg daily.',
        },
      ],
      risk_assessment: [
        {
          area: 'Iron Status / Anemia Risk',
          level: 'high',
          description:
            'Ferritin at 61 ng/mL and declining. If trend continues at current rate, functional iron deficiency likely within 60–90 days. High training volume without adequate repletion is unsustainable.',
          mitigations: [
            'Switch to heme iron (Proferrin) 18mg daily with vitamin C',
            'Increase red meat intake 3–4x per week',
            'Recheck ferritin + transferrin saturation in 6 weeks',
            'Reduce training volume by 15% if ferritin drops below 50 ng/mL',
          ],
        },
        {
          area: 'Glycemic Control (Nocturnal)',
          level: 'medium',
          description:
            'Nocturnal hypoglycemia events are metabolically disruptive — impair recovery, sleep quality, and morning cortisol rhythm. Pattern is predictable and addressable.',
          mitigations: [
            'Pre-bed slow-carb protocol on heavy training days',
            'Review CGM alerts — set low threshold alarm at 65 mg/dL',
            'Reassess if pattern persists after dietary adjustment',
          ],
        },
        {
          area: 'Cardiovascular (Homocysteine)',
          level: 'low',
          description:
            'Homocysteine at 11.2 µmol/L is mildly elevated but manageable with optimized methylation support. Risk is low given current age and otherwise clean lipid panel.',
          mitigations: [
            'Optimize B-vitamin methylation stack',
            'Recheck homocysteine in 90 days',
            'Monitor LDL particle size — NMR at next draw',
          ],
        },
      ],
      recommendations: [
        {
          category: 'Nutrition',
          action: 'Implement pre-bed slow-carb protocol on training days',
          rationale:
            'Directly addresses nocturnal hypoglycemia by providing sustained glucose during overnight GLUT4-driven uptake in ACTN3 TT individuals.',
          priority: 'high',
        },
        {
          category: 'Supplementation',
          action: 'Switch to heme iron (Proferrin 18mg) + vitamin C 500mg',
          rationale:
            'TMPRSS6 variant reduces non-heme iron absorption. Heme iron bypasses this pathway and is absorbed independently of hepcidin.',
          priority: 'high',
        },
        {
          category: 'Supplementation',
          action: 'Increase 5-MTHF to 2mg, add riboflavin 100mg',
          rationale:
            'Riboflavin is an essential cofactor for MTHFR enzyme function. Combined with higher folate dose should reduce homocysteine within 60 days.',
          priority: 'medium',
        },
        {
          category: 'Peptides',
          action: 'Evaluate BPC-157 or Ipamorelin as CJC-1295 alternatives',
          rationale:
            'HNMT and MAO-B genomic variants explain histamine sensitivity to CJC-1295. Lower-histamine GH secretagogues provide similar benefit without the reaction risk.',
          priority: 'medium',
        },
      ],
      follow_up_schedule: [
        {
          test: 'Comprehensive Lab Panel (Quest)',
          rationale: 'Quarterly draw — ferritin, CBC, metabolic, hormonal, inflammatory markers',
          timing: 'March 15, 2026',
        },
        {
          test: 'Ferritin + Transferrin Saturation',
          rationale: 'Interim check to confirm iron repletion response to heme iron protocol',
          timing: '6 weeks (late April 2026)',
        },
        {
          test: 'Homocysteine',
          rationale: 'Confirm methylation protocol response after riboflavin + 5-MTHF dose increase',
          timing: '90 days (June 2026)',
        },
        {
          test: 'CGM Sensor Replacement',
          rationale: 'Continue nocturnal monitoring to confirm resolution of hypoglycemia pattern',
          timing: 'Ongoing — replace every 14 days',
        },
      ],
      data_source_analysis: {
        genomics: 'Analyzed 847 clinically relevant SNPs from 23andMe raw data. Key actionable variants identified in methylation, iron metabolism, histamine processing, and fitness pathways.',
        bloodwork: 'Three consecutive quarterly draws from Quest Diagnostics reviewed. Trending analysis applied to ferritin, homocysteine, and lipid panel.',
        cgm: '28 days of Libre 3 data analyzed. Time-in-range, nocturnal patterns, and meal response profiled.',
        garmin: '90 days of Garmin Fenix 7 data reviewed. Training load, HRV trends, sleep architecture, and recovery scores integrated.',
      },
    },
  },
  {
    id: 'report-2',
    user_id: 'demo',
    title: 'Genomic Analysis Report — February 2026',
    report_type: 'genomic',
    status: 'superseded',
    data_sources: ['genomics'],
    generated_at: '2026-02-01T14:00:00Z',
    model_used: 'claude-3-5-sonnet',
    created_at: '2026-02-01T14:00:00Z',
    full_report: {
      executive_summary:
        'Initial genomic analysis of 23andMe raw data identifies 12 high-priority and 31 medium-priority actionable variants. Key findings include ACTN3 TT fast-twitch dominance, MTHFR C677T methylation impairment, TMPRSS6 iron absorption variant, and HNMT/MAO-B histamine processing variants. Full cross-referencing with bloodwork and CGM data deferred to comprehensive Q1 2026 report.',
      key_findings: [
        {
          title: 'ACTN3 TT — Fast-Twitch Fiber Dominance',
          severity: 'low',
          description:
            'Homozygous TT at ACTN3 rs1815739 eliminates alpha-actinin-3 expression in fast-twitch muscle fibers. Associated with superior sprint and power performance. Training periodization should emphasize low-rep, high-intensity work.',
          data_points: [
            'ACTN3 rs1815739 TT — homozygous risk (functional)',
            'Elevated GLUT4 expression in fast-twitch fibers',
            'Optimal training: 1–5 rep range, 85–95% 1RM',
            'Reduced endurance adaptation capacity relative to power output',
          ],
        },
        {
          title: 'MTHFR C677T — Methylation Pathway',
          severity: 'medium',
          description:
            'Heterozygous C677T reduces MTHFR enzyme activity by approximately 40%, impairing conversion of folate to 5-methyltetrahydrofolate. Requires methylated B-vitamin supplementation to maintain adequate methylation capacity.',
          data_points: [
            'MTHFR rs1801133 C677T heterozygous',
            '~40% reduction in folate-to-5-MTHF conversion',
            'Increased homocysteine risk without supplementation',
            'Standard folic acid ineffective — use 5-MTHF exclusively',
          ],
        },
      ],
      cross_references: [],
      risk_assessment: [
        {
          area: 'Methylation / Homocysteine',
          level: 'medium',
          description:
            'MTHFR C677T heterozygosity creates chronic methylation insufficiency that, without supplementation, will elevate homocysteine and increase cardiovascular and cognitive risk over time.',
          mitigations: [
            'Daily 5-MTHF 1–2mg',
            'Methylcobalamin 1–2mg daily',
            'Avoid folic acid fortified foods (blocks 5-MTHF receptor)',
          ],
        },
      ],
      recommendations: [
        {
          category: 'Supplementation',
          action: 'Begin methylated B-vitamin protocol',
          rationale: 'MTHFR C677T requires methylated forms of folate and B12 for adequate homocysteine remethylation.',
          priority: 'high',
        },
        {
          category: 'Training',
          action: 'Shift to power-focused periodization (1–5 rep range)',
          rationale: 'ACTN3 TT genotype indicates superior fast-twitch fiber capacity. High-rep hypertrophy work will yield suboptimal strength adaptation.',
          priority: 'medium',
        },
      ],
      follow_up_schedule: [
        {
          test: 'Comprehensive Report (cross-reference bloodwork + CGM)',
          rationale: 'Genomic findings should be contextualized with live biomarker data for full clinical picture',
          timing: 'Q1 2026 (after March 15 lab draw)',
        },
      ],
      data_source_analysis: {
        genomics: 'Analyzed 23andMe v5 chip data. 847 clinically relevant SNPs reviewed across methylation, cardiovascular, detox, metabolism, inflammation, nutrient, sleep, fitness, and immune categories.',
      },
    },
  },
];

const REPORT_TYPE_OPTIONS: Array<{ value: ReportType; label: string }> = [
  { value: 'comprehensive', label: 'Comprehensive' },
  { value: 'genomic', label: 'Genomic' },
  { value: 'bloodwork', label: 'Bloodwork' },
  { value: 'quarterly', label: 'Quarterly' },
];

export default function ReportsPage() {
  const { isDemo } = useDemo();
  const [selectedReport, setSelectedReport] = useState<HealthReport | null>(null);
  const [showGenerateForm, setShowGenerateForm] = useState(false);
  const [selectedType, setSelectedType] = useState<ReportType>('comprehensive');

  const reports = isDemo ? DEMO_REPORTS : [];

  if (!isDemo && reports.length === 0 && !showGenerateForm) {
    return (
      <div className="p-6">
        <PageHeader title="AI Reports" description="AI-generated health intelligence reports">
          <button
            onClick={() => setShowGenerateForm(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent/90 transition-colors"
          >
            <Sparkles className="h-4 w-4" />
            Generate New Report
          </button>
        </PageHeader>
        <EmptyState
          icon={FileText}
          title="No reports yet"
          description="Generate a comprehensive health report that cross-references your genomic, blood work, CGM, and wearable data."
          ctaLabel="Generate Report"
          onCtaClick={() => setShowGenerateForm(true)}
        />
      </div>
    );
  }

  return (
    <div className="p-6">
      <PageHeader title="AI Reports" description="AI-generated health intelligence reports">
        <button
          onClick={() => setShowGenerateForm((v) => !v)}
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent/90 transition-colors"
        >
          <Sparkles className="h-4 w-4" />
          Generate New Report
        </button>
      </PageHeader>

      {/* Generate form */}
      {showGenerateForm && (
        <div className="mb-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Generate New Report
            </h3>
            <button
              onClick={() => setShowGenerateForm(false)}
              className="rounded-lg p-1 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>
          </div>
          <div className="flex flex-wrap items-end gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                Report Type
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as ReportType)}
                className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              >
                {REPORT_TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <button
              className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent/90 transition-colors opacity-60 cursor-not-allowed"
              disabled
              title="Connect data sources to generate reports"
            >
              Generate
            </button>
            <p className="text-xs text-gray-400 dark:text-gray-500 self-center">
              Upload data sources to enable report generation.
            </p>
          </div>
        </div>
      )}

      {/* Reports list */}
      {reports.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No reports yet"
          description="Generate a comprehensive health report that cross-references your genomic, blood work, CGM, and wearable data."
          ctaLabel="Generate Report"
          onCtaClick={() => setShowGenerateForm(true)}
        />
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              onClick={() => setSelectedReport(report)}
            />
          ))}
        </div>
      )}

      {/* Report viewer modal */}
      {selectedReport && (
        <ReportViewer
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
        />
      )}
    </div>
  );
}
