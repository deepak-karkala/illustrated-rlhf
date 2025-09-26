'use client';

import { useMemo, useRef, useState } from 'react';

import { useAnalogy } from '@/lib/analogy-context';
import { ControlSlider } from '@/components/visualizations/control-slider';
import { VisualizationContainer } from '@/components/visualizations/visualization-container';

interface ToolLatencyMetrics {
  networkMs: number;
  executionMs: number;
  totalMs: number;
  successRate: number;
}

function computeLatency(
  toolCount: number,
  avgLatency: number,
  failureRate: number
): ToolLatencyMetrics {
  const networkMs = toolCount * 80;
  const executionMs = toolCount * avgLatency;
  const totalMs = networkMs + executionMs;
  const successRate = Math.max(0.2, 1 - failureRate * toolCount * 0.05);
  return {
    networkMs,
    executionMs,
    totalMs,
    successRate,
  };
}

export function ToolLatencyChart(): JSX.Element {
  const { activeAnalogy } = useAnalogy();
  const [toolCount, setToolCount] = useState<number>(2);
  const [avgLatency, setAvgLatency] = useState<number>(150);
  const [failureRate, setFailureRate] = useState<number>(5);
  const containerRef = useRef<HTMLDivElement>(null);

  const metrics = useMemo(
    () => computeLatency(toolCount, avgLatency, failureRate / 100),
    [toolCount, avgLatency, failureRate]
  );

  return (
    <VisualizationContainer
      title="Tool latency planner"
      description="Estimate latency and reliability as you add more tool calls (Chapter 15)."
      ariaLabel="Tool latency planner"
      activeAnalogy={activeAnalogy}
      visualRef={containerRef}
      controls={
        <div className="space-y-3 text-xs text-foreground">
          <ControlSlider
            id="tool-count"
            label="Tool calls per turn"
            min={1}
            max={6}
            step={1}
            value={toolCount}
            onChange={setToolCount}
            description="Multi-step workflows increase network round trips."
          />
          <ControlSlider
            id="avg-latency"
            label="Average tool latency (ms)"
            min={50}
            max={600}
            step={10}
            value={avgLatency}
            onChange={setAvgLatency}
            description="Execution time of each external tool."
          />
          <ControlSlider
            id="failure-rate"
            label="Failure rate (%)"
            min={0}
            max={20}
            step={1}
            value={failureRate}
            onChange={setFailureRate}
            description="Probability that a single call fails (timeouts, schema errors)."
          />
        </div>
      }
    >
      <div ref={containerRef} className="space-y-4 text-sm text-muted-foreground">
        <div className="rounded-2xl border border-border bg-card/70 p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase text-muted-foreground">Total latency</p>
          <p className="text-foreground">{Math.round(metrics.totalMs)} ms</p>
          <p className="text-xs text-muted-foreground">
            Network: {Math.round(metrics.networkMs)} ms - Execution:{' '}
            {Math.round(metrics.executionMs)} ms
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card/70 p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase text-muted-foreground">
            Success probability
          </p>
          <p className="text-foreground">{Math.round(metrics.successRate * 100)}%</p>
          <p className="text-xs text-muted-foreground">
            Mitigate cascading failures with retries or fallback plans, as advised in Chapter 15.
          </p>
        </div>
      </div>
    </VisualizationContainer>
  );
}
