import Link from 'next/link';

export function SiteFooter(): JSX.Element {
  return (
    <footer className="border-t bg-background py-6 md:py-8">
      <div className="container flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground md:h-16 md:flex-row">
        <p className="text-center md:text-left">
          Built with Next.js and Tailwind CSS. Open source educational project.
        </p>
        <div className="flex items-center gap-4">
          <Link className="transition hover:text-foreground" href="/modules">
            Modules
          </Link>
          <Link className="transition hover:text-foreground" href="/playground">
            Playground
          </Link>
        </div>
      </div>
    </footer>
  );
}
