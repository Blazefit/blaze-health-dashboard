'use client';

import { Info } from 'lucide-react';
import { Card } from '@/components/ui/Card';

// Annual peptide cycling calendar
// 3 active blocks per year (Jan-Mar, May-Jul, Sep-Nov)
// Transition / washout months: Apr, Aug, Dec

type CellStatus = 'active' | 'periodic' | 'transition' | 'off';

interface MonthCell {
  month: string;
  shortMonth: string;
  status: CellStatus;
}

const CALENDAR: MonthCell[] = [
  { month: 'January',   shortMonth: 'Jan', status: 'active' },
  { month: 'February',  shortMonth: 'Feb', status: 'active' },
  { month: 'March',     shortMonth: 'Mar', status: 'active' },
  { month: 'April',     shortMonth: 'Apr', status: 'transition' },
  { month: 'May',       shortMonth: 'May', status: 'active' },
  { month: 'June',      shortMonth: 'Jun', status: 'active' },
  { month: 'July',      shortMonth: 'Jul', status: 'active' },
  { month: 'August',    shortMonth: 'Aug', status: 'transition' },
  { month: 'September', shortMonth: 'Sep', status: 'active' },
  { month: 'October',   shortMonth: 'Oct', status: 'active' },
  { month: 'November',  shortMonth: 'Nov', status: 'active' },
  { month: 'December',  shortMonth: 'Dec', status: 'transition' },
];

// Compound-level schedules
interface CompoundSchedule {
  name: string;
  schedule: CellStatus[];
}

const COMPOUND_SCHEDULES: CompoundSchedule[] = [
  {
    name: 'BPC-157',
    // 8w on / 4w off → roughly 2 months on / 1 month off
    schedule: ['active', 'active', 'off', 'off', 'active', 'active', 'off', 'off', 'active', 'active', 'off', 'off'],
  },
  {
    name: 'TB-500',
    // 6w on / 6w off → alternating ~1.5 month cycles
    schedule: ['active', 'active', 'off', 'off', 'active', 'active', 'off', 'off', 'active', 'active', 'off', 'off'],
  },
  {
    name: 'Ipamorelin / CJC-1295',
    // 12w on / 4w off → 3 months on / 1 month off
    schedule: ['active', 'active', 'active', 'off', 'active', 'active', 'active', 'off', 'active', 'active', 'active', 'off'],
  },
];

const STATUS_CLASSES: Record<CellStatus, string> = {
  active: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 border-green-200 dark:border-green-800/50',
  periodic: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200 dark:border-blue-800/50',
  transition: 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700',
  off: 'bg-gray-50 text-gray-300 dark:bg-gray-800/30 dark:text-gray-600 border-gray-100 dark:border-gray-800/40',
};

const STATUS_LABEL: Record<CellStatus, string> = {
  active: 'Active',
  periodic: 'Periodic',
  transition: 'Washout',
  off: 'Off',
};

const LEGEND: { status: CellStatus; label: string }[] = [
  { status: 'active', label: 'Active' },
  { status: 'periodic', label: 'Periodic' },
  { status: 'transition', label: 'Washout / transition' },
  { status: 'off', label: 'Off cycle' },
];

export function PeptideCycleCalendar() {
  const currentMonth = new Date().getMonth(); // 0-indexed

  return (
    <div className="space-y-5">
      {/* Legend */}
      <div className="flex flex-wrap gap-3">
        {LEGEND.map(({ status, label }) => (
          <div key={status} className="flex items-center gap-1.5">
            <span className={`h-3 w-3 rounded-sm border ${STATUS_CLASSES[status]}`} />
            <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
          </div>
        ))}
      </div>

      {/* Annual overview grid */}
      <Card>
        <h3 className="mb-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
          Annual Cycle Overview — 2026
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-separate border-spacing-1">
            <thead>
              <tr>
                <th className="text-left text-gray-400 font-medium pb-1 pr-2 w-36">Compound</th>
                {CALENDAR.map((m, i) => (
                  <th
                    key={m.month}
                    className={`text-center font-medium pb-1 px-0.5 ${
                      i === currentMonth ? 'text-accent' : 'text-gray-400'
                    }`}
                  >
                    {m.shortMonth}
                    {i === currentMonth && (
                      <span className="block w-1 h-1 rounded-full bg-accent mx-auto mt-0.5" />
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="space-y-1">
              {COMPOUND_SCHEDULES.map((compound) => (
                <tr key={compound.name}>
                  <td className="text-gray-700 dark:text-gray-300 font-medium pr-2 py-1 text-xs whitespace-nowrap">
                    {compound.name}
                  </td>
                  {compound.schedule.map((status, i) => (
                    <td key={i} className="text-center p-0.5">
                      <div
                        className={`rounded border px-1 py-1 text-center text-[9px] font-medium leading-none ${STATUS_CLASSES[status]}`}
                        title={`${CALENDAR[i].month}: ${STATUS_LABEL[status]}`}
                      >
                        {status === 'active' ? 'ON' : status === 'off' ? 'OFF' : 'WO'}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Block detail cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Block 1', months: 'Jan – Mar', description: 'Post-holiday kickoff cycle. Focus on tissue repair and body recomposition.' },
          { label: 'Block 2', months: 'May – Jul', description: 'Summer performance cycle. GH secretagogue emphasis for lean mass.' },
          { label: 'Block 3', months: 'Sep – Nov', description: 'Autumn strength cycle. Collagen peptides prioritised pre-competition.' },
        ].map((block) => (
          <Card key={block.label}>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-700 dark:bg-green-900/30 dark:text-green-400">
                {block.label.split(' ')[1]}
              </span>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{block.label}</p>
                <p className="text-xs text-gray-400">{block.months}</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">{block.description}</p>
          </Card>
        ))}
      </div>

      {/* Washout months */}
      <Card>
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
          <div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Washout Months — Apr, Aug, Dec
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Peptide clearance periods allow receptor sensitivity to reset. During washout months
              all peptide injections are paused. Oral stack and daily supplements continue uninterrupted.
              Labs (IGF-1, cortisol, CBC) are drawn at the end of each washout before resuming the next block.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
