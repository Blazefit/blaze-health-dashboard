'use client';

import { useDemo } from '@/hooks/useDemo';

export function DemoToggle() {
  const { isDemo, toggleDemo } = useDemo();

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={toggleDemo}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${
          isDemo ? 'bg-coral' : 'bg-gray-200 dark:bg-gray-700'
        }`}
        role="switch"
        aria-checked={isDemo}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform ${
            isDemo ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
      <span className="text-sm font-medium text-gray-600 dark:text-gray-400 max-md:hidden">
        {isDemo && (
          <span className="inline-flex items-center rounded-full bg-coral/10 px-2 py-0.5 text-xs font-medium text-coral">
            DEMO
          </span>
        )}
        {!isDemo && 'Demo'}
      </span>
    </div>
  );
}
