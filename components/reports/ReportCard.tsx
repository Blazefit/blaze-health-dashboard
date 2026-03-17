'use client';

import { HealthReport } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { StatusPill } from '@/components/ui/StatusPill';

interface ReportCardProps {
  report: HealthReport;
  onClick: () => void;
}

const REPORT_TYPE_LABELS: Record<string, string> = {
  comprehensive: 'Comprehensive',
  genomic: 'Genomic',
  bloodwork: 'Bloodwork',
  quarterly: 'Quarterly',
  custom: 'Custom',
};

const REPORT_TYPE_COLORS: Record<string, 'blue' | 'purple' | 'green' | 'yellow' | 'gray'> = {
  comprehensive: 'blue',
  genomic: 'purple',
  bloodwork: 'green',
  quarterly: 'yellow',
  custom: 'gray',
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function ReportCard({ report, onClick }: ReportCardProps) {
  const summary = report.full_report?.executive_summary ?? report.summary ?? '';
  const preview = summary.length > 200 ? summary.slice(0, 200).trimEnd() + '…' : summary;
  const typeColor = REPORT_TYPE_COLORS[report.report_type] ?? 'gray';
  const statusVariant = report.status === 'current' ? 'green' : 'gray';
  const statusLabel = report.status === 'current' ? 'Current' : report.status === 'superseded' ? 'Superseded' : 'Archived';

  return (
    <button
      onClick={onClick}
      className="w-full text-left"
    >
      <Card className="transition-shadow hover:shadow-md cursor-pointer">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate">
              {report.title}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Generated {formatDate(report.generated_at)}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <StatusPill label={REPORT_TYPE_LABELS[report.report_type] ?? report.report_type} variant={typeColor} />
            <StatusPill label={statusLabel} variant={statusVariant} />
          </div>
        </div>
        {preview && (
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            {preview}
          </p>
        )}
      </Card>
    </button>
  );
}
