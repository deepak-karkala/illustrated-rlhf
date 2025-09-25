'use client';

import { useMemo, useRef, useState } from 'react';

import { useAnalogy } from '@/lib/analogy-context';
import { ControlSlider } from '@/components/visualizations/control-slider';
import { VisualizationContainer } from '@/components/visualizations/visualization-container';

interface MethodScore {
  method: 'Rejection Sampling' | 'PPO' | 'DPO';
  quality: number;
  cost: number;
  latency: number;
}

function estimateScores(temperature: number, completions: number): MethodScore[] {
  const baseQuality = Math.min(0.85, 0.65 + completions * 0.01 - Math.abs(temperature - 0.8) * 0.1);
  return [
    {
      method: 'Rejection Sampling',
      quality: Math.max(0, baseQuality),
      cost: Math.min(1, 0.35 + completions * 0.015),
      latency: Math.min(1, 0.3 + completions * 0.01),
    },
    {
      method: 'PPO',
      quality: Math.min(0.95, 0.8 + completions * 0.005),
      cost: 0.75,
      latency: 0.6,
    },
    {
      method: 'DPO',
      quality: Math.min(0.9, 0.78 + Math.abs(0.7 - temperature) * -0.05),
      cost: 0.45,
      latency: 0.4,
    },
  ];
}

export function MethodComparisonChart(): JSX.Element {
  const [temperature, setTemperature] = useState<number>(0.7);
  const [completions, setCompletions] = useState<number>(12);
  const { activeAnalogy } = useAnalogy();
  const containerRef = useRef<HTMLDivElement>(null);

  const scores = useMemo(
    () => estimateScores(temperature, completions),
    [temperature, completions]
  );

  return (
    <VisualizationContainer
      title="Method comparison snapshot"
      description="Compare rejection sampling to PPO and DPO qualitatively. Values are illustrative, matching the trade-offs described in Chapter 10."
      ariaLabel="Bar chart comparing alignment methods"
      visualRef={containerRef}
      activeAnalogy={activeAnalogy}
      controls={
        <div className="space-y-3 text-xs text-foreground">
          <ControlSlider
            id="comparison-temperature"
            label="Sampling temperature"
            min={0.4}
            max={1.0}
            step={0.05}
            value={temperature}
            onChange={setTemperature}
            description="Higher temperatures favour diversity but can reduce reward model scores."
          />
          <ControlSlider
            id="comparison-completions"
            label="Completions per prompt"
            min={4}
            max={30}
            step={1}
            value={completions}
            onChange={setCompletions}
            description="Increasing completions improves RS quality but raises cost and latency."
          />
        </div>
      }
    >
      <div ref={containerRef} className="grid gap-4 md:grid-cols-3 text-xs text-muted-foreground">
        {scores.map((score) => (
          <div
            key={score.method}
            className="space-y-3 rounded-2xl border border-border bg-card/70 p-4 shadow-sm"
          >
            <h4 className="text-sm font-semibold text-foreground">{score.method}</h4>
            <div>
              <p className="text-[11px] uppercase text-muted-foreground">Quality</p>
              <div className="mt-1 h-2 w-full rounded-full bg-muted/40">
                <div
                  className="h-full rounded-full bg-analogy-writing-500/70"
                  style={{ width: `${score.quality * 100}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {(score.quality * 100).toFixed(0)}%
              </p>
            </div>
            <div>
              <p className="text-[11px] uppercase text-muted-foreground">Compute cost</p>
              <div className="mt-1 h-2 w-full rounded-full bg-muted/40">
                <div
                  className="h-full rounded-full bg-analogy-advanced-500/70"
                  style={{ width: `${score.cost * 100}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{(score.cost * 100).toFixed(0)}%</p>
            </div>
            <div>
              <p className="text-[11px] uppercase text-muted-foreground">Latency</p>
              <div className="mt-1 h-2 w-full rounded-full bg-muted/40">
                <div
                  className="h-full rounded-full bg-analogy-reasoning-500/70"
                  style={{ width: `${score.latency * 100}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {(score.latency * 100).toFixed(0)}%
              </p>
            </div>
          </div>
        ))}
      </div>
    </VisualizationContainer>
  );
}
