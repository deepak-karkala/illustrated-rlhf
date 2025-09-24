import { Spinner } from '@/components/ui/spinner';

export default function RootLoading(): JSX.Element {
  return (
    <div className="flex min-h-[200px] items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-sm text-muted-foreground">
        <Spinner />
        <span>Loading experience…</span>
      </div>
    </div>
  );
}
