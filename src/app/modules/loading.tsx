import { Spinner } from '@/components/ui/spinner';

export default function ModulesLoading(): JSX.Element {
  return (
    <div className="flex min-h-[200px] items-center justify-center rounded-xl border border-border bg-card p-12">
      <div className="flex flex-col items-center gap-3 text-sm text-muted-foreground">
        <Spinner />
        <span>Preparing module content…</span>
      </div>
    </div>
  );
}
