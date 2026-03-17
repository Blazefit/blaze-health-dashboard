'use client';

import { useDemo } from '@/hooks/useDemo';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { Card } from '@/components/ui/Card';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { GlucoseTrend } from '@/components/cgm/GlucoseTrend';
import { HypoLog } from '@/components/cgm/HypoLog';
import { GenomicContext } from '@/components/cgm/GenomicContext';
import { Activity } from 'lucide-react';
import { demoCgmReadings } from '@/lib/demo-data';

export default function CgmPage() {
  const { isDemo } = useDemo();

  if (!isDemo) {
    return (
      <div className="p-6">
        <PageHeader title="CGM Data" description="Continuous glucose monitoring" />
        <EmptyState
          icon={Activity}
          title="No CGM data"
          description="Upload your FreeStyle Libre CSV export to view glucose trends, AGP, and hypoglycemic events."
          ctaLabel="Upload CGM Data"
          ctaHref="/dashboard/upload"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="CGM Data"
        description="Continuous glucose monitoring · Demo: Mar 14–16, 2026"
      />

      {/* Summary metrics */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <MetricCard
          label="Avg Glucose"
          value="84 mg/dL"
          delta="Optimal range"
          deltaType="positive"
        />
        <MetricCard
          label="GMI"
          value="5.3%"
          delta="Below diabetic threshold"
          deltaType="positive"
        />
        <MetricCard
          label="CV (variability)"
          value="15.1%"
          delta="< 36% target"
          deltaType="positive"
        />
        <MetricCard
          label="Time Below 70"
          value="8%"
          delta="Above 4% threshold"
          deltaType="negative"
        />
      </div>

      {/* Glucose trend chart */}
      <Card>
        <h2 className="mb-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
          Glucose Trend
        </h2>
        <GlucoseTrend readings={demoCgmReadings} />
        <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-4 rounded" style={{ background: '#7F77DD' }} />
            Glucose (mg/dL)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-4 rounded bg-red-200 opacity-70" />
            Hypo zone (&lt; 70)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-red-500" />
            Critical low (&lt; 54)
          </span>
        </div>
      </Card>

      {/* Hypo log */}
      <Card>
        <h2 className="mb-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
          Hypoglycemic Events
          <span className="ml-2 inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900/30 dark:text-red-400">
            {demoCgmReadings.filter((r) => r.glucose_mg_dl < 70).length} readings below 70
          </span>
        </h2>
        <HypoLog readings={demoCgmReadings} />
      </Card>

      {/* Genomic context */}
      <GenomicContext />
    </div>
  );
}
