'use client';

import * as d3 from 'd3';
import { useEffect, useMemo, useRef, useState } from 'react';

import { useAnalogy } from '@/lib/analogy-context';
import { ControlSlider } from '@/components/visualizations/control-slider';
import { VisualizationContainer } from '@/components/visualizations/visualization-container';

interface StepPoint {
  step: number;
  reward: number;
  kl: number;
}

function generateTrajectory(): StepPoint[] {
  const steps = d3.range(0, 30);
  return steps.map((step) => {
    const reward = 2.0 + 0.3 * Math.log(step + 1);
    const kl = 0.3 + 0.05 * Math.sin(step / 2) + step * 0.01;
    return { step, reward, kl };
  });
}

export function KlPenaltyPlayground(): JSX.Element {
  const [lambda, setLambda] = useState<number>(0.03);
  const [targetKl, setTargetKl] = useState<number>(0.6);
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { activeAnalogy } = useAnalogy();

  const baseline = useMemo(() => generateTrajectory(), []);
  const adjusted = useMemo(
    () => baseline.map((point) => ({ step: point.step, value: point.reward - lambda * point.kl })),
    [baseline, lambda]
  );

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    const width = 420;
    const height = 220;
    svg.attr('viewBox', `0 0 ${width} ${height}`);

    const margin = { top: 20, right: 20, bottom: 40, left: 48 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const root = svg.selectAll('g.chart-root').data([null]);
    const rootEnter = root.enter().append('g').attr('class', 'chart-root');
    rootEnter.merge(root as any).attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleLinear()
      .domain(d3.extent(baseline, (d) => d.step) as [number, number])
      .range([0, chartWidth]);

    const y = d3
      .scaleLinear()
      .domain([
        0,
        d3.max([...baseline.map((d) => d.reward), ...adjusted.map((d) => d.value)])! * 1.1,
      ])
      .range([chartHeight, 0]);

    const lineReward = d3
      .line<StepPoint>()
      .x((d) => x(d.step))
      .y((d) => y(d.reward))
      .curve(d3.curveMonotoneX);

    const lineAdjusted = d3
      .line<{ step: number; value: number }>()
      .x((d) => x(d.step))
      .y((d) => y(d.value))
      .curve(d3.curveMonotoneX);

    const chart = svg.select<SVGGElement>('g.chart-root');
    chart.selectAll('g.axis').remove();

    chart
      .append('g')
      .attr('class', 'axis axis-x text-[10px] text-muted-foreground')
      .attr('transform', `translate(0,${chartHeight})`)
      .call(d3.axisBottom(x).ticks(6));

    chart
      .append('g')
      .attr('class', 'axis axis-y text-[10px] text-muted-foreground')
      .call(d3.axisLeft(y).ticks(5));

    chart
      .selectAll('path.reward-line')
      .data([baseline])
      .join('path')
      .attr('class', 'reward-line')
      .attr('fill', 'none')
      .attr('stroke', 'var(--chart-color-primary, #2563eb)')
      .attr('stroke-width', 3)
      .attr('d', lineReward);

    chart
      .selectAll('path.adjusted-line')
      .data([adjusted])
      .join('path')
      .attr('class', 'adjusted-line')
      .attr('fill', 'none')
      .attr('stroke', 'var(--chart-color-secondary, #22c55e)')
      .attr('stroke-width', 3)
      .attr('stroke-dasharray', '6 4')
      .attr('d', lineAdjusted);

    const target = chart.selectAll('line.target-kl').data([targetKl]);
    target
      .join('line')
      .attr('class', 'target-kl')
      .attr('x1', 0)
      .attr('x2', chartWidth)
      .attr('y1', y(targetKl))
      .attr('y2', y(targetKl))
      .attr('stroke', 'var(--border)')
      .attr('stroke-dasharray', '4 6');
  }, [baseline, adjusted, lambda, targetKl]);

  const averageReward = adjusted.reduce((acc, point) => acc + point.value, 0) / adjusted.length;
  const averageKl = baseline.reduce((acc, point) => acc + point.kl, 0) / baseline.length;

  return (
    <VisualizationContainer
      title="KL penalty playground"
      description="Adjust λ to see how KL regularisation pulls the effective reward curve toward the reference model, as discussed in Chapter 8."
      ariaLabel="Line chart showing effect of KL penalty on reward trajectory"
      visualRef={containerRef}
      activeAnalogy={activeAnalogy}
      controls={
        <div className="space-y-3 text-xs text-foreground">
          <ControlSlider
            id="lambda"
            label="KL weight λ"
            min={0}
            max={0.08}
            step={0.005}
            value={lambda}
            onChange={setLambda}
            description="Higher λ emphasises staying near the reference policy."
          />
          <ControlSlider
            id="target-kl"
            label="Target KL"
            min={0.3}
            max={1.0}
            step={0.05}
            value={targetKl}
            onChange={setTargetKl}
            description="Visual guideline for acceptable KL range."
          />
        </div>
      }
    >
      <div ref={containerRef} className="space-y-4 text-xs text-muted-foreground">
        <svg ref={svgRef} className="w-full" />
        <p className="rounded-xl border border-dashed border-border bg-muted/40 p-4 text-xs text-muted-foreground">
          Effective reward ≈ {averageReward.toFixed(2)} after KL penalty; average KL ≈{' '}
          {averageKl.toFixed(2)}. Chapter 8 recommends tuning λ so models learn without drifting
          into degenerate behaviour.
        </p>
      </div>
    </VisualizationContainer>
  );
}
