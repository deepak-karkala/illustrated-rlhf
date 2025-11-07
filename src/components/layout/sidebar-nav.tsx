'use client';

import { useMemo, useState } from 'react';
import { Menu } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { useAnalogy } from '@/lib/analogy-context';
import { MODULES } from '@/lib/modules';
import { cn } from '@/lib/utils';

export function SidebarNav(): JSX.Element {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { activeAnalogy } = useAnalogy();

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
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = item.slug === currentSlug;
            const matchesAnalogy = item.analogy === activeAnalogy;

            return (
              <li key={item.id}>
                <Link
                  href={`/modules/${item.slug}`}
                  className={cn(
                    'block rounded-lg border border-transparent p-3 transition hover:border-border hover:bg-accent',
                    isActive && 'border-border bg-accent/60',
                    matchesAnalogy ? 'opacity-100' : 'opacity-90'
                  )}
                >
                  <div>
                    <p className="text-sm font-semibold text-foreground">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
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
