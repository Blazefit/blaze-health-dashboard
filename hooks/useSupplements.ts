'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { useDemo } from './useDemo';
import { fetcher } from '@/lib/fetcher';
import type { SupplementProtocol } from '@/lib/types';

export function useSupplements() {
  const { isDemo } = useDemo();
  const [selectedId, setSelectedId] = useState<string | null>(null);

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
      selectedId: null as string | null,
      setSelectedId,
      error: null,
      isLoading: false,
      mutate,
    };
  }

  const protocols = liveProtocols || [];
  // If user has selected a specific protocol, use that. Otherwise pick the active one.
  const activeProtocol = (selectedId
    ? protocols.find((p) => p.id === selectedId)
    : protocols.find((p) => p.is_active) || protocols[0]) || null;

  return {
    protocols,
    activeProtocol,
    selectedId,
    setSelectedId,
    error,
    isLoading,
    mutate,
  };
}
