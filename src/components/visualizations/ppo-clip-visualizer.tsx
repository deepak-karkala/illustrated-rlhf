'use client';

import { useMemo, useRef, useState } from 'react';

import { useAnalogy } from '@/lib/analogy-context';
import { ControlSlider } from '@/components/visualizations/control-slider';
import { VisualizationContainer } from '@/components/visualizations/visualization-container';

function objective(ratio: number, advantage: number): number {
  return ratio * advantage;
}

function clippedObjective(ratio: number, advantage: number, epsilon: number): number {
  const clippedRatio = Math.min(Math.max(ratio, 1 - epsilon), 1 + epsilon);
  return clippedRatio * advantage;
}

export function PpoClipVisualizer(): JSX.Element {
  const [ratio, setRatio] = useState<number>(1.3);
  const [advantage, setAdvantage] = useState<number>(0.8);
  const [epsilon, setEpsilon] = useState<number>(0.2);
  const containerRef = useRef<HTMLDivElement>(null);
  const { activeAnalogy } = useAnalogy();

  const unclipped = useMemo(() => objective(ratio, advantage), [ratio, advantage]);
  const clipped = useMemo(
    () => clippedObjective(ratio, advantage, epsilon),
    [ratio, advantage, epsilon]
  );

  const clippedRatio = Math.min(Math.max(ratio, 1 - epsilon), 1 + epsilon);

  return (
    <VisualizationContainer
      title="Clipping intuition"
      description="See how PPO’s clip(min,max) guardrail limits the policy update compared to vanilla policy gradients and why it prevents runaway ratios."
      ariaLabel="Interactive comparison of unclipped PPO objective and clipped objective"
      visualRef={containerRef}
      activeAnalogy={activeAnalogy}
      controls={
        <>
          <ControlSlider
            id="ratio"
            label="Policy ratio"
            min={0.5}
            max={1.8}
            step={0.02}
            value={ratio}
            onChange={setRatio}
            description="Ratio of new policy probability over old policy for a sampled action."
          />
          <ControlSlider
            id="advantage"
            label="Advantage"
            min={-1}
            max={1.2}
            step={0.05}
            value={advantage}
            onChange={setAdvantage}
            description="Positive advantages suggest increasing probability; negatives suggest decreasing it."
          />
          <ControlSlider
            id="epsilon"
            label="Clip ε"
            min={0.05}
            max={0.4}
            step={0.01}
            value={epsilon}
            onChange={setEpsilon}
            description="Tight clips prevent large updates but may slow learning; loose clips behave closer to vanilla policy gradients."
          />
        </>
      }
    >
      <div ref={containerRef} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <article className="rounded-2xl border border-border bg-card/70 p-4 shadow-sm">
            <h4 className="text-sm font-semibold text-foreground">Unclipped policy gradient</h4>
            <p className="mt-1 text-sm text-muted-foreground">
              Objective = ratio × advantage = {unclipped.toFixed(3)}. Vanilla REINFORCE would follow
              this value even if the ratio drifts far from 1.
            </p>
          </article>
          <article className="rounded-2xl border border-border bg-card/70 p-4 shadow-sm">
            <h4 className="text-sm font-semibold text-foreground">PPO clipped objective</h4>
            <p className="mt-1 text-sm text-muted-foreground">
              Clipped ratio = {clippedRatio.toFixed(3)} ⇒ objective = {clipped.toFixed(3)}.
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              When the advantage is positive and the ratio overshoots {(1 + epsilon).toFixed(2)},
              the clip holds the update at the safe boundary. For negative advantages the same
              guardrail applies with {(1 - epsilon).toFixed(2)}.
            </p>
          </article>
        </div>
        <div className="rounded-xl border border-dashed border-border bg-muted/40 p-4 text-sm text-muted-foreground">
          <p className="font-semibold text-foreground">Comparison with vanilla policy gradients</p>
          <p className="mt-1 text-muted-foreground">
            Chapter 11 contrasts PPO with the simpler REINFORCE objective. This control shows how
            PPO flattens the objective near large ratios, avoiding steps that would irreversibly
            warp the policy. If ε → ∞ the two objectives converge; if ε → 0 PPO refuses to change
            the policy at all.
          </p>
        </div>
      </div>
    </VisualizationContainer>
  );
}
