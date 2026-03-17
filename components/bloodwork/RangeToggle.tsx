'use client';

interface RangeToggleProps {
  mode: 'standard' | 'functional';
  onChange: (mode: 'standard' | 'functional') => void;
}

export function RangeToggle({ mode, onChange }: RangeToggleProps) {
  return (
    <div className="inline-flex rounded-lg border border-gray-200 bg-gray-100 p-1 dark:border-gray-700 dark:bg-gray-800">
      <button
        type="button"
        onClick={() => onChange('standard')}
        className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
          mode === 'standard'
            ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white'
            : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'
        }`}
      >
        Standard
      </button>
      <button
        type="button"
        onClick={() => onChange('functional')}
        className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
          mode === 'functional'
            ? 'bg-[#1D9E75] text-white shadow-sm'
            : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'
        }`}
      >
        Functional / Optimal
      </button>
    </div>
  );
}
