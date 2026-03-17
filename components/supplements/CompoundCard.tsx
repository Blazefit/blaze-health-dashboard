'use client';

import { Syringe, RefreshCw, Clock } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { StatusPill } from '@/components/ui/StatusPill';
import type { Supplement } from '@/lib/types';

interface CompoundCardProps {
  supplement: Supplement;
}

const TIMING_LABEL: Record<string, string> = {
  morning: 'Morning',
  with_meal: 'With meal',
  bedtime: 'Bedtime',
  pre_workout: 'Pre-workout',
  post_workout: 'Post-workout',
  active: 'Active compound',
};

export function CompoundCard({ supplement }: CompoundCardProps) {
  const isPeptide = supplement.is_peptide;

  return (
    <Card className={isPeptide ? 'border-purple-200 dark:border-purple-800/60' : ''}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-start gap-2.5">
          {isPeptide && (
            <div className="mt-0.5 rounded-lg bg-purple-100 p-1.5 dark:bg-purple-900/30">
              <Syringe className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
          )}
          <div>
            <h3 className={`font-bold text-gray-900 dark:text-white ${isPeptide ? 'text-base' : 'text-sm'}`}>
              {supplement.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {supplement.dose} {supplement.unit}
            </p>
          </div>
        </div>
        {isPeptide && <StatusPill label="Peptide" variant="purple" />}
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="rounded-md bg-gray-50 p-2 dark:bg-gray-800/60">
          <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">Timing</p>
          <p className="text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {TIMING_LABEL[supplement.timing] ?? supplement.timing}
          </p>
        </div>
        <div className="rounded-md bg-gray-50 p-2 dark:bg-gray-800/60">
          <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">Frequency</p>
          <p className="text-xs font-medium text-gray-700 dark:text-gray-300">{supplement.frequency}</p>
        </div>
      </div>

      {/* Cycle info (peptides only) */}
      {isPeptide && supplement.cycle_on_weeks && (
        <div className="flex items-center gap-2 rounded-md border border-purple-100 bg-purple-50 px-3 py-2 mb-3 dark:border-purple-900/40 dark:bg-purple-900/10">
          <RefreshCw className="h-3.5 w-3.5 shrink-0 text-purple-500" />
          <p className="text-xs text-purple-700 dark:text-purple-300 font-medium">
            Cycle: {supplement.cycle_on_weeks} weeks on / {supplement.cycle_off_weeks} weeks off
          </p>
        </div>
      )}

      {/* Genomic rationale */}
      {supplement.genomic_rationale && (
        <p className="text-xs text-gray-400 dark:text-gray-500 italic border-t border-gray-100 dark:border-gray-800 pt-2.5 mt-2.5">
          {supplement.genomic_rationale}
        </p>
      )}
    </Card>
  );
}
