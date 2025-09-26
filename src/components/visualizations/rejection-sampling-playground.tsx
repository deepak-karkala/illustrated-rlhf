'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import { useAnalogy } from '@/lib/analogy-context';
import { ControlSlider } from '@/components/visualizations/control-slider';
import { VisualizationContainer } from '@/components/visualizations/visualization-container';

export interface RejectionSamplingSnapshot {
  completionsPerPrompt: number;
  temperature: number;
  topK: number;
  strategy: 'per-prompt' | 'global';
  selectedCount: number;
  meanSelectedReward: number;
}

interface CompletionRow {
  prompt: string;
  completion: string;
  reward: number;
  selected: boolean;
}

const PROMPTS = [
  'Summarise the RLHF training loop.',
  'Draft a polite refusal for a malicious request.',
  'Explain KL regularisation to a new engineer.',
  'List post-training stages used in Tulu 3.',
];

function generateSyntheticCompletions(n: number, temperature: number): CompletionRow[] {
  const rows: CompletionRow[] = [];
  const completions = [
    'RLHF combines SFT, reward modelling, and an RL optimiser to align behaviour.',
    'I am sorry, but I cannot help with that request because it violates policy.',
    'KL control keeps the policy near its reference by subtracting λ times the divergence.',
    'Tulu 3 iterates instruction tuning, reward updates, small RL loops, and evaluation.',
  ];
  PROMPTS.forEach((prompt) => {
    for (let i = 0; i < n; i += 1) {
      const completion = completions[Math.floor(Math.random() * completions.length)];
      const noise = (Math.random() - 0.5) * temperature;
      const baseScore = completion.includes('KL')
        ? 0.82
        : completion.includes('policy')
          ? 0.76
          : 0.7;
      const reward = Math.max(0, Math.min(1, baseScore + noise));
      rows.push({
        prompt,
        completion,
        reward,
        selected: false,
      });
    }
  });
  return rows;
}

function selectRows(
  rows: CompletionRow[],
  topK: number,
  strategy: 'per-prompt' | 'global'
): CompletionRow[] {
  const updated = rows.map((row) => ({ ...row, selected: false }));
  if (strategy === 'per-prompt') {
    PROMPTS.forEach((prompt) => {
      const candidates = updated
        .map((row, index) => ({ row, index }))
        .filter((entry) => entry.row.prompt === prompt)
        .sort((a, b) => b.row.reward - a.row.reward);
      candidates.slice(0, Math.max(1, topK)).forEach((entry) => {
        updated[entry.index].selected = true;
      });
    });
  } else {
    updated
      .map((row, index) => ({ row, index }))
      .sort((a, b) => b.row.reward - a.row.reward)
      .slice(0, topK * PROMPTS.length)
      .forEach((entry) => {
        updated[entry.index].selected = true;
      });
  }
  return updated;
}

interface RejectionSamplingPlaygroundProps {
  onSnapshot?: (snapshot: RejectionSamplingSnapshot) => void;
}

export function RejectionSamplingPlayground({
  onSnapshot,
}: RejectionSamplingPlaygroundProps = {}): JSX.Element {
  const [completionsPerPrompt, setCompletionsPerPrompt] = useState<number>(8);
  const [temperature, setTemperature] = useState<number>(0.6);
  const [topK, setTopK] = useState<number>(1);
  const [strategy, setStrategy] = useState<'per-prompt' | 'global'>('per-prompt');
  const containerRef = useRef<HTMLDivElement>(null);
  const { activeAnalogy } = useAnalogy();

  const rows = useMemo(() => {
    const generated = generateSyntheticCompletions(completionsPerPrompt, temperature);
    return selectRows(generated, topK, strategy);
  }, [completionsPerPrompt, temperature, topK, strategy]);

  const averageReward = rows.reduce((acc, row) => acc + (row.selected ? row.reward : 0), 0);
  const selectedCount = rows.filter((row) => row.selected).length || 1;
  const meanSelectedReward = averageReward / selectedCount;

  useEffect(() => {
    if (!onSnapshot) {
      return;
    }
    onSnapshot({
      completionsPerPrompt,
      temperature,
      topK,
      strategy,
      selectedCount,
      meanSelectedReward,
    });
  }, [
    onSnapshot,
    completionsPerPrompt,
    temperature,
    topK,
    strategy,
    selectedCount,
    meanSelectedReward,
  ]);

  return (
    <VisualizationContainer
      title="Rejection sampling playground"
      description="Simulate Chapter 10's baseline: generate N completions per prompt, score them with a reward model, then select the best to finetune."
      ariaLabel="Table showing sampled completions and rewards"
      visualRef={containerRef}
      activeAnalogy={activeAnalogy}
      controls={
        <div className="space-y-3 text-xs text-foreground">
          <ControlSlider
            id="completions-per-prompt"
            label="Completions per prompt"
            min={2}
            max={20}
            step={1}
            value={completionsPerPrompt}
            onChange={setCompletionsPerPrompt}
            description="Sampling budget per prompt (Chapter 10 recommends 10–30)."
          />
          <ControlSlider
            id="temperature"
            label="Sampling temperature"
            min={0.2}
            max={1.2}
            step={0.05}
            value={temperature}
            onChange={setTemperature}
            description="Higher temperature increases diversity but adds noise to rewards."
          />
          <ControlSlider
            id="top-k"
            label="Top-K selections"
            min={1}
            max={5}
            step={1}
            value={topK}
            onChange={setTopK}
            description="How many completions per prompt (or overall) to keep."
          />
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="strategy"
              value="per-prompt"
              checked={strategy === 'per-prompt'}
              onChange={() => setStrategy('per-prompt')}
              className="h-3 w-3 accent-primary"
            />
            <span className="text-xs">Select top-K per prompt</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="strategy"
              value="global"
              checked={strategy === 'global'}
              onChange={() => setStrategy('global')}
              className="h-3 w-3 accent-primary"
            />
            <span className="text-xs">Select top-K globally</span>
          </label>
        </div>
      }
    >
      <div ref={containerRef} className="space-y-4 text-xs text-muted-foreground">
        <table className="w-full table-fixed border-collapse overflow-hidden rounded-2xl border border-border text-left">
          <thead className="bg-muted/30 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-3 py-2">Prompt</th>
              <th className="px-3 py-2">Completion</th>
              <th className="px-3 py-2">Reward</th>
              <th className="px-3 py-2">Selected</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr
                key={`${row.prompt}-${index}`}
                className={
                  row.selected ? 'bg-analogy-writing-50 dark:bg-analogy-writing-900/20' : ''
                }
              >
                <td className="px-3 py-2 align-top text-foreground">{row.prompt}</td>
                <td className="px-3 py-2 align-top text-foreground">{row.completion}</td>
                <td className="px-3 py-2 align-top text-foreground">{row.reward.toFixed(2)}</td>
                <td className="px-3 py-2 align-top text-foreground">{row.selected ? '✓' : ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="rounded-xl border border-dashed border-border bg-muted/40 p-4 text-xs text-muted-foreground">
          Estimated fine-tuning reward ≈ {meanSelectedReward.toFixed(2)} using {selectedCount}{' '}
          selected completions. Chapter 10 emphasises keeping enough diversity (temperature and N)
          while relying on the reward model to filter quality.
        </p>
      </div>
    </VisualizationContainer>
  );
}
