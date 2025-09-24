'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Fragment } from 'react';

import { MODULES } from '@/lib/modules';
import { cn } from '@/lib/utils';

function getLabelForSegment(segment: string): string {
  if (segment === '') return 'Home';
  if (segment === 'modules') return 'Modules';

  const moduleEntry = MODULES.find((item) => item.slug === segment);
  if (moduleEntry) {
    return moduleEntry.title;
  }

  return segment
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function Breadcrumbs(): JSX.Element | null {
  const pathname = usePathname();

  if (!pathname) {
    return null;
  }

  const segments = pathname.split('/');

  if (segments.length <= 2 && (segments[1] === '' || segments[1] === undefined)) {
    return null;
  }

  const paths: { href: string; label: string; isCurrent: boolean }[] = [];
  let accumulated = '';

  segments.forEach((segment, index) => {
    if (index === 0) {
      return;
    }

    accumulated += `/${segment}`;
    const isLast = index === segments.length - 1;
    const label = getLabelForSegment(segment);

    if (label.trim() === '') {
      return;
    }

    paths.push({
      href: accumulated,
      label,
      isCurrent: isLast,
    });
  });

  if (paths.length === 0) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className="mb-4 flex items-center text-sm text-muted-foreground">
      <ol className="flex items-center gap-2">
        <li>
          <Link href="/" className="transition-colors hover:text-foreground">
            Home
          </Link>
        </li>
        {paths.map((path) => (
          <Fragment key={path.href}>
            <li aria-hidden="true" className="text-muted-foreground">
              /
            </li>
            <li>
              {path.isCurrent ? (
                <span className="font-medium text-foreground" aria-current="page">
                  {path.label}
                </span>
              ) : (
                <Link
                  href={path.href}
                  className={cn(
                    'transition-colors hover:text-foreground',
                    path.isCurrent && 'text-foreground'
                  )}
                >
                  {path.label}
                </Link>
              )}
            </li>
          </Fragment>
        ))}
      </ol>
    </nav>
  );
}
