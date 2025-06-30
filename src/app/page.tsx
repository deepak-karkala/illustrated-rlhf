import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'RLHF Illustrated Guide - Home',
  description:
    'Learn Reinforcement Learning from Human Feedback through interactive visualizations and analogies',
};

export default function HomePage(): JSX.Element {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <section className="text-center mb-12">
          <h1 className="heading-1 mb-6">RLHF Illustrated Guide</h1>
          <p className="body-large text-muted-foreground mb-8">
            Learn Reinforcement Learning from Human Feedback through interactive visualizations,
            intuitive analogies, and hands-on examples.
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="/modules/introduction"
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Start Learning
            </a>
            <a
              href="/playground"
              className="px-6 py-3 border border-border rounded-lg hover:bg-accent transition-colors"
            >
              Try Playground
            </a>
          </div>
        </section>

        <section className="grid gap-8 md:grid-cols-3 mb-12">
          <div className="p-6 border border-border rounded-lg">
            <div className="w-12 h-12 bg-analogy-atari-500 rounded-lg mb-4 flex items-center justify-center">
              🎮
            </div>
            <h3 className="heading-3 mb-2">Interactive Learning</h3>
            <p className="body text-muted-foreground">
              Explore RLHF concepts through interactive visualizations and hands-on examples.
            </p>
          </div>

          <div className="p-6 border border-border rounded-lg">
            <div className="w-12 h-12 bg-analogy-writing-500 rounded-lg mb-4 flex items-center justify-center">
              ✍️
            </div>
            <h3 className="heading-3 mb-2">Intuitive Analogies</h3>
            <p className="body text-muted-foreground">
              Understand complex concepts through relatable analogies and visual metaphors.
            </p>
          </div>

          <div className="p-6 border border-border rounded-lg">
            <div className="w-12 h-12 bg-analogy-reasoning-500 rounded-lg mb-4 flex items-center justify-center">
              🧮
            </div>
            <h3 className="heading-3 mb-2">Comprehensive Coverage</h3>
            <p className="body text-muted-foreground">
              From basic concepts to advanced topics like Constitutional AI and reasoning training.
            </p>
          </div>
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
              <span className="text-sm text-muted-foreground">Coming soon</span>
            </div>
            <div className="p-4 border border-border rounded-lg flex items-center justify-between opacity-60">
              <div className="text-left">
                <h4 className="font-semibold">Policy Gradients (PPO)</h4>
                <p className="text-sm text-muted-foreground">Core RL optimization techniques</p>
              </div>
              <span className="text-sm text-muted-foreground">Coming soon</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
