import Link from 'next/link';
import type { ReactNode } from 'react';

import { AnalogyPill } from '@/components/analogies/analogy-pill';
import { MODULES } from '@/lib/modules';
import type { ModuleNavItem } from '@/lib/modules';
import type { ModuleSectionType } from '@/lib/types';
import { cn } from '@/lib/utils';

const SECTION_CONFIG: Record<
  ModuleSectionType,
  { label: string; icon: string; badge: string; surface: string }
> = {
  equation: {
    label: 'Equation',
    icon: '📀',
    badge:
      'border-analogy-atari-200 bg-analogy-atari-50 text-analogy-atari-700 dark:bg-analogy-atari-900/20',
    surface: 'bg-analogy-atari-50/60 dark:bg-analogy-atari-900/10 border-analogy-atari-200',
  },
  intuition: {
    label: 'Intuition',
    icon: '🧠',
    badge:
      'border-analogy-writing-200 bg-analogy-writing-50 text-analogy-writing-700 dark:bg-analogy-writing-900/20',
    surface: 'bg-analogy-writing-50/60 dark:bg-analogy-writing-900/10 border-analogy-writing-200',
  },
  analogy: {
    label: 'Analogy',
    icon: '🎭',
    badge:
      'border-analogy-writing-200 bg-analogy-writing-50 text-analogy-writing-700 dark:bg-analogy-writing-900/20',
    surface: 'bg-analogy-writing-50/60 dark:bg-analogy-writing-900/10 border-analogy-writing-200',
  },
  visualization: {
    label: 'Visualization',
    icon: '🖼️',
    badge:
      'border-analogy-reasoning-200 bg-analogy-reasoning-50 text-analogy-reasoning-700 dark:bg-analogy-reasoning-900/20',
    surface:
      'bg-analogy-reasoning-50/60 dark:bg-analogy-reasoning-900/10 border-analogy-reasoning-200',
  },
  takeaways: {
    label: 'Takeaways',
    icon: '✅',
    badge: 'border-border bg-muted text-foreground',
    surface: 'bg-muted/60 border-border',
  },
  assessment: {
    label: 'Self-check',
    icon: '📝',
    badge:
      'border-analogy-advanced-200 bg-analogy-advanced-50 text-analogy-advanced-700 dark:bg-analogy-advanced-900/20',
    surface:
      'bg-analogy-advanced-50/60 dark:bg-analogy-advanced-900/10 border-analogy-advanced-200',
  },
};

interface ModuleLayoutProps {
  module: ModuleNavItem;
  previous?: ModuleNavItem;
  next?: ModuleNavItem;
  children: ReactNode;
}

