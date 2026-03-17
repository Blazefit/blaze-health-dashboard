'use client';

import { useState } from 'react';
import { useDemo } from '@/hooks/useDemo';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { StatusPill } from '@/components/ui/StatusPill';
import { NoteEntry } from '@/components/notes/NoteEntry';
import { NoteEditor } from '@/components/notes/NoteEditor';
import { StickyNote, Plus } from 'lucide-react';
import { HealthNote } from '@/lib/types';

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

const ALL_TAGS = Object.keys(TAG_LABELS);

const DEMO_NOTES: HealthNote[] = [
  {
    id: 'note-1',
    user_id: 'demo',
    date: '2026-03-10',
    content:
      'Switched off CJC-1295 after notable histamine response — flushing and mild urticaria within 30 min of injection. Cross-referencing HNMT and MAO-B variants. Will hold peptide for 2 weeks and reassess with low-dose antihistamine pre-treatment.',
    tags: ['adverse_reaction', 'supplements', 'genomics'],
    created_at: '2026-03-10T10:00:00Z',
    updated_at: '2026-03-10T10:00:00Z',
  },
  {
    id: 'note-2',
    user_id: 'demo',
    date: '2026-03-05',
    content:
      'Added heavy primer set (3×3 @ 90%) before main working sets for squat and bench. Initial session showed improved bar speed and reduced perceived effort on top sets. Will monitor for CNS fatigue over 3-week block.',
    tags: ['training', 'key_finding'],
    created_at: '2026-03-05T09:00:00Z',
    updated_at: '2026-03-05T09:00:00Z',
  },
  {
    id: 'note-3',
    user_id: 'demo',
    date: '2026-02-28',
    content:
      'CGM showing repeated overnight lows between 53–58 mg/dL from ~2–4 AM. Correlates with high training load days. Suspecting glycogen depletion + GLUT4 upregulation from ACTN3 TT. Consider adding 20g slow-release carbs pre-bed on heavy training days.',
    tags: ['cgm', 'genomics', 'key_finding'],
    created_at: '2026-02-28T08:00:00Z',
    updated_at: '2026-02-28T08:00:00Z',
  },
  {
    id: 'note-4',
    user_id: 'demo',
    date: '2026-02-20',
    content:
      'Ferritin trending downward across last 3 draws: 94 → 78 → 61 ng/mL. Likely driven by high training volume and chronic low-grade inflammation. Increasing iron-rich food intake and adding vitamin C with meals. Lab re-draw scheduled for March 15.',
    tags: ['supplements', 'lab_scheduled'],
    created_at: '2026-02-20T11:00:00Z',
    updated_at: '2026-02-20T11:00:00Z',
  },
  {
    id: 'note-5',
    user_id: 'demo',
    date: '2026-02-15',
    content:
      'Adjusting training approach based on ACTN3 TT genotype — fast-twitch fiber dominance confirmed. Shifting from high-rep hypertrophy blocks to power-focused periodization (3–5 rep range, longer rest intervals). Expect better strength adaptation and lower injury risk.',
    tags: ['genomics', 'training'],
    created_at: '2026-02-15T07:00:00Z',
    updated_at: '2026-02-15T07:00:00Z',
  },
  {
    id: 'note-6',
    user_id: 'demo',
    date: '2026-02-10',
    content:
      'Quarterly comprehensive lab panel scheduled for March 15 at Quest Diagnostics. Panel includes full metabolic, CBC, lipid advanced (NMR), hormonal (TT, FT, E2, SHBG, LH, FSH), thyroid (TSH, fT3, fT4), inflammatory markers (hsCRP, IL-6), and ferritin.',
    tags: ['lab_scheduled'],
    created_at: '2026-02-10T14:00:00Z',
    updated_at: '2026-02-10T14:00:00Z',
  },
];

export default function NotesPage() {
  const { isDemo } = useDemo();
  const [showEditor, setShowEditor] = useState(false);
  const [userNotes, setUserNotes] = useState<HealthNote[]>([]);
  const [activeTagFilter, setActiveTagFilter] = useState<string | null>(null);

  const notes = isDemo ? DEMO_NOTES : userNotes;

  const filteredNotes = activeTagFilter
    ? notes.filter((n) => n.tags.includes(activeTagFilter))
    : notes;

  // Sort newest first
  const sortedNotes = [...filteredNotes].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const handleSave = (data: { content: string; tags: string[]; date: string }) => {
    const newNote: HealthNote = {
      id: `note-${Date.now()}`,
      user_id: 'user',
      date: data.date,
      content: data.content,
      tags: data.tags,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setUserNotes((prev) => [newNote, ...prev]);
    setShowEditor(false);
  };

  if (!isDemo && userNotes.length === 0 && !showEditor) {
    return (
      <div className="p-6">
        <PageHeader title="Health Notes" description="Clinical journal and observations">
          <button
            onClick={() => setShowEditor(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Note
          </button>
        </PageHeader>
        {showEditor && (
          <NoteEditor onSave={handleSave} onCancel={() => setShowEditor(false)} />
        )}
        <EmptyState
          icon={StickyNote}
          title="No notes yet"
          description="Add health notes to track observations, protocol changes, and clinical findings."
          ctaLabel="Add Note"
          onCtaClick={() => setShowEditor(true)}
        />
      </div>
    );
  }

  return (
    <div className="p-6">
      <PageHeader title="Health Notes" description="Clinical journal and observations">
        <button
          onClick={() => setShowEditor((v) => !v)}
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Note
        </button>
      </PageHeader>

      {showEditor && (
        <NoteEditor onSave={handleSave} onCancel={() => setShowEditor(false)} />
      )}

      {/* Tag filter row */}
      {notes.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2 items-center">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 mr-1">
            Filter:
          </span>
          <button
            onClick={() => setActiveTagFilter(null)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors border ${
              activeTagFilter === null
                ? 'bg-gray-900 text-white border-gray-900 dark:bg-white dark:text-gray-900 dark:border-white'
                : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500'
            }`}
          >
            All
          </button>
          {ALL_TAGS.filter((tag) => notes.some((n) => n.tags.includes(tag))).map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTagFilter(tag === activeTagFilter ? null : tag)}
              className={`transition-opacity ${
                activeTagFilter === tag ? 'opacity-100 ring-2 ring-offset-1 ring-accent rounded-full' : 'opacity-70 hover:opacity-100'
              }`}
            >
              <StatusPill label={TAG_LABELS[tag]} variant={TAG_COLORS[tag] ?? 'gray'} />
            </button>
          ))}
        </div>
      )}

      {/* Notes list */}
      {sortedNotes.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
          No notes match the selected filter.
        </p>
      ) : (
        <div className="space-y-4">
          {sortedNotes.map((note) => (
            <NoteEntry key={note.id} note={note} />
          ))}
        </div>
      )}
    </div>
  );
}
