import Link from 'next/link';
import type { Metadata } from 'next';

import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MODULES } from '@/lib/modules';

export const metadata: Metadata = {
  title: 'RLHF Modules',
  description: 'Browse the RLHF learning modules and track your progress through the curriculum.',
};

export default function ModulesPage(): JSX.Element {
  return (
    <div className="space-y-6">
      <header className="space-y-3">
        <h1 className="heading-1">Learning Modules</h1>
        <p className="body-large text-muted-foreground">
          Follow the core RLHF curriculum. Each module combines equations, intuition, analogies, and
          interactive visualizations.
        </p>
      </header>

      <div className="grid gap-5 md:grid-cols-2">
        {MODULES.map((moduleEntry) => (
          <Link
            key={moduleEntry.id}
            href={`/modules/${moduleEntry.slug}`}
            className="group block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            aria-label={`Open module ${moduleEntry.title}`}
          >
            <Card className="h-full border-border transition hover:border-primary/40 hover:bg-accent/40 group-hover:shadow-md">
              <CardHeader>
                <CardTitle>{moduleEntry.title}</CardTitle>
                <CardDescription>{moduleEntry.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
