import { Card } from '@/components/ui/Card';

interface FlaggedMarker {
  name: string;
  value: string;
  range: string;
  status: 'flagged' | 'borderline';
}

const demoFlags: FlaggedMarker[] = [
  { name: 'Ferritin', value: '227 ng/mL', range: '30-150', status: 'flagged' },
  { name: 'LDL-P', value: '1438 nmol/L', range: '<1000', status: 'flagged' },
  { name: 'Homocysteine', value: '9.3 µmol/L', range: '<7.0', status: 'borderline' },
  { name: 'Time Below 70 (CGM)', value: '8%', range: '<4%', status: 'flagged' },
];

export function PriorityFlags() {
  return (
    <Card>
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
        Priority Flags
      </h2>
      <div className="space-y-3">
        {demoFlags.map((marker) => (
          <div
            key={marker.name}
            className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3 dark:bg-gray-800"
          >
            <div className="flex items-center gap-3">
              <div
                className={`h-2.5 w-2.5 rounded-full ${
                  marker.status === 'flagged' ? 'bg-danger' : 'bg-warning'
                }`}
              />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {marker.name}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span
                className={`text-sm font-semibold ${
                  marker.status === 'flagged' ? 'text-danger' : 'text-warning'
                }`}
              >
                {marker.value}
              </span>
              <span className="text-xs text-gray-400">{marker.range}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
