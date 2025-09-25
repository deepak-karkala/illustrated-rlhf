'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import { useAnalogy } from '@/lib/analogy-context';
import { ControlSlider } from '@/components/visualizations/control-slider';
import { VisualizationContainer } from '@/components/visualizations/visualization-container';

interface PreferenceResponse {
  id: 'a' | 'b';
  title: string;
  text: string;
  highlights: string[];
  metrics: {
    helpfulness: number;
    safety: number;
    style: number;
  };
}

interface PreferenceScenario {
  id: string;
  prompt: string;
  theme: string;
  rationale: string;
  humanPreferred: 'a' | 'b';
  responses: PreferenceResponse[];
}

const SCENARIOS: PreferenceScenario[] = [
  {
    id: 'editing-tone',
    theme: 'Tone and safety',
    prompt:
      'Rewrite the following customer support reply so it stays warm while making the refund policy explicit.',
    rationale:
      'Humans preferred Response B because it balances empathy with a clear boundary, matching the RLHF book description of aligning tone with policy.',
    humanPreferred: 'b',
    responses: [
      {
        id: 'a',
        title: 'Response A',
        text: "Hey there! No worries at all—we've already pushed the refund through. Take your time deciding if you want to order again!",
        highlights: [
          'High warmth but promises an action that violates the stated policy.',
          'Leaves ambiguity about the actual refund criteria.',
        ],
        metrics: { helpfulness: 0.52, safety: 0.35, style: 0.78 },
      },
      {
        id: 'b',
        title: 'Response B',
        text: 'Thanks for reaching out! I checked your order and the refund requires the item to be returned unused within 30 days. I can start that process right away if that works for you.',
        highlights: [
          'Balances warmth with accurate policy detail.',
          'Keeps commitments consistent with safety guidance.',
        ],
        metrics: { helpfulness: 0.82, safety: 0.93, style: 0.76 },
      },
    ],
  },
  {
    id: 'writing-feedback',
    theme: 'Constructive critique',
    prompt:
      'Give actionable feedback on a short story opening about an astronaut reflecting on Earth.',
    rationale:
      'Response A wins with annotators because it offers concrete edits and keeps the reflective style, echoing the editor metaphor from Chapter 7.',
    humanPreferred: 'a',
    responses: [
      {
        id: 'a',
        title: 'Response A',
        text: 'The opening image is strong. Consider sharpening the sensory details (“the curvature glints like a coin”) and add a sentence connecting the homesickness to a mission choice. That will ground the reflection in action.',
        highlights: [
          'Specific rewrite suggestions reinforce the author voice.',
          'Connects emotions to plot stakes, strengthening helpfulness.',
        ],
        metrics: { helpfulness: 0.9, safety: 0.88, style: 0.84 },
      },
      {
        id: 'b',
        title: 'Response B',
        text: 'Nice job! The astronaut sounds nostalgic which is cool. Maybe keep adding more feelings or something so readers feel it. Otherwise it looks good!',
        highlights: ['Light praise without guidance.', 'Does not anchor feedback in the draft.'],
        metrics: { helpfulness: 0.38, safety: 0.92, style: 0.58 },
      },
    ],
  },
  {
    id: 'guardrail',
    theme: 'Safety guardrails',
    prompt: 'Decline a request to generate malware while remaining courteous.',
    rationale:
      'Humans (and safety reviewers) selected Response B because it firmly refuses while educating about policy, matching the reward modeling emphasis on safe refusals.',
    humanPreferred: 'b',
    responses: [
      {
        id: 'a',
        title: 'Response A',
        text: 'I can’t help with that, but if you’re doing a security audit you might search public repositories for sample payloads.',
        highlights: [
          'Implicitly suggests workarounds.',
          'Fails the safety constraint despite brevity.',
        ],
        metrics: { helpfulness: 0.28, safety: 0.12, style: 0.65 },
      },
      {
        id: 'b',
        title: 'Response B',
        text: 'I’m sorry, but I can’t assist with creating malware or tools intended to harm systems. If you’re assessing security, consider reviewing threat modeling resources or certified training on defensive techniques.',
        highlights: ['Clear refusal aligned with policy.', 'Offers safe alternatives.'],
        metrics: { helpfulness: 0.61, safety: 0.98, style: 0.72 },
      },
    ],
  },
];

function scoreResponse(
  response: PreferenceResponse,
  weights: { helpfulness: number; safety: number; style: number }
): number {
  const { helpfulness, safety, style } = response.metrics;
  return helpfulness * weights.helpfulness + safety * weights.safety + style * weights.style;
}

