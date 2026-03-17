'use client';

import { useDemo } from '@/hooks/useDemo';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { Tabs } from '@/components/ui/Tabs';
import { ProtocolTimeline } from '@/components/supplements/ProtocolTimeline';
import { CompoundCard } from '@/components/supplements/CompoundCard';
import { ContraindicationBanner } from '@/components/supplements/ContraindicationBanner';
import { PeptideCycleCalendar } from '@/components/supplements/PeptideCycleCalendar';
import { Pill } from 'lucide-react';

const TABS = [
  { id: 'stack', label: 'Daily Stack' },
  { id: 'peptides', label: 'Peptide Protocol' },
  { id: 'calendar', label: 'Cycling Calendar' },
];

export default function SupplementsPage() {
  const { isDemo } = useDemo();

  if (!isDemo) {
    return (
      <div className="p-6">
        <PageHeader title="Supplements" description="Protocol management and cycling" />
        <EmptyState
          icon={Pill}
          title="No supplement protocol"
          description="Create a supplement protocol to track your daily stack, timing, and genomic rationale."
          ctaLabel="Create Protocol"
          ctaHref="/dashboard/supplements?tab=create"
        />
      </div>
    );
  }

  // Load demo data only when in demo mode
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { demoSupplementProtocol } = require('@/lib/demo-data');
  const protocol = demoSupplementProtocol;
  const peptides = protocol.supplements.filter((s: { is_peptide: boolean }) => s.is_peptide);

  return (
    <div className="p-6">
      <PageHeader
        title="Supplements"
        description="Protocol management and cycling"
      />

      <Tabs tabs={TABS} defaultTab="stack">
        {(activeTab) => (
          <>
            {activeTab === 'stack' && (
              <div className="space-y-5">
                <ProtocolTimeline protocol={protocol} />
                <ContraindicationBanner contraindications={protocol.contraindications} />
              </div>
            )}

            {activeTab === 'peptides' && (
              <div className="space-y-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {peptides.length} active peptide{peptides.length !== 1 ? 's' : ''} in current protocol.
                  All peptides are cycled on a structured on/off schedule.
                </p>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {peptides.map((s: Parameters<typeof CompoundCard>[0]['supplement']) => (
                    <CompoundCard key={s.name} supplement={s} />
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'calendar' && <PeptideCycleCalendar />}
          </>
        )}
      </Tabs>
    </div>
  );
}
