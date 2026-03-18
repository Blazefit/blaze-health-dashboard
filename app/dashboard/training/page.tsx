'use client';

import { useState, useMemo } from 'react';
import { useActiveProgram, useWorkoutLogs } from '@/hooks/useTraining';
import { ProgramView } from '@/components/training/ProgramView';
import { ProgramGenerator } from '@/components/training/ProgramGenerator';
import { WorkoutLogger } from '@/components/training/WorkoutLogger';
import {
  Dumbbell, CalendarDays, Sparkles, ClipboardList, Loader2, CheckCircle2,
} from 'lucide-react';
import { normalizeProgramData } from '@/lib/training-utils';
import type { ProgramDay, TrainingProgram, WorkoutLog } from '@/lib/types';

const TABS = [
  { id: 'program', label: 'Program', Icon: ClipboardList },
  { id: 'log', label: 'Log Workout', Icon: Dumbbell },
  { id: 'history', label: 'History', Icon: CalendarDays },
  { id: 'generate', label: 'Generate', Icon: Sparkles },
];

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/** Find the current week's days using the shared normalizer */
function getCurrentWeekDays(program: TrainingProgram): ProgramDay[] {
  const weeks = normalizeProgramData(program);
  const currentWeekIdx = Math.max(0, (program.current_week || 1) - 1);
  return weeks[currentWeekIdx]?.days || weeks[0]?.days || [];
}

/** Find today's scheduled workout */
function getTodaysDay(days: ProgramDay[]): ProgramDay | null {
  const todayName = DAY_NAMES[new Date().getDay()];
  // Try exact match
  const match = days.find((d) =>
    d.day_of_week.toLowerCase() === todayName.toLowerCase()
  );
  if (match && match.exercises.length > 0) return match;
  // Fallback: first day with exercises
  return days.find((d) => d.exercises.length > 0) || null;
}