export function PreferenceComparisonPlayground(): JSX.Element {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(SCENARIOS[0]!.id);
  const [safetyWeight, setSafetyWeight] = useState<number>(0.45);
  const [styleWeight, setStyleWeight] = useState<number>(0.25);
  const containerRef = useRef<HTMLDivElement>(null);
  const { activeAnalogy } = useAnalogy();

  const styleMax = useMemo(() => Math.max(0, 1 - safetyWeight), [safetyWeight]);

  useEffect(() => {
    if (styleWeight > styleMax) {
      setStyleWeight(Number(styleMax.toFixed(2)));
    }
  }, [styleMax, styleWeight]);

  const scenario = useMemo(
    () => SCENARIOS.find((item) => item.id === selectedScenarioId) ?? SCENARIOS[0]!,
    [selectedScenarioId]
  );

  const normalizedWeights = useMemo(() => {
    const safety = Math.min(Math.max(safetyWeight, 0), 1);
    const style = Math.min(Math.max(styleWeight, 0), 1 - safety);
    const helpfulness = 1 - safety - style;
    return { helpfulness, safety, style };
  }, [safetyWeight, styleWeight]);

  const scored = scenario.responses.map((response) => ({
    response,
    score: scoreResponse(response, normalizedWeights),
  }));

  const [best] = [...scored].sort((a, b) => b.score - a.score);
  const other = scored.find((item) => item.response.id !== best.response.id) ?? scored[0]!;
  const scoreGap = best.score - other.score;
  const probability = 1 / (1 + Math.exp(-scoreGap));

  return (
    <VisualizationContainer
      title="Preference comparison playground"
      description="Explore how changing the weighting between helpfulness, safety, and style influences which completion a reward model prefers. The scenarios mirror editor-style judgments described in Chapter 7 of the RLHF book."
      ariaLabel="Interactive preference comparison showing two completions and the resulting reward preference"
      visualRef={containerRef}
      activeAnalogy={activeAnalogy}
      controls={
        <>
          <p>
            Adjust the emphasis on each quality dimension. Remaining weight automatically flows into
            helpfulness to reflect scarce annotations.
          </p>
          <ControlSlider
            id="safety-weight"
            label="Safety weight"
            min={0}
            max={0.7}
            step={0.05}
            value={safetyWeight}
            onChange={setSafetyWeight}
            description="Higher values favour policy-consistent refusals and cautious tone."
          />
          <ControlSlider
            id="style-weight"
            label="Style weight"
            min={0}
            max={Number(styleMax.toFixed(2))}
            step={0.05}
            value={Math.min(styleWeight, styleMax)}
            onChange={setStyleWeight}
            description="Controls how much narrative polish influences the score."
          />
          <p className="text-xs text-muted-foreground">
            Human preferred: {scenario.humanPreferred.toUpperCase()} (from Chapter 7 annotation
            examples).
          </p>
        </>
      }
    >
      <div className="space-y-4 text-sm text-foreground">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Scenario
            </p>
            <p className="text-base font-semibold text-foreground">{scenario.theme}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <button
              type="button"
              className="rounded-full border border-border px-3 py-1 font-medium transition hover:border-foreground/60 hover:bg-accent"
              onClick={() => {
                const currentIndex = SCENARIOS.findIndex((item) => item.id === scenario.id);
                const next = SCENARIOS[(currentIndex + 1) % SCENARIOS.length]!;
                setSelectedScenarioId(next.id);
              }}
            >
              Shuffle scenario
            </button>
            <span className="rounded-full bg-muted px-2 py-1">
              σ(reward gap) ≈ {probability.toFixed(2)}
            </span>
          </div>
        </div>
        <p className="rounded-lg border border-border bg-muted/40 p-3 text-muted-foreground">
          {scenario.prompt}
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          {scored.map(({ response, score }) => {
            const isHumanPreferred = scenario.humanPreferred === response.id;
            const isModelPreferred = best.response.id === response.id;
            return (
              <article
                key={response.id}
                className={
                  'flex h-full flex-col gap-3 rounded-2xl border border-border bg-card/70 p-4 shadow-sm transition'
                }
              >
                <header className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {response.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Score {score.toFixed(2)} (helpfulness{' '}
                      {response.metrics.helpfulness.toFixed(2)}, safety{' '}
                      {response.metrics.safety.toFixed(2)}, style{' '}
                      {response.metrics.style.toFixed(2)})
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1 text-[11px]">
                    {isModelPreferred ? (
                      <span className="rounded-full bg-primary/10 px-3 py-1 font-semibold text-primary">
                        Model favours
                      </span>
                    ) : null}
                    {isHumanPreferred ? (
                      <span className="rounded-full bg-analogy-writing-100 px-3 py-1 font-semibold text-analogy-writing-700">
                        Human choice
                      </span>
                    ) : null}
                  </div>
                </header>
                <p className="text-sm leading-relaxed text-foreground">{response.text}</p>
                <ul className="mt-auto space-y-2 text-xs text-muted-foreground">
                  {response.highlights.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span aria-hidden="true">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
        <div className="rounded-xl border border-dashed border-border bg-muted/40 p-4 text-xs text-muted-foreground">
          <p className="font-semibold text-foreground">Why humans picked differently</p>
          <p className="mt-1 text-sm text-muted-foreground">{scenario.rationale}</p>
          <p className="mt-3 text-xs text-muted-foreground">
            According to Chapter 7 of the RLHF book, annotators supply pairwise judgements anchored
            in editor-like deliberations. Reward models learn these trade-offs but depend on how we
            weight the axes above.
          </p>
        </div>
      </div>
    </VisualizationContainer>
  );
}
