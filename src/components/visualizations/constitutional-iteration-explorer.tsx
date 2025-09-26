'use client';

import { useMemo, useRef, useState } from 'react';

import { useAnalogy } from '@/lib/analogy-context';
import { ControlSlider } from '@/components/visualizations/control-slider';
import { VisualizationContainer } from '@/components/visualizations/visualization-container';

interface IterationMetrics {
  winRate: number;
  hallucinationDrop: number;
  biasIndex: number;
}

function computeMetrics(iterations: number, principles: number): IterationMetrics {
  const cappedIterations = Math.max(1, Math.min(iterations, 8));
  const cappedPrinciples = Math.max(4, Math.min(principles, 20));

  const winRate = Math.min(0.9, 0.65 + cappedIterations * 0.05 + cappedPrinciples * 0.005);
  const hallucinationDrop = Math.min(0.4, cappedPrinciples * 0.01 + cappedIterations * 0.02);
  const biasIndex = Math.max(0.1, 0.35 - cappedPrinciples * 0.01 - cappedIterations * 0.015);

  return {
    winRate,
    hallucinationDrop,
    biasIndex,
  };
}

export function ConstitutionalIterationExplorer(): JSX.Element {
  const { activeAnalogy } = useAnalogy();
  const [iterations, setIterations] = useState<number>(3);
  const [principles, setPrinciples] = useState<number>(10);
  const containerRef = useRef<HTMLDivElement>(null);

  const metrics = useMemo(() => computeMetrics(iterations, principles), [iterations, principles]);

  return (
    <VisualizationContainer
      title="Self-improvement iteration lab"
      description="Project how many critique iterations and principles you need for Chapter 13 style self-training."
      ariaLabel="Iteration explorer for constitutional AI"
      activeAnalogy={activeAnalogy}
      visualRef={containerRef}
      controls={
        <div className="space-y-3 text-xs text-foreground">
          <ControlSlider
            id="iterations"
            label="Critique iterations"
            min={1}
            max={8}
            step={1}
            value={iterations}
            onChange={setIterations}
            description="How many critique and revise passes you schedule per prompt."
          />
          <ControlSlider
            id="principles"
            label="Principles in constitution"
            min={4}
            max={20}
            step={1}
            value={principles}
            onChange={setPrinciples}
            description="Chapter 13 examples use 8-16 principles for harmlessness, honesty, and helpfulness."
          />
        </div>
      }
    >
      <div ref={containerRef} className="space-y-4 text-sm text-muted-foreground">
        <div className="space-y-2 rounded-2xl border border-border bg-card/70 p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase text-muted-foreground">
            Win rate vs human data
          </p>
          <p className="text-foreground">{Math.round(metrics.winRate * 100)}%</p>
          <p className="text-xs text-muted-foreground">
            Synthetic feedback approaches human evaluation scores when you stack enough revision
            rounds.
          </p>
        </div>
        <div className="space-y-2 rounded-2xl border border-border bg-card/70 p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase text-muted-foreground">
            Hallucination reduction
          </p>
          <p className="text-foreground">{Math.round(metrics.hallucinationDrop * 100)}% drop</p>
          <p className="text-xs text-muted-foreground">
            More principles target truthfulness and safety, reducing unsupported claims per Chapter
            13 guidance.
          </p>
        </div>
        <div className="space-y-2 rounded-2xl border border-border bg-card/70 p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase text-muted-foreground">Bias index</p>
          <p className="text-foreground">{metrics.biasIndex.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground">
            Lower numbers mean less constitution-induced bias; include human audits when the index
            is above 0.2.
          </p>
        </div>
      </div>
    </VisualizationContainer>
  );
}
