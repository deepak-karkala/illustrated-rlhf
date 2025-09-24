'use client';

import { motion } from 'framer-motion';

import { useAnalogy, useAnalogyDetails } from '@/lib/analogy-context';
import type { AnalogyType } from '@/lib/types';
import { cn } from '@/lib/utils';

function AtariVisual(): JSX.Element {
  return (
    <div className="relative h-36 overflow-hidden rounded-xl border border-emerald-400/60 bg-slate-950 p-4 shadow-[0_0_30px_rgba(16,185,129,0.35)]">
      <div className="grid h-full grid-cols-6 gap-1 opacity-30">
        {Array.from({ length: 24 }).map((_, index) => (
          <div key={index} className="rounded-sm bg-emerald-400/40" />
        ))}
      </div>
      <motion.div
        className="absolute inset-x-6 top-5 h-1 rounded-full bg-emerald-300/70"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute left-6 bottom-6 h-6 w-6 rounded-sm bg-emerald-300"
        animate={{ x: [0, 80, 0], y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute right-8 bottom-8 h-4 w-4 rounded-full border-2 border-emerald-200"
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}

function WritingVisual(): JSX.Element {
  return (
    <div className="relative h-36 overflow-hidden rounded-xl border border-amber-400/50 bg-gradient-to-b from-white via-amber-50 to-amber-100 p-4 shadow-[0_0_20px_rgba(251,191,36,0.25)]">
      <div className="absolute inset-x-4 top-6 h-[1px] bg-amber-200" />
      <div className="absolute inset-x-4 top-12 h-[1px] bg-amber-200" />
      <div className="absolute inset-x-4 top-18 h-[1px] bg-amber-200" />
      <motion.div
        className="absolute top-4 left-6 h-8 w-52 rounded-lg bg-white/70 shadow-inner"
        animate={{ opacity: [0.65, 0.9, 0.65] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute inset-x-6 bottom-8 h-14 rounded-md border border-amber-300 bg-white/80 p-2 shadow"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <motion.span
          className="inline-block rounded-sm bg-amber-500/90 px-2 py-1 text-xs font-semibold text-white"
          animate={{ x: [0, 12, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          Editing draft…
        </motion.span>
      </motion.div>
      <motion.div
        className="absolute bottom-4 right-6 h-10 w-10 rotate-12 rounded-full bg-amber-400/60"
        animate={{ rotate: [10, -5, 10] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}

function ReasoningVisual(): JSX.Element {
  return (
    <div className="relative h-36 overflow-hidden rounded-xl border border-orange-400/60 bg-gradient-to-br from-white to-orange-50 p-4 shadow-[0_0_20px_rgba(249,115,22,0.25)]">
      <div className="absolute inset-3 rounded-lg border border-orange-200 bg-white/70" />
      <motion.span
        className="absolute left-8 top-6 text-sm font-semibold text-orange-900"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        {`∑ reward_t ⋅ γ^t`}
      </motion.span>
      <motion.span
        className="absolute right-8 bottom-8 rounded-md bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        Proof Verified
      </motion.span>
      <motion.div
        className="absolute left-8 bottom-6 h-10 w-10 rounded-full border-2 border-orange-400"
        animate={{ rotate: [0, 12, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute left-12 bottom-10 h-3 w-20 rounded-full bg-orange-400/60"
        animate={{ scaleX: [1, 1.2, 1] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}

function AdvancedVisual(): JSX.Element {
  return (
    <div className="relative h-36 overflow-hidden rounded-xl border border-purple-400/60 bg-gradient-to-br from-purple-950 via-purple-800 to-purple-600 p-4 shadow-[0_0_25px_rgba(168,85,247,0.35)]">
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(251,191,36,0.35),transparent_60%)]"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute left-10 top-6 h-3 w-24 rounded-full bg-purple-300/60"
        animate={{ x: [0, 12, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute right-12 bottom-10 h-4 w-4 rounded-full bg-fuchsia-400"
        animate={{ y: [0, -12, 0], scale: [1, 1.3, 1] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute left-10 bottom-8 h-3 w-3 rounded-full bg-sky-300"
        animate={{ x: [0, 60, 0], rotate: [0, 180, 360] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}

const VISUAL_COMPONENTS: Record<AnalogyType, () => JSX.Element> = {
  atari: AtariVisual,
  writing: WritingVisual,
  reasoning: ReasoningVisual,
  advanced: AdvancedVisual,
};

const ANALOGY_COPY: Record<AnalogyType, { tagline: string; description: string }> = {
  atari: {
    tagline: 'Retro policy training',
    description:
      'Treat RLHF like a classic arcade challenge – policies learn by chasing new highs.',
  },
  writing: {
    tagline: 'Draft, edit, refine',
    description: 'Follow the writing student and mentor through iterative feedback and revisions.',
  },
  reasoning: {
    tagline: 'Whiteboard your steps',
    description: 'Trace every deduction on a collaborative whiteboard to keep reasoning grounded.',
  },
  advanced: {
    tagline: 'Push the frontier',
    description:
      'Peek at frontier alignment topics like Constitutional AI and tool-use orchestration.',
  },
};

interface AnalogyCardProps {
  type: AnalogyType;
}

function AnalogyCard({ type }: AnalogyCardProps): JSX.Element {
  const details = useAnalogyDetails(type);
  const { activeAnalogy, setAnalogy } = useAnalogy();
  const Visual = VISUAL_COMPONENTS[type];
  const copy = ANALOGY_COPY[type];

  const isActive = activeAnalogy === type;

  return (
    <button
      type="button"
      onClick={() => setAnalogy(type)}
      className={cn(
        'flex h-full flex-col gap-4 rounded-2xl border bg-card p-5 text-left transition hover:border-foreground/40 focus-ring',
        isActive ? 'border-foreground shadow-lg shadow-foreground/10' : 'border-border'
      )}
      aria-pressed={isActive}
    >
      <Visual />
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
          <span aria-hidden="true">{details.emoji}</span>
          <span>{copy.tagline}</span>
        </div>
        <h3 className="text-lg font-semibold text-foreground">{details.name}</h3>
        <p className="text-sm text-muted-foreground">{copy.description}</p>
      </div>
    </button>
  );
}

interface AnalogyShowcaseProps {
  className?: string;
}

export function AnalogyShowcase({ className }: AnalogyShowcaseProps): JSX.Element {
  const { availableAnalogies } = useAnalogy();

  return (
    <section className={cn('space-y-6', className)}>
      <header className="space-y-2 text-center">
        <h2 className="heading-2">Analogy Visuals</h2>
        <p className="body text-muted-foreground">
          Each context gives RLHF a different story arc. Explore the visuals and pick the lens that
          resonates.
        </p>
      </header>
      <div className="grid gap-6 md:grid-cols-2">
        {availableAnalogies.map((type) => (
          <AnalogyCard key={type} type={type} />
        ))}
      </div>
    </section>
  );
}
