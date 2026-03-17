'use client';

import { Card } from '@/components/ui/Card';
import { StatusPill } from '@/components/ui/StatusPill';
import type { GenomicSnp } from '@/lib/types';

interface ActionableFindingsProps {
  snps: GenomicSnp[];
}

export function ActionableFindings({ snps }: ActionableFindingsProps) {
  // Filter non-clear, sort homozygous_risk first then heterozygous
  const findings = snps
    .filter((s) => s.risk_level !== 'clear')
    .sort((a, b) => {
      if (a.risk_level === 'homozygous_risk' && b.risk_level !== 'homozygous_risk') return -1;
      if (a.risk_level !== 'homozygous_risk' && b.risk_level === 'homozygous_risk') return 1;
      return 0;
    });

  if (findings.length === 0) {
    return (
      <Card>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No actionable findings in the current view.
        </p>
      </Card>
    );
  }

  return (
    <Card padding={false}>
      <div className="border-b border-gray-100 px-6 py-4 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Actionable Findings
          </h2>
          <span className="text-xs text-gray-400 dark:text-gray-600">
            {findings.length} variant{findings.length !== 1 ? 's' : ''} requiring attention
          </span>
        </div>
      </div>

      <ol className="divide-y divide-gray-100 dark:divide-gray-800">
        {findings.map((snp, index) => (
          <li key={snp.id} className="px-6 py-5">
            {/* Header row */}
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                {index + 1}
              </span>
              <span className="font-semibold text-gray-900 dark:text-white">{snp.gene_name}</span>
              {snp.variant_name && (
                <span className="text-sm text-gray-500 dark:text-gray-400">{snp.variant_name}</span>
              )}
              <StatusPill
                label={snp.risk_level === 'homozygous_risk' ? 'Homozygous Risk' : 'Heterozygous'}
                variant={snp.risk_level === 'homozygous_risk' ? 'red' : 'yellow'}
              />
              <StatusPill label={snp.genotype} variant="gray" />
              <span className="font-mono text-xs text-gray-400 dark:text-gray-600">{snp.rsid}</span>
            </div>

            {/* Clinical significance */}
            <p className="mb-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
              {snp.clinical_significance}
            </p>

            {/* Actionable note */}
            {snp.actionable_note && (
              <div className="rounded-lg border border-primary-100 bg-primary-50/60 px-4 py-3 dark:border-primary-900/50 dark:bg-primary-950/20">
                <div className="mb-1 flex items-center gap-2">
                  <StatusPill label="Recommendation" variant="green" />
                </div>
                <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                  {snp.actionable_note}
                </p>
              </div>
            )}
          </li>
        ))}
      </ol>
    </Card>
  );
}
