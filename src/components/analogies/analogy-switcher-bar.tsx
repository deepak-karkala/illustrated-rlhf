'use client';

import { useAnalogy, useAnalogyDetails } from '@/lib/analogy-context';
import type { AnalogyType } from '@/lib/types';
import { cn } from '@/lib/utils';

interface AnalogySwitcherBarProps {
  className?: string;
}

function AnalogyButton({
  type,
  isActive,
  onSelect,
}: {
  type: AnalogyType;
  isActive: boolean;
  onSelect: (type: AnalogyType) => void;
}): JSX.Element {
  const details = useAnalogyDetails(type);

  return (
    <button
      type="button"
      onClick={() => onSelect(type)}
      className={cn(
        'flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium transition-colors focus-ring',
        isActive
          ? 'border-foreground bg-foreground/10 text-foreground'
          : 'border-border hover:border-foreground/40 text-muted-foreground'
      )}
      aria-pressed={isActive}
    >
      <span aria-hidden="true" className="text-sm">
        {details.emoji}
      </span>
      <span>{details.name}</span>
    </button>
  );
}

export function AnalogySwitcherBar({ className }: AnalogySwitcherBarProps): JSX.Element {
  const { activeAnalogy, setAnalogy, availableAnalogies } = useAnalogy();

  return (
    <div
      className={cn(
        'flex flex-col gap-2 rounded-xl border border-border bg-card/70 p-3 md:flex-row md:items-center md:justify-between',
        className
      )}
    >
      <div>
        <p className="text-xs uppercase tracking-wide text-muted-foreground">Active Analogy</p>
        <p className="text-sm font-medium text-foreground">
          {useAnalogyDetails(activeAnalogy).description}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {availableAnalogies.map((type) => (
          <AnalogyButton
            key={type}
            type={type}
            isActive={type === activeAnalogy}
            onSelect={setAnalogy}
          />
        ))}
      </div>
    </div>
  );
}
