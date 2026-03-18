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
  Settings,
} from 'lucide-react';

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
  { href: '/dashboard/upload', label: 'Upload', icon: Upload },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="fixed left-0 top-0 z-40 flex h-screen w-[68px] flex-col items-center py-5 gap-1"
      style={{ background: 'var(--surface)', borderRight: '1px solid var(--border)' }}
    >
      {/* Logo */}
      <div
        className="mb-4 flex h-9 w-9 items-center justify-center rounded-[10px]"
        style={{ background: 'linear-gradient(135deg, #00D68F, #00B876)' }}
      >
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" className="h-5 w-5 stroke-white">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col items-center gap-1">
        {navItems.map((item, i) => {
          if ('type' in item && item.type === 'separator') {
            return (
              <div key={`sep-${i}`} className="my-2 h-px w-7" style={{ background: 'rgba(255,255,255,0.06)' }} />
            );
          }
          if (!('href' in item)) return null;
          const Icon = item.icon;
          const isActive =
            item.href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname?.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              className="relative flex h-11 w-11 items-center justify-center rounded-xl transition-all hover:bg-white/[0.04]"
              style={isActive ? { background: 'var(--green-bg)' } : {}}
            >
              {isActive && (
                <span
                  className="absolute left-0 top-3 bottom-3 w-[3px] rounded-r-sm"
                  style={{ background: 'var(--green)' }}
                />
              )}
              <Icon
                className="h-5 w-5 transition-colors"
                style={{ color: isActive ? 'var(--green)' : 'var(--muted-2)' }}
              />
            </Link>
          );
        })}
      </nav>

      {/* Settings at bottom */}
      <div className="mt-auto">
        <button
          title="Settings"
          className="flex h-11 w-11 items-center justify-center rounded-xl transition-all hover:bg-white/[0.04]"
        >
          <Settings className="h-5 w-5" style={{ color: 'var(--muted-2)' }} />
        </button>
      </div>
    </aside>
  );
}
