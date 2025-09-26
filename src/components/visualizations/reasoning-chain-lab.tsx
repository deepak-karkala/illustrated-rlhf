'use client';

import { useMemo, useRef, useState } from 'react';

import { useAnalogy } from '@/lib/analogy-context';
import { ControlSlider } from '@/components/visualizations/control-slider';
import { VisualizationContainer } from '@/components/visualizations/visualization-container';

interface ChainStep {
  thought: string;
  verifier: string;
  status: 'pass' | 'fail' | 'pending';
}

interface ReasoningScenario {
  id: string;
  title: string;
  prompt: string;
  baseline: string;
  steps: ChainStep[];
}

const SCENARIOS: ReasoningScenario[] = [
  {
    id: 'math-tutor',
    title: 'Math tutor (GSM8K)',
    prompt: 'What is 3/4 of 96?',
    baseline: 'Model guesses 68 without showing work and fails verifier.',
    steps: [
      {
        thought: 'Convert the fraction: one quarter of 96 is 24.',
        verifier: 'Unit fraction check passes (96 / 4 = 24).',
        status: 'pass',
      },
      {
        thought: 'Three quarters means 3 * 24 = 72.',
        verifier: 'Arithmetic check confirms 72.',
        status: 'pass',
      },
      {
        thought: 'Answer: 72. Provide explanation.',
        verifier: 'Math reward model marks answer as correct.',
        status: 'pass',
      },
    ],
  },
  {
    id: 'code-eval',
    title: 'Code evaluation',
    prompt: 'Write a Python function that returns the factorial of n.',
    baseline: 'Model writes recursive code but forgets base case, causing RuntimeError.',
    steps: [
      {
        thought: 'Define function factorial(n) with guard if n <= 1: return 1.',
        verifier: 'Static analyzer sees termination condition, passes.',
        status: 'pass',
      },
      {
        thought: 'Otherwise return n * factorial(n - 1).',
        verifier: 'Python unit tests for n=5 and n=7 pass.',
        status: 'pass',
      },
      {
        thought: 'Add docstring and input validation for negatives.',
        verifier: 'Reward model issues warning for negative inputs. Mark as pending.',
        status: 'pending',
      },
    ],
  },
  {
    id: 'logic-proof',
    title: 'Logic puzzle',
    prompt:
      'Three boxes contain apples, oranges, or both. Each label is wrong. One peek reveals apples-only. Re-label correctly.',
    baseline: 'Model outputs inconsistent labels without deduction.',
    steps: [
      {
        thought: 'Peeked box labeled "Apples & Oranges" contains only apples.',
        verifier: 'Verifier records observation.',
        status: 'pass',
      },
      {
        thought: 'Swap label: the peeked box must be "Apples" because labels are wrong.',
        verifier: 'Constraint solver agrees.',
        status: 'pass',
      },
      {
        thought: 'Box labeled "Apples" cannot contain apples. It must be "Oranges".',
        verifier: 'Constraint solver checks remaining possibilities.',
        status: 'pass',
      },
      {
        thought: 'Final box gets "Apples & Oranges".',
        verifier: 'All constraints satisfied.',
        status: 'pass',
      },
    ],
  },
];

const STATUS_TOKEN: Record<ChainStep['status'], string> = {
  pass: 'PASS',
  fail: 'FAIL',
  pending: 'HOLD',
};

export function ReasoningChainLab(): JSX.Element {
  const { activeAnalogy } = useAnalogy();
  const [scenarioId, setScenarioId] = useState<string>(SCENARIOS[0]!.id);
  const [stepIndex, setStepIndex] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const scenario = useMemo(
    () => SCENARIOS.find((item) => item.id === scenarioId) ?? SCENARIOS[0]!,
    [scenarioId]
  );

  const steps = scenario.steps;
  const clampedStep = Math.min(stepIndex, steps.length - 1);

  return (
    <VisualizationContainer
      title="Reasoning chain lab"
      description="Step through chain-of-thought revisions reinforced with verifiable rewards (Chapter 14)."
      ariaLabel="Interactive reasoning chain"
      activeAnalogy={activeAnalogy}
      visualRef={containerRef}
      controls={
        <div className="space-y-3 text-xs text-foreground">
          <div className="flex flex-wrap gap-2">
            {SCENARIOS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setScenarioId(item.id);
                  setStepIndex(0);
                }}
                className={`rounded-full border px-3 py-1 font-medium transition ${
                  scenarioId === item.id
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-muted text-foreground hover:border-primary/60'
                }`}
              >
                {item.title}
              </button>
            ))}
          </div>
          <ControlSlider
            id="reasoning-step"
            label="Highlighted step"
            min={0}
            max={Math.max(steps.length - 1, 0)}
            step={1}
            value={clampedStep}
            onChange={setStepIndex}
            description="Traverse the reasoning chain reinforced by verifiers."
          />
        </div>
      }
    >
      <div ref={containerRef} className="space-y-6 text-sm text-muted-foreground">
        <div className="rounded-2xl border border-border bg-card/70 p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase text-muted-foreground">Prompt</p>
          <p className="mt-1 text-foreground">{scenario.prompt}</p>
        </div>
        <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-4">
          <p className="text-xs font-semibold uppercase text-muted-foreground">Baseline attempt</p>
          <p className="mt-1 text-foreground">{scenario.baseline}</p>
        </div>
        <ol className="space-y-3">
          {steps.map((step, index) => {
            const isActive = index === clampedStep;
            return (
              <li
                key={index}
                className={`rounded-2xl border p-4 shadow-sm transition ${
                  isActive
                    ? 'border-primary bg-primary/10 text-foreground'
                    : 'border-border bg-card/70'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase text-muted-foreground">
                      Step {index + 1}
                    </p>
                    <p className="text-foreground">{step.thought}</p>
                  </div>
                  <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
                    {STATUS_TOKEN[step.status]}
                  </span>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">Verifier: {step.verifier}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </VisualizationContainer>
  );
}
