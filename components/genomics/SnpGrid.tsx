'use client';

import type { GenomicSnp, RiskLevel } from '@/lib/types';

interface SnpGridProps {
  snps: GenomicSnp[];
}

const riskStyles: Record<RiskLevel, { chip: string; dot: string; badge: string }> = {
  clear: {
    chip: 'border-primary-200 bg-primary-50 hover:border-primary-300 dark:border-primary-800 dark:bg-primary-950/30 dark:hover:border-primary-700',
    dot: 'bg-primary-500',
    badge: 'text-primary-700 dark:text-primary-400',
  },
  heterozygous: {
    chip: 'border-yellow-200 bg-yellow-50 hover:border-yellow-300 dark:border-yellow-800 dark:bg-yellow-950/30 dark:hover:border-yellow-700',
    dot: 'bg-yellow-500',
    badge: 'text-yellow-700 dark:text-yellow-400',
  },
  homozygous_risk: {
    chip: 'border-red-200 bg-red-50 hover:border-red-300 dark:border-red-800 dark:bg-red-950/30 dark:hover:border-red-700',
    dot: 'bg-red-500',
    badge: 'text-red-700 dark:text-red-400',
  },
};

const riskLabel: Record<RiskLevel, string> = {
  clear: 'Clear',
  heterozygous: 'Het',
  homozygous_risk: 'Hom Risk',
};

function SnpChip({ snp }: { snp: GenomicSnp }) {
  const style = riskStyles[snp.risk_level];

  return (
    <div
      className={`group relative inline-flex cursor-default flex-col gap-0.5 rounded-lg border px-3 py-2 transition-all hover:shadow-md ${style.chip}`}
    >
      {/* Gene name + risk indicator */}
      <div className="flex items-center gap-1.5">
        <span className={`h-2 w-2 flex-shrink-0 rounded-full ${style.dot}`} />
        <span className="text-xs font-bold text-gray-900 dark:text-white">{snp.gene_name}</span>
      </div>

      {/* Genotype + risk label */}
      <div className="flex items-center gap-1 pl-3.5">
        <span className="font-mono text-xs font-medium text-gray-600 dark:text-gray-400">
          {snp.genotype}
        </span>
        <span className="text-xs text-gray-400">&middot;</span>
        <span className={`text-xs font-medium ${style.badge}`}>{riskLabel[snp.risk_level]}</span>
      </div>

      {/* Hover tooltip */}
      <div className="pointer-events-none absolute bottom-full left-0 z-30 mb-2 hidden w-72 rounded-xl border border-gray-200 bg-white p-4 shadow-xl group-hover:block dark:border-gray-700 dark:bg-gray-900">
        <p className="mb-1 text-xs font-semibold text-gray-900 dark:text-white">
          {snp.variant_name}
        </p>
        <p className="mb-2 font-mono text-xs text-gray-400">{snp.rsid}</p>
        <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-300 line-clamp-5">
          {snp.clinical_significance}
        </p>
      </div>
    </div>
  );
}

export function SnpGrid({ snps }: SnpGridProps) {
  if (snps.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-xl border-2 border-dashed border-gray-200 py-10 dark:border-gray-800">
        <p className="text-sm text-gray-400 dark:text-gray-600">
          No SNPs match the selected filter.
        </p>
      </div>
    );
  }

  const hom = snps.filter((s) => s.risk_level === 'homozygous_risk');
  const het = snps.filter((s) => s.risk_level === 'heterozygous');
  const clear = snps.filter((s) => s.risk_level === 'clear');
  const sorted = [...hom, ...het, ...clear];

  return (
    <div className="space-y-3">
      {/* Summary counts */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-red-500" />
          {hom.length} homozygous risk
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-yellow-500" />
          {het.length} heterozygous
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-primary-500" />
          {clear.length} clear
        </span>
        <span className="text-gray-300 dark:text-gray-600">|</span>
        <span>{snps.length} total SNPs</span>
      </div>

      {/* Chip grid */}
      <div className="flex flex-wrap gap-2">
        {sorted.map((snp) => (
          <SnpChip key={snp.id} snp={snp} />
        ))}
      </div>
    </div>
  );
}
