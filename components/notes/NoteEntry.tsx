'use client';

import { HealthNote } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { StatusPill } from '@/components/ui/StatusPill';

interface NoteEntryProps {
  note: HealthNote;
}

type TagColor = 'red' | 'purple' | 'blue' | 'yellow' | 'green' | 'gray';

const TAG_COLORS: Record<string, TagColor> = {
  adverse_reaction: 'red',
  key_finding: 'purple',
  protocol_change: 'blue',
  lab_scheduled: 'yellow',
  training: 'green',
  supplements: 'green',
  genomics: 'purple',
  cgm: 'blue',
  garmin: 'blue',
  general: 'gray',
};

const TAG_LABELS: Record<string, string> = {
  adverse_reaction: 'Adverse Reaction',
  key_finding: 'Key Finding',
  protocol_change: 'Protocol Change',
  lab_scheduled: 'Lab Scheduled',
  training: 'Training',
  supplements: 'Supplements',
  genomics: 'Genomics',
  cgm: 'CGM',
  garmin: 'Garmin',
  general: 'General',
};

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function NoteEntry({ note }: NoteEntryProps) {
  return (
    <Card className="transition-shadow hover:shadow-md cursor-default">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
            {formatDate(note.date)}
          </p>
          <p className="text-gray-900 dark:text-white text-sm leading-relaxed whitespace-pre-wrap">
            {note.content}
          </p>
        </div>
      </div>
      {note.tags && note.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {note.tags.map((tag) => (
            <StatusPill
              key={tag}
              label={TAG_LABELS[tag] ?? tag}
              variant={TAG_COLORS[tag] ?? 'gray'}
            />
          ))}
        </div>
      )}
    </Card>
  );
}
