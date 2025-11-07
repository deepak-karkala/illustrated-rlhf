import Link from 'next/link';
import type { Metadata } from 'next';

import { AnalogyShowcase } from '@/components/analogies/analogy-visuals';
import { Badge } from '@/components/ui/badge';
import { MODULES } from '@/lib/modules';

export const metadata: Metadata = {
  title: 'RLHF Illustrated Guide - Home',
  description:
    'Learn Reinforcement Learning from Human Feedback through interactive visualizations and analogies',
};

const LEARNING_PATH_SLUGS = ['introduction', 'reward-modeling', 'policy-gradients'];

export default function HomePage(): JSX.Element {
  const learningPathModules = LEARNING_PATH_SLUGS.map((slug) =>
    MODULES.find((module) => module.slug === slug)
  ).filter((moduleEntry): moduleEntry is NonNullable<typeof moduleEntry> => Boolean(moduleEntry));

  return (
    <div className="mx-auto max-w-4xl">
      <section className="text-center mb-12">
        <h1 className="heading-1 mb-6">RLHF Illustrated Guide</h1>
        <p className="body-large text-muted-foreground mb-8">
          Learn Reinforcement Learning from Human Feedback through interactive visualizations,
          intuitive analogies, and hands-on examples.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/modules/introduction"
            className="inline-flex items-center rounded-md bg-primary px-6 py-3 text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Start Learning
          </Link>
          <Link
            href="/playground"
            className="inline-flex items-center rounded-md border border-border px-6 py-3 transition-colors hover:bg-accent"
          >
            Try Playground
          </Link>
        </div>
      </section>

      <AnalogyShowcase className="mb-12" />

      <section className="text-center">
        <h2 className="heading-2 mb-6">Learning Path</h2>
        <div className="space-y-4">
          {learningPathModules.map((moduleEntry) => {
            const isAvailable = moduleEntry.status === 'available';
            const actionLabel = moduleEntry.slug === 'introduction' ? 'Start here' : 'View module';
            const cardClasses = [
              'flex items-center justify-between rounded-lg border border-border p-4 text-left transition',
              isAvailable
                ? 'hover:border-primary/40 hover:bg-accent/40'
                : 'cursor-not-allowed opacity-70',
            ].join(' ');
            const cardContent = (
              <div className={cardClasses}>
                <div>
                  <h4 className="font-semibold">{moduleEntry.title}</h4>
                  <p className="text-sm text-muted-foreground">{moduleEntry.description}</p>
                </div>
                {isAvailable ? (
                  <span className="text-sm font-semibold text-primary">{actionLabel}</span>
                ) : (
                  <Badge variant="warning">Coming soon</Badge>
                )}
              </div>
            );

            return isAvailable ? (
              <Link
                key={moduleEntry.id}
                href={`/modules/${moduleEntry.slug}`}
                className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                aria-label={`Open module ${moduleEntry.title}`}
              >
                {cardContent}
              </Link>
            ) : (
              <div key={moduleEntry.id} aria-disabled="true">
                {cardContent}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
