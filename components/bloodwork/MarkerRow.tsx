'use client';

import type { Biomarker, BiomarkerStatus } from '@/lib/types';

interface MarkerRowProps {
  marker: Biomarker;
}

const STATUS_COLORS: Record<BiomarkerStatus, string> = {
  optimal: '#1D9E75',
  normal: '#6B7280',
  borderline: '#EF9F27',
  flagged: '#E24B4A',
};

const STATUS_DOT_CLASSES: Record<BiomarkerStatus, string> = {
  optimal: 'bg-[#1D9E75]',
  normal: 'bg-gray-400',
  borderline: 'bg-[#EF9F27]',
  flagged: 'bg-[#E24B4A]',
};

export function MarkerRow({ marker }: MarkerRowProps) {
  const color = STATUS_COLORS[marker.status];
  const dotClass = STATUS_DOT_CLASSES[marker.status];

  return (
    <div className="flex items-center gap-3 py-3 px-1 border-b border-gray-100 dark:border-gray-800 last:border-0">
      {/* Status dot */}
      <span
        className={`h-2.5 w-2.5 flex-shrink-0 rounded-full ${dotClass}`}
        aria-label={marker.status}
      />

      {/* Marker name */}
      <span className="flex-1 text-sm font-medium text-gray-900 dark:text-white truncate">
        {marker.marker_name}
      </span>

      {/* Reference range */}
      <span className="text-xs text-gray-400 dark:text-gray-500 tabular-nums whitespace-nowrap">
        {marker.ref_low} – {marker.ref_high} {marker.unit}
      </span>

      {/* Value + unit */}
      <span
        className="ml-4 text-sm font-semibold tabular-nums whitespace-nowrap"
        style={{ color }}
      >
        {marker.value}{' '}
        <span className="text-xs font-normal text-gray-500 dark:text-gray-400">
          {marker.unit}
        </span>
      </span>
    </div>
  );
}
