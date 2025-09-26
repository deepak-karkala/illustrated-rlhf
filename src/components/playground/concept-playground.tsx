'use client';

import { useCallback, useMemo, useState } from 'react';

import {
  DpoBetaPlayground,
  type DpoSnapshot,
} from '@/components/visualizations/dpo-beta-playground';
import {
  PpoTrainingPlayground,
  type PpoSnapshot,
} from '@/components/visualizations/ppo-training-playground';
import {
  RejectionSamplingPlayground,
  type RejectionSamplingSnapshot,
} from '@/components/visualizations/rejection-sampling-playground';

const SCENARIO_ORDER = ['rejection-sampling', 'ppo', 'dpo'] as const;

type ScenarioKey = (typeof SCENARIO_ORDER)[number];

type RawSnapshotMap = {
  'rejection-sampling': RejectionSamplingSnapshot;
  ppo: PpoSnapshot;
  dpo: DpoSnapshot;
};

interface ScenarioMeta {
  id: ScenarioKey;
  label: string;
  chapter: string;
  summary: string;
  objectives: string[];
  experimentSteps: string[];
  expectedSignals: string[];
}

interface PlaygroundSnapshot {
  scenario: ScenarioKey;
  label: string;
  metrics: Record<string, number>;
  parameters: Record<string, number | string>;
  annotations: string;
}

interface SessionEntry extends PlaygroundSnapshot {
  timestamp: number;
}

const SCENARIOS: Record<ScenarioKey, ScenarioMeta> = {
  'rejection-sampling': {
    id: 'rejection-sampling',
    label: 'Rejection Sampling Baseline',
    chapter: 'Chapter 10',
    summary:
      'Sample -> score -> select pipeline highlighted in Chapter 10. Track how dataset quality and compute budget interact when filtering completions.',
    objectives: [
      'Compare per-prompt vs. global Top-K filtering for diversity versus reward.',
      'Observe how completions-per-prompt budgets shape the filtered dataset quality.',
      'Connect temperature control to reward variance and selection outcomes.',
    ],
    experimentSteps: [
      'Start with 6 completions per prompt, Top-K = 1, and per-prompt selection (baseline recommended in Chapter 10.1).',
      'Increase completions to 14 while keeping Top-K = 1 to see quality gains versus added inference cost.',
      'Switch to global selection to mimic Best-of-N and note the reward lift alongside reduced diversity.',
    ],
    expectedSignals: [
      'Mean reward climbs as completions-per-prompt increases, but selected count grows slowly.',
      'Per-prompt selection keeps a higher diversity index than global Top-K.',
      'High temperatures (>0.9) widen reward variance and can push lower average reward despite more exploration.',
    ],
  },
  ppo: {
    id: 'ppo',
    label: 'PPO Policy Update',
    chapter: 'Chapter 11',
    summary:
      'Inspect clipped versus unclipped policy ratios from Chapter 11 and how learning rate, clipping range, and KL penalty stabilise updates.',
    objectives: [
      'Link larger learning rates to overshooting policy ratios before clipping.',
      'Watch KL penalties rein in the ratio trajectory toward 1.0.',
      'Tune the clip range epsilon to balance improvement and stability.',
    ],
    experimentSteps: [
      'Begin with learning rate 0.08, clip epsilon = 0.2, and beta = 0.008 as the "safe" setting discussed in Chapter 11.',
      'Raise learning rate above 0.14 without changing epsilon to see unclipped ratios surge while clipped ratios stay bounded.',
      'Increase beta to 0.014 and observe how both curves converge toward 1.0, signalling stronger KL anchoring.',
    ],
    expectedSignals: [
      'High learning rates widen the gap between unclipped and clipped ratios.',
      'Larger beta values bring the clipped curve closer to 1.0 at the cost of slower policy shifts.',
      'Tight clip ranges (<0.12) flatten progress but keep the policy stable.',
    ],
  },
  dpo: {
    id: 'dpo',
    label: 'DPO Weighting',
    chapter: 'Chapter 12',
    summary:
      'Examine how beta and logit shifts control preference weights without a reward model, following the derivation in Chapter 12.',
    objectives: [
      'Understand how beta sharpens the gap between chosen and rejected samples.',
      'Experiment with margins to simulate cDPO-style safety buffers.',
      'Explore how policy logits drifting from the reference affects gradients.',
    ],
    experimentSteps: [
      'Set beta = 0.1 and logit shift = 0.6 to match the worked example in Chapter 12.',
      'Increase beta above 0.2 to emphasise the chosen sample and compare the weight ratio.',
      'Apply a positive margin (m = 0.2) to soften updates, then a negative margin to favour stronger rejections.',
    ],
    expectedSignals: [
      'Chosen weight approaches 0.8+ when beta is large and logit shift favours the chosen sample.',
      'Margins reduce both weights symmetrically, emulating safety slack.',
      'When logit shift approaches 0, weights converge, mirroring the reference policy.',
    ],
  },
};

