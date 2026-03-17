'use client';

import type { SnpCategory } from '@/lib/types';

interface CategoryFilterProps {
  activeCategory: SnpCategory | null;
  onCategoryChange: (category: SnpCategory | null) => void;
  counts?: Partial<Record<SnpCategory | 'all', number>>;
}

const CATEGORIES: { id: SnpCategory | null; label: string; emoji: string }[] = [
  { id: null,             label: 'All',           emoji: '' },
  { id: 'methylation',    label: 'Methylation',   emoji: '' },
  { id: 'cardiovascular', label: 'Cardiovascular',emoji: '' },
  { id: 'detox',          label: 'Detox',         emoji: '' },
  { id: 'metabolism',     label: 'Metabolism',    emoji: '' },
  { id: 'inflammation',   label: 'Inflammation',  emoji: '' },
  { id: 'nutrient',       label: 'Nutrient',      emoji: '' },
  { id: 'sleep',          label: 'Sleep',         emoji: '' },
  { id: 'fitness',        label: 'Fitness',       emoji: '' },
  { id: 'immune',         label: 'Immune',        emoji: '' },
];

export function CategoryFilter({ activeCategory, onCategoryChange, counts }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2" role="tablist" aria-label="SNP categories">
      {CATEGORIES.map((cat) => {
        const key = cat.id ?? 'all';
        const count = counts?.[key as SnpCategory | 'all'];
        const isActive = activeCategory === cat.id;

        return (
          <button
            key={key}
            role="tab"
            aria-selected={isActive}
            onClick={() => onCategoryChange(cat.id)}
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
              isActive
                ? 'bg-accent text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
            }`}
          >
            {cat.label}
            {count !== undefined && (
              <span
                className={`rounded-full px-1.5 py-0.5 text-xs font-semibold ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
