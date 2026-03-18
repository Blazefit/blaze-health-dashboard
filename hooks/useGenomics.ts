'use client';

import useSWR from 'swr';
import { useDemo } from './useDemo';
import { fetcher } from '@/lib/fetcher';
import type { GenomicSnp, SnpCategory } from '@/lib/types';

export function useGenomics() {
  const { isDemo } = useDemo();

  const { data: liveSnps, error, isLoading, mutate } = useSWR<GenomicSnp[]>(
    !isDemo ? '/api/genomics/snps' : null,
    fetcher
  );

  if (isDemo) {
    const { demoSnps } = require('@/lib/demo-data');
    return {
      snps: demoSnps as GenomicSnp[],
      error: null,
      isLoading: false,
      mutate,
    };
  }

  return {
    snps: liveSnps || [],
    error,
    isLoading,
    mutate,
  };
}

export function useSnpsByCategory(category?: SnpCategory) {
  const { snps, ...rest } = useGenomics();

  const filtered = category
    ? snps.filter((s) => s.category === category)
    : snps;

  return {
    snps: filtered,
    ...rest,
  };
}
