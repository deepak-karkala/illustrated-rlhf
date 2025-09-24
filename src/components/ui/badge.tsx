import * as React from 'react';

import { cn } from '@/lib/utils';

type BadgeVariant = 'default' | 'secondary' | 'outline' | 'success' | 'warning';

type BadgeColorMap = Record<BadgeVariant, string>;

const VARIANT_STYLES: BadgeColorMap = {
  default: 'bg-primary/10 text-primary ring-primary/30',
  secondary: 'bg-secondary text-secondary-foreground ring-secondary/30',
  outline: 'border border-border text-foreground',
  success: 'bg-analogy-writing-100 text-analogy-writing-700 ring-analogy-writing-200',
  warning: 'bg-analogy-reasoning-100 text-analogy-reasoning-700 ring-analogy-reasoning-200',
};

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps): JSX.Element {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-transparent px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset',
        VARIANT_STYLES[variant],
        className
      )}
      {...props}
    />
  );
}
