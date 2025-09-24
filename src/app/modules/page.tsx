import type { Metadata } from 'next';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
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
          <Card key={moduleEntry.id} className="border-border">
            <CardHeader>
              <CardTitle>{moduleEntry.title}</CardTitle>
              <CardDescription>{moduleEntry.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <Badge variant={moduleEntry.status === 'available' ? 'success' : 'warning'}>
                  {moduleEntry.status === 'available' ? 'Available' : 'Coming soon'}
                </Badge>
                <span>Estimated time: {moduleEntry.estimated_time} min</span>
                <span>Difficulty: {moduleEntry.difficulty}</span>
              </div>
              <div>
                <Progress value={moduleEntry.progress} />
                <span className="mt-1 block text-right text-xs text-muted-foreground">
                  {moduleEntry.progress}% complete
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
