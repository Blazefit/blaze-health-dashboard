'use client';

import useSWR from 'swr';
import { useDemo } from './useDemo';
import type { GarminDaily } from '@/lib/types';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useGarmin(days = 30) {
  const { isDemo } = useDemo();

  const { data: liveData, error, isLoading, mutate } = useSWR<GarminDaily[]>(
    !isDemo ? `/api/garmin?days=${days}` : null,
    fetcher
  );

  if (isDemo) {
    const { demoGarminData } = require('@/lib/demo-data');
    const data = (demoGarminData as GarminDaily[]).slice(-days);
    return {
      data,
      error: null,
      isLoading: false,
      mutate,
    };
  }

  return {
    data: liveData || [],
    error,
    isLoading,
    mutate,
  };
}

export function useLatestGarmin() {
  const { data, ...rest } = useGarmin(1);
  return {
    latest: data[0] || null,
    ...rest,
  };
}
