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
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';

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

// Bottom nav: most important items for mobile
const mobileNavItems = [
  { href: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { href: '/dashboard/training', label: 'Training', icon: Dumbbell },
  { href: '/dashboard/supplements', label: 'Supps', icon: Pill },
  { href: '/dashboard/reports', label: 'Reports', icon: FileText },
];

export function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* ─── Desktop sidebar (hidden on mobile) ─── */}
      <aside
        className="fixed left-0 top-0 z-40 hidden md:flex h-screen w-[68px] flex-col items-center py-5 gap-1"
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

      {/* ─── Mobile top bar ─── */}
      <header
        className="fixed top-0 left-0 right-0 z-40 flex md:hidden items-center justify-between px-4 h-14"
        style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg"
            style={{ background: 'linear-gradient(135deg, #00D68F, #00B876)' }}
          >
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" className="h-4 w-4 stroke-white">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </div>
          <span className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>Blaze Health</span>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-xl hover:bg-white/[0.04]"
        >
          <Menu className="h-5 w-5" style={{ color: 'var(--muted)' }} />
        </button>
      </header>

      {/* ─── Mobile bottom nav ─── */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 flex md:hidden items-center justify-around h-16 px-2"
        style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)' }}
      >
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname?.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-1 py-1.5 px-3 rounded-lg transition-all"
            >
              <Icon
                className="h-5 w-5"
                style={{ color: isActive ? 'var(--green)' : 'var(--muted-2)' }}
              />
              <span
                className="text-[10px] font-medium"
                style={{ color: isActive ? 'var(--green)' : 'var(--muted-2)' }}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
        <button
          onClick={() => setMobileOpen(true)}
          className="flex flex-col items-center gap-1 py-1.5 px-3 rounded-lg"
        >
          <Menu className="h-5 w-5" style={{ color: 'var(--muted-2)' }} />
          <span className="text-[10px] font-medium" style={{ color: 'var(--muted-2)' }}>More</span>
        </button>
      </nav>

      {/* ─── Mobile full nav drawer ─── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden" style={{ background: 'rgba(0,0,0,0.6)' }}>
          <div
            className="absolute right-0 top-0 bottom-0 w-64 p-5 overflow-y-auto"
            style={{ background: 'var(--background)' }}
          >
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>Menu</span>
              <button
                onClick={() => setMobileOpen(false)}
                className="rounded-lg p-2 hover:bg-white/[0.04]"
              >
                <X className="h-5 w-5" style={{ color: 'var(--muted)' }} />
              </button>
            </div>
            <nav className="space-y-1">
              {navItems.map((item, i) => {
                if ('type' in item && item.type === 'separator') {
                  return <div key={`sep-${i}`} className="my-3 h-px" style={{ background: 'var(--border)' }} />;
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
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all"
                    style={{
                      background: isActive ? 'var(--green-bg)' : 'transparent',
                      color: isActive ? 'var(--green)' : 'var(--muted)',
                    }}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="absolute inset-0 -z-10" onClick={() => setMobileOpen(false)} />
        </div>
      )}
    </>
  );
}
