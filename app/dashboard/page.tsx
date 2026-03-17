'use client';

import { useDemo } from '@/hooks/useDemo';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { LayoutDashboard } from 'lucide-react';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { PriorityFlags } from '@/components/dashboard/PriorityFlags';
import { GenomicHighlights } from '@/components/dashboard/GenomicHighlights';
import { SleepCard } from '@/components/dashboard/SleepCard';
import { HrvSparkline } from '@/components/dashboard/HrvSparkline';

export default function DashboardPage() {
  const { isDemo } = useDemo();

  if (!isDemo) {
    return (
      <div className="p-6">
        <PageHeader title="Overview" description="Your health intelligence dashboard" />
        <EmptyState
          icon={LayoutDashboard}
          title="No data yet"
          description="Upload your health data or enable demo mode to explore the dashboard."
          ctaLabel="Upload Data"
          ctaHref="/dashboard/upload"
        />
      </div>
    );
  }

  return (
    <div className="p-6">
      <PageHeader title="Overview" description="Your health intelligence dashboard" />
      {/* Metric cards row */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Weight" value="184 lb" delta="-2 lb" deltaType="positive" />
        <MetricCard label="Avg Glucose" value="84 mg/dL" delta="GMI 5.3%" deltaType="neutral" />
        <MetricCard label="Resting HR" value="57 bpm" delta="-1 bpm" deltaType="positive" />
        <MetricCard label="Bench 1RM" value="285 lb" delta="+10 lb" deltaType="positive" />
      </div>

      {/* Priority flags */}
      <div className="mb-6">
        <PriorityFlags />
      </div>

      {/* Two column: Genomics + Sleep/HRV */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <GenomicHighlights />
        <div className="space-y-6">
          <SleepCard />
          <HrvSparkline />
        </div>
      </div>
    </div>
  );
}
