'use client';

import useSWR from 'swr';
import { useDemo } from './useDemo';
import type { TrainingProgram, WorkoutLog } from '@/lib/types';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useActiveProgram() {
  const { isDemo } = useDemo();

  const { data: liveProgram, error, isLoading, mutate } = useSWR<TrainingProgram>(
    !isDemo ? '/api/training/programs?status=active' : null,
    fetcher
  );

  if (isDemo) {
    const { demoTrainingProgram } = require('@/lib/demo-data');
    return {
      program: demoTrainingProgram as TrainingProgram,
      error: null,
      isLoading: false,
      mutate,
    };
  }

  return {
    program: liveProgram || null,
    error,
    isLoading,
    mutate,
  };
}

export function useWorkoutLogs(programId?: string) {
  const { isDemo } = useDemo();

  const { data: liveLogs, error, isLoading, mutate } = useSWR<WorkoutLog[]>(
    !isDemo && programId ? `/api/training/workouts?program_id=${programId}` : null,
    fetcher
  );

  if (isDemo) {
    return {
      logs: [] as WorkoutLog[],
      error: null,
      isLoading: false,
      mutate,
    };
  }

  return {
    logs: liveLogs || [],
    error,
    isLoading,
    mutate,
  };
}
