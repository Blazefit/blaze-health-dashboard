'use client';

interface Reading {
  timestamp: string;
  glucose_mg_dl: number;
}

interface HypoLogProps {
  readings: Reading[];
}

function getPeriod(hour: number): string {
  if (hour >= 21 || hour < 6) return 'Overnight';
  if (hour >= 18) return 'Evening';
  if (hour >= 12) return 'Afternoon';
  return 'Daytime';
}

function formatDate(ts: string) {
  return new Date(ts).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatTime(ts: string) {
  return new Date(ts).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export function HypoLog({ readings }: HypoLogProps) {
  const hypoReadings = readings
    .filter((r) => r.glucose_mg_dl < 70)
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

  if (hypoReadings.length === 0) {
    return (
      <p className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
        No readings below 70 mg/dL in this period.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <th className="pb-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Date
            </th>
            <th className="pb-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Time
            </th>
            <th className="pb-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Value
            </th>
            <th className="pb-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Period
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
          {hypoReadings.map((r) => {
            const hour = new Date(r.timestamp).getHours();
            const isCritical = r.glucose_mg_dl < 54;
            const valueColor = isCritical
              ? 'text-red-600 dark:text-red-400 font-semibold'
              : 'text-yellow-600 dark:text-yellow-400 font-semibold';

            return (
              <tr key={r.timestamp} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className="py-2.5 pr-4 text-gray-700 dark:text-gray-300">
                  {formatDate(r.timestamp)}
                </td>
                <td className="py-2.5 pr-4 text-gray-700 dark:text-gray-300">
                  {formatTime(r.timestamp)}
                </td>
                <td className={`py-2.5 pr-4 ${valueColor}`}>
                  {r.glucose_mg_dl} mg/dL
                  {isCritical && (
                    <span className="ml-1.5 inline-flex items-center rounded-full bg-red-100 px-1.5 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900/30 dark:text-red-400">
                      Critical
                    </span>
                  )}
                </td>
                <td className="py-2.5 text-gray-500 dark:text-gray-400">
                  {getPeriod(hour)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
