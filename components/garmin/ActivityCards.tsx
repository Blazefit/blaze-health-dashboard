'use client';

import type { GarminDaily } from '@/lib/types';
import { Footprints, Flame, Building2, Zap } from 'lucide-react';

interface ActivityCardsProps {
  data: GarminDaily;
}

interface ActivityCardItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtitle?: string;
  iconBg: string;
}

function ActivityCardItem({ icon, label, value, subtitle, iconBg }: ActivityCardItemProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center gap-3 mb-3">
        <div className={`flex-shrink-0 rounded-lg p-2 ${iconBg}`}>
          {icon}
        </div>
        <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
          {label}
        </p>
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      {subtitle && (
        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>
      )}
    </div>
  );
}

function formatSteps(steps: number) {
  return steps >= 1000
    ? `${(steps / 1000).toFixed(1)}k`
    : String(steps);
}

function formatDistance(meters: number) {
  const km = meters / 1000;
  return `${km.toFixed(1)} km`;
}

export function ActivityCards({ data }: ActivityCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      <ActivityCardItem
        icon={<Footprints className="h-5 w-5 text-blue-500" />}
        label="Steps"
        value={formatSteps(data.steps)}
        subtitle={formatDistance(data.distance_meters)}
        iconBg="bg-blue-50 dark:bg-blue-900/20"
      />
      <ActivityCardItem
        icon={<Flame className="h-5 w-5 text-orange-500" />}
        label="Active Calories"
        value={`${data.active_calories}`}
        subtitle={`${data.total_calories} total kcal`}
        iconBg="bg-orange-50 dark:bg-orange-900/20"
      />
      <ActivityCardItem
        icon={<Building2 className="h-5 w-5 text-purple-500" />}
        label="Floors"
        value={String(data.floors_climbed)}
        subtitle="floors climbed"
        iconBg="bg-purple-50 dark:bg-purple-900/20"
      />
      <ActivityCardItem
        icon={<Zap className="h-5 w-5 text-green-500" />}
        label="Intensity Mins"
        value={`${data.intensity_minutes}`}
        subtitle="weekly target: 150 min"
        iconBg="bg-green-50 dark:bg-green-900/20"
      />
    </div>
  );
}
