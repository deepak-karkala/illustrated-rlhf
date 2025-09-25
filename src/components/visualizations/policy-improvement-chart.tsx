'use client';

import * as d3 from 'd3';
import { useEffect, useMemo, useRef, useState } from 'react';

import { useAnalogy } from '@/lib/analogy-context';
import { VisualizationContainer } from '@/components/visualizations/visualization-container';
import { ControlSlider } from '@/components/visualizations/control-slider';
import { ControlToggle } from '@/components/visualizations/control-toggle';

function generateRewards(klPenalty: number): Array<{ step: number; reward: number }> {
  const steps = d3.range(0, 30);
  return steps.map((step) => {
    const explorationBoost = Math.sin(step / 4) * (1 - klPenalty);
    const baseline = 0.4 * Math.log(step + 1) + 0.5;
    return {
      step,
      reward: baseline + explorationBoost,
    };
  });
}

function generateBaseline(): Array<{ step: number; reward: number }> {
  const steps = d3.range(0, 30);
  return steps.map((step) => ({
    step,
    reward: 0.4 * Math.log(step + 1) + 0.5,
  }));
}

export function PolicyImprovementChart(): JSX.Element {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [klPenalty, setKlPenalty] = useState(0.3);
  const [showBaseline, setShowBaseline] = useState(true);
  const { activeAnalogy } = useAnalogy();

  const baselineData = useMemo(() => generateBaseline(), []);
  const rewardData = useMemo(() => generateRewards(klPenalty), [klPenalty]);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    if (svgRef.current === null) {
      return;
    }

    const width = 600;
    const height = 320;
    svg.attr('viewBox', `0 0 ${width} ${height}`);

    const margin = { top: 20, right: 20, bottom: 40, left: 48 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const g = svg.select('g.chart-root');
    if (g.empty()) {
      svg
        .append('g')
        .attr('class', 'chart-root')
        .attr('transform', `translate(${margin.left},${margin.top})`);
    }
    const root = svg.select('g.chart-root');

    const x = d3
      .scaleLinear()
      .domain(d3.extent(rewardData, (d) => d.step) as [number, number])
      .range([0, chartWidth]);
    const y = d3
      .scaleLinear()
      .domain([0, d3.max([...rewardData, ...baselineData], (d) => d.reward)! * 1.05])
      .range([chartHeight, 0]);

    const lineGenerator = d3
      .line<{ step: number; reward: number }>()
      .x((d) => x(d.step))
      .y((d) => y(d.reward))
      .curve(d3.curveCatmullRom.alpha(0.5));

    root.selectAll('g.axis').remove();

    root
      .append('g')
      .attr('class', 'axis axis-x text-[10px] text-muted-foreground')
      .attr('transform', `translate(0,${chartHeight})`)
      .call(
        d3
          .axisBottom(x)
          .ticks(6)
          .tickFormat((d) => `${d}`)
      );

    root
      .append('g')
      .attr('class', 'axis axis-y text-[10px] text-muted-foreground')
      .call(d3.axisLeft(y).ticks(5));

    const rewardPath = root.selectAll('path.reward-line').data([rewardData]);
    rewardPath
      .join('path')
      .attr('class', 'reward-line')
      .attr('fill', 'none')
      .attr('stroke', 'var(--chart-color-primary, #3b82f6)')
      .attr('stroke-width', 3)
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round')
      .attr('d', lineGenerator);

    const points = root.selectAll('circle.reward-point').data(rewardData, (d: any) => d.step);
    points
      .join('circle')
      .attr('class', 'reward-point')
      .attr('cx', (d) => x(d.step))
      .attr('cy', (d) => y(d.reward))
      .attr('r', 3)
      .attr('fill', 'var(--chart-color-primary, #2563eb)');

    const baselinePath = root
      .selectAll('path.baseline-line')
      .data(showBaseline ? [baselineData] : []);
    baselinePath.join(
      (enter) =>
        enter
          .append('path')
          .attr('class', 'baseline-line')
          .attr('fill', 'none')
          .attr('stroke-dasharray', '6 4')
          .attr('stroke-width', 2)
          .attr('stroke', 'var(--chart-color-secondary, #64748b)')
          .attr('d', lineGenerator),
      (update) => update.attr('d', lineGenerator),
      (exit) => exit.remove()
    );

    return () => {
      root.selectAll('path.reward-line').remove();
      root.selectAll('circle.reward-point').remove();
      root.selectAll('path.baseline-line').remove();
      root.selectAll('g.axis').remove();
    };
  }, [baselineData, rewardData, klPenalty, showBaseline]);

  return (
    <VisualizationContainer
      title="Policy reward progression"
      description="Adjust the KL penalty to see how exploration pressure changes expected reward across training steps."
      ariaLabel="Line chart comparing policy reward trajectories under different KL penalties"
      visualRef={containerRef}
      controls={
        <>
          <ControlSlider
            id="kl-penalty"
            label="KL penalty"
            min={0.1}
            max={0.8}
            step={0.05}
            value={klPenalty}
            onChange={setKlPenalty}
            description="Higher values keep the policy closer to the SFT reference; lower values allow more exploration."
          />
          <ControlToggle
            label="Show SFT baseline"
            value={showBaseline}
            onChange={setShowBaseline}
            description="Compare against the supervised model without RLHF updates."
          />
        </>
      }
      activeAnalogy={activeAnalogy}
    >
      <div ref={containerRef} className="max-w-full overflow-hidden">
        <svg ref={svgRef} role="presentation" focusable={false} className="w-full" />
      </div>
    </VisualizationContainer>
  );
}
