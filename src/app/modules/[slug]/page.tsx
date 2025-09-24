import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { MODULES, getModuleBySlug } from '@/lib/modules';

interface ModulePageProps {
  params: { slug: string };
}

export function generateStaticParams(): Array<{ slug: string }> {
  return MODULES.filter((moduleEntry) => moduleEntry.status === 'available').map((moduleEntry) => ({
    slug: moduleEntry.slug,
  }));
}

export function generateMetadata({ params }: ModulePageProps): Metadata {
  const moduleEntry = getModuleBySlug(params.slug);

  if (!moduleEntry) {
    return {
      title: 'Module not found',
    };
  }

  return {
    title: `${moduleEntry.title} • RLHF Module`,
    description: moduleEntry.description,
  };
}

export default function ModulePage({ params }: ModulePageProps): JSX.Element {
  const moduleEntry = getModuleBySlug(params.slug);

  if (!moduleEntry) {
    notFound();
  }

  const isComingSoon = moduleEntry.status === 'coming-soon';

  return (
    <article className="space-y-6">
      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <Badge variant={isComingSoon ? 'warning' : 'success'}>
            {isComingSoon ? 'Coming soon' : 'Available'}
          </Badge>
          <span>Estimated time: {moduleEntry.estimated_time} min</span>
          <span>Difficulty: {moduleEntry.difficulty}</span>
        </div>
        <h1 className="heading-1">{moduleEntry.title}</h1>
        <p className="body-large text-muted-foreground">{moduleEntry.description}</p>
      </header>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Module Status</CardTitle>
            <CardDescription>Track your progress through the chapter.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Progress value={moduleEntry.progress} />
            <p className="text-sm text-muted-foreground">{moduleEntry.progress}% complete</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Prerequisites</CardTitle>
            <CardDescription>Concepts recommended before starting this module.</CardDescription>
          </CardHeader>
          <CardContent>
            {moduleEntry.prerequisites.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                This is the recommended starting point.
              </p>
            ) : (
              <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                {moduleEntry.prerequisites.map((prereq) => {
                  const prereqModule = MODULES.find((item) => item.id === prereq);
                  return <li key={prereq}>{prereqModule ? prereqModule.title : prereq}</li>;
                })}
              </ul>
            )}
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Module Outline</CardTitle>
          <CardDescription>
            A detailed outline will appear here as content is authored.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            We&apos;re preparing interactive lessons that combine equations, analogies, and
            visualizations. Check back soon for the full learning experience.
          </p>
        </CardContent>
      </Card>
    </article>
  );
}
