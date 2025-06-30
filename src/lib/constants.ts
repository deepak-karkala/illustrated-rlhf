/**
 * Application constants and configuration
 */

export const APP_CONFIG = {
  name: 'RLHF Illustrated Guide',
  description: 'An interactive visual guide to Reinforcement Learning from Human Feedback',
  version: '0.1.0',
  author: 'RLHF Guide Team',
  repository: 'https://github.com/deepak-karkala/illustrated-rlhf',
} as const;

export const ANALOGY_TYPES = {
  ATARI: 'atari',
  WRITING: 'writing',
  REASONING: 'reasoning',
  ADVANCED: 'advanced',
} as const;

export const ANALOGY_CONFIG = {
  [ANALOGY_TYPES.ATARI]: {
    name: 'Atari Game Bot',
    emoji: '🎮',
    description: 'Game-playing AI learning from rewards',
    color: 'analogy-atari',
    use_cases: ['Core RL concepts', 'Policy learning', 'Value functions', 'Environmental rewards'],
  },
  [ANALOGY_TYPES.WRITING]: {
    name: 'Creative Writing Student',
    emoji: '✍️',
    description: 'Student improving through teacher feedback',
    color: 'analogy-writing',
    use_cases: [
      'Preference learning',
      'Reward modeling',
      'Human feedback',
      'Iterative improvement',
    ],
  },
  [ANALOGY_TYPES.REASONING]: {
    name: 'Math Tutor Bot',
    emoji: '🧮',
    description: 'AI solving problems step-by-step',
    color: 'analogy-reasoning',
    use_cases: ['Reasoning chains', 'Verifiable rewards', 'Tool use', 'Inference-time scaling'],
  },
  [ANALOGY_TYPES.ADVANCED]: {
    name: 'Advanced Concepts',
    emoji: '🧠',
    description: 'Complex RLHF topics and applications',
    color: 'analogy-advanced',
    use_cases: ['Constitutional AI', 'Evaluation', 'Over-optimization', 'Product considerations'],
  },
} as const;

export const MODULE_PHASES = {
  PHASE_1: 'phase-1',
  PHASE_2: 'phase-2',
  PHASE_3: 'phase-3',
} as const;

export const PERFORMANCE_TARGETS = {
  LCP: 2500, // Largest Contentful Paint (ms)
  FID: 100, // First Input Delay (ms)
  CLS: 0.1, // Cumulative Layout Shift
  PAGE_LOAD: 3000, // Page load time on 3G (ms)
  VISUALIZATION_RENDER: 500, // Visualization rendering time (ms)
} as const;

export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;

export const LOCAL_STORAGE_KEYS = {
  THEME: 'rlhf-guide-theme',
  ANALOGY_PREFERENCE: 'rlhf-guide-analogy',
  PROGRESS: 'rlhf-guide-progress',
  SETTINGS: 'rlhf-guide-settings',
} as const;
