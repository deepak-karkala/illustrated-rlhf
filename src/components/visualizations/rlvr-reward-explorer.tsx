'use client';

import { useMemo, useRef, useState } from 'react';

import { useAnalogy } from '@/lib/analogy-context';
import { ControlSlider } from '@/components/visualizations/control-slider';
import { VisualizationContainer } from '@/components/visualizations/visualization-container';

interface DomainConfig {
  id: string;
  label: string;
  baselineAccuracy: number;
  difficulty: number;
}

const DOMAINS: DomainConfig[] = [
  { id: 'gsm8k', label: 'Math (GSM8K)', baselineAccuracy: 0.52, difficulty: 1.0 },
  { id: 'code', label: 'Code (LeetCode Hard)', baselineAccuracy: 0.28, difficulty: 1.3 },
  { id: 'logic', label: 'Logic (ProofWriter)', baselineAccuracy: 0.41, difficulty: 1.1 },
];

function computeRlvrMetrics(iterations: number, domain: DomainConfig) {
  const cappedIterations = Math.max(0, Math.min(iterations, 8));
  const rewardGain = (0.08 * cappedIterations) / domain.difficulty;
  const accuracy = Math.min(0.95, domain.baselineAccuracy + rewardGain);
  const verifierCost = 0.05 * cappedIterations;
  const sampleReuse = Math.min(1, 0.3 + cappedIterations * 0.08);

  return {
    accuracy,
    rewardGain,
    verifierCost,
    sampleReuse,
  };
}

export function RlvrRewardExplorer(): JSX.Element {
  const { activeAnalogy } = useAnalogy();
  const [domainId, setDomainId] = useState<string>(DOMAINS[0]!.id);
  const [iterations, setIterations] = useState<number>(3);
  const containerRef = useRef<HTMLDivElement>(null);

  const domain = useMemo(
    () => DOMAINS.find((item) => item.id === domainId) ?? DOMAINS[0]!,
    [domainId]
  );

  const metrics = useMemo(() => computeRlvrMetrics(iterations, domain), [iterations, domain]);

  return (
    <VisualizationContainer
      title="RLVR reward explorer"
      description="Estimate accuracy gains when you add more verifiable reward passes (Chapter 14)."
      ariaLabel="RLVR reward explorer"
      activeAnalogy={activeAnalogy}
      visualRef={containerRef}
      controls={
        <div className="space-y-3 text-xs text-foreground">
          <div className="flex flex-wrap gap-2">
            {DOMAINS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setDomainId(item.id)}
                className={`rounded-full border px-3 py-1 font-medium transition ${
                  domainId === item.id
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-muted text-foreground hover:border-primary/60'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <ControlSlider
            id="rlvr-iterations"
            label="RLVR iterations"
            min={0}
            max={8}
            step={1}
            value={iterations}
            onChange={setIterations}
            description="Number of verifier-guided RL passes over the same prompts."
          />
        </div>
      }
    >
      <div ref={containerRef} className="space-y-4 text-sm text-muted-foreground">
        <div className="rounded-2xl border border-border bg-card/70 p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase text-muted-foreground">Accuracy</p>
          <p className="text-foreground">{Math.round(metrics.accuracy * 100)}%</p>
          <p className="text-xs text-muted-foreground">
            Baseline {Math.round(domain.baselineAccuracy * 100)}% → RLVR gain{' '}
            {Math.round(metrics.rewardGain * 100)}%.
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card/70 p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase text-muted-foreground">Verifier budget</p>
          <p className="text-foreground">{metrics.verifierCost.toFixed(2)} relative units</p>
          <p className="text-xs text-muted-foreground">
            Each pass consumes compute for proof checkers, unit tests, or execution sandboxes.
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card/70 p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase text-muted-foreground">Sample reuse</p>
          <p className="text-foreground">
            {Math.round(metrics.sampleReuse * 100)}% of traces retained
          </p>
          <p className="text-xs text-muted-foreground">
            Chapter 14 recommends reusing successful traces to distill into instruction-tuned
            students.
          </p>
        </div>
      </div>
    </VisualizationContainer>
  );
}
