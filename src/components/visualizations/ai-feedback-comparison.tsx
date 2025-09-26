'use client';

import { useMemo, useRef, useState } from 'react';

import { useAnalogy } from '@/lib/analogy-context';
import { ControlSlider } from '@/components/visualizations/control-slider';
import { VisualizationContainer } from '@/components/visualizations/visualization-container';

const HUMAN_COST_PER_PROMPT = 1.0;
const AI_COST_PER_PROMPT = 0.01;

function round(value: number, digits = 2): number {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

export function AiFeedbackComparison(): JSX.Element {
  const { activeAnalogy } = useAnalogy();
  const [totalPrompts, setTotalPrompts] = useState<number>(8000);
  const [humanShare, setHumanShare] = useState<number>(40);
  const containerRef = useRef<HTMLDivElement>(null);

  const metrics = useMemo(() => {
    const humanPrompts = Math.round((humanShare / 100) * totalPrompts);
    const aiPrompts = totalPrompts - humanPrompts;

    const humanCost = humanPrompts * HUMAN_COST_PER_PROMPT;
    const aiCost = aiPrompts * AI_COST_PER_PROMPT;
    const blendedCost = humanCost + aiCost;

    const humanHours = humanPrompts * 0.08; // assume 5 prompts per hour per annotator
    const aiMinutes = aiPrompts * 0.01; // near instant
    const turnaroundHours = humanHours + aiMinutes / 60;

    const biasPenalty = (100 - humanShare) / 150; // more AI share, higher bias
    const noisePenalty = humanShare / 200; // more human share, more annotator noise
    const alignmentScore = round(0.78 + (humanShare / 100) * 0.12 - biasPenalty - noisePenalty, 3);
    const driftRisk = round(0.25 + biasPenalty - humanShare / 500, 3);

    return {
      humanPrompts,
      aiPrompts,
      humanCost: round(humanCost, 2),
      aiCost: round(aiCost, 2),
      blendedCost: round(blendedCost, 2),
      turnaroundHours: round(turnaroundHours, 1),
      alignmentScore,
      driftRisk: Math.max(0, driftRisk),
    };
  }, [totalPrompts, humanShare]);

  return (
    <VisualizationContainer
      title="AI vs human feedback trade-offs"
      description="Estimate cost, turnaround, and risk when mixing Chapter 13's synthetic feedback with human annotations."
      ariaLabel="Comparison table for AI and human feedback"
      activeAnalogy={activeAnalogy}
      visualRef={containerRef}
      controls={
        <div className="space-y-3 text-xs text-foreground">
          <ControlSlider
            id="total-prompts"
            label="Total prompts"
            min={1000}
            max={50000}
            step={500}
            value={totalPrompts}
            onChange={setTotalPrompts}
            description="How many preference or critique prompts you want to label."
          />
          <ControlSlider
            id="human-share"
            label="Human share (%)"
            min={0}
            max={100}
            step={5}
            value={humanShare}
            onChange={setHumanShare}
            description="Blend human oversight with AI feedback, as suggested by Chapter 13."
          />
        </div>
      }
    >
      <div ref={containerRef} className="space-y-4 text-sm text-muted-foreground">
        <div className="space-y-2 rounded-2xl border border-border bg-card/70 p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase text-muted-foreground">Volume split</p>
          <p className="text-foreground">{metrics.humanPrompts} human-labeled prompts</p>
          <p className="text-foreground">{metrics.aiPrompts} AI-labeled prompts</p>
        </div>
        <div className="space-y-2 rounded-2xl border border-border bg-card/70 p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase text-muted-foreground">Budget</p>
          <p className="text-foreground">Human cost: ${metrics.humanCost.toFixed(2)}</p>
          <p className="text-foreground">AI cost: ${metrics.aiCost.toFixed(2)}</p>
          <p className="text-sm text-foreground font-semibold">
            Total: ${metrics.blendedCost.toFixed(2)}
          </p>
        </div>
        <div className="space-y-2 rounded-2xl border border-border bg-card/70 p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase text-muted-foreground">Turnaround</p>
          <p className="text-foreground">
            Approximate hours: {metrics.turnaroundHours.toFixed(1)} h
          </p>
          <p className="text-xs text-muted-foreground">
            Human feedback dominates schedule; AI feedback is near-instant and can backfill gaps
            overnight.
          </p>
        </div>
        <div className="space-y-2 rounded-2xl border border-border bg-card/70 p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase text-muted-foreground">Quality outlook</p>
          <p className="text-foreground">
            Alignment score (0-1 scale): {metrics.alignmentScore.toFixed(2)}
          </p>
          <p className="text-foreground">Bias exposure: {metrics.driftRisk.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground">
            Chapter 13 notes AI feedback has lower noise but higher bias; keep some human oversight
            to cap drift.
          </p>
        </div>
      </div>
    </VisualizationContainer>
  );
}
