'use client';

import { useState } from 'react';
import { useReports } from '@/hooks/useReports';
import { ReportCard } from '@/components/reports/ReportCard';
import { ReportViewer } from '@/components/reports/ReportViewer';
import { FileText, Sparkles, X, Loader2 } from 'lucide-react';
import { HealthReport, ReportType } from '@/lib/types';

const REPORT_TYPE_OPTIONS: Array<{ value: ReportType; label: string; description: string }> = [
  { value: 'comprehensive', label: 'Comprehensive', description: 'Cross-references all data sources — genomics, blood work, CGM, wearables, supplements' },
  { value: 'genomic', label: 'Genomic', description: 'Deep analysis of your SNP data and actionable genetic variants' },
  { value: 'bloodwork', label: 'Bloodwork', description: 'Blood panel analysis with trending and genomic context' },
  { value: 'quarterly', label: 'Quarterly', description: 'Quarterly progress review with trend analysis' },
];

// Normalize reports from DB — the seeded full_report may have key_findings as string[]
function normalizeReport(report: HealthReport): HealthReport {
  if (!report.full_report) return report;
  const fr = report.full_report;

  // If key_findings are strings (from seed), convert to ReportFinding objects
  if (Array.isArray(fr.key_findings) && fr.key_findings.length > 0 && typeof fr.key_findings[0] === 'string') {
    fr.key_findings = (fr.key_findings as unknown as string[]).map((s, i) => ({
      title: `Finding ${i + 1}`,
      severity: 'medium' as const,
      description: s,
      data_points: [],
    }));
  }

  // Ensure all expected arrays exist
  if (!fr.cross_references) fr.cross_references = [];
  if (!fr.risk_assessment) fr.risk_assessment = [];
  if (!fr.recommendations) fr.recommendations = [];
  if (!fr.follow_up_schedule) fr.follow_up_schedule = [];
  if (!fr.data_source_analysis) fr.data_source_analysis = {};

  return report;
}

export default function ReportsPage() {
  const { reports: rawReports, isLoading, mutate } = useReports();
  const [selectedReport, setSelectedReport] = useState<HealthReport | null>(null);
  const [showGenerateForm, setShowGenerateForm] = useState(false);
  const [selectedType, setSelectedType] = useState<ReportType>('comprehensive');
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);

  const reports = rawReports.map(normalizeReport);

  async function handleGenerate() {
    setGenerating(true);
    setGenError(null);
    try {
      const res = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ report_type: selectedType }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Generation failed');
      }
      const newReport = await res.json();
      mutate();
      setShowGenerateForm(false);
      setSelectedReport(normalizeReport(newReport));
    } catch (e) {
      setGenError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="p-6 max-w-5xl">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
            AI Reports
          </h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--muted)' }}>
            AI-generated health intelligence reports cross-referencing your data
          </p>
        </div>
        <button
          onClick={() => setShowGenerateForm((v) => !v)}
          className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-white transition-all hover:brightness-110"
          style={{ background: 'var(--green)' }}
        >
          <Sparkles className="h-4 w-4" />
          Generate Report
        </button>
      </div>

      {/* Generate form */}
      {showGenerateForm && (
        <div
          className="mb-6 rounded-xl p-5"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
              Generate New Report
            </h3>
            <button
              onClick={() => setShowGenerateForm(false)}
              className="rounded-lg p-1 transition-colors hover:bg-white/[0.04]"
            >
              <X className="h-4 w-4" style={{ color: 'var(--muted)' }} />
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 mb-4">
            {REPORT_TYPE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSelectedType(opt.value)}
                className="rounded-xl p-4 text-left transition-all"
                style={{
                  background: selectedType === opt.value ? 'var(--green-bg)' : 'var(--surface-2)',
                  border: `1px solid ${selectedType === opt.value ? 'var(--green)' : 'var(--border)'}`,
                }}
              >
                <span
                  className="text-sm font-semibold block mb-1"
                  style={{ color: selectedType === opt.value ? 'var(--green)' : 'var(--foreground)' }}
                >
                  {opt.label}
                </span>
                <span className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>
                  {opt.description}
                </span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium text-white transition-all hover:brightness-110 disabled:opacity-60"
              style={{ background: 'var(--green)' }}
            >
              {generating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating…
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate {selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} Report
                </>
              )}
            </button>
            {generating && (
              <span className="text-xs" style={{ color: 'var(--muted)' }}>
                This may take 30–60 seconds…
              </span>
            )}
          </div>

          {genError && (
            <div
              className="mt-3 rounded-lg px-4 py-2.5 text-sm"
              style={{ background: 'var(--red-bg)', color: 'var(--red)' }}
            >
              {genError}
            </div>
          )}
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin" style={{ color: 'var(--green)' }} />
        </div>
      )}

      {/* Empty state */}
      {!isLoading && reports.length === 0 && (
        <div
          className="flex flex-col items-center justify-center rounded-xl px-6 py-16 text-center"
          style={{ background: 'var(--surface)', border: '2px dashed var(--border)' }}
        >
          <div
            className="mb-4 rounded-full p-4"
            style={{ background: 'var(--surface-2)' }}
          >
            <FileText className="h-8 w-8" style={{ color: 'var(--muted)' }} />
          </div>
          <h3 className="mb-2 text-lg font-semibold" style={{ color: 'var(--foreground)' }}>
            No reports yet
          </h3>
          <p className="mb-6 max-w-sm text-sm" style={{ color: 'var(--muted)' }}>
            Generate a comprehensive health report that cross-references your genomic, blood work, CGM, and wearable data.
          </p>
          <button
            onClick={() => setShowGenerateForm(true)}
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-white"
            style={{ background: 'var(--green)' }}
          >
            <Sparkles className="h-4 w-4" />
            Generate Report
          </button>
        </div>
      )}

      {/* Reports list */}
      {!isLoading && reports.length > 0 && (
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
