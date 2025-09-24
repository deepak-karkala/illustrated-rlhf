import Link from 'next/link';
import type { LinkProps } from 'next/link';
import * as React from 'react';

import { cn } from '@/lib/utils';

export interface NavigationLinkProps extends LinkProps {
  children: React.ReactNode;
  className?: string;
  isActive?: boolean;
}

export function NavigationLink({
  children,
  className,
  isActive = false,
  ...props
}: NavigationLinkProps): JSX.Element {
  return (
    <Link
      className={cn(
        'text-sm font-medium text-muted-foreground transition-colors hover:text-foreground',
        isActive ? 'text-foreground' : undefined,
        className
      )}
      aria-current={isActive ? 'page' : undefined}
      {...props}
    >
      {children}
    </Link>
  );
}
