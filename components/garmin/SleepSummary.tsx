'use client';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import type { GarminDaily } from '@/lib/types';

interface SleepSummaryProps {
  data: GarminDaily;
}

function formatMinutes(mins: number) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

const STAGES = [
  { key: 'sleep_deep_minutes', label: 'Deep', color: '#534AB7' },
  { key: 'sleep_light_minutes', label: 'Light', color: '#AFA9EC' },
  { key: 'sleep_rem_minutes', label: 'REM', color: '#1D9E75' },
  { key: 'sleep_awake_minutes', label: 'Awake', color: '#EF9F27' },
];

const LegendItem = ({
  color,
  label,
  minutes,
}: {
  color: string;
  label: string;
  minutes: number;
}) => (
  <div className="flex items-center gap-2">
    <span
      className="inline-block h-3 w-3 flex-shrink-0 rounded-sm"
      style={{ background: color }}
    />
    <span className="text-xs text-gray-600 dark:text-gray-400">
      {label}
    </span>
    <span className="ml-auto text-xs font-medium text-gray-800 dark:text-gray-200">
      {formatMinutes(minutes)}
    </span>
  </div>
);

export function SleepSummary({ data }: SleepSummaryProps) {
  const chartData = [
    {
      name: 'Tonight',
      Deep: data.sleep_deep_minutes,
      Light: data.sleep_light_minutes,
      REM: data.sleep_rem_minutes,
      Awake: data.sleep_awake_minutes,
    },
  ];

  const scoreColor =
    data.sleep_score >= 80
      ? 'text-green-600 dark:text-green-400'
      : data.sleep_score >= 65
      ? 'text-yellow-600 dark:text-yellow-400'
      : 'text-red-600 dark:text-red-400';

  return (
    <div className="space-y-6">
      {/* Top summary row */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Total Sleep
          </p>
          <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
            {formatMinutes(data.sleep_total_minutes)}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Sleep Score
          </p>
          <p className={`mt-1 text-2xl font-bold ${scoreColor}`}>
            {data.sleep_score}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Wake Events
          </p>
          <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
            {data.sleep_wake_events}
          </p>
        </div>
      </div>

      {/* Stacked bar chart */}
      <div className="h-28">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
          >
            <XAxis type="number" hide domain={[0, data.sleep_total_minutes + data.sleep_awake_minutes + 5]} />
            <YAxis type="category" dataKey="name" hide />
            <Tooltip
              formatter={(value, name) => [formatMinutes(Number(value)), String(name)]}
              contentStyle={{
                fontSize: 12,
                borderRadius: 8,
                border: '1px solid #E5E7EB',
              }}
            />
            <Bar dataKey="Deep" stackId="sleep" fill="#534AB7" radius={[4, 0, 0, 4]} />
            <Bar dataKey="Light" stackId="sleep" fill="#AFA9EC" />
            <Bar dataKey="REM" stackId="sleep" fill="#1D9E75" />
            <Bar dataKey="Awake" stackId="sleep" fill="#EF9F27" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-y-2 gap-x-6">
        {STAGES.map((s) => (
          <LegendItem
            key={s.key}
            color={s.color}
            label={s.label}
            minutes={data[s.key as keyof GarminDaily] as number}
          />
        ))}
      </div>
    </div>
  );
}
