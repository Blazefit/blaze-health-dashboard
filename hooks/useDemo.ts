'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import React from 'react';

interface DemoContextType {
  isDemo: boolean;
  toggleDemo: () => void;
  setDemo: (value: boolean) => void;
}

const DemoContext = createContext<DemoContextType>({
  isDemo: false,
  toggleDemo: () => {},
  setDemo: () => {},
});

export function DemoProvider({ children }: { children: ReactNode }) {
  const [isDemo, setIsDemo] = useState(false);

  const toggleDemo = useCallback(() => setIsDemo((prev) => !prev), []);
  const setDemo = useCallback((value: boolean) => setIsDemo(value), []);

  return React.createElement(
    DemoContext.Provider,
    { value: { isDemo, toggleDemo, setDemo } },
    children
  );
}

export function useDemo() {
  return useContext(DemoContext);
}
