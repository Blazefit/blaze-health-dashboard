'use client';

import useSWR from 'swr';
import { useDemo } from './useDemo';
import { fetcher } from '@/lib/fetcher';
import type { Biomarker } from '@/lib/types';

export function useBiomarkers() {
  const { isDemo } = useDemo();

  const { data: liveBiomarkers, error, isLoading, mutate } = useSWR<Biomarker[]>(
    !isDemo ? '/api/biomarkers' : null,
    fetcher
  );

  if (isDemo) {
    // Lazy import demo data to avoid bundling in production
    const { demoBiomarkers } = require('@/lib/demo-data');
    return {
      biomarkers: demoBiomarkers as Biomarker[],
      error: null,
      isLoading: false,
      mutate,
    };
  }

  return {
    biomarkers: liveBiomarkers || [],
    error,
    isLoading,
    mutate,
  };
}

export function useLatestBiomarkers() {
  const { biomarkers, ...rest } = useBiomarkers();

  // Group by marker_name and get the latest date for each
  const latestMap = new Map<string, Biomarker>();
  biomarkers.forEach((b) => {
    const existing = latestMap.get(b.marker_name);
    if (!existing || b.date > existing.date) {
      latestMap.set(b.marker_name, b);
    }
  });

  return {
    biomarkers: Array.from(latestMap.values()),
    ...rest,
  };
}

export function useBiomarkerTrend(markerName: string) {
  const { biomarkers, ...rest } = useBiomarkers();

  const trend = biomarkers
    .filter((b) => b.marker_name === markerName)
    .sort((a, b) => a.date.localeCompare(b.date));

  return {
    trend,
    ...rest,
  };
}
