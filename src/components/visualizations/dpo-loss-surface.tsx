'use client';

import * as d3 from 'd3';
import { useEffect, useMemo, useRef, useState } from 'react';

import { useAnalogy } from '@/lib/analogy-context';
import { ControlSlider } from '@/components/visualizations/control-slider';
import { VisualizationContainer } from '@/components/visualizations/visualization-container';

interface LossPoint {
  delta: number;
  loss: number;
}

function dpoLoss(delta: number, beta: number): number {
  return Math.log1p(Math.exp(-beta * delta));
}

export function DpoLossSurface(): JSX.Element {
  const [beta, setBeta] = useState<number>(0.1);
  const [temperature, setTemperature] = useState<number>(1.0);
  const svgRef = useRef<SVGSVGElement>(null);
  const { activeAnalogy } = useAnalogy();

  const data = useMemo<LossPoint[]>(() => {
    const deltas = d3.range(-4, 4.01, 0.2);
    return deltas.map((delta) => ({ delta, loss: dpoLoss(delta * temperature, beta) }));
  }, [beta, temperature]);

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    const width = 420;
    const height = 200;
    svg.attr('viewBox', `0 0 ${width} ${height}`);

    const margin = { top: 10, right: 10, bottom: 30, left: 40 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const xScale = d3
      .scaleLinear()
      .domain(d3.extent(data, (d) => d.delta) as [number, number])
      .range([0, chartWidth]);
    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.loss)!])
      .nice()
      .range([chartHeight, 0]);

    const g = svg.select('g.chart');
    if (g.empty()) {
      svg
        .append('g')
        .attr('class', 'chart')
        .attr('transform', `translate(${margin.left},${margin.top})`);
    }

    const root = svg.select('g.chart');
    root.selectAll('*').remove();

    root
      .append('g')
      .attr('class', 'axis axis-x text-[10px] text-muted-foreground')
      .attr('transform', `translate(0,${chartHeight})`)
      .call(d3.axisBottom(xScale).ticks(8));

    root
      .append('g')
      .attr('class', 'axis axis-y text-[10px] text-muted-foreground')
      .call(d3.axisLeft(yScale).ticks(6));

    const area = d3
      .area<LossPoint>()
      .x((d) => xScale(d.delta))
      .y0(chartHeight)
      .y1((d) => yScale(d.loss))
      .curve(d3.curveMonotoneX);

    root
      .append('path')
      .datum(data)
      .attr('fill', 'rgba(168, 85, 247, 0.2)')
      .attr('stroke', 'rgb(126, 34, 206)')
      .attr('stroke-width', 3)
      .attr('d', area);

    root
      .append('line')
      .attr('x1', xScale(0))
      .attr('x2', xScale(0))
      .attr('y1', 0)
      .attr('y2', chartHeight)
      .attr('stroke', 'var(--border)')
      .attr('stroke-dasharray', '4 6');
  }, [data]);

  const minLoss = d3.min(data, (d) => d.loss) ?? 0;

  return (
    <VisualizationContainer
      title="DPO loss curve"
      description="Inspect how the negative log-sigmoid term behaves as the policy moves away from the reference, echoing the derivation in Chapter 12."
      ariaLabel="Chart showing DPO loss as a function of logit difference"
      visualRef={useRef<HTMLDivElement>(null)}
      activeAnalogy={activeAnalogy}
      controls={
        <>
          <ControlSlider
            id="beta-loss"
            label="β"
            min={0.05}
            max={0.4}
            step={0.01}
            value={beta}
            onChange={setBeta}
            description="Sharper β values make the loss grow faster when policy and reference disagree."
          />
          <ControlSlider
            id="temperature-loss"
            label="Logit scale"
            min={0.5}
            max={1.5}
            step={0.05}
            value={temperature}
            onChange={setTemperature}
            description="Scales the logit gap, simulating confidence changes in the dataset."
          />
        </>
      }
    >
      <div className="space-y-3">
        <svg ref={svgRef} className="w-full" />
        <p className="rounded-xl border border-dashed border-border bg-muted/40 p-3 text-xs text-muted-foreground">
          Minimum loss ≈ {minLoss.toFixed(3)} when the policy aligns with human preference. Large
          negative deltas (rewarding the rejected response) push the loss rapidly upward, mirroring
          the cautionary notes in Chapter 12 about preference displacement.
        </p>
      </div>
    </VisualizationContainer>
  );
}
