'use client';

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import type { GarminDaily } from '@/lib/types';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface RestingHrChartProps {
  data: GarminDaily[];
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function detectTrend(values: number[]): 'up' | 'down' | 'stable' {
  if (values.length < 3) return 'stable';
  const recent = values.slice(-7);
  const first = recent.slice(0, Math.ceil(recent.length / 2));
  const last = recent.slice(Math.floor(recent.length / 2));
  const firstAvg = first.reduce((a, b) => a + b, 0) / first.length;
  const lastAvg = last.reduce((a, b) => a + b, 0) / last.length;
  const diff = lastAvg - firstAvg;
  if (diff > 1.5) return 'up';
  if (diff < -1.5) return 'down';
  return 'stable';
}

export function RestingHrChart({ data }: RestingHrChartProps) {
  const sorted = [...data]
    .sort((a, b) => a.date.localeCompare(b.date));

  const chartData = sorted.map((d) => ({
    date: formatDate(d.date),
    rhr: d.resting_hr,
  }));

  const trend = detectTrend(sorted.map((d) => d.resting_hr));
  const isAlert = trend === 'up';

  const trendConfig = {
    up: {
      icon: TrendingUp,
      label: 'Upward trend — monitor closely',
      color: 'text-red-600 dark:text-red-400',
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-800',
    },
    down: {
      icon: TrendingDown,
      label: 'Declining — positive recovery signal',
      color: 'text-green-600 dark:text-green-400',
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-200 dark:border-green-800',
    },
    stable: {
      icon: Minus,
      label: 'Stable over last 7 days',
      color: 'text-gray-600 dark:text-gray-400',
      bg: 'bg-gray-50 dark:bg-gray-800/50',
      border: 'border-gray-200 dark:border-gray-700',
    },
  }[trend];

  const TrendIcon = trendConfig.icon;
  const latestRhr = sorted[sorted.length - 1]?.resting_hr;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Latest Resting HR
          </p>
          <p className={`mt-1 text-3xl font-bold ${isAlert ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
            {latestRhr} <span className="text-base font-normal text-gray-400">bpm</span>
          </p>
        </div>
        <div className={`flex items-center gap-2 rounded-lg border px-3 py-2 ${trendConfig.bg} ${trendConfig.border}`}>
          <TrendIcon className={`h-4 w-4 ${trendConfig.color}`} />
          <span className={`text-xs font-medium ${trendConfig.color}`}>
            {trendConfig.label}
          </span>
        </div>
      </div>

      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 4, right: 8, left: -10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: '#9CA3AF' }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#9CA3AF' }}
              tickLine={false}
              axisLine={false}
              domain={['auto', 'auto']}
            />
            <Tooltip
              contentStyle={{
                fontSize: 12,
                borderRadius: 8,
                border: '1px solid #E5E7EB',
              }}
              formatter={(v) => [`${v} bpm`, 'Resting HR']}
            />
            <Line
              type="monotone"
              dataKey="rhr"
              stroke={isAlert ? '#EF4444' : '#378ADD'}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
