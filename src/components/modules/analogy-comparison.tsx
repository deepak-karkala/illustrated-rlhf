import { cn } from '@/lib/utils';

interface AnalogyRow {
  label: string;
  description: string;
}

interface AnalogyComparisonProps {
  items: AnalogyRow[];
  className?: string;
}

export function AnalogyComparison({ items, className }: AnalogyComparisonProps): JSX.Element {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-2xl border border-border bg-card/70 shadow-sm',
        className
      )}
    >
      <div className="grid divide-border md:grid-cols-2 md:divide-x">
        {items.map((item) => (
          <div key={item.label} className="p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {item.label}
            </p>
            <p className="mt-2 text-sm text-foreground">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
