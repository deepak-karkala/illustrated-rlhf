import { getAnalogyMetadata } from '@/lib/module-utils';
import type { AnalogyType } from '@/lib/types';
import { cn } from '@/lib/utils';

interface AnalogyPillProps {
  type: AnalogyType;
  className?: string;
}

export function AnalogyPill({ type, className }: AnalogyPillProps): JSX.Element {
  const details = getAnalogyMetadata(type);

  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium tracking-wide',
        details.color,
        className
      )}
    >
      <span aria-hidden="true">{details.emoji}</span>
      <span>{details.name}</span>
    </span>
  );
}
