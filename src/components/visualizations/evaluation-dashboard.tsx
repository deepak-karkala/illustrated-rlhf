'use client';

import { useMemo, useRef, useState } from 'react';

import { useAnalogy } from '@/lib/analogy-context';
import { VisualizationContainer } from '@/components/visualizations/visualization-container';

interface EvalMetric {
  id: string;
  label: string;
  value: number;
  description: string;
}

const METRIC_GROUPS: Record<string, EvalMetric[]> = {
  alignment: [
    {
      id: 'helpfulness',
      label: 'Helpfulness',
      value: 0.82,
      description: 'Aggregate from instruction-following datasets.',
    },
    {
      id: 'safety',
      label: 'Safety',
      value: 0.91,
      description: 'Guard evaluations (e.g., WildGuard, Llama Guard).',
    },
    {
      id: 'bias',
      label: 'Bias',
      value: 0.12,
      description: 'Lower is better; measured via targeted probes.',
    },
  ],
  reasoning: [
    {
      id: 'gsm8k',
      label: 'GSM8K',
      value: 0.71,
      description: 'Math benchmarks with verifier checks.',
    },
    {
      id: 'leetcode',
      label: 'LeetCode Hard',
      value: 0.34,
      description: 'Code benchmarks with execution harness.',
    },
    {
      id: 'mmlu',
      label: 'MMLU',
      value: 0.82,
      description: 'General knowledge exam-style evaluation.',
    },
  ],
  ux: [
    {
      id: 'latency',
      label: 'Median Latency (ms)',
      value: 820,
      description: 'Serving latency at P50.',
    },
    {
      id: 'cost',
      label: 'Cost / 1K tokens ($)',
      value: 0.0028,
      description: 'Blended inference cost.',
    },
    {
      id: 'nps',
      label: 'User satisfaction (NPS)',
      value: 48,
      description: 'Product or UX score from surveys.',
    },
  ],
};

export function EvaluationDashboard(): JSX.Element {
  const { activeAnalogy } = useAnalogy();
  const [groupId, setGroupId] = useState<string>('alignment');
  const containerRef = useRef<HTMLDivElement>(null);

  const metrics = useMemo(() => METRIC_GROUPS[groupId] ?? METRIC_GROUPS.alignment, [groupId]);

  return (
    <VisualizationContainer
      title="Evaluation dashboard snapshot"
      description="Track quantitative signals described in Chapters 17 and 19."
      ariaLabel="Evaluation dashboard"
      activeAnalogy={activeAnalogy}
      visualRef={containerRef}
      controls={
        <div className="flex flex-wrap gap-2 text-xs text-foreground">
          {Object.keys(METRIC_GROUPS).map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setGroupId(id)}
              className={`rounded-full border px-3 py-1 font-medium transition ${
                groupId === id
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-muted text-foreground hover:border-primary/60'
              }`}
            >
              {id.toUpperCase()}
            </button>
          ))}
        </div>
      }
    >
      <div ref={containerRef} className="space-y-3 text-sm text-muted-foreground">
        {metrics.map((metric) => (
          <div
            key={metric.id}
            className="rounded-2xl border border-border bg-card/70 p-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase text-muted-foreground">
                {metric.label}
              </p>
              <span className="rounded-full bg-muted px-3 py-1 text-[11px] text-muted-foreground">
                {metric.id.toUpperCase()}
              </span>
            </div>
            <p className="mt-2 text-foreground">
              {metric.id === 'latency' || metric.id === 'cost'
                ? metric.value
                : Math.round(metric.value * 100)}
              {metric.id === 'latency' ? ' ms' : metric.id === 'cost' ? '' : '%'}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{metric.description}</p>
          </div>
        ))}
      </div>
    </VisualizationContainer>
  );
}
