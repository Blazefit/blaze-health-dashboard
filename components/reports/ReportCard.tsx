'use client';

import { HealthReport } from '@/lib/types';
import { FileText, Dna, Droplets, CalendarDays, Sparkles } from 'lucide-react';

interface ReportCardProps {
  report: HealthReport;
  onClick: () => void;
}

const REPORT_TYPE_META: Record<string, { label: string; color: string; bg: string; Icon: React.ElementType }> = {
  comprehensive: { label: 'Comprehensive', color: 'var(--blue)', bg: 'var(--blue-bg)', Icon: Sparkles },
  genomic: { label: 'Genomic', color: 'var(--purple)', bg: 'var(--purple-bg)', Icon: Dna },
  bloodwork: { label: 'Bloodwork', color: 'var(--green)', bg: 'var(--green-bg)', Icon: Droplets },
  quarterly: { label: 'Quarterly', color: 'var(--amber)', bg: 'var(--amber-bg)', Icon: CalendarDays },
  custom: { label: 'Custom', color: 'var(--muted)', bg: 'var(--surface-2)', Icon: FileText },
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function ReportCard({ report, onClick }: ReportCardProps) {
  const summary = report.full_report?.executive_summary ?? report.summary ?? '';
  const preview = summary.length > 200 ? summary.slice(0, 200).trimEnd() + '…' : summary;
  const meta = REPORT_TYPE_META[report.report_type] ?? REPORT_TYPE_META.custom;
  const { Icon } = meta;

  return (
    <button onClick={onClick} className="w-full text-left">
      <div
        className="rounded-xl p-5 transition-all hover:brightness-110 cursor-pointer"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
      >
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="shrink-0 rounded-lg p-2 mt-0.5" style={{ background: meta.bg }}>
              <Icon className="h-4 w-4" style={{ color: meta.color }} />
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-semibold truncate" style={{ color: 'var(--foreground)' }}>
                {report.title}
              </h3>
              <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                Generated {formatDate(report.generated_at)} · {report.model_used}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span
              className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
              style={{ background: meta.bg, color: meta.color }}
            >
              {meta.label}
            </span>
            <span
              className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
              style={{
                background: report.status === 'current' ? 'var(--green-bg)' : 'var(--surface-2)',
                color: report.status === 'current' ? 'var(--green)' : 'var(--muted)',
              }}
            >
              {report.status === 'current' ? 'Current' : report.status === 'superseded' ? 'Superseded' : 'Archived'}
            </span>
          </div>
        </div>
        {preview && (
          <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
            {preview}
          </p>
        )}
        {report.data_sources?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {report.data_sources.map((src) => (
              <span
                key={src}
                className="rounded-md px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide"
                style={{ background: 'var(--surface-2)', color: 'var(--muted-2)' }}
              >
                {src.replace(/_/g, ' ')}
              </span>
            ))}
          </div>
        )}
      </div>
    </button>
  );
}