const buildSnapshot: {
  [K in ScenarioKey]: (data: RawSnapshotMap[K]) => PlaygroundSnapshot;
} = {
  'rejection-sampling': (data: RejectionSamplingSnapshot) => {
    const diversityIndex =
      data.strategy === 'per-prompt'
        ? 1 - data.topK / Math.max(data.completionsPerPrompt, 1)
        : 1 - Math.min(1, (data.topK * data.selectedCount) / (data.completionsPerPrompt * 4));
    const annotations =
      data.strategy === 'per-prompt'
        ? 'Per-prompt filtering keeps each prompt represented, matching Chapter 10.1 guidance on diversity.'
        : 'Global Top-K mirrors Best-of-N; Chapter 10.2 warns it can drop coverage even as mean reward rises.';
    return {
      scenario: 'rejection-sampling',
      label: SCENARIOS['rejection-sampling'].label,
      metrics: {
        meanReward: Number(data.meanSelectedReward.toFixed(3)),
        diversityIndex: Number(diversityIndex.toFixed(3)),
      },
      parameters: {
        completionsPerPrompt: data.completionsPerPrompt,
        topK: data.topK,
        temperature: Number(data.temperature.toFixed(2)),
        strategy: data.strategy,
        selectedCount: data.selectedCount,
      },
      annotations,
    };
  },
  ppo: (data: PpoSnapshot) => {
    const ratioGap = Math.abs(data.finalUnclippedRatio - data.finalClippedRatio);
    const stability = 1 - Math.min(1, Math.abs(data.finalClippedRatio - 1));
    const annotations =
      ratioGap > 0.25
        ? 'Chapter 11 flags large unclipped gaps as a signal to tighten epsilon or raise beta.'
        : 'Balanced ratios indicate a stable update window consistent with Chapter 11 heuristics.';
    return {
      scenario: 'ppo',
      label: SCENARIOS.ppo.label,
      metrics: {
        clippedRatio: Number(data.finalClippedRatio.toFixed(3)),
        unclippedRatio: Number(data.finalUnclippedRatio.toFixed(3)),
        stability: Number(stability.toFixed(3)),
      },
      parameters: {
        learningRate: Number(data.learningRate.toFixed(3)),
        clip: Number(data.clip.toFixed(3)),
        klPenalty: Number(data.klPenalty.toFixed(4)),
      },
      annotations,
    };
  },
  dpo: (data: DpoSnapshot) => {
    const separation = data.chosenWeight - data.rejectedWeight;
    const annotations =
      separation > 0.35
        ? 'High separation echoes Chapter 12: gradients strongly favour chosen completions.'
        : 'Weights converge as beta shrinks or logits align with the reference, reducing gradient strength.';
    return {
      scenario: 'dpo',
      label: SCENARIOS.dpo.label,
      metrics: {
        chosenWeight: Number(data.chosenWeight.toFixed(3)),
        rejectedWeight: Number(data.rejectedWeight.toFixed(3)),
        separation: Number(separation.toFixed(3)),
      },
      parameters: {
        beta: Number(data.beta.toFixed(3)),
        margin: Number(data.margin.toFixed(3)),
        logitShift: Number(data.logitShift.toFixed(3)),
      },
      annotations,
    };
  },
};

