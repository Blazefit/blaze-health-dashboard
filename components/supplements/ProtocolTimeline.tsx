'use client';

import { Sun, UtensilsCrossed, Moon, Zap } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { StatusPill } from '@/components/ui/StatusPill';
import type { SupplementProtocol, Supplement } from '@/lib/types';

interface ProtocolTimelineProps {
  protocol: SupplementProtocol;
}

type TimingGroup = {
  key: string;
  label: string;
  Icon: React.ElementType;
  iconClass: string;
  borderClass: string;
  headerClass: string;
};

const TIMING_GROUPS: TimingGroup[] = [
  {
    key: 'morning',
    label: 'Morning',
    Icon: Sun,
    iconClass: 'text-yellow-500',
    borderClass: 'border-yellow-100 dark:border-yellow-900/30',
    headerClass: 'bg-yellow-50 dark:bg-yellow-900/10',
  },
  {
    key: 'with_meal',
    label: 'With Meal',
    Icon: UtensilsCrossed,
    iconClass: 'text-green-500',
    borderClass: 'border-green-100 dark:border-green-900/30',
    headerClass: 'bg-green-50 dark:bg-green-900/10',
  },
  {
    key: 'bedtime',
    label: 'Bedtime',
    Icon: Moon,
    iconClass: 'text-blue-500',
    borderClass: 'border-blue-100 dark:border-blue-900/30',
    headerClass: 'bg-blue-50 dark:bg-blue-900/10',
  },
  {
    key: 'active',
    label: 'Active Compounds',
    Icon: Zap,
    iconClass: 'text-purple-500',
    borderClass: 'border-purple-100 dark:border-purple-900/30',
    headerClass: 'bg-purple-50 dark:bg-purple-900/10',
  },
];


function SupplementRow({ supplement }: { supplement: Supplement }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0 dark:border-gray-800">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-sm text-gray-900 dark:text-white">
            {supplement.name}
          </span>
          {supplement.is_peptide && (
            <StatusPill label="Peptide" variant="purple" />
          )}
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          {supplement.dose} {supplement.unit} &middot; {supplement.frequency}
        </p>
        {supplement.genomic_rationale && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 italic">
            {supplement.genomic_rationale}
          </p>
        )}
      </div>
      {supplement.is_peptide && supplement.cycle_on_weeks && (
        <div className="shrink-0 text-right text-xs text-gray-400">
          <p>{supplement.cycle_on_weeks}w on</p>
          <p>{supplement.cycle_off_weeks}w off</p>
        </div>
      )}
    </div>
  );
}

export function ProtocolTimeline({ protocol }: ProtocolTimelineProps) {
  // Group supplements by timing
  const grouped = TIMING_GROUPS.map((group) => ({
    ...group,
    supplements: protocol.supplements.filter((s) => {
      if (group.key === 'with_meal') {
        return s.timing === 'with_meal' || s.timing === 'pre_workout' || s.timing === 'post_workout';
      }
      return s.timing === group.key;
    }),
  })).filter((g) => g.supplements.length > 0);

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">{protocol.name}</h2>
          {protocol.start_date && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Started {new Date(protocol.start_date).toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric',
              })}
            </p>
          )}
        </div>
        <StatusPill label={protocol.is_active ? 'Active' : 'Inactive'} variant={protocol.is_active ? 'green' : 'gray'} />
      </div>

      {grouped.map((group) => {
        const { Icon } = group;
        return (
          <Card key={group.key} padding={false}>
            <div className={`flex items-center gap-2 px-4 py-3 rounded-t-xl border-b ${group.borderClass} ${group.headerClass}`}>
              <Icon className={`h-4 w-4 ${group.iconClass}`} />
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                {group.label}
              </h3>
              <span className="ml-auto text-xs text-gray-400">
                {group.supplements.length} {group.supplements.length === 1 ? 'item' : 'items'}
              </span>
            </div>
            <div className="px-4">
              {group.supplements.map((s, i) => (
                <SupplementRow key={i} supplement={s} />
              ))}
            </div>
          </Card>
        );
      })}

      {protocol.notes && (
        <p className="text-xs text-gray-400 dark:text-gray-500 italic px-1">{protocol.notes}</p>
      )}
    </div>
  );
}
