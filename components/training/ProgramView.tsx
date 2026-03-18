'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, Dna, AlertCircle, Circle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { StatusPill } from '@/components/ui/StatusPill';
import { normalizeProgramData } from '@/lib/training-utils';
import type { TrainingProgram, ProgramDay, ProgramExercise } from '@/lib/types';

interface ProgramViewProps {
  program: TrainingProgram;
}

const STATUS_VARIANT: Record<string, 'green' | 'yellow' | 'gray' | 'blue'> = {
  active: 'green',
  paused: 'yellow',
  completed: 'blue',
  archived: 'gray',
};

const SET_TYPE_COLOR: Record<string, string> = {
  warmup: 'text-gray-400',
  working: 'text-gray-900 dark:text-white font-medium',
  primer: 'text-blue-600 dark:text-blue-400',
  backoff: 'text-orange-500 dark:text-orange-400',
};

function ExerciseDetail({ exercise }: { exercise: ProgramExercise }) {
  const workingSets = exercise.sets.filter((s) => s.type !== 'warmup');

  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/50">
      <div className="mb-3 flex items-start justify-between gap-2">
        <div>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{exercise.name}</h4>
          {exercise.notes && (
            <p className="mt-0.5 text-xs text-amber-600 dark:text-amber-400">{exercise.notes}</p>
          )}
        </div>
        <span className="shrink-0 text-xs text-gray-400">
          {workingSets.length} working {workingSets.length === 1 ? 'set' : 'sets'}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-left text-gray-400">
              <th className="pb-1 pr-3 font-medium">Set</th>
              <th className="pb-1 pr-3 font-medium">Type</th>
              <th className="pb-1 pr-3 font-medium">Reps</th>
              <th className="pb-1 pr-3 font-medium">Weight</th>
              {exercise.sets.some((s) => s.percentage) && (
                <th className="pb-1 font-medium">%1RM</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {exercise.sets.map((set) => (
              <tr key={set.set_number} className={SET_TYPE_COLOR[set.type]}>
                <td className="py-1 pr-3">{set.set_number}</td>
                <td className="py-1 pr-3">
                  <span className="rounded px-1 py-0.5 text-[10px] font-medium uppercase tracking-wide bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                    {set.type === 'warmup' ? 'Warm' : set.type === 'backoff' ? 'Back' : set.type}
                  </span>
                </td>
                <td className="py-1 pr-3">{set.reps}</td>
                <td className="py-1 pr-3">
                  {set.weight !== undefined && set.weight > 0 ? `${set.weight} lb` : 'BW'}
                </td>
                {exercise.sets.some((s) => s.percentage) && (
                  <td className="py-1">{set.percentage ? `${set.percentage}%` : '—'}</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DayRow({
  day,
  isExpanded,
  onToggle,
}: {
  day: ProgramDay;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const isRest = day.exercises.length === 0;
  const previewExercises = day.exercises.slice(0, 3);
  const moreCount = day.exercises.length - 3;

  return (
    <div className="border-b border-gray-100 last:border-0 dark:border-gray-800">
      <button
        onClick={onToggle}
        disabled={isRest}
        className={`flex w-full items-start gap-4 px-4 py-3 text-left transition-colors ${
          isRest
            ? 'cursor-default opacity-60'
            : 'hover:bg-gray-50 dark:hover:bg-gray-800/60'
        }`}
      >
        {/* Day label */}
        <div className="w-24 shrink-0">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {day.day_of_week}
          </span>
        </div>

        {/* Session summary */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 dark:text-white">{day.label}</p>
          {!isRest && (
            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400 truncate">
              {previewExercises.map((e) => e.name).join(' · ')}
              {moreCount > 0 && ` +${moreCount} more`}
            </p>
          )}
        </div>

        {/* Completion + expand */}
        <div className="flex shrink-0 items-center gap-2">
          {isRest ? (
            <StatusPill label="Rest" variant="gray" />
          ) : (
            <Circle className="h-4 w-4 text-gray-300" />
          )}
          {!isRest && (
            isExpanded ? (
              <ChevronDown className="h-4 w-4 text-gray-400" />
            ) : (
              <ChevronRight className="h-4 w-4 text-gray-400" />
            )
          )}
        </div>
      </button>

      {/* Expanded detail */}
      {isExpanded && !isRest && (
        <div className="space-y-3 px-4 pb-4">
          {day.exercises.map((exercise, i) => (
            <ExerciseDetail key={i} exercise={exercise} />
          ))}
        </div>
      )}
    </div>
  );
}

export function ProgramView({ program }: ProgramViewProps) {
  const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set());

  const toggleDay = (dayOfWeek: string) => {
    setExpandedDays((prev) => {
      const next = new Set(prev);
      if (next.has(dayOfWeek)) {
        next.delete(dayOfWeek);
      } else {
        next.add(dayOfWeek);
      }
      return next;
    });
  };

  const programWeeks = normalizeProgramData(program);
  const currentWeekData = programWeeks.find(
    (w) => w.week === program.current_week
  ) ?? programWeeks[0];

  return (
    <div className="space-y-5">
      {/* Program header */}
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {program.name}
              </h2>
              <StatusPill
                label={program.status.charAt(0).toUpperCase() + program.status.slice(1)}
                variant={STATUS_VARIANT[program.status] ?? 'gray'}
              />
              {program.ai_generated && (
                <StatusPill label="AI Generated" variant="purple" />
              )}
            </div>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {program.description}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              Week {program.current_week}
              <span className="text-base font-normal text-gray-400">
                /{program.duration_weeks}
              </span>
            </p>
            {currentWeekData && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {currentWeekData.phase}
              </p>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="h-2 w-full rounded-full bg-gray-100 dark:bg-gray-800">
            <div
              className="h-2 rounded-full bg-accent transition-all"
              style={{
                width: `${(program.current_week / program.duration_weeks) * 100}%`,
              }}
            />
          </div>
          <div className="mt-1 flex justify-between text-xs text-gray-400">
            <span>Start</span>
            <span>
              {Math.round((program.current_week / program.duration_weeks) * 100)}% complete
            </span>
            <span>Week {program.duration_weeks}</span>
          </div>
        </div>
      </Card>

      {/* Config section */}
      <Card>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Program Configuration
        </h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/60">
            <p className="text-xs text-gray-400">Bench 1RM</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {program.config.bench_1rm} <span className="text-sm font-normal text-gray-400">lb</span>
            </p>
          </div>
          <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/60">
            <p className="text-xs text-gray-400">Squat 1RM</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {program.config.squat_1rm} <span className="text-sm font-normal text-gray-400">lb</span>
            </p>
          </div>
          {program.config.deadlift_1rm && (
            <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/60">
              <p className="text-xs text-gray-400">Deadlift 1RM</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {program.config.deadlift_1rm} <span className="text-sm font-normal text-gray-400">lb</span>
              </p>
            </div>
          )}
        </div>

        {program.config?.constraints?.length > 0 && (
          <div className="mt-4">
            <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400">
              <AlertCircle className="h-3.5 w-3.5" />
              Constraints
            </p>
            <ul className="space-y-1">
              {program.config.constraints.map((c, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                  {c}
                </li>
              ))}
            </ul>
          </div>
        )}

        {program.config.genomic_notes && (
          <div className="mt-4 rounded-lg border border-purple-100 bg-purple-50 p-3 dark:border-purple-900/40 dark:bg-purple-900/10">
            <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-purple-700 dark:text-purple-400">
              <Dna className="h-3.5 w-3.5" />
              Genomic Notes
            </p>
            <p className="text-sm text-purple-800 dark:text-purple-300">
              {program.config.genomic_notes}
            </p>
          </div>
        )}
      </Card>

      {/* Weekly schedule */}
      <Card padding={false}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            Week {currentWeekData?.week} Schedule
          </h3>
          <span className="text-xs text-gray-400">Click a day to expand</span>
        </div>
        {currentWeekData?.days.map((day) => (
          <DayRow
            key={day.day_of_week}
            day={day}
            isExpanded={expandedDays.has(day.day_of_week)}
            onToggle={() => toggleDay(day.day_of_week)}
          />
        ))}
      </Card>
    </div>
  );
}
