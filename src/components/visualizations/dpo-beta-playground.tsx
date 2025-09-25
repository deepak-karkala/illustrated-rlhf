'use client';

import { useMemo, useRef, useState } from 'react';

import { useAnalogy } from '@/lib/analogy-context';
import { ControlSlider } from '@/components/visualizations/control-slider';
import { VisualizationContainer } from '@/components/visualizations/visualization-container';

interface CandidateSample {
  id: 'chosen' | 'rejected';
  label: string;
  logprob: number;
  summary: string;
}

const SAMPLES: CandidateSample[] = [
  {
    id: 'chosen',
    label: 'Chosen completion',
    logprob: -1.2,
    summary: 'Polite answer with concrete next steps.',
  },
  {
    id: 'rejected',
    label: 'Rejected completion',
    logprob: -0.8,
    summary: 'Dismissive answer that ignores the request.',
  },
];

function weight(logprob: number, referenceLogprob: number, beta: number, margin: number): number {
  return Math.exp(beta * (logprob - referenceLogprob - margin));
}

export function DpoBetaPlayground(): JSX.Element {
  const [beta, setBeta] = useState<number>(0.1);
  const [margin, setMargin] = useState<number>(0);
  const [logitShift, setLogitShift] = useState<number>(0.6);
  const containerRef = useRef<HTMLDivElement>(null);
  const { activeAnalogy } = useAnalogy();

  const points = useMemo(() => {
    const referenceLogprob = -1.0;
    return SAMPLES.map((sample) => {
      const policyLogprob = sample.logprob + (sample.id === 'chosen' ? logitShift : -logitShift);
      const w = weight(policyLogprob, referenceLogprob, beta, margin);
      return { sample, policyLogprob, referenceLogprob, w };
    });
  }, [beta, margin, logitShift]);

  const normaliser = points.reduce((acc, item) => acc + item.w, 0);

  return (
    <VisualizationContainer
      title="DPO weighting playground"
      description="Adjust β, policy logits, and margin to see how DPO emphasises chosen vs. rejected samples without a reward model."
      ariaLabel="Weights applied to chosen and rejected samples in DPO"
      visualRef={containerRef}
      activeAnalogy={activeAnalogy}
      controls={
        <>
          <ControlSlider
            id="beta"
            label="β (temperature)"
            min={0.02}
            max={0.4}
            step={0.01}
            value={beta}
            onChange={setBeta}
            description="Higher β sharpens the preference weight difference, as suggested in Chapter 12."
          />
          <ControlSlider
            id="margin"
            label="Margin m"
            min={-0.5}
            max={0.5}
            step={0.05}
            value={margin}
            onChange={setMargin}
            description="Optional safety margin on logit gaps used by variants like IPO/cDPO."
          />
          <ControlSlider
            id="logit-shift"
            label="Policy logit shift"
            min={0}
            max={1.2}
            step={0.05}
            value={logitShift}
            onChange={setLogitShift}
            description="Controls how far the current policy deviates from the reference logits."
          />
        </>
      }
    >
      <div ref={containerRef} className="grid gap-4 md:grid-cols-2">
        {points.map(({ sample, policyLogprob, referenceLogprob, w }) => (
          <article
            key={sample.id}
            className="space-y-3 rounded-2xl border border-border bg-card/70 p-4 shadow-sm"
          >
            <header className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {sample.label}
                </p>
                <p className="text-sm text-muted-foreground">{sample.summary}</p>
              </div>
              <span className="rounded-full bg-muted px-3 py-1 text-xs text-foreground">
                weight ≈ {(w / normaliser).toFixed(2)}
              </span>
            </header>
            <div className="grid gap-2 text-xs text-muted-foreground">
              <p>
                π<sub>θ</sub>(y|x) logprob ≈ {policyLogprob.toFixed(2)} vs. π<sub>ref</sub>(y|x) ≈{' '}
                {referenceLogprob.toFixed(2)}
              </p>
              <p>β · Δ = {(beta * (policyLogprob - referenceLogprob - margin)).toFixed(2)}</p>
            </div>
            <p className="text-xs text-muted-foreground">
              DPO multiplies the gradient for each sample by σ(β Δ). This illustration mirrors the
              weighting described in Chapter 12’s derivative form.
            </p>
          </article>
        ))}
      </div>
    </VisualizationContainer>
  );
}
