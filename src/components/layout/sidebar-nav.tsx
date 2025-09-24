'use client';

import { useMemo, useState } from 'react';
import { Menu } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { MODULES, type ModuleNavItem } from '@/lib/modules';
import { cn } from '@/lib/utils';

function getAnalogyColor(analogy: ModuleNavItem['analogy']): string {
  switch (analogy) {
    case 'writing':
      return 'bg-analogy-writing-500';
    case 'reasoning':
      return 'bg-analogy-reasoning-500';
    case 'advanced':
      return 'bg-analogy-advanced-500';
    case 'atari':
    default:
      return 'bg-analogy-atari-500';
  }
}

function getPhaseLabel(phase: ModuleNavItem['phase']): string {
  switch (phase) {
    case 'phase-1':
      return 'Core Loop';
    case 'phase-2':
      return 'Foundation';
    case 'phase-3':
      return 'Advanced';
    default:
      return 'Module';
  }
}

export function SidebarNav(): JSX.Element {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const currentSlug = useMemo(() => {
    if (!pathname) return '';
    const segments = pathname.split('/').filter(Boolean);
    if (segments[0] !== 'modules') {
      return '';
    }
    return segments[1] ?? '';
  }, [pathname]);

  const navItems = MODULES;

  return (
    <aside className="lg:w-72">
      <div className="lg:hidden">
        <Button
          variant="outline"
          className="mb-4 flex w-full items-center justify-between"
          onClick={() => setIsMobileOpen((open) => !open)}
          aria-expanded={isMobileOpen}
          aria-controls="module-nav"
        >
          <span>Modules</span>
          <Menu className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
      <nav
        id="module-nav"
        className={cn(
          'space-y-2 rounded-xl border border-border bg-card p-4 shadow-sm',
          isMobileOpen ? 'block' : 'hidden lg:block'
        )}
      >
        <h2 className="text-sm font-semibold text-muted-foreground">Phase 1 • Core RLHF Loop</h2>
        <ul className="mt-3 space-y-2">
          {navItems.map((item) => {
            const isActive = item.slug === currentSlug;
            const indicatorClass = cn({
              'bg-analogy-writing-500': item.analogy === 'writing',
              'bg-analogy-reasoning-500': item.analogy === 'reasoning',
              'bg-analogy-advanced-500': item.analogy === 'advanced',
              'bg-analogy-atari-500': item.analogy === 'atari',
            });

            return (
              <li key={item.id}>
                <Link
                  href={`/modules/${item.slug}`}
                  className={cn(
                    'block rounded-lg border border-transparent p-3 transition hover:border-border hover:bg-accent',
                    isActive && 'border-border bg-accent/60'
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                    <span
                      className={cn(
                        'flex h-8 w-8 items-center justify-center rounded-full text-sm text-white',
                        getAnalogyColor(item.analogy)
                      )}
                      aria-hidden="true"
                    >
                      {item.title.charAt(0)}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <Badge variant={item.status === 'available' ? 'success' : 'warning'}>
                      {item.status === 'available' ? 'Available' : 'Coming soon'}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {getPhaseLabel(item.phase)}
                    </span>
                  </div>
                  <div className="mt-3">
                    <Progress value={item.progress} indicatorClassName={indicatorClass} />
                    <span className="mt-1 block text-right text-[11px] text-muted-foreground">
                      {item.progress}% complete
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
