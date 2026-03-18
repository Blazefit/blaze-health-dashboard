'use client';

import { useGarmin } from '@/hooks/useGarmin';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Tabs } from '@/components/ui/Tabs';
import { EmptyState } from '@/components/ui/EmptyState';
import { SleepSummary } from '@/components/garmin/SleepSummary';
import { HrvChart } from '@/components/garmin/HrvChart';
import { RestingHrChart } from '@/components/garmin/RestingHrChart';
import { BodyBattery } from '@/components/garmin/BodyBattery';
import { ActivityCards } from '@/components/garmin/ActivityCards';
import { TrainingLoad } from '@/components/garmin/TrainingLoad';
import { Watch } from 'lucide-react';

const TABS = [
  { id: 'sleep', label: 'Sleep' },
  { id: 'hrv', label: 'HRV' },
  { id: 'resting-hr', label: 'Resting HR' },
  { id: 'activity', label: 'Activity' },
  { id: 'body-battery', label: 'Body Battery' },
  { id: 'training', label: 'Training Load' },
];

export default function GarminPage() {
  const { data, isLoading } = useGarmin(30);

  const latest = data[data.length - 1] ?? null;

  if (isLoading) {
    return (
      <div className="p-6">
        <PageHeader title="Garmin" description="Wearable data and recovery metrics" />
        <div className="h-64 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800" />
      </div>
    );
  }

  if (!latest) {
    return (
      <div className="p-6">
        <PageHeader title="Garmin" description="Wearable data and recovery metrics" />
        <EmptyState
          icon={Watch}
          title="No Garmin data yet"
          description="Connect your Garmin device or upload your daily summary data to see sleep, HRV, body battery, and activity metrics here."
          ctaLabel="Upload Garmin Data"
          ctaHref="/dashboard/upload"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Garmin"
        description={`Wearable data and recovery metrics · Last updated ${new Date(latest.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`}
      />

      <Tabs tabs={TABS} defaultTab="sleep">
        {(activeTab) => (
          <div>
            {activeTab === 'sleep' && (
              <Card>
                <h2 className="mb-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Sleep Analysis
                </h2>
                <SleepSummary data={latest} />
              </Card>
            )}

            {activeTab === 'hrv' && (
              <div className="space-y-4">
                <Card>
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      HRV — 7 Day
                    </h2>
                    <span className="text-xs text-gray-400">Overnight average (ms)</span>
                  </div>
                  <HrvChart data={data} days={7} />
                </Card>
                <Card>
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      HRV — 30 Day Trend
                    </h2>
                    <span className="text-xs text-gray-400">Overnight average (ms)</span>
                  </div>
                  <HrvChart data={data} days={30} />
                </Card>
              </div>
            )}

            {activeTab === 'resting-hr' && (
              <Card>
                <h2 className="mb-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Resting Heart Rate
                </h2>
                <RestingHrChart data={data} />
              </Card>
            )}

            {activeTab === 'activity' && (
              <div className="space-y-4">
                <ActivityCards data={latest} />
                <Card>
                  <h2 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Today at a Glance
                  </h2>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Max HR</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">
                        {latest.max_hr} <span className="text-xs font-normal text-gray-400">bpm</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Avg HR</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">
                        {latest.avg_hr} <span className="text-xs font-normal text-gray-400">bpm</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">SpO2 Avg</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">
                        {latest.avg_spo2}<span className="text-xs font-normal text-gray-400">%</span>
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'body-battery' && (
              <Card>
                <h2 className="mb-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Body Battery
                </h2>
                <BodyBattery data={latest} />
              </Card>
            )}

            {activeTab === 'training' && (
              <Card>
                <h2 className="mb-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Training Load &amp; Status
                </h2>
                <TrainingLoad data={latest} />
              </Card>
            )}
          </div>
        )}
      </Tabs>
    </div>
  );
}
