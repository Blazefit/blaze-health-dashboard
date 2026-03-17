'use client';

import { useState } from 'react';
import { Wand2, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';

const CONSTRAINT_OPTIONS = [
  'No overhead pressing',
  'Low-back caution',
  'Knee pain — avoid deep squats',
  'No running / high-impact',
  'Shoulder impingement',
  'Wrist pain',
  'Limited hip mobility',
  'Post-surgery recovery',
];

const GOAL_OPTIONS = [
  { value: 'hypertrophy', label: 'Hypertrophy (muscle growth)' },
  { value: 'strength', label: 'Strength (1RM focus)' },
  { value: 'powerbuilding', label: 'Powerbuilding (strength + size)' },
  { value: 'fat_loss', label: 'Fat loss / body recomp' },
  { value: 'athletic', label: 'Athletic performance' },
  { value: 'longevity', label: 'Longevity & health' },
];

const DURATION_OPTIONS = [4, 8, 12, 16];
const DAYS_PER_WEEK_OPTIONS = [3, 4, 5, 6];

interface GeneratorForm {
  duration: number;
  goal: string;
  bench_1rm: string;
  squat_1rm: string;
  deadlift_1rm: string;
  days_per_week: number;
  constraints: string[];
  equipment: string;
}

export function ProgramGenerator() {
  const [form, setForm] = useState<GeneratorForm>({
    duration: 12,
    goal: 'hypertrophy',
    bench_1rm: '',
    squat_1rm: '',
    deadlift_1rm: '',
    days_per_week: 4,
    constraints: [],
    equipment: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  const toggleConstraint = (c: string) => {
    setForm((prev) => ({
      ...prev,
      constraints: prev.constraints.includes(c)
        ? prev.constraints.filter((x) => x !== c)
        : [...prev.constraints, c],
    }));
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    // Placeholder — wire to POST /api/training/generate when ready
    await new Promise((r) => setTimeout(r, 2000));
    setIsLoading(false);
  };

  return (
    <div className="space-y-5">
      {/* Goal & duration */}
      <Card>
        <h3 className="mb-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
          Program Parameters
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-500 dark:text-gray-400">
              Goal
            </label>
            <select
              value={form.goal}
              onChange={(e) => setForm((p) => ({ ...p, goal: e.target.value }))}
              className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-accent dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              {GOAL_OPTIONS.map((g) => (
                <option key={g.value} value={g.value}>
                  {g.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-500 dark:text-gray-400">
              Duration (weeks)
            </label>
            <select
              value={form.duration}
              onChange={(e) =>
                setForm((p) => ({ ...p, duration: Number(e.target.value) }))
              }
              className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-accent dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              {DURATION_OPTIONS.map((d) => (
                <option key={d} value={d}>
                  {d} weeks
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-500 dark:text-gray-400">
              Training Days / Week
            </label>
            <select
              value={form.days_per_week}
              onChange={(e) =>
                setForm((p) => ({ ...p, days_per_week: Number(e.target.value) }))
              }
              className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-accent dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              {DAYS_PER_WEEK_OPTIONS.map((d) => (
                <option key={d} value={d}>
                  {d} days
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-500 dark:text-gray-400">
              Available Equipment
            </label>
            <input
              type="text"
              placeholder="e.g. Full commercial gym, barbell, cables"
              value={form.equipment}
              onChange={(e) => setForm((p) => ({ ...p, equipment: e.target.value }))}
              className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-accent dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>
        </div>
      </Card>

      {/* 1RM inputs */}
      <Card>
        <h3 className="mb-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
          One-Rep Maxes (lb)
        </h3>
        <div className="grid gap-4 sm:grid-cols-3">
          {(
            [
              { key: 'bench_1rm', label: 'Bench Press' },
              { key: 'squat_1rm', label: 'Back Squat' },
              { key: 'deadlift_1rm', label: 'Deadlift' },
            ] as const
          ).map(({ key, label }) => (
            <div key={key}>
              <label className="mb-1.5 block text-xs font-medium text-gray-500 dark:text-gray-400">
                {label}
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={0}
                  step={5}
                  placeholder="e.g. 225"
                  value={form[key]}
                  onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                  className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 pr-10 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-accent dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                  lb
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Constraints */}
      <Card>
        <h3 className="mb-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
          Constraints & Limitations
        </h3>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {CONSTRAINT_OPTIONS.map((c) => (
            <label
              key={c}
              className={`flex cursor-pointer items-center gap-2 rounded-md border p-2.5 text-sm transition-colors ${
                form.constraints.includes(c)
                  ? 'border-accent bg-accent/5 text-accent dark:bg-accent/10'
                  : 'border-gray-200 text-gray-700 hover:border-gray-300 dark:border-gray-700 dark:text-gray-300'
              }`}
            >
              <input
                type="checkbox"
                checked={form.constraints.includes(c)}
                onChange={() => toggleConstraint(c)}
                className="accent-accent h-3.5 w-3.5 shrink-0"
              />
              <span className="leading-tight">{c}</span>
            </label>
          ))}
        </div>
      </Card>

      {/* Generate button */}
      <div className="flex justify-end">
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent/90 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating Program…
            </>
          ) : (
            <>
              <Wand2 className="h-4 w-4" />
              Generate Program
            </>
          )}
        </button>
      </div>

      {/* Loading state placeholder */}
      {isLoading && (
        <Card>
          <div className="space-y-3">
            {[80, 60, 70, 50].map((w, i) => (
              <div
                key={i}
                className="h-4 animate-pulse rounded bg-gray-100 dark:bg-gray-800"
                style={{ width: `${w}%` }}
              />
            ))}
            <p className="pt-2 text-center text-sm text-gray-400">
              AI is building your personalised program…
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
