'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea,
} from 'recharts';

interface TrendDataPoint {
  date: string;
  value: number;
}

interface MarkerTrendProps {
  markerName: string;
  data: TrendDataPoint[];
  refLow: number;
  refHigh: number;
  optLow?: number;
  optHigh?: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-md dark:border-gray-700 dark:bg-gray-800">
      <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
      <p className="text-sm font-semibold text-gray-900 dark:text-white">
        {payload[0].value}
      </p>
    </div>
  );
}

export function MarkerTrend({
  markerName,
  data,
  refLow,
  refHigh,
  optLow,
  optHigh,
}: MarkerTrendProps) {
  if (!data.length) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-gray-400">
        No trend data for {markerName}.
      </div>
    );
  }

  // Compute Y-axis domain with a little padding
  const values = data.map((d) => d.value);
  const allPoints = [...values, refLow, refHigh, optLow ?? refLow, optHigh ?? refHigh];
  const yMin = Math.floor(Math.min(...allPoints) * 0.9);
  const yMax = Math.ceil(Math.max(...allPoints) * 1.1);

  return (
    <div className="w-full">
      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
        {markerName}
      </p>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />

          {/* Standard reference range — light gray band */}
          <ReferenceArea
            y1={refLow}
            y2={refHigh}
            fill="#E5E7EB"
            fillOpacity={0.5}
            stroke="none"
          />

          {/* Functional / optimal range — light green band */}
          {optLow !== undefined && optHigh !== undefined && (
            <ReferenceArea
              y1={optLow}
              y2={optHigh}
              fill="#1D9E75"
              fillOpacity={0.12}
              stroke="none"
            />
          )}

          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: '#9CA3AF' }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            domain={[yMin, yMax]}
            tick={{ fontSize: 11, fill: '#9CA3AF' }}
            tickLine={false}
            axisLine={false}
            width={40}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#1D9E75"
            strokeWidth={2}
            dot={{ r: 4, fill: '#1D9E75', strokeWidth: 0 }}
            activeDot={{ r: 6, fill: '#1D9E75' }}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-sm bg-gray-200 dark:bg-gray-600" />
          Standard range ({refLow}–{refHigh})
        </span>
        {optLow !== undefined && optHigh !== undefined && (
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded-sm bg-[#1D9E75]/20" />
            Functional range ({optLow}–{optHigh})
          </span>
        )}
      </div>
    </div>
  );
}
