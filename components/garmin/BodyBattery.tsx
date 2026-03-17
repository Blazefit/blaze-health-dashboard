'use client';

import type { GarminDaily } from '@/lib/types';

interface BodyBatteryProps {
  data: GarminDaily;
}

function getBatteryColor(value: number): string {
  if (value >= 70) return '#1D9E75';
  if (value >= 40) return '#378ADD';
  if (value >= 20) return '#EF9F27';
  return '#EF4444';
}

function getBatteryLabel(value: number): string {
  if (value >= 70) return 'High Energy';
  if (value >= 40) return 'Moderate';
  if (value >= 20) return 'Low Energy';
  return 'Depleted';
}

export function BodyBattery({ data }: BodyBatteryProps) {
  const { body_battery_current, body_battery_high, body_battery_low } = data;
  const pct = Math.min(100, Math.max(0, body_battery_current));
  const color = getBatteryColor(pct);
  const label = getBatteryLabel(pct);

  return (
    <div className="space-y-6">
      {/* Current value — large display */}
      <div className="flex items-end gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Current Body Battery
          </p>
          <div className="flex items-baseline gap-2 mt-1">
            <span
              className="text-5xl font-bold"
              style={{ color }}
            >
              {body_battery_current}
            </span>
            <span className="text-base text-gray-400">/100</span>
          </div>
          <span
            className="mt-1 inline-block text-sm font-medium"
            style={{ color }}
          >
            {label}
          </span>
        </div>

        {/* High / Low stats */}
        <div className="ml-auto flex gap-6 text-right">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Today High</p>
            <p className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              {body_battery_high}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Today Low</p>
            <p className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              {body_battery_low}
            </p>
          </div>
        </div>
      </div>

      {/* Gradient bar with position marker */}
      <div className="relative">
        <div
          className="h-5 w-full overflow-hidden rounded-full"
          style={{
            background:
              'linear-gradient(to right, #EF4444 0%, #EF9F27 25%, #378ADD 50%, #1D9E75 75%, #1D9E75 100%)',
          }}
        />
        {/* Position marker */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
          style={{ left: `${pct}%` }}
        >
          <div
            className="h-7 w-3.5 rounded-sm border-2 border-white shadow-md"
            style={{ background: color }}
          />
        </div>
        {/* Scale labels */}
        <div className="mt-2 flex justify-between text-xs text-gray-400">
          <span>0</span>
          <span>25</span>
          <span>50</span>
          <span>75</span>
          <span>100</span>
        </div>
      </div>

      {/* Range context */}
      <div className="grid grid-cols-4 gap-2 text-center text-xs">
        {[
          { range: '0–19', label: 'Depleted', color: '#EF4444' },
          { range: '20–39', label: 'Low', color: '#EF9F27' },
          { range: '40–69', label: 'Moderate', color: '#378ADD' },
          { range: '70–100', label: 'High', color: '#1D9E75' },
        ].map((tier) => (
          <div
            key={tier.range}
            className="rounded-lg px-2 py-1.5"
            style={{
              background: `${tier.color}18`,
              border: `1px solid ${tier.color}40`,
            }}
          >
            <p className="font-medium" style={{ color: tier.color }}>
              {tier.label}
            </p>
            <p className="text-gray-400">{tier.range}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
