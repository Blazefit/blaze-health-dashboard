'use client';

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceArea,
} from 'recharts';

interface Reading {
  timestamp: string;
  glucose_mg_dl: number;
}

interface GlucoseTrendProps {
  readings: Reading[];
}

function formatTime(ts: string) {
  const d = new Date(ts);
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

function formatXAxis(ts: string) {
  const d = new Date(ts);
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    hour12: true,
  });
}

// Custom dot — only renders when glucose < 54
function CriticalDot(props: {
  cx?: number;
  cy?: number;
  payload?: { glucose_mg_dl: number };
}) {
  const { cx, cy, payload } = props;
  if (!payload || payload.glucose_mg_dl >= 54) return null;
  return (
    <circle
      cx={cx}
      cy={cy}
      r={5}
      fill="#EF4444"
      stroke="#fff"
      strokeWidth={2}
    />
  );
}

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: Reading }[];
}) => {
  if (!active || !payload?.length) return null;
  const r = payload[0].payload;
  const value = r.glucose_mg_dl;
  const color =
    value < 54 ? '#EF4444' : value < 70 ? '#F59E0B' : '#7F77DD';
  return (
    <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-md dark:border-gray-700 dark:bg-gray-800">
      <p className="text-xs text-gray-500 dark:text-gray-400">
        {formatTime(r.timestamp)}
      </p>
      <p className="mt-0.5 text-sm font-bold" style={{ color }}>
        {value} mg/dL
      </p>
      {value < 70 && (
        <p className="text-xs text-red-500">
          {value < 54 ? 'Critical Low' : 'Low'}
        </p>
      )}
    </div>
  );
};

export function GlucoseTrend({ readings }: GlucoseTrendProps) {
  const sorted = [...readings].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  // Find min/max timestamps for ReferenceArea domain
  const timestamps = sorted.map((r) => r.timestamp);

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={sorted}
          margin={{ top: 8, right: 16, left: 0, bottom: 4 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            dataKey="timestamp"
            tickFormatter={formatXAxis}
            tick={{ fontSize: 11, fill: '#9CA3AF' }}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            domain={[40, 160]}
            tick={{ fontSize: 11, fill: '#9CA3AF' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `${v}`}
            width={36}
          />
          <Tooltip content={<CustomTooltip />} />

          {/* Shade hypo zone */}
          <ReferenceArea
            x1={timestamps[0]}
            x2={timestamps[timestamps.length - 1]}
            y1={40}
            y2={70}
            fill="#FEE2E2"
            fillOpacity={0.5}
          />

          <Line
            type="monotone"
            dataKey="glucose_mg_dl"
            stroke="#7F77DD"
            strokeWidth={2}
            dot={<CriticalDot />}
            activeDot={{ r: 5, fill: '#7F77DD' }}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
