'use client';

import { Card } from '@/components/ui/Card';

const hrvData = [
  { day: 'Mon', value: 42 },
  { day: 'Tue', value: 38 },
  { day: 'Wed', value: 45 },
  { day: 'Thu', value: 41 },
  { day: 'Fri', value: 47 },
  { day: 'Sat', value: 44 },
  { day: 'Sun', value: 51 },
];

const maxHrv = Math.max(...hrvData.map((d) => d.value));

export function HrvSparkline() {
  return (
    <Card>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          7-Day HRV
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            {hrvData[hrvData.length - 1].value} ms
          </span>
          <span className="text-sm text-accent">+7 ms</span>
        </div>
      </div>

      {/* Bar chart */}
      <div className="flex items-end justify-between gap-2" style={{ height: 80 }}>
        {hrvData.map((d, i) => {
          const height = (d.value / maxHrv) * 100;
          const isToday = i === hrvData.length - 1;
          return (
            <div key={d.day} className="flex flex-1 flex-col items-center gap-1">
              <div
                className={`w-full rounded-t ${isToday ? 'bg-accent' : 'bg-info'}`}
                style={{ height: `${height}%` }}
                title={`${d.day}: ${d.value} ms`}
              />
              <span className="text-[10px] text-gray-400">{d.day}</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
