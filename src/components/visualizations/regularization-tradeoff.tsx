'use client';

import { useMemo, useRef, useState } from 'react';

import { useAnalogy } from '@/lib/analogy-context';
import { ControlSlider } from '@/components/visualizations/control-slider';
import { VisualizationContainer } from '@/components/visualizations/visualization-container';

function computeScores(
  lambda: number,
  entropyBonus: number
): { stability: number; exploration: number; overfitRisk: number } {
  const stability = Math.min(1, lambda * 12 + 0.3);
  const exploration = Math.max(0, 0.9 - lambda * 8 + entropyBonus * 0.4);
  const overfitRisk = Math.max(0, 0.7 - stability * 0.6 - entropyBonus * 0.2);
  return {
    stability,
    exploration,
    overfitRisk,
  };
}

export function RegularizationTradeoff(): JSX.Element {
  const [lambda, setLambda] = useState<number>(0.03);
  const [entropyBonus, setEntropyBonus] = useState<number>(0.02);
  const { activeAnalogy } = useAnalogy();
  const containerRef = useRef<HTMLDivElement>(null);

  const scores = useMemo(() => computeScores(lambda, entropyBonus), [lambda, entropyBonus]);

  return (
    <VisualizationContainer
      title="Regularisation trade-offs"
      description="Balance KL weight and entropy bonus to manage stability versus exploration, echoing Chapter 8’s guidance."
      ariaLabel="Bars showing stability, exploration, and over-optimisation risk"
      visualRef={containerRef}
      activeAnalogy={activeAnalogy}
      controls={
        <div className="space-y-3 text-xs text-foreground">
          <ControlSlider
            id="tradeoff-lambda"
            label="KL weight λ"
            min={0}
            max={0.08}
            step={0.005}
            value={lambda}
            onChange={setLambda}
            description="Higher λ stabilises optimisation but may dampen exploration."
          />
          <ControlSlider
            id="entropy-bonus"
            label="Entropy bonus"
            min={0}
            max={0.05}
            step={0.005}
            value={entropyBonus}
            onChange={setEntropyBonus}
            description="Encourages diversity to counterbalance large KL penalties."
          />
        </div>
      }
    >
      <div ref={containerRef} className="space-y-4">
        {[
          { label: 'Stability', value: scores.stability, color: 'bg-analogy-advanced-500/70' },
          { label: 'Exploration', value: scores.exploration, color: 'bg-analogy-reasoning-500/70' },
          {
            label: 'Over-optimisation risk',
            value: scores.overfitRisk,
            color: 'bg-analogy-writing-500/60',
          },
        ].map((bar) => (
          <div
            key={bar.label}
            className="rounded-2xl border border-border bg-card/70 p-4 shadow-sm text-xs text-muted-foreground"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {bar.label}
            </p>
            <div className="mt-2 h-3 w-full rounded-full bg-muted/40">
              <div
                className={`h-full rounded-full ${bar.color}`}
                style={{ width: `${Math.min(100, Math.max(0, bar.value * 100))}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">{(bar.value * 100).toFixed(0)}%</p>
          </div>
        ))}
        <p className="rounded-xl border border-dashed border-border bg-muted/40 p-4 text-xs text-muted-foreground">
          Chapter 8 notes that KL penalties, entropy bonuses, and auxiliary NLL terms work in
          concert. Use this control to reason about the qualitative effects before diving into
          training logs.
        </p>
      </div>
    </VisualizationContainer>
  );
}