function deriveComparisonScores(snapshot: PlaygroundSnapshot) {
  if (snapshot.scenario === 'rejection-sampling') {
    const quality = snapshot.metrics.meanReward ?? 0;
    const cost = ((snapshot.parameters.completionsPerPrompt as number) ?? 0) / 20;
    const stability = snapshot.metrics.diversityIndex ?? 0;
    return { quality, cost, stability };
  }
  if (snapshot.scenario === 'ppo') {
    const quality = snapshot.metrics.clippedRatio
      ? 1 - Math.abs(1 - snapshot.metrics.clippedRatio)
      : 0;
    const cost = ((snapshot.parameters.learningRate as number) ?? 0) / 0.2;
    const stability = snapshot.metrics.stability ?? 0;
    return { quality, cost, stability };
  }
  const quality = snapshot.metrics.chosenWeight ?? 0;
  const cost = ((snapshot.parameters.beta as number) ?? 0) / 0.4;
  const stability = 1 - Math.min(1, Math.abs((snapshot.parameters.margin as number) ?? 0));
  return { quality, cost, stability };
}

function formatPercent(value: number): string {
  const bounded = Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : 0;
  return `${(bounded * 100).toFixed(0)}%`;
}

function formatTimestamp(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function ConceptPlayground(): JSX.Element {
  const [activeScenario, setActiveScenario] = useState<ScenarioKey>('rejection-sampling');
  const [latestSnapshots, setLatestSnapshots] = useState<
    Partial<Record<ScenarioKey, PlaygroundSnapshot>>
  >({});
  const [sessionLog, setSessionLog] = useState<SessionEntry[]>([]);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleSnapshot = useCallback(
    <K extends ScenarioKey>(scenario: K, data: RawSnapshotMap[K]) => {
      const snapshot = buildSnapshot[scenario](data);
      setLatestSnapshots((prev) => ({ ...prev, [scenario]: snapshot }));
    },
    []
  );

  const recordRun = useCallback(() => {
    const snapshot = latestSnapshots[activeScenario];
    if (!snapshot) {
      setStatusMessage('Adjust the controls to generate a run before recording.');
      return;
    }
    setStatusMessage(null);
    setSessionLog((prev) => [...prev.slice(-11), { ...snapshot, timestamp: Date.now() }]);
  }, [activeScenario, latestSnapshots]);

  const exportCsv = useCallback(() => {
    if (sessionLog.length === 0) {
      setStatusMessage('No runs recorded yet.');
      return;
    }
    const header = 'timestamp,scenario,label,metric,value\n';
    const rows = sessionLog
      .flatMap((entry) => {
        const metricRows = Object.entries({ ...entry.metrics, ...entry.parameters }).map(
          ([metricKey, metricValue]) =>
            `${new Date(entry.timestamp).toISOString()},${entry.scenario},${entry.label},${metricKey},${metricValue}`
        );
        return metricRows.length > 0
          ? metricRows
          : [
              `${new Date(entry.timestamp).toISOString()},${entry.scenario},${entry.label},notes,"${entry.annotations}"`,
            ];
      })
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'concept-playground-session.csv';
    link.click();
    URL.revokeObjectURL(url);
    setStatusMessage('Exported current session as CSV.');
  }, [sessionLog]);

  const scenarioSummary = useMemo(() => {
    return SCENARIO_ORDER.map((scenario) => {
      const runs = sessionLog.filter((entry) => entry.scenario === scenario);
      if (runs.length === 0) {
        return {
          scenario,
          label: SCENARIOS[scenario].label,
          highlight: 'No runs recorded yet.',
          metrics: [],
        };
      }
      const metricNames = Object.keys(runs[0].metrics);
      const averages = metricNames.map((name) => {
        const values = runs
          .map((entry) => entry.metrics[name])
          .filter((value) => Number.isFinite(value));
        const avg = values.length
          ? values.reduce((acc, value) => acc + value, 0) / values.length
          : 0;
        return { name, avg };
      });
      const highlight = runs[runs.length - 1]?.annotations ?? '';
      return {
        scenario,
        label: SCENARIOS[scenario].label,
        highlight,
        metrics: averages,
      };
    });
  }, [sessionLog]);

  const activeMeta = SCENARIOS[activeScenario];
  const activeSnapshot = latestSnapshots[activeScenario];

  return (
    <section className="space-y-12">
      <div className="rounded-3xl border border-border bg-card/70 p-8 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary/80">
              Enhanced Features - {activeMeta.chapter}
            </p>
            <h1 className="text-3xl font-semibold text-foreground">Concept Playground</h1>
            <p className="text-base text-muted-foreground">
              Experiment with RLHF training strategies using the pre-built scenarios derived from
              Chapters 10–12 of the RLHF book. Adjust parameters, compare methods, and record runs
              for a lightweight session log.
            </p>
          </div>
          <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-4 text-sm text-muted-foreground lg:w-80">
            <p className="font-semibold text-foreground">How to use</p>
            <ol className="mt-2 list-decimal space-y-2 pl-5">
              <li>Select a scenario tab to load its interactive simulation.</li>
              <li>Follow the guided experiment steps and observe the expected signals.</li>
              <li>
                Click <span className="font-medium text-foreground">Record run</span> to log a
                configuration for later comparison.
              </li>
            </ol>
          </div>
        </div>
      </div>

      <nav className="flex flex-wrap gap-3">
        {SCENARIO_ORDER.map((scenario) => {
          const meta = SCENARIOS[scenario];
          const isActive = scenario === activeScenario;
          return (
            <button
              key={scenario}
              type="button"
              onClick={() => setActiveScenario(scenario)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                isActive
                  ? 'border-primary bg-primary text-primary-foreground shadow'
                  : 'border-border bg-muted text-foreground hover:border-primary/60'
              }`}
            >
              {meta.label}
            </button>
          );
        })}
      </nav>

      <div className="grid gap-8 lg:grid-cols-[320px,1fr]">
        <aside className="space-y-6 rounded-3xl border border-border bg-card/60 p-6 shadow-sm">
          <header className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary/70">
              {activeMeta.chapter}
            </p>
            <h2 className="text-xl font-semibold text-foreground">Guided experiment</h2>
            <p className="text-sm text-muted-foreground">{activeMeta.summary}</p>
          </header>

          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase text-muted-foreground">Objectives</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {activeMeta.objectives.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-primary" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase text-muted-foreground">Run these steps</p>
            <ol className="list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
              {activeMeta.experimentSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase text-muted-foreground">
              Expected signals
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {activeMeta.expectedSignals.map((signal) => (
                <li key={signal} className="flex gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-analogy-writing-500" aria-hidden />
                  <span>{signal}</span>
                </li>
              ))}
            </ul>
          </div>

          {activeSnapshot ? (
            <div className="space-y-3 rounded-2xl border border-dashed border-border bg-muted/30 p-4 text-sm text-muted-foreground">
              <p className="text-xs font-semibold uppercase text-muted-foreground">
                Latest reading
              </p>
              <ul className="space-y-1">
                {Object.entries(activeSnapshot.metrics).map(([metric, value]) => (
                  <li key={metric} className="flex items-center justify-between">
                    <span className="capitalize">{metric.replace(/([A-Z])/g, ' $1')}</span>
                    <span className="font-mono text-foreground">{value.toFixed(3)}</span>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-muted-foreground">{activeSnapshot.annotations}</p>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-4 text-sm text-muted-foreground">
              Interact with the controls to capture metrics for this scenario.
            </div>
          )}

          <button
            type="button"
            onClick={recordRun}
            className="w-full rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            Record run
          </button>
          {statusMessage && <p className="text-xs text-muted-foreground">{statusMessage}</p>}
        </aside>

        <div className="space-y-6">
          {activeScenario === 'rejection-sampling' ? (
            <RejectionSamplingPlayground
              onSnapshot={(data) => handleSnapshot('rejection-sampling', data)}
            />
          ) : null}
          {activeScenario === 'ppo' ? (
            <PpoTrainingPlayground onSnapshot={(data) => handleSnapshot('ppo', data)} />
          ) : null}
          {activeScenario === 'dpo' ? (
            <DpoBetaPlayground onSnapshot={(data) => handleSnapshot('dpo', data)} />
          ) : null}
        </div>
      </div>

      <div className="rounded-3xl border border-border bg-card/50 p-6 shadow-sm">
        <header className="flex flex-col gap-2 pb-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Method comparison snapshot</h2>
            <p className="text-sm text-muted-foreground">
              Side-by-side summary of the most recent reading for each method. Values are normalised
              to make quick trade-off checks across quality, cost, and stability.
            </p>
          </div>
        </header>
        <div className="overflow-x-auto">
          <table className="w-full table-fixed border-collapse text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="border-b border-border px-3 py-2">Method</th>
                <th className="border-b border-border px-3 py-2">Quality proxy</th>
                <th className="border-b border-border px-3 py-2">Cost proxy</th>
                <th className="border-b border-border px-3 py-2">Stability proxy</th>
                <th className="border-b border-border px-3 py-2">Last note</th>
              </tr>
            </thead>
            <tbody>
              {SCENARIO_ORDER.map((scenario) => {
                const snapshot = latestSnapshots[scenario];
                const scores = snapshot ? deriveComparisonScores(snapshot) : null;
                return (
                  <tr key={scenario} className="border-b border-border last:border-b-0">
                    <td className="px-3 py-3">
                      <div className="font-medium text-foreground">{SCENARIOS[scenario].label}</div>
                      <div className="text-xs text-muted-foreground">
                        {SCENARIOS[scenario].chapter}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-muted-foreground">
                      {scores ? formatPercent(scores.quality) : '—'}
                    </td>
                    <td className="px-3 py-3 text-muted-foreground">
                      {scores ? formatPercent(scores.cost) : '—'}
                    </td>
                    <td className="px-3 py-3 text-muted-foreground">
                      {scores ? formatPercent(scores.stability) : '—'}
                    </td>
                    <td className="px-3 py-3 text-xs text-muted-foreground">
                      {snapshot
                        ? snapshot.annotations
                        : 'Interact with the scenario to populate metrics.'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr,320px]">
        <div className="rounded-3xl border border-border bg-card/50 p-6 shadow-sm">
          <header className="flex items-center justify-between pb-4">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Session log</h2>
              <p className="text-sm text-muted-foreground">
                A lightweight record of the runs you captured this session (clears on refresh).
              </p>
            </div>
            <button
              type="button"
              onClick={exportCsv}
              className="rounded-full border border-border px-4 py-2 text-xs font-semibold text-foreground transition hover:border-primary/60"
            >
              Export CSV
            </button>
          </header>
          {sessionLog.length === 0 ? (
            <p className="text-sm text-muted-foreground">No runs captured yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-fixed border-collapse text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="border-b border-border px-3 py-2">Time</th>
                    <th className="border-b border-border px-3 py-2">Scenario</th>
                    <th className="border-b border-border px-3 py-2">Key metrics</th>
                    <th className="border-b border-border px-3 py-2">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {sessionLog
                    .slice()
                    .reverse()
                    .map((entry) => (
                      <tr
                        key={`${entry.timestamp}-${entry.scenario}`}
                        className="border-b border-border last:border-b-0"
                      >
                        <td className="px-3 py-3 font-mono text-xs text-muted-foreground">
                          {formatTimestamp(entry.timestamp)}
                        </td>
                        <td className="px-3 py-3">
                          <div className="font-medium text-foreground">{entry.label}</div>
                          <div className="text-xs text-muted-foreground">
                            {entry.parameters.strategy ?? ''}
                          </div>
                        </td>
                        <td className="px-3 py-3 text-xs text-muted-foreground">
                          {Object.entries(entry.metrics)
                            .map(([name, value]) => `${name}: ${value.toFixed(3)}`)
                            .join(' | ')}
                        </td>
                        <td className="px-3 py-3 text-xs text-muted-foreground">
                          {entry.annotations}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div className="rounded-3xl border border-border bg-card/40 p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-foreground">Performance summary</h2>
          <p className="text-sm text-muted-foreground">
            Aggregated signals from this session, per scenario. Use it as a quick retrospective
            before you move on.
          </p>
          <div className="mt-4 space-y-4">
            {scenarioSummary.map((summary) => (
              <div
                key={summary.scenario}
                className="rounded-2xl border border-border/80 bg-muted/30 p-4"
              >
                <p className="text-sm font-semibold text-foreground">{summary.label}</p>
                <p className="text-xs text-muted-foreground">{summary.highlight}</p>
                {summary.metrics.length > 0 && (
                  <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                    {summary.metrics.map((metric) => (
                      <li key={metric.name} className="flex justify-between">
                        <span className="capitalize">{metric.name.replace(/([A-Z])/g, ' $1')}</span>
                        <span className="font-mono text-foreground">{metric.avg.toFixed(3)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
