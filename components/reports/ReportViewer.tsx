'use client';

import { useState } from 'react';
import { HealthReport, ReportFinding, CrossReference, RiskItem, Recommendation, FollowUp } from '@/lib/types';
import { StatusPill } from '@/components/ui/StatusPill';
import { ChevronDown, ChevronUp, X } from 'lucide-react';

interface ReportViewerProps {
  report: HealthReport;
  onClose: () => void;
}

interface CollapsibleSectionProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

function CollapsibleSection({ title, defaultOpen = true, children }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden mb-4">
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700/60 transition-colors text-left"
      >
        <span className="text-sm font-semibold text-gray-900 dark:text-white">{title}</span>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-gray-500" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-500" />
        )}
      </button>
      {isOpen && (
        <div className="px-5 py-4 bg-white dark:bg-gray-900">
          {children}
        </div>
      )}
    </div>
  );
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const SEVERITY_COLORS: Record<string, 'red' | 'yellow' | 'blue'> = {
  high: 'red',
  medium: 'yellow',
  low: 'blue',
};

const PRIORITY_COLORS: Record<string, 'red' | 'yellow' | 'blue'> = {
  high: 'red',
  medium: 'yellow',
  low: 'blue',
};

export function ReportViewer({ report, onClose }: ReportViewerProps) {
  const content = report.full_report;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 px-4 py-8">
      <div className="w-full max-w-3xl rounded-2xl bg-white dark:bg-gray-900 shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-4 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{report.title}</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Generated {formatDate(report.generated_at)} &middot; {report.model_used}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors shrink-0"
            aria-label="Close report"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Sections */}
        <div className="px-6 py-5">
          {/* Executive Summary */}
          {content.executive_summary && (
            <CollapsibleSection title="Executive Summary" defaultOpen={true}>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {content.executive_summary}
              </p>
            </CollapsibleSection>
          )}

          {/* Key Findings */}
          {content.key_findings?.length > 0 && (
            <CollapsibleSection title="Key Findings" defaultOpen={true}>
              <div className="space-y-4">
                {content.key_findings.map((finding: ReportFinding, i: number) => (
                  <div key={i} className="pb-4 border-b border-gray-100 dark:border-gray-800 last:border-0 last:pb-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {finding.title}
                      </span>
                      <StatusPill
                        label={finding.severity.charAt(0).toUpperCase() + finding.severity.slice(1)}
                        variant={SEVERITY_COLORS[finding.severity] ?? 'gray'}
                      />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-2">
                      {finding.description}
                    </p>
                    {finding.data_points?.length > 0 && (
                      <ul className="list-disc list-inside space-y-0.5">
                        {finding.data_points.map((dp: string, j: number) => (
                          <li key={j} className="text-xs text-gray-500 dark:text-gray-400">
                            {dp}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </CollapsibleSection>
          )}

          {/* Cross-References */}
          {content.cross_references?.length > 0 && (
            <CollapsibleSection title="Cross-References" defaultOpen={false}>
              <div className="space-y-4">
                {content.cross_references.map((ref: CrossReference, i: number) => (
                  <div key={i} className="pb-4 border-b border-gray-100 dark:border-gray-800 last:border-0 last:pb-0">
                    <div className="flex flex-wrap gap-2 mb-1.5">
                      <StatusPill label={ref.genomic_marker} variant="purple" />
                      <StatusPill label={ref.biomarker} variant="blue" />
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-1 leading-relaxed">
                      {ref.finding}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                      {ref.recommendation}
                    </p>
                  </div>
                ))}
              </div>
            </CollapsibleSection>
          )}

          {/* Risk Assessment */}
          {content.risk_assessment?.length > 0 && (
            <CollapsibleSection title="Risk Assessment" defaultOpen={false}>
              <div className="space-y-4">
                {content.risk_assessment.map((risk: RiskItem, i: number) => (
                  <div key={i} className="pb-4 border-b border-gray-100 dark:border-gray-800 last:border-0 last:pb-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{risk.area}</span>
                      <StatusPill
                        label={risk.level.charAt(0).toUpperCase() + risk.level.slice(1)}
                        variant={SEVERITY_COLORS[risk.level] ?? 'gray'}
                      />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 leading-relaxed">
                      {risk.description}
                    </p>
                    {risk.mitigations?.length > 0 && (
                      <ul className="list-disc list-inside space-y-0.5">
                        {risk.mitigations.map((m: string, j: number) => (
                          <li key={j} className="text-xs text-gray-500 dark:text-gray-400">{m}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </CollapsibleSection>
          )}

          {/* Recommendations */}
          {content.recommendations?.length > 0 && (
            <CollapsibleSection title="Recommendations" defaultOpen={true}>
              <div className="space-y-4">
                {content.recommendations.map((rec: Recommendation, i: number) => (
                  <div key={i} className="pb-4 border-b border-gray-100 dark:border-gray-800 last:border-0 last:pb-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        {rec.category}
                      </span>
                      <StatusPill
                        label={rec.priority.charAt(0).toUpperCase() + rec.priority.slice(1) + ' Priority'}
                        variant={PRIORITY_COLORS[rec.priority] ?? 'gray'}
                      />
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                      {rec.action}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                      {rec.rationale}
                    </p>
                  </div>
                ))}
              </div>
            </CollapsibleSection>
          )}

          {/* Follow-Up Schedule */}
          {content.follow_up_schedule?.length > 0 && (
            <CollapsibleSection title="Follow-Up Schedule" defaultOpen={false}>
              <div className="space-y-3">
                {content.follow_up_schedule.map((followUp: FollowUp, i: number) => (
                  <div key={i} className="flex items-start gap-3 pb-3 border-b border-gray-100 dark:border-gray-800 last:border-0 last:pb-0">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {followUp.test}
                        </span>
                        <StatusPill label={followUp.timing} variant="blue" />
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {followUp.rationale}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CollapsibleSection>
          )}
        </div>
      </div>
    </div>
  );
}