export function ModuleLayout({ module, previous, next, children }: ModuleLayoutProps): JSX.Element {
  return (
    <article className="flex h-full flex-col gap-8 lg:grid lg:grid-rows-[auto_minmax(0,1fr)_auto] lg:gap-8">
      <header className="space-y-4 rounded-3xl border border-border bg-card/70 p-6 shadow-sm">
        <AnalogyPill type={module.analogy} />
        <div className="space-y-2">
          <h1 className="heading-2">{module.title}</h1>
          <p className="text-muted-foreground">{module.summary}</p>
        </div>
        <dl className="grid gap-4 text-sm text-muted-foreground sm:grid-cols-3">
          <div>
            <dt className="font-semibold text-foreground">Estimated time</dt>
            <dd>{module.estimated_time} minutes</dd>
          </div>
          <div>
            <dt className="font-semibold text-foreground">Difficulty</dt>
            <dd className="capitalize">{module.difficulty}</dd>
          </div>
          <div>
            <dt className="font-semibold text-foreground">Prerequisites</dt>
            <dd>
              {module.prerequisites.length > 0
                ? `${module.prerequisites.length} module(s)`
                : 'None'}
            </dd>
          </div>
        </dl>
      </header>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,220px)_1fr] lg:min-h-0">
        <aside className="no-print space-y-6 lg:sticky lg:top-16 lg:self-start">
          <div className="rounded-2xl border border-border bg-card/60 p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-foreground">Table of contents</h2>
            <nav className="mt-3 space-y-2 text-sm">
              {module.sections.map((section) => (
                <Link
                  key={section.id}
                  href={`#${section.id}`}
                  className="group flex items-start gap-2 rounded-md border border-transparent px-3 py-2 text-left transition hover:border-border hover:bg-accent"
                >
                  <span aria-hidden="true" className="text-base">
                    {section.icon ?? SECTION_CONFIG[section.type].icon}
                  </span>
                  <span className="text-muted-foreground group-hover:text-foreground">
                    <span className="block text-xs uppercase tracking-wide text-muted-foreground">
                      {section.eyebrow ?? SECTION_CONFIG[section.type].label}
                    </span>
                    <span className="block font-medium text-foreground">{section.title}</span>
                  </span>
                </Link>
              ))}
            </nav>
          </div>
          <div className="rounded-2xl border border-border bg-card/60 p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-foreground">Prerequisites</h2>
            {module.prerequisites.length > 0 ? (
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {module.prerequisites.map((prereq) => {
                  const prereqModule = MODULES.find(
                    (item) => item.id === prereq || item.slug === prereq
                  );
                  return (
                    <li key={prereq} className="flex items-center gap-2">
                      <span aria-hidden="true">•</span>
                      <span>{prereqModule ? prereqModule.title : prereq}</span>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">
                Jump straight in – this is the suggested starting point.
              </p>
            )}
          </div>
        </aside>
        <div className="space-y-12 lg:min-h-0 lg:max-h-[calc(100vh-1.75rem)] lg:overflow-y-auto lg:pr-4 lg:pb-6">
          {children}
        </div>
      </div>

      <footer className="flex flex-col gap-3 border-t border-border pt-6 no-print sm:flex-row sm:items-center sm:justify-between">
        <NavigationCard label="Previous" module={previous} direction="prev" />
        <NavigationCard label="Next" module={next} direction="next" />
      </footer>
    </article>
  );
}

interface NavigationCardProps {
  label: string;
  module?: ModuleNavItem;
  direction: 'prev' | 'next';
}

function NavigationCard({ label, module, direction }: NavigationCardProps): JSX.Element {
  if (!module) {
    return <div />;
  }

  return (
    <Link
      href={`/modules/${module.slug}`}
      className={cn(
        'flex w-full max-w-sm items-center justify-between gap-3 rounded-xl border border-border bg-card/60 px-4 py-3 text-sm transition hover:border-foreground/40 hover:bg-accent',
        direction === 'next' ? 'ml-auto' : 'mr-auto'
      )}
    >
      <div>
        <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="font-semibold text-foreground">{module.title}</p>
      </div>
      <span aria-hidden="true" className="text-lg text-muted-foreground">
        {direction === 'next' ? '→' : '←'}
      </span>
    </Link>
  );
}

interface ModuleSectionProps {
  id: string;
  type: ModuleSectionType;
  title: string;
  eyebrow?: string;
  children: ReactNode;
}

export function ModuleSection({
  id,
  type,
  title,
  eyebrow,
  children,
}: ModuleSectionProps): JSX.Element {
  const config = SECTION_CONFIG[type];

  return (
    <section id={id} className="module-section scroll-mt-28 space-y-4 pb-10">
      <header className="space-y-2">
        <span
          className={cn(
            'inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide transition-colors',
            config.badge
          )}
        >
          <span aria-hidden="true">{config.icon}</span>
          {eyebrow ?? config.label}
        </span>
        <h2 className="text-2xl font-semibold text-foreground">{title}</h2>
      </header>
      <div
        className={cn(
          'prose prose-slate max-w-none rounded-2xl border p-5 shadow-sm transition-colors dark:prose-invert',
          config.surface
        )}
      >
        {children}
      </div>
    </section>
  );
}

export function EquationSection(props: Omit<ModuleSectionProps, 'type'>): JSX.Element {
  return <ModuleSection type="equation" {...props} />;
}

export function IntuitionSection(props: Omit<ModuleSectionProps, 'type'>): JSX.Element {
  return <ModuleSection type="intuition" {...props} />;
}

export function AnalogySection(props: Omit<ModuleSectionProps, 'type'>): JSX.Element {
  return <ModuleSection type="analogy" {...props} />;
}

export function VisualizationSection(props: Omit<ModuleSectionProps, 'type'>): JSX.Element {
  return <ModuleSection type="visualization" {...props} />;
}

export function TakeawaysSection(props: Omit<ModuleSectionProps, 'type'>): JSX.Element {
  return <ModuleSection type="takeaways" {...props} />;
}

export function AssessmentSection(props: Omit<ModuleSectionProps, 'type'>): JSX.Element {
  return <ModuleSection type="assessment" {...props} />;
}

export function ModuleCallout({ children }: { children: ReactNode }): JSX.Element {
  return (
    <div className="rounded-xl border border-dashed border-border bg-muted/40 p-4 text-sm text-muted-foreground">
      {children}
    </div>
  );
}

export function InlineDefinition({
  term,
  children,
}: {
  term: string;
  children: ReactNode;
}): JSX.Element {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground">
      <strong className="font-semibold">{term}:</strong>
      <span>{children}</span>
    </span>
  );
}
