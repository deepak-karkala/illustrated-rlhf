'use client';

import { useMemo, useRef, useState } from 'react';

import { useAnalogy } from '@/lib/analogy-context';
import { ControlSlider } from '@/components/visualizations/control-slider';
import { VisualizationContainer } from '@/components/visualizations/visualization-container';

function computeOverOptimization(proxyScore: number, evalScore: number, ensembleSize: number) {
  const gap = proxyScore - evalScore;
  const risk = Math.max(0, gap * 0.6 - ensembleSize * 0.05);
  const recommendation =
    risk > 0.2 ? 'Rotate reward models or add constraints.' : 'Proxy is aligned with evals.';
  return { gap, risk, recommendation };
}

export function OveroptimizationMonitor(): JSX.Element {
  const { activeAnalogy } = useAnalogy();
  const [proxyScore, setProxyScore] = useState<number>(0.88);
  const [evalScore, setEvalScore] = useState<number>(0.74);
  const [ensembleSize, setEnsembleSize] = useState<number>(3);
  const containerRef = useRef<HTMLDivElement>(null);

  const metrics = useMemo(
    () => computeOverOptimization(proxyScore, evalScore, ensembleSize),
    [proxyScore, evalScore, ensembleSize]
  );

  return (
    <VisualizationContainer
      title="Over-optimisation monitor"
      description="Compare proxy reward and evaluation gaps, following Chapter 18 guidance."
      ariaLabel="Over-optimisation monitor"
      activeAnalogy={activeAnalogy}
      visualRef={containerRef}
      controls={
        <div className="space-y-3 text-xs text-foreground">
          <ControlSlider
            id="proxy-score"
            label="Proxy reward score"
            min={0.5}
            max={1}
            step={0.01}
            value={proxyScore}
            onChange={setProxyScore}
            description="Internal reward model score."
          />
          <ControlSlider
            id="eval-score"
            label="External eval score"
            min={0.5}
            max={1}
            step={0.01}
            value={evalScore}
            onChange={setEvalScore}
            description="Hold-out benchmark performance."
          />
          <ControlSlider
            id="ensemble-size"
            label="Reward ensemble size"
            min={1}
            max={6}
            step={1}
            value={ensembleSize}
            onChange={setEnsembleSize}
            description="More ensemble members reduce over-optimisation risk."
          />
        </div>
      }
    >
      <div ref={containerRef} className="space-y-4 text-sm text-muted-foreground">
        <div className="rounded-2xl border border-border bg-card/70 p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase text-muted-foreground">
            Proxy vs evaluation gap
          </p>
          <p className="text-foreground">{Math.round(metrics.gap * 100)}%</p>
          <p className="text-xs text-muted-foreground">
            Close gaps indicate aligned objectives; wide gaps signal Goodhart risk.
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card/70 p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase text-muted-foreground">Risk indicator</p>
          <p className="text-foreground">{metrics.risk.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground">
            Values above 0.2 warrant reward model audits or new constraints.
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card/70 p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase text-muted-foreground">Recommendation</p>
          <p className="text-foreground">{metrics.recommendation}</p>
        </div>
      </div>
    </VisualizationContainer>
  );
}
