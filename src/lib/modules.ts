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
    id: 'module-problem-setup',
    slug: 'problem-setup',
    title: 'Problem Setup & Context',
    description: 'Foundations: definitions, pipelines, and data collection',
    phase: 'phase-2',
    analogy: 'advanced',
    prerequisites: ['module-introduction'],
    estimated_time: 30,
    difficulty: 'intermediate',
    tags: ['foundations', 'problem-setup'],
    summary:
      'Map the RLHF objective, modern pipelines, and preference data workflow before diving deeper.',
    order: 2,
    progress: 0,
    status: 'available',
    sections: [
      {
        id: 'equation',
        type: 'equation',
        title: 'RLHF Objective Refresher',
        eyebrow: 'Equation',
      },
      {
        id: 'intuition',
        type: 'intuition',
        title: 'From Definitions to Pipelines',
        eyebrow: 'Intuition',
      },
      {
        id: 'analogy',
        type: 'analogy',
        title: 'Analogy: Systems Architect & Field Researcher',
        eyebrow: 'Analogy',
      },
      {
        id: 'visualization',
        type: 'visualization',
        title: 'Preference Data Playground',
        eyebrow: 'Visualization',
      },
      {
        id: 'takeaways',
        type: 'takeaways',
        title: 'Operational Notes',
        eyebrow: 'Summary',
      },
      {
        id: 'assessment',
        type: 'assessment',
        title: 'Problem Setup Check',
        eyebrow: 'Assessment',
      },
    ],
  },
  {
    id: 'module-instruction-tuning',
    slug: 'instruction-tuning',
    title: 'Instruction Tuning',
    description: 'Teach the model the chat format before RLHF',
    phase: 'phase-2',
    analogy: 'writing',
    prerequisites: ['module-problem-setup', 'module-introduction'],
    estimated_time: 35,
    difficulty: 'intermediate',
    tags: ['instruction-tuning', 'sft'],
    summary:
      'Build chat templates, curated datasets, and masking rules that prepare models for RLHF.',
    order: 3,
    progress: 0,
    status: 'available',
    sections: [
      {
        id: 'equation',
        type: 'equation',
        title: 'Supervised Objective',
        eyebrow: 'Equation',
      },
      {
        id: 'intuition',
        type: 'intuition',
        title: 'Why Instruction Tuning Matters',
        eyebrow: 'Intuition',
      },
      {
        id: 'analogy',
        type: 'analogy',
        title: 'Analogy: Writing Coach & Script Editor',
        eyebrow: 'Analogy',
      },
      {
        id: 'visualization',
        type: 'visualization',
        title: 'Template & Masking Lab',
        eyebrow: 'Visualization',
      },
      {
        id: 'takeaways',
        type: 'takeaways',
        title: 'Implementation Notes',
        eyebrow: 'Summary',
      },
      {
        id: 'assessment',
        type: 'assessment',
        title: 'Instruction Tuning Check',
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
    order: 4,
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
    prerequisites: ['module-introduction', 'module-reward-modeling'],
    estimated_time: 40,
    difficulty: 'intermediate',
    tags: ['policy', 'ppo'],
    summary: 'Walk through PPO and why it stabilises post-training policy updates.',
    order: 5,
    progress: 10,
    status: 'available',
    sections: [
      {
        id: 'equation',
        type: 'equation',
        title: 'Clipped PPO Objective',
        eyebrow: 'Equation',
      },
      {
        id: 'intuition',
        type: 'intuition',
        title: 'Why PPO Stabilises Updates',
        eyebrow: 'Intuition',
      },
      {
        id: 'analogy',
        type: 'analogy',
        title: 'Analogy: Arcade Bot With Bumpers',
        eyebrow: 'Analogy',
      },
      {
        id: 'visualization',
        type: 'visualization',
        title: 'Policy Update Lab',
        eyebrow: 'Visualization',
      },
      {
        id: 'takeaways',
        type: 'takeaways',
        title: 'Implementation Notes',
        eyebrow: 'Summary',
      },
      {
        id: 'assessment',
        type: 'assessment',
        title: 'PPO Check',
        eyebrow: 'Assessment',
      },
    ],
  },
  {
    id: 'module-dpo',
    slug: 'direct-preference-optimization',
    title: 'Direct Preference Optimization (DPO)',
    description: 'Alignment without reinforcement learning',
    phase: 'phase-1',
    analogy: 'advanced',
    prerequisites: ['module-introduction', 'module-reward-modeling'],
    estimated_time: 30,
    difficulty: 'intermediate',
    tags: ['alignment', 'dpo'],
    summary: 'Optimise policies directly against preference data without training a reward model.',
    order: 6,
    progress: 0,
    status: 'available',
    sections: [
      {
        id: 'equation',
        type: 'equation',
        title: 'DPO Objective',
        eyebrow: 'Equation',
      },
      {
        id: 'intuition',
        type: 'intuition',
        title: 'Offline Alignment Intuition',
        eyebrow: 'Intuition',
      },
      {
        id: 'analogy',
        type: 'analogy',
        title: 'Analogy: Debate Judge & Apprentice',
        eyebrow: 'Analogy',
      },
      {
        id: 'visualization',
        type: 'visualization',
        title: 'DPO Playground',
        eyebrow: 'Visualization',
      },
      {
        id: 'takeaways',
        type: 'takeaways',
        title: 'Operational Notes',
        eyebrow: 'Summary',
      },
      {
        id: 'assessment',
        type: 'assessment',
        title: 'DPO Check',
        eyebrow: 'Assessment',
      },
    ],
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
