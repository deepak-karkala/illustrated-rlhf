'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

import { NavigationLink } from '@/components/ui/navigation-link';
import { ThemeToggle } from '@/components/ui/theme-toggle';

interface NavItem {
  href: string;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { href: '/modules', label: 'Modules' },
  { href: '/playground', label: 'Playground' },
  { href: '/about', label: 'About' },
];

export function SiteHeader(): JSX.Element {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Left: Back to Portfolio */}
        <div className="flex items-center">
          <a
            href="https://deepakkarkala.com"
            className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back to Portfolio</span>
            <span className="sm:hidden">Portfolio</span>
          </a>
        </div>

        {/* Center: Title */}
        <div className="pointer-events-none absolute left-1/2 -translate-x-1/2">
          <Link href="/" className="pointer-events-auto text-lg font-bold md:text-xl">
            The Illustrated RLHF Guide
          </Link>
        </div>

        {/* Right: Navigation + Theme Toggle */}
        <div className="flex items-center gap-1 sm:gap-3">
          <nav className="hidden items-center gap-1 sm:flex sm:gap-3">
            {NAV_ITEMS.map((item) => (
              <NavigationLink
                key={item.href}
                href={item.href}
                isActive={pathname === item.href || pathname.startsWith(item.href + '/')}
              >
                {item.label}
              </NavigationLink>
            ))}
          </nav>
          {/* Mobile nav - compact */}
          <nav className="flex items-center gap-1 sm:hidden">
            {NAV_ITEMS.map((item) => (
              <NavigationLink
                key={item.href}
                href={item.href}
                className="px-1.5 py-1 text-xs"
                isActive={pathname === item.href || pathname.startsWith(item.href + '/')}
              >
                {item.label.slice(0, 3)}
              </NavigationLink>
            ))}
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
