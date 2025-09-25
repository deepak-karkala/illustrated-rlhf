'use client';

import { useMemo, useRef, useState } from 'react';

import { useAnalogy } from '@/lib/analogy-context';
import { VisualizationContainer } from '@/components/visualizations/visualization-container';

interface TokenRow {
  token: string;
  role: 'system' | 'user' | 'assistant';
}

const BASE_CONVERSATION: TokenRow[] = [
  { token: '<|im_start|>system', role: 'system' },
  { token: 'You are a helpful assistant.', role: 'system' },
  { token: '<|im_end|>', role: 'system' },
  { token: '<|im_start|>user', role: 'user' },
  { token: 'Explain RLHF in two sentences.', role: 'user' },
  { token: '<|im_end|>', role: 'user' },
  { token: '<|im_start|>assistant', role: 'assistant' },
  {
    token: 'RLHF combines instruction tuning, preference data, and policy optimisation.',
    role: 'assistant',
  },
  {
    token:
      'It aligns outputs with human intent via reward models or direct preference optimisation.',
    role: 'assistant',
  },
  { token: '<|im_end|>', role: 'assistant' },
];

export function PromptMaskingVisualizer(): JSX.Element {
  const [multiTurn, setMultiTurn] = useState<boolean>(true);
  const [maskPrompts, setMaskPrompts] = useState<boolean>(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const { activeAnalogy } = useAnalogy();

  const rows = useMemo(() => {
    if (!multiTurn) {
      return BASE_CONVERSATION;
    }
    return [
      ...BASE_CONVERSATION,
      { token: '<|im_start|>user', role: 'user' },
      { token: 'Add a short safety disclaimer.', role: 'user' },
      { token: '<|im_end|>', role: 'user' },
      { token: '<|im_start|>assistant', role: 'assistant' },
      { token: 'Note: Verify outputs with internal policy before acting.', role: 'assistant' },
      { token: '<|im_end|>', role: 'assistant' },
    ];
  }, [multiTurn]);

  return (
    <VisualizationContainer
      title="Prompt masking visualiser"
      description="See which tokens contribute to the loss during instruction tuning, following the masking guidance from Chapter 9."
      ariaLabel="Token-level masking illustration"
      visualRef={containerRef}
      activeAnalogy={activeAnalogy}
      controls={
        <div className="space-y-3 text-xs text-foreground">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={multiTurn}
              onChange={(event) => setMultiTurn(event.target.checked)}
              className="h-3 w-3 accent-primary"
            />
            Include second user turn
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={maskPrompts}
              onChange={(event) => setMaskPrompts(event.target.checked)}
              className="h-3 w-3 accent-primary"
            />
            Mask prompt tokens (SFT convention)
          </label>
        </div>
      }
    >
      <div ref={containerRef} className="space-y-4 text-xs text-muted-foreground">
        <div className="grid gap-2 lg:grid-cols-2">
          {rows.map((row, index) => {
            const isMasked = maskPrompts && row.role !== 'assistant';
            return (
              <div
                key={`${row.token}-${index}`}
                className={`flex items-start justify-between gap-2 rounded-xl border p-3 ${
                  isMasked
                    ? 'border-border bg-muted/50 text-muted-foreground'
                    : 'border-analogy-reasoning-500 bg-analogy-reasoning-50/80 text-foreground dark:bg-analogy-reasoning-900/30'
                }`}
              >
                <span className="font-mono text-[11px]">{row.token}</span>
                <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] capitalize text-muted-foreground">
                  {row.role}
                </span>
              </div>
            );
          })}
        </div>
        <div className="rounded-xl border border-dashed border-border bg-muted/40 p-4 text-xs text-muted-foreground">
          <p className="font-semibold text-foreground">Why mask prompts?</p>
          <p className="mt-1">
            Chapter 9 explains that instruction tuning only applies loss to assistant tokens so the
            model learns responses, not the user’s words. Multi-turn sequences are “unrolled” so
            each target assistant turn remains unmasked while earlier context stays in the prompt.
          </p>
        </div>
      </div>
    </VisualizationContainer>
  );
}