export default function TrainingPage() {
  const { program, isLoading } = useActiveProgram();
  const { logs, mutate: mutateLogs } = useWorkoutLogs(program?.id);
  const [activeTab, setActiveTab] = useState('program');
  const [selectedDayIdx, setSelectedDayIdx] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Get current week's days
  const weekDays = useMemo(() => {
    if (!program) return [];
    return getCurrentWeekDays(program);
  }, [program]);

  // The day to log
  const logDay = useMemo(() => {
    if (selectedDayIdx !== null && weekDays[selectedDayIdx]) return weekDays[selectedDayIdx];
    return getTodaysDay(weekDays);
  }, [weekDays, selectedDayIdx]);

  // Save workout to API
  async function handleSaveWorkout(log: WorkoutLog) {
    setSaving(true);
    try {
      const body = {
        program_id: program?.id,
        date: log.date,
        week_number: program?.current_week || 1,
        day_of_week: log.day_of_week,
        day_label: log.day_label,
        exercises: log.exercises,
        session_rpe: log.session_rpe,
        notes: log.notes,
        completed: log.completed,
      };
      const res = await fetch('/api/training/workouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Save failed');
      await mutateLogs();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Workout save failed:', err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-6 max-w-5xl">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>Training</h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--muted)' }}>
          {program ? `${program.name} · Week ${program.current_week || 1} of ${program.duration_weeks}` : 'Programs and workout logging'}
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 rounded-xl p-1" style={{ background: 'var(--surface)' }}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all"
              style={{
                background: isActive ? 'var(--surface-2)' : 'transparent',
                color: isActive ? 'var(--foreground)' : 'var(--muted)',
              }}
            >
              <tab.Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin" style={{ color: 'var(--green)' }} />
        </div>
      )}

      {/* No program empty state */}
      {!isLoading && !program && activeTab !== 'generate' && (
        <div
          className="flex flex-col items-center justify-center rounded-xl px-6 py-16 text-center"
          style={{ background: 'var(--surface)', border: '2px dashed var(--border)' }}
        >
          <div className="mb-4 rounded-full p-4" style={{ background: 'var(--surface-2)' }}>
            <Dumbbell className="h-8 w-8" style={{ color: 'var(--muted)' }} />
          </div>
          <h3 className="mb-2 text-lg font-semibold" style={{ color: 'var(--foreground)' }}>No active program</h3>
          <p className="mb-6 max-w-sm text-sm" style={{ color: 'var(--muted)' }}>
            Generate a training program to get started with workout logging.
          </p>
          <button
            onClick={() => setActiveTab('generate')}
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-white hover:brightness-110"
            style={{ background: 'var(--green)' }}
          >
            <Sparkles className="h-4 w-4" />
            Generate Program
          </button>
        </div>
      )}

      {/* Current Program Tab */}
      {!isLoading && activeTab === 'program' && program && (
        <ProgramView program={program} />
      )}

      {/* Log Workout Tab */}
      {!isLoading && activeTab === 'log' && program && (
        <div className="space-y-5">
          {/* Day picker */}
          {weekDays.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {weekDays.map((day, i) => {
                const isSelected = logDay === day;
                const isRest = day.exercises.length === 0;
                const todayName = DAY_NAMES[new Date().getDay()];
                const isToday = day.day_of_week.toLowerCase() === todayName.toLowerCase();
                // Check if already logged today for this day
                const alreadyLogged = logs.some(
                  (l) => l.day_label === day.label && l.date === new Date().toISOString().split('T')[0]
                );

                return (
                  <button
                    key={i}
                    onClick={() => !isRest && setSelectedDayIdx(i)}
                    disabled={isRest}
                    className="rounded-xl px-4 py-3 text-left transition-all disabled:opacity-40"
                    style={{
                      background: isSelected ? 'var(--green-bg)' : 'var(--surface)',
                      border: `1px solid ${isSelected ? 'var(--green)' : isToday ? 'var(--amber)' : 'var(--border)'}`,
                      minWidth: 110,
                    }}
                  >
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-xs font-medium" style={{ color: isSelected ? 'var(--green)' : isToday ? 'var(--amber)' : 'var(--muted)' }}>
                        {day.day_of_week.slice(0, 3)}
                      </span>
                      {isToday && (
                        <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full" style={{ background: 'var(--amber-bg)', color: 'var(--amber)' }}>
                          TODAY
                        </span>
                      )}
                      {alreadyLogged && (
                        <CheckCircle2 className="h-3 w-3" style={{ color: 'var(--green)' }} />
                      )}
                    </div>
                    <p className="text-xs truncate" style={{ color: isRest ? 'var(--muted-2)' : 'var(--foreground)' }}>
                      {isRest ? 'Rest' : day.label}
                    </p>
                  </button>
                );
              })}
            </div>
          )}

          {/* Save success banner */}
          {saveSuccess && (
            <div
              className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium"
              style={{ background: 'var(--green-bg)', color: 'var(--green)' }}
            >
              <CheckCircle2 className="h-4 w-4" />
              Workout saved successfully!
            </div>
          )}

          {/* Logger */}
          {logDay ? (
            <WorkoutLogger
              key={logDay.label}
              day={logDay}
              onSave={handleSaveWorkout}
            />
          ) : (
            <div
              className="rounded-xl p-8 text-center"
              style={{ background: 'var(--surface)', border: '2px dashed var(--border)' }}
            >
              <Dumbbell className="h-8 w-8 mx-auto mb-3" style={{ color: 'var(--muted-2)' }} />
              <p className="text-sm" style={{ color: 'var(--muted)' }}>
                No workout scheduled. Select a training day above.
              </p>
            </div>
          )}

          {saving && (
            <div className="fixed bottom-6 right-6 flex items-center gap-2 rounded-xl px-4 py-3 shadow-lg" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <Loader2 className="h-4 w-4 animate-spin" style={{ color: 'var(--green)' }} />
              <span className="text-sm" style={{ color: 'var(--muted)' }}>Saving workout…</span>
            </div>
          )}
        </div>
      )}

      {/* History Tab */}
      {!isLoading && activeTab === 'history' && (
        <div className="space-y-4">
          {logs.length === 0 ? (
            <div
              className="rounded-xl p-8 text-center"
              style={{ background: 'var(--surface)', border: '2px dashed var(--border)' }}
            >
              <CalendarDays className="h-8 w-8 mx-auto mb-3" style={{ color: 'var(--muted-2)' }} />
              <p className="text-sm" style={{ color: 'var(--muted)' }}>No workouts logged yet. Hit the gym!</p>
            </div>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className="rounded-xl p-5"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold" style={{ color: 'var(--foreground)' }}>{log.day_label}</h3>
                    <p className="text-xs" style={{ color: 'var(--muted)' }}>
                      {log.day_of_week} · {new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      {log.week_number ? ` · Week ${log.week_number}` : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {log.session_rpe && (
                      <span
                        className="rounded-full px-2.5 py-0.5 text-xs font-medium"
                        style={{ background: 'var(--blue-bg)', color: 'var(--blue)' }}
                      >
                        RPE {log.session_rpe}
                      </span>
                    )}
                    {log.completed && (
                      <CheckCircle2 className="h-4 w-4" style={{ color: 'var(--green)' }} />
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {log.exercises.map((ex) => (
                    <span
                      key={ex.name}
                      className="rounded-lg px-2.5 py-1 text-xs"
                      style={{ background: 'var(--surface-2)', color: 'var(--muted)' }}
                    >
                      {ex.name} · {ex.sets.length} sets
                    </span>
                  ))}
                </div>
                {log.notes && (
                  <p className="mt-2 text-xs italic" style={{ color: 'var(--muted-2)' }}>{log.notes}</p>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Generate Tab */}
      {activeTab === 'generate' && <ProgramGenerator />}
    </div>
  );
}
