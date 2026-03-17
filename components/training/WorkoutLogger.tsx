'use client';

import { useState } from 'react';
import { Save, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import type { ProgramDay, WorkoutLog, LoggedExercise, LoggedSet } from '@/lib/types';

interface WorkoutLoggerProps {
  day: ProgramDay;
  onSave: (log: WorkoutLog) => void;
}

interface SetInput {
  actual_reps: string;
  actual_weight: string;
  rpe: string;
}

type ExerciseInputs = Record<string, SetInput[]>;

const SET_TYPE_BADGE: Record<string, string> = {
  warmup: 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400',
  working: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  primer: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  backoff: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
};

export function WorkoutLogger({ day, onSave }: WorkoutLoggerProps) {
  const [inputs, setInputs] = useState<ExerciseInputs>(() => {
    const init: ExerciseInputs = {};
    day.exercises.forEach((ex) => {
      init[ex.name] = ex.sets.map((s) => ({
        actual_reps: '',
        actual_weight: s.weight !== undefined ? String(s.weight) : '',
        rpe: '',
      }));
    });
    return init;
  });

  const [sessionRpe, setSessionRpe] = useState('');
  const [notes, setNotes] = useState('');
  const [saved, setSaved] = useState(false);

  const updateSet = (
    exerciseName: string,
    setIndex: number,
    field: keyof SetInput,
    value: string
  ) => {
    setInputs((prev) => {
      const updated = { ...prev };
      updated[exerciseName] = [...updated[exerciseName]];
      updated[exerciseName][setIndex] = {
        ...updated[exerciseName][setIndex],
        [field]: value,
      };
      return updated;
    });
  };

  const handleSave = () => {
    const exercises: LoggedExercise[] = day.exercises.map((ex) => ({
      name: ex.name,
      sets: ex.sets.map((s, i): LoggedSet => ({
        set_number: s.set_number,
        target_reps: s.reps,
        target_weight: s.weight ?? 0,
        actual_reps: inputs[ex.name]?.[i]?.actual_reps
          ? Number(inputs[ex.name][i].actual_reps)
          : undefined,
        actual_weight: inputs[ex.name]?.[i]?.actual_weight
          ? Number(inputs[ex.name][i].actual_weight)
          : undefined,
        rpe: inputs[ex.name]?.[i]?.rpe
          ? Number(inputs[ex.name][i].rpe)
          : undefined,
      })),
    }));

    const log: WorkoutLog = {
      id: `log-${Date.now()}`,
      user_id: 'demo-user',
      date: new Date().toISOString().split('T')[0],
      day_of_week: day.day_of_week,
      day_label: day.label,
      exercises,
      session_rpe: sessionRpe ? Number(sessionRpe) : undefined,
      notes: notes || undefined,
      completed: true,
      created_at: new Date().toISOString(),
    };

    onSave(log);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (day.exercises.length === 0) {
    return (
      <Card>
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          No exercises scheduled for {day.day_of_week} — this is a rest day.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-5">
      {/* Session header */}
      <Card>
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">{day.label}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {day.day_of_week} &middot; {day.exercises.length} exercises
            </p>
          </div>
          <span className="text-sm text-gray-400">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'short',
              day: 'numeric',
            })}
          </span>
        </div>
      </Card>

      {/* Exercise cards */}
      {day.exercises.map((exercise) => (
        <Card key={exercise.name}>
          <div className="mb-4 flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{exercise.name}</h3>
              {exercise.notes && (
                <p className="mt-0.5 text-xs text-amber-600 dark:text-amber-400">
                  {exercise.notes}
                </p>
              )}
            </div>
            <span className="text-xs text-gray-400">
              {exercise.sets.filter((s) => s.type !== 'warmup').length} working sets
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-400">
                  <th className="pb-2 pr-2 font-medium w-8">#</th>
                  <th className="pb-2 pr-2 font-medium w-20">Type</th>
                  <th className="pb-2 pr-2 font-medium">Target</th>
                  <th className="pb-2 pr-2 font-medium">Actual Reps</th>
                  <th className="pb-2 pr-2 font-medium">Actual Wt (lb)</th>
                  <th className="pb-2 font-medium w-20">RPE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {exercise.sets.map((set, i) => (
                  <tr key={set.set_number}>
                    <td className="py-2 pr-2 text-gray-400 text-xs">{set.set_number}</td>
                    <td className="py-2 pr-2">
                      <span
                        className={`rounded px-1.5 py-0.5 text-[10px] font-medium uppercase ${
                          SET_TYPE_BADGE[set.type]
                        }`}
                      >
                        {set.type === 'backoff' ? 'back' : set.type}
                      </span>
                    </td>
                    <td className="py-2 pr-2 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {set.reps} × {set.weight ? `${set.weight} lb` : 'BW'}
                      {set.percentage ? ` (${set.percentage}%)` : ''}
                    </td>
                    <td className="py-2 pr-2">
                      <input
                        type="number"
                        min={0}
                        max={999}
                        placeholder={String(set.reps)}
                        value={inputs[exercise.name]?.[i]?.actual_reps ?? ''}
                        onChange={(e) =>
                          updateSet(exercise.name, i, 'actual_reps', e.target.value)
                        }
                        className="w-20 rounded-md border border-gray-200 bg-white px-2 py-1 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-accent dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                      />
                    </td>
                    <td className="py-2 pr-2">
                      <input
                        type="number"
                        min={0}
                        step={2.5}
                        placeholder={set.weight ? String(set.weight) : '—'}
                        value={inputs[exercise.name]?.[i]?.actual_weight ?? ''}
                        onChange={(e) =>
                          updateSet(exercise.name, i, 'actual_weight', e.target.value)
                        }
                        className="w-24 rounded-md border border-gray-200 bg-white px-2 py-1 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-accent dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                      />
                    </td>
                    <td className="py-2">
                      <input
                        type="number"
                        min={1}
                        max={10}
                        step={0.5}
                        placeholder="—"
                        value={inputs[exercise.name]?.[i]?.rpe ?? ''}
                        onChange={(e) =>
                          updateSet(exercise.name, i, 'rpe', e.target.value)
                        }
                        className="w-16 rounded-md border border-gray-200 bg-white px-2 py-1 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-accent dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ))}

      {/* Session RPE + notes */}
      <Card>
        <h3 className="mb-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
          Session Summary
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-500 dark:text-gray-400">
              Session RPE (1–10)
            </label>
            <input
              type="number"
              min={1}
              max={10}
              step={0.5}
              placeholder="e.g. 7.5"
              value={sessionRpe}
              onChange={(e) => setSessionRpe(e.target.value)}
              className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-accent dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-500 dark:text-gray-400">
              Notes
            </label>
            <textarea
              rows={2}
              placeholder="How did it feel?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full resize-none rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-accent dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={handleSave}
            className={`inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium text-white transition-colors ${
              saved
                ? 'bg-green-500 hover:bg-green-600'
                : 'bg-accent hover:bg-accent/90'
            }`}
          >
            {saved ? (
              <>
                <CheckCircle2 className="h-4 w-4" />
                Saved!
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Workout
              </>
            )}
          </button>
        </div>
      </Card>
    </div>
  );
}
