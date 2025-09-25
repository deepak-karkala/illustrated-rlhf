import type { ModuleMetadata, ModuleSectionDefinition } from '@/lib/types';

export interface ModuleNavItem extends ModuleMetadata {
  slug: string;
  summary: string;
  order: number;
  progress: number;
  status: 'available' | 'coming-soon';
  sections: ModuleSectionDefinition[];
}

export const MODULES: ModuleNavItem[] = [
  {
    id: 'module-introduction',
    slug: 'introduction',
    title: 'Introduction to RLHF',
    description: 'What RLHF does and why it matters',
    phase: 'phase-1',
    analogy: 'atari',
    prerequisites: [],
    estimated_time: 20,
    difficulty: 'beginner',
    tags: ['overview', 'rlhf'],
    summary:
      'Learn why RLHF emerged, its training loop, and how preferences become better policies.',
    order: 1,
    progress: 20,
    status: 'available',
    sections: [
      {
        id: 'equation',
        type: 'equation',
        title: 'RLHF Training Objective',
        eyebrow: 'Equation',
      },
      {
        id: 'intuition',
        type: 'intuition',
        title: 'Why Human Feedback Matters',
        eyebrow: 'Intuition',
      },
      {
        id: 'analogy',
        type: 'analogy',
        title: 'Analogy: Writing Coach & Arcade Bot',
        eyebrow: 'Analogy',
      },
      {
        id: 'visualization',
        type: 'visualization',
        title: 'The RLHF Loop',
        eyebrow: 'Visualization',
      },
      {
        id: 'takeaways',
        type: 'takeaways',
        title: 'Key Takeaways',
        eyebrow: 'Summary',
      },
      {
        id: 'assessment',
        type: 'assessment',
        title: 'Quick Self-Check',
        eyebrow: 'Assessment',
      },
    ],
  },
  {
    id: 'module-reward-modeling',
    slug: 'reward-modeling',
    title: 'Reward Modeling',
    description: 'Training reward models from preference data',
    phase: 'phase-1',
    analogy: 'writing',
    prerequisites: ['module-introduction'],
    estimated_time: 35,
    difficulty: 'intermediate',
    tags: ['reward-model', 'preferences'],
    summary: 'Teach a reward model to score completions using pairwise human preference datasets.',
    order: 2,
    progress: 30,
    status: 'available',
    sections: [
      {
        id: 'equation',
        type: 'equation',
        title: 'Pairwise Preference Loss',
        eyebrow: 'Equation',
      },
      {
        id: 'intuition',
        type: 'intuition',
        title: 'From Comparisons to Scores',
        eyebrow: 'Intuition',
      },
      {
        id: 'analogy',
        type: 'analogy',
        title: 'Analogy: Writing Student & Editor',
        eyebrow: 'Analogy',
      },
      {
        id: 'visualization',
        type: 'visualization',
        title: 'Reward Model Explorer',
        eyebrow: 'Visualization',
      },
      {
        id: 'takeaways',
        type: 'takeaways',
        title: 'Practice Patterns',
        eyebrow: 'Summary',
      },
      {
        id: 'assessment',
        type: 'assessment',
        title: 'Reward Modeling Check',
        eyebrow: 'Assessment',
      },
    ],
  },
  {
    id: 'module-ppo',
    slug: 'policy-gradients',
    title: 'Policy Gradients (PPO)',
    description: 'Core RL optimization techniques',
    phase: 'phase-1',
    analogy: 'atari',
    prerequisites: ['module-introduction'],
    estimated_time: 40,
    difficulty: 'intermediate',
    tags: ['policy', 'ppo'],
    summary: 'Walk through PPO and why it stabilises post-training policy updates.',
    order: 3,
    progress: 0,
    status: 'coming-soon',
    sections: [],
  },
];

export function getModuleBySlug(slug: string): ModuleNavItem | undefined {
  return MODULES.find((moduleEntry) => moduleEntry.slug === slug);
}

export function getAdjacentModules(slug: string): {
  previous?: ModuleNavItem;
  next?: ModuleNavItem;
} {
  const available = MODULES.filter((entry) => entry.status === 'available');
  const index = available.findIndex((entry) => entry.slug === slug);
  if (index === -1) return {};
  return {
    previous: available[index - 1],
    next: available[index + 1],
  };
}

export function getModuleSummaries(): Pick<
  ModuleNavItem,
  'slug' | 'title' | 'description' | 'order' | 'sections'
>[] {
  return MODULES.map(({ slug, title, description, order, sections }) => ({
    slug,
    title,
    description,
    order,
    sections,
  }));
}
