'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Dna,
  Droplets,
  Activity,
  Watch,
  Dumbbell,
  Pill,
  StickyNote,
  FileText,
  Upload,
  Flame,
} from 'lucide-react';
import { DemoToggle } from './DemoToggle';

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/genomics', label: 'Genomics', icon: Dna },
  { href: '/dashboard/bloodwork', label: 'Blood Work', icon: Droplets },
  { href: '/dashboard/cgm', label: 'CGM', icon: Activity },
  { href: '/dashboard/garmin', label: 'Garmin', icon: Watch },
  { type: 'separator' as const },
  { href: '/dashboard/training', label: 'Training', icon: Dumbbell },
  { href: '/dashboard/supplements', label: 'Supplements', icon: Pill },
  { type: 'separator' as const },
  { href: '/dashboard/notes', label: 'Notes', icon: StickyNote },
  { href: '/dashboard/reports', label: 'Reports', icon: FileText },
  { type: 'separator' as const },
  { href: '/dashboard/upload', label: 'Upload', icon: Upload },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950 md:w-64 max-md:w-16 transition-all">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-gray-200 px-4 dark:border-gray-800">
        <Flame className="h-8 w-8 text-accent shrink-0" />
        <span className="text-xl font-bold text-gray-900 dark:text-white max-md:hidden">
          Blaze Health
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {navItems.map((item, i) => {
            if ('type' in item && item.type === 'separator') {
              return (
                <li key={`sep-${i}`} className="my-3">
                  <div className="h-px bg-gray-200 dark:bg-gray-800" />
                </li>
              );
            }
            if (!('href' in item)) return null;
            const Icon = item.icon;
            const isActive =
              item.href === '/dashboard'
                ? pathname === '/dashboard'
                : pathname?.startsWith(item.href);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'border-l-[3px] border-accent bg-green-50 text-accent dark:bg-green-950/30'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span className="max-md:hidden">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Demo Toggle */}
      <div className="border-t border-gray-200 p-4 dark:border-gray-800">
        <DemoToggle />
      </div>
    </aside>
  );
}
