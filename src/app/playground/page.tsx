import type { Metadata } from 'next';

import { ConceptPlayground } from '@/components/playground/concept-playground';

export const metadata: Metadata = {
  title: 'Concept Playground · RLHF Illustrated Guide',
  description:
    'Interactive sandbox for exploring rejection sampling, PPO, and DPO scenarios inspired by Chapters 10–12 of the RLHF book.',
};

export default function PlaygroundPage(): JSX.Element {
  return (
    <div className="container space-y-12 py-12">
      <ConceptPlayground />
    </div>
  );
}
