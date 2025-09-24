import type { ModuleMetadata } from '@/lib/types';

interface ModuleNavItem extends ModuleMetadata {
  slug: string;
  progress: number;
  status: 'available' | 'coming-soon';
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
    progress: 20,
    status: 'available',
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
    progress: 0,
    status: 'coming-soon',
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
    progress: 0,
    status: 'coming-soon',
  },
];

export function getModuleBySlug(slug: string): ModuleNavItem | undefined {
  return MODULES.find((moduleEntry) => moduleEntry.slug === slug);
}

export type { ModuleNavItem };
