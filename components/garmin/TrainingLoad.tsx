'use client';

import type { GarminDaily } from '@/lib/types';
import { StatusPill } from '@/components/ui/StatusPill';
import { Dumbbell } from 'lucide-react';

interface TrainingLoadProps {
  data: GarminDaily;
}

function getStatusVariant(
  status: string
): 'green' | 'yellow' | 'red' | 'blue' | 'purple' | 'gray' | 'coral' {
  const s = status.toLowerCase();
  if (s.includes('productive') || s.includes('peaking')) return 'green';
  if (s.includes('maintaining')) return 'blue';
  if (s.includes('recovering') || s.includes('recovery')) return 'yellow';
  if (s.includes('overreaching') || s.includes('overtraining')) return 'red';
  if (s.includes('unproductive')) return 'coral';
  return 'gray';
}

function getFocusVariant(
  focus: string
): 'green' | 'yellow' | 'red' | 'blue' | 'purple' | 'gray' | 'coral' {
  const f = focus.toLowerCase();
  if (f.includes('anaerobic')) return 'purple';
  if (f.includes('aerobic')) return 'blue';
  if (f.includes('base')) return 'blue';
  return 'gray';
}

function getLoadZone(load: number): { label: string; color: string; description: string } {
  if (load < 30) return { label: 'Low', color: '#378ADD', description: 'Easy recovery week' };
  if (load < 60) return { label: 'Moderate', color: '#1D9E75', description: 'Building fitness' };
  if (load < 90) return { label: 'High', color: '#EF9F27', description: 'Performance stimulus' };
  return { label: 'Very High', color: '#EF4444', description: 'Increased injury risk' };
}

export function TrainingLoad({ data }: TrainingLoadProps) {
  const { training_load, training_load_focus, training_status } = data;
  const zone = getLoadZone(training_load);
  const loadPct = Math.min(100, (training_load / 100) * 100);

  return (
    <div className="space-y-6">
      {/* Score display */}
      <div className="flex items-start gap-6">
        <div className="flex-shrink-0 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 p-5 w-28">
          <Dumbbell className="h-6 w-6 mb-2" style={{ color: zone.color }} />
          <span className="text-3xl font-bold" style={{ color: zone.color }}>
            {training_load}
          </span>
          <span className="mt-0.5 text-xs text-gray-400">load score</span>
        </div>

        <div className="space-y-3 flex-1">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Training Status</p>
            <StatusPill
              label={training_status}
              variant={getStatusVariant(training_status)}
            />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Load Focus</p>
            <StatusPill
              label={training_load_focus}
              variant={getFocusVariant(training_load_focus)}
            />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Load Zone</p>
            <StatusPill
              label={zone.label}
              variant={getStatusVariant(
                zone.label === 'Low'
                  ? 'Maintaining'
                  : zone.label === 'Moderate'
                  ? 'Productive'
                  : zone.label === 'High'
                  ? 'Recovering'
                  : 'Overreaching'
              )}
            />
          </div>
        </div>
      </div>

      {/* Load bar */}
      <div>
        <div className="mb-1 flex justify-between text-xs text-gray-400">
          <span>0 — Rest</span>
          <span>100 — Peak</span>
        </div>
        <div className="relative h-3 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${loadPct}%`,
              background: `linear-gradient(to right, #378ADD, ${zone.color})`,
            }}
          />
        </div>
        <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">{zone.description}</p>
      </div>

      {/* Stress context */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50">
          <p className="text-xs text-gray-500 dark:text-gray-400">Avg Stress</p>
          <p className="mt-0.5 text-xl font-semibold text-gray-800 dark:text-gray-200">
            {data.avg_stress}
          </p>
        </div>
        <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50">
          <p className="text-xs text-gray-500 dark:text-gray-400">Max Stress</p>
          <p className="mt-0.5 text-xl font-semibold text-gray-800 dark:text-gray-200">
            {data.max_stress}
          </p>
        </div>
      </div>
    </div>
  );
}
