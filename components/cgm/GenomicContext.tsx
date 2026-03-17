'use client';

import { Card } from '@/components/ui/Card';
import { Dna, AlertTriangle, Zap, Droplets } from 'lucide-react';

export function GenomicContext() {
  return (
    <Card className="border-l-4 border-l-[#7F77DD]">
      <div className="flex items-start gap-3 mb-4">
        <div className="flex-shrink-0 rounded-lg bg-purple-100 p-2 dark:bg-purple-900/30">
          <Dna className="h-5 w-5 text-[#7F77DD]" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            Genomic Context for Glucose Patterns
          </h3>
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
            How your genetics influence CGM readings
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
              FADS1 TT — Impaired Fuel Switching
            </p>
            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              The homozygous TT genotype at FADS1 (rs174537) reduces delta-5 desaturase activity,
              limiting conversion of ALA to EPA/DHA and impairing phospholipid-mediated
              insulin signaling. This contributes to slower transitions between glucose and fat
              oxidation — reflected in the extended post-prandial glucose elevations and overnight
              dips visible in your CGM trace.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <Zap className="h-4 w-4 text-[#7F77DD]" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
              Low Insulin Secretion
            </p>
            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Baseline fasting insulin sits in the low-normal range, consistent with lean, low-fat-mass
              phenotypes and reduced pancreatic beta-cell stimulation. While protective against
              hyperinsulinemia, this amplifies the amplitude of nocturnal glucose swings — especially
              in the absence of a late-evening carbohydrate buffer.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <Droplets className="h-4 w-4 text-blue-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
              Low Leptin &amp; Appetite Regulation
            </p>
            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Circulating leptin tracks closely with fat mass. At low body-fat levels, reduced leptin
              signaling blunts hypothalamic glucose sensing and diminishes the counter-regulatory
              response to mild hypoglycemia. This may explain why readings of 53–58 mg/dL occur
              without strong symptomatic warning, and underscores the value of CGM monitoring for
              catching asymptomatic lows.
            </p>
          </div>
        </div>

        <div className="rounded-lg bg-purple-50 px-4 py-3 dark:bg-purple-900/20">
          <p className="text-xs font-medium text-[#7F77DD]">Actionable note</p>
          <p className="mt-1 text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
            Consider a small protein + fat snack (e.g., Greek yogurt, nuts) 30–60 minutes before
            sleep on training days to blunt the overnight drop. Pre-formed EPA/DHA (fish oil, 2–3 g/day)
            bypasses the FADS1 bottleneck and may improve post-meal glucose kinetics over 8–12 weeks.
          </p>
        </div>
      </div>
    </Card>
  );
}
