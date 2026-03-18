'use client';

import useSWR from 'swr';
import { useDemo } from './useDemo';
import { fetcher } from '@/lib/fetcher';
import type { HealthReport } from '@/lib/types';

export function useReports() {
  const { isDemo } = useDemo();

  const { data: liveReports, error, isLoading, mutate } = useSWR<HealthReport[]>(
    !isDemo ? '/api/reports' : null,
    fetcher
  );

  if (isDemo) {
    const { demoReports } = require('@/lib/demo-data');
    return {
      reports: (demoReports || []) as HealthReport[],
      error: null,
      isLoading: false,
      mutate,
    };
  }

  return {
    reports: liveReports || [],
    error,
    isLoading,
    mutate,
  };
}
