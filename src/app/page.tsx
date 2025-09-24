import Link from 'next/link';
import type { Metadata } from 'next';

import { Badge } from '@/components/ui/badge';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'RLHF Illustrated Guide - Home',
  description:
    'Learn Reinforcement Learning from Human Feedback through interactive visualizations and analogies',
};

export default function HomePage(): JSX.Element {
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

      <section className="mb-12 grid gap-8 md:grid-cols-3">
        <Card className="border-border">
          <CardHeader>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-analogy-atari-500 text-white">
              🎮
            </div>
            <CardTitle>Interactive Learning</CardTitle>
            <CardDescription>
              Explore RLHF concepts through interactive visualizations and hands-on examples.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-analogy-writing-500 text-white">
              ✍️
            </div>
            <CardTitle>Intuitive Analogies</CardTitle>
            <CardDescription>
              Understand complex concepts through relatable analogies and visual metaphors.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-analogy-reasoning-500 text-white">
              🧮
            </div>
            <CardTitle>Comprehensive Coverage</CardTitle>
            <CardDescription>
              From basic concepts to advanced topics like Constitutional AI and reasoning training.
            </CardDescription>
          </CardHeader>
        </Card>
      </section>

      <section className="text-center">
        <h2 className="heading-2 mb-6">Learning Path</h2>
        <div className="space-y-4">
          <div className="p-4 border border-border rounded-lg flex items-center justify-between">
            <div className="text-left">
              <h4 className="font-semibold">Introduction to RLHF</h4>
              <p className="text-sm text-muted-foreground">What RLHF does and why it matters</p>
            </div>
            <span className="text-sm text-analogy-atari-600">Start here</span>
          </div>
          <div className="p-4 border border-border rounded-lg flex items-center justify-between opacity-60">
            <div className="text-left">
              <h4 className="font-semibold">Reward Modeling</h4>
              <p className="text-sm text-muted-foreground">
                Training reward models from preference data
              </p>
            </div>
            <Badge variant="warning">Coming soon</Badge>
          </div>
          <div className="p-4 border border-border rounded-lg flex items-center justify-between opacity-60">
            <div className="text-left">
              <h4 className="font-semibold">Policy Gradients (PPO)</h4>
              <p className="text-sm text-muted-foreground">Core RL optimization techniques</p>
            </div>
            <Badge variant="warning">Coming soon</Badge>
          </div>
        </div>
      </section>
    </div>
  );
}
