'use client';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Cell,
} from 'recharts';
import type { GarminDaily } from '@/lib/types';

interface HrvChartProps {
  data: GarminDaily[];
  days?: number;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function HrvChart({ data, days = 7 }: HrvChartProps) {
  const sliced = [...data]
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-days);

  const avg =
    sliced.length > 0
      ? Math.round(
          sliced.reduce((sum, d) => sum + d.hrv_overnight_avg, 0) / sliced.length
        )
      : 0;

  const chartData = sliced.map((d, i) => ({
    date: formatDate(d.date),
    hrv: d.hrv_overnight_avg,
    isToday: i === sliced.length - 1,
  }));

  const tooltipStyle = {
    fontSize: 12,
    borderRadius: 8,
    border: '1px solid #E5E7EB',
  };

  if (days <= 7) {
    return (
      <div className="space-y-3">
        <div className="flex items-baseline gap-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            7-day average:
          </span>
          <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
            {avg} ms
          </span>
        </div>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 4, right: 8, left: -10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: '#9CA3AF' }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#9CA3AF' }}
                tickLine={false}
                axisLine={false}
                domain={['auto', 'auto']}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(v) => [`${v} ms`, 'HRV']}
              />
              <ReferenceLine y={avg} stroke="#9CA3AF" strokeDasharray="4 4" label={{ value: `Avg ${avg}`, fill: '#9CA3AF', fontSize: 10, position: 'insideTopRight' }} />
              <Bar dataKey="hrv" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={entry.isToday ? '#1D9E75' : '#378ADD'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex gap-4 text-xs text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-sm bg-[#378ADD]" />
            Previous days
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-sm bg-[#1D9E75]" />
            Today
          </span>
        </div>
      </div>
    );
  }

  // 30-day line chart
  return (
    <div className="space-y-3">
      <div className="flex items-baseline gap-2">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          30-day average:
        </span>
        <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
          {avg} ms
        </span>
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
              contentStyle={tooltipStyle}
              formatter={(v) => [`${v} ms`, 'HRV']}
            />
            <ReferenceLine y={avg} stroke="#9CA3AF" strokeDasharray="4 4" />
            <Line
              type="monotone"
              dataKey="hrv"
              stroke="#378ADD"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: '#378ADD' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
