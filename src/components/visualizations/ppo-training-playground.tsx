'use client';

import * as d3 from 'd3';
import { useEffect, useMemo, useRef, useState } from 'react';

import { useAnalogy } from '@/lib/analogy-context';
import { ControlSlider } from '@/components/visualizations/control-slider';
import { VisualizationContainer } from '@/components/visualizations/visualization-container';

interface TrajectoryPoint {
  step: number;
  clipped: number;
  unclipped: number;
}

const ADVANTAGES = [0.8, 0.3, -0.2, 1.0, -0.5, 0.4, -0.1, 0.6, -0.3, 0.2];

function simulateTrajectory(
  learningRate: number,
  clip: number,
  klPenalty: number
): TrajectoryPoint[] {
  let ratio = 1;
  const points: TrajectoryPoint[] = [];
  ADVANTAGES.forEach((adv, index) => {
    const unclipped = Math.max(
      0.2,
      ratio * Math.exp(learningRate * (adv - klPenalty * (ratio - 1)))
    );
    const clipped = Math.min(Math.max(unclipped, 1 - clip), 1 + clip);
    points.push({ step: index, clipped, unclipped });
    ratio = clipped;
  });
  return points;
}

export function PpoTrainingPlayground(): JSX.Element {
  const [learningRate, setLearningRate] = useState<number>(0.08);
  const [clip, setClip] = useState<number>(0.2);
  const [klPenalty, setKlPenalty] = useState<number>(0.008);
  const containerRef = useRef<HTMLDivElement>(null);
  const clippedPathRef = useRef<SVGPathElement>(null);
  const unclippedPathRef = useRef<SVGPathElement>(null);
  const { activeAnalogy } = useAnalogy();

  const data = useMemo(
    () => simulateTrajectory(learningRate, clip, klPenalty),
    [learningRate, clip, klPenalty]
  );

  useEffect(() => {
    const width = 420;
    const height = 180;
    const xScale = d3
      .scaleLinear()
      .domain([0, data.length - 1])
      .range([0, width]);
    const yScale = d3
      .scaleLinear()
      .domain([
        Math.min(0.6, d3.min(data, (d) => Math.min(d.clipped, d.unclipped)) ?? 0.6),
        Math.max(1.6, d3.max(data, (d) => Math.max(d.clipped, d.unclipped)) ?? 1.5),
      ])
      .range([height, 0])
      .nice();

    const line = d3
      .line<TrajectoryPoint>()
      .x((point) => xScale(point.step))
      .y((point) => yScale(point.unclipped))
      .curve(d3.curveMonotoneX);

    const clippedLine = d3
      .line<TrajectoryPoint>()
      .x((point) => xScale(point.step))
      .y((point) => yScale(point.clipped))
      .curve(d3.curveMonotoneX);

    if (unclippedPathRef.current) {
      unclippedPathRef.current.setAttribute('d', line(data) ?? '');
    }
    if (clippedPathRef.current) {
      clippedPathRef.current.setAttribute('d', clippedLine(data) ?? '');
    }
  }, [data]);

  const finalRatio = data[data.length - 1];

  return (
    <VisualizationContainer
      title="PPO policy update playground"
      description="Track how policy ratios evolve over mini-batches when you vary the learning rate, clipping range, and KL penalty — mirroring the PPO discussion in Chapter 11."
      ariaLabel="Line chart comparing unclipped and clipped PPO policy ratios across optimisation steps"
      visualRef={containerRef}
      activeAnalogy={activeAnalogy}
      controls={
        <>
          <ControlSlider
            id="learning-rate"
            label="Learning rate"
            min={0.02}
            max={0.2}
            step={0.01}
            value={learningRate}
            onChange={setLearningRate}
            description="Higher values move the policy farther each batch, risking divergence without clipping."
          />
          <ControlSlider
            id="clip-range"
            label="Clip range ε"
            min={0.05}
            max={0.4}
            step={0.01}
            value={clip}
            onChange={setClip}
            description="PPO bounds the policy ratio between 1 ± ε to limit destructive updates."
          />
          <ControlSlider
            id="kl-penalty"
            label="KL penalty β"
            min={0}
            max={0.02}
            step={0.002}
            value={klPenalty}
            onChange={setKlPenalty}
            description="Heavier KL penalties keep the new policy close to the reference, echoing RLHF safety tethers."
          />
        </>
      }
    >
      <div ref={containerRef} className="space-y-4">
        <svg viewBox="0 0 460 220" className="w-full">
          <defs>
            <linearGradient id="ppo-unclipped" x1="0%" x2="0%" y1="0%" y2="100%">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#60a5fa" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="ppo-clipped" x1="0%" x2="0%" y1="0%" y2="100%">
              <stop offset="0%" stopColor="#22c55e" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
            </linearGradient>
          </defs>
          <g transform="translate(30,20)">
            <rect width="400" height="160" fill="url(#ppo-unclipped)" opacity="0.35" />
            <rect width="400" height="160" fill="url(#ppo-clipped)" opacity="0.35" />
            <line x1="0" x2="400" y1="120" y2="120" stroke="var(--border)" strokeDasharray="4 6" />
            <line x1="0" x2="400" y1="80" y2="80" stroke="var(--border)" strokeDasharray="4 6" />
            <path ref={unclippedPathRef} stroke="#1d4ed8" strokeWidth="3" fill="none" />
            <path ref={clippedPathRef} stroke="#16a34a" strokeWidth="3" fill="none" />
          </g>
        </svg>
        <div className="rounded-xl border border-dashed border-border bg-muted/40 p-4 text-sm text-muted-foreground">
          <p className="font-semibold text-foreground">Reading the curves</p>
          <p className="mt-1 text-muted-foreground">
            The blue line shows where plain policy gradient updates would push the ratio. The green
            line applies PPO clipping and the KL penalty, emulating the stabilisation strategies
            emphasised in Chapter 11. When clipping is tight or the KL weight grows, the curve hugs
            1.0 rather than overshooting.
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Final policy ratio ≈ {finalRatio?.clipped.toFixed(2)} (clipped) vs{' '}
            {finalRatio?.unclipped.toFixed(2)} (unclipped).
          </p>
        </div>
      </div>
    </VisualizationContainer>
  );
}
