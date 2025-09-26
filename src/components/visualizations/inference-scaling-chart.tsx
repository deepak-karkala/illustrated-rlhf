'use client';

import { useMemo, useRef, useState } from 'react';

import { useAnalogy } from '@/lib/analogy-context';
import { ControlSlider } from '@/components/visualizations/control-slider';
import { VisualizationContainer } from '@/components/visualizations/visualization-container';

function computeScalingMetrics(tokens: number, samples: number) {
  const cappedTokens = Math.max(256, Math.min(tokens, 4096));
  const cappedSamples = Math.max(1, Math.min(samples, 16));

  const logFactor = Math.log2(cappedSamples);
  const passRate = Math.min(0.97, 0.55 + logFactor * 0.05 + cappedTokens / 8000);
  const latencyMs = cappedTokens * cappedSamples * 6; // approximate ms
  const costUnits = (cappedTokens * cappedSamples) / 1000;

  return {
    passRate,
    latencyMs,
    costUnits,
  };
}

export function InferenceScalingChart(): JSX.Element {
  const { activeAnalogy } = useAnalogy();
  const [tokens, setTokens] = useState<number>(1024);
  const [samples, setSamples] = useState<number>(4);
  const containerRef = useRef<HTMLDivElement>(null);

  const metrics = useMemo(() => computeScalingMetrics(tokens, samples), [tokens, samples]);

  return (
    <VisualizationContainer
      title="Inference-time scaling trade-offs"
      description="Explore the accuracy, latency, and cost impact of longer chains and more self-consistency samples (Chapter 14)."
      ariaLabel="Inference scaling chart"
      activeAnalogy={activeAnalogy}
      visualRef={containerRef}
      controls={
        <div className="space-y-3 text-xs text-foreground">
          <ControlSlider
            id="tokens"
            label="Tokens per response"
            min={256}
            max={4096}
            step={128}
            value={tokens}
            onChange={setTokens}
            description="Longer rollouts support deeper reasoning but increase latency."
          />
          <ControlSlider
            id="samples"
            label="Self-consistency samples"
            min={1}
            max={16}
            step={1}
            value={samples}
            onChange={setSamples}
            description="More samples improve majority voting accuracy at extra cost."
          />
        </div>
      }
    >
      <div ref={containerRef} className="space-y-4 text-sm text-muted-foreground">
        <div className="rounded-2xl border border-border bg-card/70 p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase text-muted-foreground">
            Pass rate estimate
          </p>
          <p className="text-foreground">{Math.round(metrics.passRate * 100)}%</p>
          <p className="text-xs text-muted-foreground">
            Chapter 14 observes accuracy rising with more tokens and self-consistency votes.
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card/70 p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase text-muted-foreground">Latency</p>
          <p className="text-foreground">{Math.round(metrics.latencyMs)} ms (approx)</p>
          <p className="text-xs text-muted-foreground">
            Latency grows linearly with token budget and sample count; batch scheduling can hide
            some cost.
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card/70 p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase text-muted-foreground">
            Relative cost units
          </p>
          <p className="text-foreground">{metrics.costUnits.toFixed(1)}</p>
          <p className="text-xs text-muted-foreground">
            Use smaller students or distillation when cost exceeds your serving budget.
          </p>
        </div>
      </div>
    </VisualizationContainer>
  );
}
