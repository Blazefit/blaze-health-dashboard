'use client';

import { useActiveProgram } from '@/hooks/useTraining';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { Tabs } from '@/components/ui/Tabs';
import { ProgramView } from '@/components/training/ProgramView';
import { ProgramGenerator } from '@/components/training/ProgramGenerator';
import { WorkoutLogger } from '@/components/training/WorkoutLogger';
import { Dumbbell } from 'lucide-react';
import type { WorkoutLog } from '@/lib/types';

const TABS = [
  { id: 'program', label: 'Current Program' },
  { id: 'generate', label: 'Generate New' },
  { id: 'log', label: 'Log Workout' },
];

export default function TrainingPage() {
  const { program, isLoading } = useActiveProgram();

  return (
    <div className="p-6">
      <PageHeader
        title="Training"
        description="Programs and workout logging"
      />

      <Tabs tabs={TABS} defaultTab="program">
        {(activeTab) => (
          <>
            {activeTab === 'program' && (
              <>
                {isLoading && (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-24 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800"
                      />
                    ))}
                  </div>
                )}
                {!isLoading && program && <ProgramView program={program} />}
                {!isLoading && !program && (
                  <EmptyState
                    icon={Dumbbell}
                    title="No active program"
                    description="No training program found. Generate one to get started."
                  />
                )}
              </>
            )}

            {activeTab === 'generate' && <ProgramGenerator />}

            {activeTab === 'log' && (
              <>
                {program && program.program_data[0]?.days[0] ? (
                  <WorkoutLogger
                    day={program.program_data[0].days[0]}
                    onSave={(log: WorkoutLog) => {
                      console.log('Workout saved:', log);
                    }}
                  />
                ) : (
                  <EmptyState
                    icon={Dumbbell}
                    title="No workout to log"
                    description="Load a training program to log today's workout."
                  />
                )}
              </>
            )}
          </>
        )}
      </Tabs>
    </div>
  );
}
