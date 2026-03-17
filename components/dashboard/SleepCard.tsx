import { Card } from '@/components/ui/Card';

const sleepData = {
  total: '7h 12m',
  score: 78,
  deep: 62,
  light: 198,
  rem: 95,
  awake: 17,
  wakeEvents: 3,
};

const totalMinutes = sleepData.deep + sleepData.light + sleepData.rem + sleepData.awake;

const stages = [
  { label: 'Deep', minutes: sleepData.deep, color: 'bg-[#534AB7]', pct: (sleepData.deep / totalMinutes) * 100 },
  { label: 'Light', minutes: sleepData.light, color: 'bg-[#AFA9EC]', pct: (sleepData.light / totalMinutes) * 100 },
  { label: 'REM', minutes: sleepData.rem, color: 'bg-accent', pct: (sleepData.rem / totalMinutes) * 100 },
  { label: 'Awake', minutes: sleepData.awake, color: 'bg-warning', pct: (sleepData.awake / totalMinutes) * 100 },
];

export function SleepCard() {
  return (
    <Card>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Last Night&apos;s Sleep
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-gray-900 dark:text-white">{sleepData.total}</span>
          <span className="text-sm text-gray-400">Score: {sleepData.score}</span>
        </div>
      </div>

      {/* Stacked bar */}
      <div className="mb-3 flex h-6 overflow-hidden rounded-full">
        {stages.map((stage) => (
          <div
            key={stage.label}
            className={`${stage.color} transition-all`}
            style={{ width: `${stage.pct}%` }}
            title={`${stage.label}: ${stage.minutes}m`}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs">
        {stages.map((stage) => (
          <div key={stage.label} className="flex items-center gap-1.5">
            <div className={`h-2.5 w-2.5 rounded-sm ${stage.color}`} />
            <span className="text-gray-600 dark:text-gray-400">
              {stage.label} {stage.minutes}m
            </span>
          </div>
        ))}
        <div className="ml-auto text-gray-400">
          {sleepData.wakeEvents} wake events
        </div>
      </div>
    </Card>
  );
}
