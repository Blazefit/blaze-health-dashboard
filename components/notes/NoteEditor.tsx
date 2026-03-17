'use client';

import { useState } from 'react';
import { HealthNote } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { StatusPill } from '@/components/ui/StatusPill';

interface NoteEditorProps {
  onSave: (note: { content: string; tags: string[]; date: string }) => void;
  initialNote?: HealthNote;
  onCancel?: () => void;
}

const AVAILABLE_TAGS: Array<{ value: string; label: string }> = [
  { value: 'supplements', label: 'Supplements' },
  { value: 'training', label: 'Training' },
  { value: 'genomics', label: 'Genomics' },
  { value: 'adverse_reaction', label: 'Adverse Reaction' },
  { value: 'protocol_change', label: 'Protocol Change' },
  { value: 'lab_scheduled', label: 'Lab Scheduled' },
  { value: 'key_finding', label: 'Key Finding' },
  { value: 'cgm', label: 'CGM' },
  { value: 'garmin', label: 'Garmin' },
  { value: 'general', label: 'General' },
];

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

function todayString(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function NoteEditor({ onSave, initialNote, onCancel }: NoteEditorProps) {
  const [content, setContent] = useState(initialNote?.content ?? '');
  const [date, setDate] = useState(initialNote?.date ?? todayString());
  const [selectedTags, setSelectedTags] = useState<string[]>(initialNote?.tags ?? []);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSave = () => {
    if (!content.trim()) return;
    onSave({ content: content.trim(), tags: selectedTags, date });
  };

  return (
    <Card className="mb-6">
      <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
        {initialNote ? 'Edit Note' : 'New Note'}
      </h2>

      <div className="space-y-4">
        {/* Date picker */}
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        {/* Content textarea */}
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
            Note
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter your health observation, finding, or protocol change..."
            rows={4}
            className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent resize-none"
          />
        </div>

        {/* Tag picker */}
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
            Tags
          </label>
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_TAGS.map((tag) => {
              const isSelected = selectedTags.includes(tag.value);
              const color = TAG_COLORS[tag.value] ?? 'gray';
              return (
                <button
                  key={tag.value}
                  type="button"
                  onClick={() => toggleTag(tag.value)}
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium transition-all border-2 ${
                    isSelected
                      ? 'border-accent ring-1 ring-accent'
                      : 'border-transparent opacity-60 hover:opacity-90'
                  }`}
                >
                  <StatusPill label={tag.label} variant={color} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={handleSave}
            disabled={!content.trim()}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {initialNote ? 'Update Note' : 'Save Note'}
          </button>
          {onCancel && (
            <button
              onClick={onCancel}
              className="rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </Card>
  );
}
