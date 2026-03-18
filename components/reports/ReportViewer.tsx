'use client';

import { useState } from 'react';
import { HealthReport, ReportFinding, CrossReference, RiskItem, Recommendation, FollowUp } from '@/lib/types';
import { ChevronDown, ChevronUp, X, AlertTriangle, Target, GitBranch, Shield, Lightbulb, Calendar } from 'lucide-react';

interface ReportViewerProps {
  report: HealthReport;
  onClose: () => void;
}

interface CollapsibleSectionProps {
  title: string;
  icon: React.ElementType;
  iconColor: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
  badge?: string;
}

function CollapsibleSection({ title, icon: Icon, iconColor, defaultOpen = true, children, badge }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="rounded-xl overflow-hidden mb-4" style={{ border: '1px solid var(--border)' }}>
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 transition-colors text-left hover:brightness-110"
        style={{ background: 'var(--surface-2)' }}
      >
        <div className="flex items-center gap-2.5">
          <Icon className="h-4 w-4" style={{ color: iconColor }} />
          <span className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{title}</span>
          {badge && (
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-medium"
              style={{ background: 'var(--surface)', color: 'var(--muted)' }}
            >
              {badge}
            </span>
          )}
        </div>
        {isOpen ? (
          <ChevronUp className="h-4 w-4" style={{ color: 'var(--muted)' }} />
        ) : (
          <ChevronDown className="h-4 w-4" style={{ color: 'var(--muted)' }} />
        )}
      </button>
      {isOpen && (
        <div className="px-5 py-4" style={{ background: 'var(--surface)' }}>
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

const SEVERITY_META: Record<string, { color: string; bg: string }> = {
  high: { color: 'var(--red)', bg: 'var(--red-bg)' },
  medium: { color: 'var(--amber)', bg: 'var(--amber-bg)' },
  low: { color: 'var(--blue)', bg: 'var(--blue-bg)' },
};

export function ReportViewer({ report, onClose }: ReportViewerProps) {
  const content = report.full_report;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto px-4 py-8" style={{ background: 'rgba(0,0,0,0.7)' }}>
      <div className="w-full max-w-3xl rounded-2xl shadow-2xl" style={{ background: 'var(--background)' }}>
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <div>
            <h2 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>{report.title}</h2>
            <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
              Generated {formatDate(report.generated_at)} · {report.model_used}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 transition-colors hover:bg-white/[0.04] shrink-0"
            aria-label="Close report"
          >
            <X className="h-5 w-5" style={{ color: 'var(--muted)' }} />
          </button>
        </div>

        {/* Sections */}
        <div className="px-6 py-5">
          {/* Executive Summary */}
          {content.executive_summary && (
            <CollapsibleSection title="Executive Summary" icon={Target} iconColor="var(--green)" defaultOpen={true}>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
                {content.executive_summary}
              </p>
            </CollapsibleSection>
          )}

          {/* Key Findings */}
          {content.key_findings?.length > 0 && (
            <CollapsibleSection
              title="Key Findings"
              icon={AlertTriangle}
              iconColor="var(--amber)"
              defaultOpen={true}
              badge={`${content.key_findings.length}`}
            >
              <div className="space-y-4">
                {content.key_findings.map((finding: ReportFinding, i: number) => {
                  const sev = SEVERITY_META[finding.severity] ?? SEVERITY_META.medium;
                  return (
                    <div key={i} className="pb-4 last:pb-0 last:border-0" style={{ borderBottom: '1px solid var(--border)' }}>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
                          {finding.title}
                        </span>
                        <span
                          className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                          style={{ background: sev.bg, color: sev.color }}
                        >
                          {finding.severity.charAt(0).toUpperCase() + finding.severity.slice(1)}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed mb-2" style={{ color: 'var(--muted)' }}>
                        {finding.description}
                      </p>
                      {finding.data_points?.length > 0 && (
                        <ul className="list-disc list-inside space-y-0.5">
                          {finding.data_points.map((dp: string, j: number) => (
                            <li key={j} className="text-xs" style={{ color: 'var(--muted-2)' }}>{dp}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>
            </CollapsibleSection>
          )}

          {/* Cross-References */}
          {content.cross_references?.length > 0 && (
            <CollapsibleSection
              title="Cross-References"
              icon={GitBranch}
              iconColor="var(--purple)"
              defaultOpen={false}
              badge={`${content.cross_references.length}`}
            >
              <div className="space-y-4">
                {content.cross_references.map((ref: CrossReference, i: number) => (
                  <div key={i} className="pb-4 last:pb-0 last:border-0" style={{ borderBottom: '1px solid var(--border)' }}>
                    <div className="flex flex-wrap gap-2 mb-1.5">
                      <span className="rounded-full px-2.5 py-0.5 text-xs font-medium" style={{ background: 'var(--purple-bg)', color: 'var(--purple)' }}>
                        {ref.genomic_marker}
                      </span>
                      <span className="rounded-full px-2.5 py-0.5 text-xs font-medium" style={{ background: 'var(--blue-bg)', color: 'var(--blue)' }}>
                        {ref.biomarker}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed mb-1" style={{ color: 'var(--muted)' }}>{ref.finding}</p>
                    <p className="text-xs italic" style={{ color: 'var(--muted-2)' }}>{ref.recommendation}</p>
                  </div>
                ))}
              </div>
            </CollapsibleSection>
          )}

          {/* Risk Assessment */}
          {content.risk_assessment?.length > 0 && (
            <CollapsibleSection
              title="Risk Assessment"
              icon={Shield}
              iconColor="var(--red)"
              defaultOpen={false}
              badge={`${content.risk_assessment.length}`}
            >
              <div className="space-y-4">
                {content.risk_assessment.map((risk: RiskItem, i: number) => {
                  const sev = SEVERITY_META[risk.level] ?? SEVERITY_META.medium;
                  return (
                    <div key={i} className="pb-4 last:pb-0 last:border-0" style={{ borderBottom: '1px solid var(--border)' }}>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{risk.area}</span>
                        <span className="rounded-full px-2 py-0.5 text-[10px] font-medium" style={{ background: sev.bg, color: sev.color }}>
                          {risk.level.charAt(0).toUpperCase() + risk.level.slice(1)}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed mb-2" style={{ color: 'var(--muted)' }}>{risk.description}</p>
                      {risk.mitigations?.length > 0 && (
                        <ul className="list-disc list-inside space-y-0.5">
                          {risk.mitigations.map((m: string, j: number) => (
                            <li key={j} className="text-xs" style={{ color: 'var(--muted-2)' }}>{m}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>
            </CollapsibleSection>
          )}

          {/* Recommendations */}
          {content.recommendations?.length > 0 && (
            <CollapsibleSection
              title="Recommendations"
              icon={Lightbulb}
              iconColor="var(--green)"
              defaultOpen={true}
              badge={`${content.recommendations.length}`}
            >
              <div className="space-y-4">
                {content.recommendations.map((rec: Recommendation, i: number) => {
                  const sev = SEVERITY_META[rec.priority] ?? SEVERITY_META.medium;
                  return (
                    <div key={i} className="pb-4 last:pb-0 last:border-0" style={{ borderBottom: '1px solid var(--border)' }}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--muted-2)' }}>
                          {rec.category}
                        </span>
                        <span className="rounded-full px-2 py-0.5 text-[10px] font-medium" style={{ background: sev.bg, color: sev.color }}>
                          {rec.priority.charAt(0).toUpperCase() + rec.priority.slice(1)} Priority
                        </span>
                      </div>
                      <p className="text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>{rec.action}</p>
                      <p className="text-xs leading-relaxed" style={{ color: 'var(--muted-2)' }}>{rec.rationale}</p>
                    </div>
                  );
                })}
              </div>
            </CollapsibleSection>
          )}

          {/* Follow-Up Schedule */}
          {content.follow_up_schedule?.length > 0 && (
            <CollapsibleSection
              title="Follow-Up Schedule"
              icon={Calendar}
              iconColor="var(--blue)"
              defaultOpen={false}
              badge={`${content.follow_up_schedule.length}`}
            >
              <div className="space-y-3">
                {content.follow_up_schedule.map((followUp: FollowUp, i: number) => (
                  <div key={i} className="flex items-start gap-3 pb-3 last:pb-0 last:border-0" style={{ borderBottom: '1px solid var(--border)' }}>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                          {followUp.test}
                        </span>
                        <span className="rounded-full px-2.5 py-0.5 text-xs font-medium" style={{ background: 'var(--blue-bg)', color: 'var(--blue)' }}>
                          {followUp.timing}
                        </span>
                      </div>
                      <p className="text-xs" style={{ color: 'var(--muted-2)' }}>{followUp.rationale}</p>
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
