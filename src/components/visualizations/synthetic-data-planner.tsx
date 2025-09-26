'use client';

import { useMemo, useRef, useState } from 'react';

import { useAnalogy } from '@/lib/analogy-context';
import { ControlSlider } from '@/components/visualizations/control-slider';
import { VisualizationContainer } from '@/components/visualizations/visualization-container';

interface BlendMetrics {
  quality: number;
  bias: number;
  cost: number;
}

function blendScore(humanShare: number, syntheticShare: number): BlendMetrics {
  const total = humanShare + syntheticShare;
  if (total === 0) {
    return { quality: 0, bias: 0, cost: 0 };
  }
  const normalizedHuman = humanShare / total;
  const normalizedSynthetic = syntheticShare / total;
  const quality = 0.6 + normalizedHuman * 0.25 + normalizedSynthetic * 0.1;
  const bias = 0.1 + normalizedSynthetic * 0.2;
  const cost = humanShare * 1.0 + syntheticShare * 0.05;
  return {
    quality,
    bias,
    cost,
  };
}

export function SyntheticDataPlanner(): JSX.Element {
  const { activeAnalogy } = useAnalogy();
  const [humanExamples, setHumanExamples] = useState<number>(2000);
  const [syntheticExamples, setSyntheticExamples] = useState<number>(8000);
  const containerRef = useRef<HTMLDivElement>(null);

  const metrics = useMemo<BlendMetrics>(
    () => blendScore(humanExamples, syntheticExamples),
    [humanExamples, syntheticExamples]
  );

  return (
    <VisualizationContainer
      title="Synthetic data planner"
      description="Balance human and synthetic datasets as suggested in Chapter 16."
      ariaLabel="Synthetic data planner"
      activeAnalogy={activeAnalogy}
      visualRef={containerRef}
      controls={
        <div className="space-y-3 text-xs text-foreground">
          <ControlSlider
            id="human-examples"
            label="Human examples"
            min={0}
            max={10000}
            step={250}
            value={humanExamples}
            onChange={setHumanExamples}
            description="Annotated human pairs or instructions."
          />
          <ControlSlider
            id="synthetic-examples"
            label="Synthetic examples"
            min={0}
            max={40000}
            step={500}
            value={syntheticExamples}
            onChange={setSyntheticExamples}
            description="Self-generated data from teachers or constitutions."
          />
        </div>
      }
    >
      <div ref={containerRef} className="space-y-4 text-sm text-muted-foreground">
        <div className="rounded-2xl border border-border bg-card/70 p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase text-muted-foreground">Estimated quality</p>
          <p className="text-foreground">{Math.round(metrics.quality * 100)}%</p>
          <p className="text-xs text-muted-foreground">
            Chapter 16 notes synthetic data boosts coverage but should be anchored by human
            references.
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card/70 p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase text-muted-foreground">Bias exposure</p>
          <p className="text-foreground">{metrics.bias.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground">
            Monitor bias as synthetic share increases; apply audits or diversification strategies.
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card/70 p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase text-muted-foreground">Relative cost</p>
          <p className="text-foreground">${metrics.cost.toFixed(2)} (arbitrary units)</p>
          <p className="text-xs text-muted-foreground">
            Human examples cost more but anchor evaluations and distillation quality.
          </p>
        </div>
      </div>
    </VisualizationContainer>
  );
}
