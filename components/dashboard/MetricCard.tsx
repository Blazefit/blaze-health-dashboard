import { Card } from '@/components/ui/Card';

interface MetricCardProps {
  label: string;
  value: string;
  delta?: string;
  deltaType?: 'positive' | 'negative' | 'neutral';
}

export function MetricCard({ label, value, delta, deltaType = 'neutral' }: MetricCardProps) {
  const deltaColor =
    deltaType === 'positive'
      ? 'text-accent'
      : deltaType === 'negative'
      ? 'text-danger'
      : 'text-gray-500 dark:text-gray-400';

  return (
    <Card>
      <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
        {label}
      </p>
      <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
      {delta && (
        <p className={`mt-1 text-sm font-medium ${deltaColor}`}>{delta}</p>
      )}
    </Card>
  );
}
