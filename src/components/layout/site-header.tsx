'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { NavigationLink } from '@/components/ui/navigation-link';
import { ThemeToggle } from '@/components/ui/theme-toggle';

interface NavItem {
  href: string;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { href: '/', label: 'Home' },
  { href: '/modules', label: 'Modules' },
  { href: '/playground', label: 'Playground' },
];

export function SiteHeader(): JSX.Element {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl font-bold">
            RLHF Guide
          </Link>
          <nav className="hidden items-center gap-4 md:flex">
            {NAV_ITEMS.map((item) => (
              <NavigationLink key={item.href} href={item.href} isActive={pathname === item.href}>
                {item.label}
              </NavigationLink>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <nav className="flex items-center gap-2 md:hidden">
            {NAV_ITEMS.map((item) => (
              <NavigationLink
                key={item.href}
                href={item.href}
                className="px-2 py-1"
                isActive={pathname === item.href}
              >
                {item.label}
              </NavigationLink>
            ))}
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
