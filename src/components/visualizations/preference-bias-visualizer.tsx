'use client';

import { useMemo, useRef, useState } from 'react';

import { useAnalogy } from '@/lib/analogy-context';
import { ControlSlider } from '@/components/visualizations/control-slider';
import { VisualizationContainer } from '@/components/visualizations/visualization-container';

const DOMAINS = [
  'Customer support',
  'Creative writing',
  'Technical Q&A',
  'Safety refusals',
] as const;

type Domain = (typeof DOMAINS)[number];

export function PreferenceBiasVisualizer(): JSX.Element {
  const [skew, setSkew] = useState<number>(0.35);
  const [safetyToggle, setSafetyToggle] = useState<boolean>(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const { activeAnalogy } = useAnalogy();

  const distribution = useMemo(() => {
    const base = {
      'Customer support': 0.25,
      'Creative writing': 0.25,
      'Technical Q&A': 0.25,
      'Safety refusals': 0.25,
    } as Record<Domain, number>;

    base['Customer support'] += skew * 0.4;
    base['Creative writing'] -= skew * 0.2;
    base['Technical Q&A'] -= skew * 0.1;
    base['Safety refusals'] -= skew * 0.1;

    if (safetyToggle) {
      base['Safety refusals'] += 0.1;
      base['Creative writing'] -= 0.05;
    }

    const total = Object.values(base).reduce((acc, value) => acc + value, 0);
    (Object.keys(base) as Domain[]).forEach((domain) => {
      base[domain] = Math.max(0.05, base[domain] / total);
    });

    return base;
  }, [skew, safetyToggle]);

  return (
    <VisualizationContainer
      title="Preference dataset bias explorer"
      description="Visualise how weighting certain prompt domains or safety filters shifts the dataset distribution, echoing the bias considerations from Chapter 6."
      ariaLabel="Bar chart depicting domain distribution under different bias settings"
      visualRef={containerRef}
      activeAnalogy={activeAnalogy}
      controls={
        <>
          <ControlSlider
            id="support-skew"
            label="Customer support share"
            min={0}
            max={0.6}
            step={0.05}
            value={skew}
            onChange={setSkew}
            description="Higher values simulate queue-based sampling that over-represents support tickets (Chapter 6)."
          />
          <label className="flex items-center gap-2 text-xs font-medium text-foreground">
            <input
              type="checkbox"
              checked={safetyToggle}
              onChange={(event) => setSafetyToggle(event.target.checked)}
              className="h-3 w-3 accent-primary"
            />
            Emphasise safety reviews
          </label>
        </>
      }
    >
      <div ref={containerRef} className="space-y-4">
        <div className="grid gap-3 md:grid-cols-2">
          {(Object.keys(distribution) as Domain[]).map((domain) => {
            const value = distribution[domain];
            return (
              <div
                key={domain}
                className="rounded-2xl border border-border bg-card/70 p-4 shadow-sm"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {domain}
                </p>
                <div className="mt-3 h-24 w-full rounded-lg bg-muted/50">
                  <div
                    className="h-full rounded-lg bg-analogy-advanced-500/70"
                    style={{ width: `${Math.min(100, Math.max(5, value * 100))}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  {(value * 100).toFixed(1)}% of comparisons
                </p>
              </div>
            );
          })}
        </div>
        <p className="rounded-xl border border-dashed border-border bg-muted/40 p-4 text-xs text-muted-foreground">
          Chapter 6 highlights biases introduced by sampling queues, annotator availability, and
          safety triage. Use this control to reason about downstream impacts—imbalanced domains lead
          reward models (and DPO/PPO) to favour those behaviours.
        </p>
      </div>
    </VisualizationContainer>
  );
}
