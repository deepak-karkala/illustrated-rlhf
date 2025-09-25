'use client';

import * as d3 from 'd3';
import { useEffect, useMemo, useRef, useState } from 'react';

import { useAnalogy } from '@/lib/analogy-context';
import { ControlSlider } from '@/components/visualizations/control-slider';
import { VisualizationContainer } from '@/components/visualizations/visualization-container';

interface CurvePoint {
  x: number;
  y: number;
}

function buildPath(
  points: CurvePoint[],
  width: number,
  height: number,
  xDomain: [number, number],
  yDomain: [number, number]
): string {
  const xScale = d3.scaleLinear().domain(xDomain).range([0, width]);
  const yScale = d3.scaleLinear().domain(yDomain).range([height, 0]);
  const line = d3
    .line<CurvePoint>()
    .x((point) => xScale(point.x))
    .y((point) => yScale(point.y))
    .curve(d3.curveMonotoneX);
  return line(points) ?? '';
}

export function RewardModelLossExplorer(): JSX.Element {
  const [delta, setDelta] = useState<number>(1.2);
  const containerRef = useRef<HTMLDivElement>(null);
  const probabilityRef = useRef<SVGPathElement>(null);
  const lossRef = useRef<SVGPathElement>(null);
  const markerRef = useRef<SVGLineElement>(null);
  const lossMarkerRef = useRef<SVGLineElement>(null);
  const { activeAnalogy } = useAnalogy();

  const points = useMemo(() => {
    const xs = d3.range(-6, 6.01, 0.2);
    return xs.map((x) => {
      const prob = 1 / (1 + Math.exp(-x));
      const loss = -Math.log(prob);
      return { x, prob, loss } as { x: number; prob: number; loss: number };
    });
  }, []);

  useEffect(() => {
    const width = 360;
    const height = 140;
    const probPath = probabilityRef.current;
    const lossPath = lossRef.current;
    if (!probPath || !lossPath) return;
    probPath.setAttribute(
      'd',
      buildPath(
        points.map(({ x, prob }) => ({ x, y: prob })),
        width,
        height,
        [-6, 6],
        [0, 1]
      )
    );
    lossPath.setAttribute(
      'd',
      buildPath(
        points.map(({ x, loss }) => ({ x, y: loss })),
        width,
        height,
        [-6, 6],
        [0, 2.2]
      )
    );
  }, [points]);

  const prob = 1 / (1 + Math.exp(-delta));
  const loss = -Math.log(prob);

  useEffect(() => {
    const width = 360;
    const height = 140;
    const probLine = markerRef.current;
    const lossLine = lossMarkerRef.current;
    if (!probLine || !lossLine) return;
    const probScaleX = d3.scaleLinear().domain([-6, 6]).range([0, width]);
    const probScaleY = d3.scaleLinear().domain([0, 1]).range([height, 0]);
    const lossScaleY = d3.scaleLinear().domain([0, 2.2]).range([height, 0]);
    const x = probScaleX(delta);
    probLine.setAttribute('x1', `${x}`);
    probLine.setAttribute('x2', `${x}`);
    probLine.setAttribute('y2', `${probScaleY(prob)}`);
    lossLine.setAttribute('x1', `${x}`);
    lossLine.setAttribute('x2', `${x}`);
    lossLine.setAttribute('y2', `${lossScaleY(loss)}`);
  }, [delta, prob, loss]);

  return (
    <VisualizationContainer
      title="Reward model loss explorer"
      description="Adjust the reward gap between a preferred and rejected completion to see the Bradley–Terry probability and the corresponding negative log-likelihood loss used in Chapter 7 of the RLHF book."
      ariaLabel="Chart depicting Bradley-Terry probability and reward model loss as the reward gap varies"
      visualRef={containerRef}
      activeAnalogy={activeAnalogy}
      controls={
        <>
          <ControlSlider
            id="reward-gap"
            label="Reward gap (r_chosen − r_rejected)"
            min={-4}
            max={4}
            step={0.1}
            value={delta}
            onChange={setDelta}
            description="Positive values mean the chosen response scores higher; negative values mean the rejected response scores higher."
          />
          <p className="text-xs text-muted-foreground">
            σ(Δ) = {prob.toFixed(2)}, loss = {loss.toFixed(3)}
          </p>
        </>
      }
    >
      <div ref={containerRef} className="space-y-6">
        <article className="space-y-2">
          <header className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Bradley–Terry win probability</span>
            <span>σ(Δ)</span>
          </header>
          <svg viewBox="0 0 360 140" className="w-full">
            <defs>
              <linearGradient id="prob-gradient" x1="0%" x2="0%" y1="0%" y2="100%">
                <stop offset="0%" stopColor="#22c55e" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
              </linearGradient>
            </defs>
            <rect width="360" height="140" rx="16" ry="16" fill="url(#prob-gradient)" />
            <g transform="translate(20,10)">
              <line
                x1="0"
                x2="320"
                y1="110"
                y2="110"
                stroke="var(--border)"
                strokeDasharray="4 6"
              />
              <line
                x1="160"
                x2="160"
                y1="0"
                y2="110"
                stroke="var(--border)"
                strokeDasharray="4 6"
              />
              <path ref={probabilityRef} stroke="#16a34a" strokeWidth="3" fill="none" />
              <line
                ref={markerRef}
                x1="0"
                x2="0"
                y1="110"
                y2="110"
                stroke="#14532d"
                strokeWidth="2"
              />
            </g>
          </svg>
        </article>
        <article className="space-y-2">
          <header className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Negative log-likelihood loss</span>
            <span>−log σ(Δ)</span>
          </header>
          <svg viewBox="0 0 360 140" className="w-full">
            <defs>
              <linearGradient id="loss-gradient" x1="0%" x2="0%" y1="0%" y2="100%">
                <stop offset="0%" stopColor="#f97316" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
              </linearGradient>
            </defs>
            <rect width="360" height="140" rx="16" ry="16" fill="url(#loss-gradient)" />
            <g transform="translate(20,10)">
              <line
                x1="0"
                x2="320"
                y1="110"
                y2="110"
                stroke="var(--border)"
                strokeDasharray="4 6"
              />
              <line
                x1="160"
                x2="160"
                y1="0"
                y2="110"
                stroke="var(--border)"
                strokeDasharray="4 6"
              />
              <path ref={lossRef} stroke="#ea580c" strokeWidth="3" fill="none" />
              <line
                ref={lossMarkerRef}
                x1="0"
                x2="0"
                y1="110"
                y2="110"
                stroke="#c2410c"
                strokeWidth="2"
              />
            </g>
          </svg>
        </article>
        <div className="rounded-xl border border-dashed border-border bg-muted/40 p-4 text-sm text-muted-foreground">
          <p className="font-semibold text-foreground">Interpretation</p>
          <p className="mt-1 text-muted-foreground">
            When the reward gap is large and positive, the model is confident in the preferred
            response, so the loss approaches zero. Negative gaps indicate the model scores the
            rejected output higher, causing the loss to blow up. This mirrors the Bradley–Terry
            derivation and the implementation snippet in Chapter 7 of the RLHF book.
          </p>
        </div>
      </div>
    </VisualizationContainer>
  );
}
