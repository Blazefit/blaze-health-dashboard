'use client';

import { useState } from 'react';
import { Droplets } from 'lucide-react';
import { useDemo } from '@/hooks/useDemo';
import { useBiomarkerTrend, useLatestBiomarkers } from '@/hooks/useBiomarkers';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { Tabs } from '@/components/ui/Tabs';
import { Card } from '@/components/ui/Card';
import { MarkerRow } from '@/components/bloodwork/MarkerRow';
import { MarkerTrend } from '@/components/bloodwork/MarkerTrend';
import { RangeToggle } from '@/components/bloodwork/RangeToggle';
import type { Biomarker } from '@/lib/types';

// ---------- Latest Panel Tab ----------

function LatestPanelTab({ biomarkers }: { biomarkers: Biomarker[] }) {
  const flagged = biomarkers.filter(
    (b) => b.status === 'flagged' || b.status === 'borderline'
  );
  const optimal = biomarkers.filter(
    (b) => b.status === 'optimal' || b.status === 'normal'
  );

  return (
    <div className="space-y-6">
      {/* Flagged / Borderline */}
      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Flagged &amp; Borderline
        </h2>
        {flagged.length === 0 ? (
          <p className="text-sm text-gray-400 dark:text-gray-500">
            No flagged or borderline markers — great work.
          </p>
        ) : (
          <Card padding={false}>
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {flagged.map((marker) => (
                <div key={marker.id} className="px-5">
                  <MarkerRow marker={marker} />
                </div>
              ))}
            </div>
          </Card>
        )}
      </section>

      {/* Optimal / Normal */}
      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Optimal &amp; Normal
        </h2>
        {optimal.length === 0 ? (
          <p className="text-sm text-gray-400 dark:text-gray-500">
            No markers in range yet.
          </p>
        ) : (
          <Card padding={false}>
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {optimal.map((marker) => (
                <div key={marker.id} className="px-5">
                  <MarkerRow marker={marker} />
                </div>
              ))}
            </div>
          </Card>
        )}
      </section>
    </div>
  );
}

// ---------- Trends Tab ----------

function TrendsTab({ markerNames }: { markerNames: string[] }) {
  const [selected, setSelected] = useState<string>(markerNames[0] ?? '');
  const { trend } = useBiomarkerTrend(selected);

  // Derive refLow / refHigh / optLow / optHigh from the latest entry in trend
  const latest = trend[trend.length - 1];

  const trendData = trend.map((b) => ({
    date: b.date,
    value: b.value,
  }));

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <label
          htmlFor="marker-select"
          className="text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Biomarker
        </label>
        <select
          id="marker-select"
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75] dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        >
          {markerNames.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>

      {selected && (
        <Card>
          <MarkerTrend
            markerName={selected}
            data={trendData}
            refLow={latest?.ref_low ?? 0}
            refHigh={latest?.ref_high ?? 0}
            optLow={latest?.optimal_low}
            optHigh={latest?.optimal_high}
          />
        </Card>
      )}
    </div>
  );
}

// ---------- Functional Ranges Tab ----------

function FunctionalRangesTab({ biomarkers }: { biomarkers: Biomarker[] }) {
  const [mode, setMode] = useState<'standard' | 'functional'>('functional');

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {mode === 'functional'
            ? 'Showing functional / optimal reference ranges.'
            : 'Showing standard lab reference ranges.'}
        </p>
        <RangeToggle mode={mode} onChange={setMode} />
      </div>

      <Card padding={false}>
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {biomarkers.map((marker) => {
            return (
              <div key={marker.id} className="px-5">
                <div className="flex items-center gap-3 py-3 px-1 last:border-0">
                  {/* Status dot */}
                  <span
                    className={`h-2.5 w-2.5 flex-shrink-0 rounded-full ${
                      marker.status === 'optimal'
                        ? 'bg-[#1D9E75]'
                        : marker.status === 'normal'
                        ? 'bg-gray-400'
                        : marker.status === 'borderline'
                        ? 'bg-[#EF9F27]'
                        : 'bg-[#E24B4A]'
                    }`}
                  />

                  {/* Marker name */}
                  <span className="flex-1 text-sm font-medium text-gray-900 dark:text-white truncate">
                    {marker.marker_name}
                  </span>

                  {/* Standard range */}
                  <div className="text-right">
                    <p className="text-xs text-gray-400 dark:text-gray-500">Standard</p>
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-300 tabular-nums">
                      {marker.ref_low} – {marker.ref_high}
                    </p>
                  </div>

                  {/* Functional range */}
                  <div className="ml-4 text-right">
                    <p className="text-xs text-gray-400 dark:text-gray-500">Functional</p>
                    <p className="text-xs font-medium text-[#1D9E75] tabular-nums">
                      {marker.optimal_low} – {marker.optimal_high}
                    </p>
                  </div>

                  {/* Value */}
                  <span
                    className={`ml-4 text-sm font-semibold tabular-nums whitespace-nowrap ${
                      marker.status === 'optimal'
                        ? 'text-[#1D9E75]'
                        : marker.status === 'normal'
                        ? 'text-gray-500 dark:text-gray-400'
                        : marker.status === 'borderline'
                        ? 'text-[#EF9F27]'
                        : 'text-[#E24B4A]'
                    }`}
                  >
                    {marker.value}{' '}
                    <span className="text-xs font-normal text-gray-500 dark:text-gray-400">
                      {marker.unit}
                    </span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

// ---------- Page ----------

const TABS = [
  { id: 'latest', label: 'Latest Panel' },
  { id: 'trends', label: 'Trends' },
  { id: 'functional', label: 'Functional Ranges' },
];

export default function BloodworkPage() {
  const { isDemo } = useDemo();
  const { biomarkers, isLoading } = useLatestBiomarkers();

  if (!isDemo) {
    return (
      <div className="p-6">
        <PageHeader title="Blood Work" description="Lab panels and biomarker trends" />
        <EmptyState
          icon={Droplets}
          title="No blood work data"
          description="Upload a CSV from Rythm Health, Function Health, or any lab provider to track your biomarkers."
          ctaLabel="Upload Blood Work"
          ctaHref="/dashboard/upload"
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <PageHeader title="Blood Work" description="Lab panels and biomarker trends" />
        <div className="flex h-48 items-center justify-center text-sm text-gray-400">
          Loading biomarkers…
        </div>
      </div>
    );
  }

  const markerNames = Array.from(new Set(biomarkers.map((b) => b.marker_name)));

  return (
    <div className="p-6">
      <PageHeader
        title="Blood Work"
        description={`${biomarkers.length} markers · latest panel`}
      />

      <Tabs tabs={TABS} defaultTab="latest">
        {(activeTab) => (
          <>
            {activeTab === 'latest' && (
              <LatestPanelTab biomarkers={biomarkers} />
            )}
            {activeTab === 'trends' && (
              <TrendsTab markerNames={markerNames} />
            )}
            {activeTab === 'functional' && (
              <FunctionalRangesTab biomarkers={biomarkers} />
            )}
          </>
        )}
      </Tabs>
    </div>
  );
}
