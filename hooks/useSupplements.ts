'use client';

import useSWR from 'swr';
import { useDemo } from './useDemo';
import { fetcher } from '@/lib/fetcher';
import type { SupplementProtocol } from '@/lib/types';

export function useSupplements() {
  const { isDemo } = useDemo();

  const { data: liveProtocols, error, isLoading, mutate } = useSWR<SupplementProtocol[]>(
    !isDemo ? '/api/supplements' : null,
    fetcher
  );

  if (isDemo) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { demoSupplementProtocol } = require('@/lib/demo-data');
    return {
      protocols: [demoSupplementProtocol] as SupplementProtocol[],
      activeProtocol: demoSupplementProtocol as SupplementProtocol,
      error: null,
      isLoading: false,
      mutate,
    };
  }

  const protocols = liveProtocols || [];
  const activeProtocol = protocols.find((p) => p.is_active) || protocols[0] || null;

  return {
    protocols,
    activeProtocol,
    error,
    isLoading,
    mutate,
  };
}
