'use client';

import { AlertTriangle } from 'lucide-react';
import type { Contraindication } from '@/lib/types';

interface ContraindicationBannerProps {
  contraindications: Contraindication[];
}

export function ContraindicationBanner({ contraindications }: ContraindicationBannerProps) {
  if (!contraindications || contraindications.length === 0) return null;

  return (
    <div className="rounded-xl border border-red-200 bg-red-50 dark:border-red-900/40 dark:bg-red-900/10">
      {/* Banner header */}
      <div className="flex items-center gap-2.5 border-b border-red-200 px-4 py-3 dark:border-red-900/40">
        <AlertTriangle className="h-5 w-5 shrink-0 text-red-600 dark:text-red-400" />
        <div>
          <h3 className="text-sm font-bold text-red-700 dark:text-red-400">
            Contraindications ({contraindications.length})
          </h3>
          <p className="text-xs text-red-500 dark:text-red-500">
            The following compounds are flagged based on your genomic profile and history.
          </p>
        </div>
      </div>

      {/* Contraindication list */}
      <div className="divide-y divide-red-100 dark:divide-red-900/30">
        {contraindications.map((ci, i) => (
          <div key={i} className="px-4 py-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-500" />
                <div>
                  <p className="text-sm font-semibold text-red-700 dark:text-red-400">
                    {ci.compound}
                  </p>
                  <p className="mt-0.5 text-xs text-red-600 dark:text-red-500">{ci.reason}</p>
                </div>
              </div>
              <span className="shrink-0 text-[10px] text-red-400 dark:text-red-600 whitespace-nowrap">
                Confirmed {new Date(ci.confirmed_date).toLocaleDateString('en-US', {
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
