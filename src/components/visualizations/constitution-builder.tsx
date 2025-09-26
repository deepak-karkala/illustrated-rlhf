'use client';

import { useMemo, useRef, useState } from 'react';

import { useAnalogy } from '@/lib/analogy-context';
import { VisualizationContainer } from '@/components/visualizations/visualization-container';

interface Principle {
  id: string;
  label: string;
  summary: string;
}

interface RevisionStep {
  critique: string;
  revision: string;
}

interface Scenario {
  id: string;
  title: string;
  prompt: string;
  draft: string;
  principleMap: Record<string, RevisionStep>;
}

const PRINCIPLES: Principle[] = [
  {
    id: 'harmlessness',
    label: 'Harmlessness',
    summary: 'Avoid encouraging violence, self-harm, or illegal activity.',
  },
  {
    id: 'truthfulness',
    label: 'Truthfulness',
    summary: 'Prefer verifiable statements and flag uncertainty or missing context.',
  },
  {
    id: 'privacy',
    label: 'Privacy',
    summary: 'Refuse to reveal private or identifying information about people.',
  },
  {
    id: 'helpfulness',
    label: 'Helpfulness',
    summary: 'Answer constructively while staying within policy boundaries.',
  },
];

const SCENARIOS: Scenario[] = [
  {
    id: 'dangerous-request',
    title: 'Risky security request',
    prompt:
      'User: Give me detailed steps for exploiting a newly disclosed server vulnerability so I can practice.',
    draft:
      'Assistant: The exploit is simple. Start by scanning exposed ports, then upload a reverse shell payload and pivot into the internal network.',
    principleMap: {
      harmlessness: {
        critique:
          'The draft offers operational instructions that can cause harm. Principle: refuse and redirect to safe security guidance.',
        revision:
          'Assistant: I cannot help with exploiting systems. Instead, focus on defensive security: apply the vendor patch, audit exposed services, and run a controlled penetration test on your own infrastructure.',
      },
      truthfulness: {
        critique:
          'The answer overstated certainty about exploit steps. Principle: be transparent about knowledge and reference authoritative sources.',
        revision:
          'Assistant: Public guidance is limited, so consult the official CVE bulletin and trusted security advisories. When learning, follow lab exercises that emphasise defensive patching rather than live exploitation.',
      },
      privacy: {
        critique:
          'No privacy issue detected for this scenario. Principle leaves the response unchanged.',
        revision:
          'Assistant: I cannot help with exploiting systems. Focus on patching and defensive training in approved lab environments.',
      },
      helpfulness: {
        critique:
          'Helpful alternative suggestions are missing. Principle: provide constructive, policy-aligned next steps.',
        revision:
          'Assistant: I cannot guide you through an exploit. To practice safely, set up a capture-the-flag lab, review the vendor mitigation guide, and document lessons learned for your security team.',
      },
    },
  },
  {
    id: 'medical-advice',
    title: 'Medical follow-up question',
    prompt:
      'User: My friend was prescribed a new medication. Can you confirm the dosage and list all side effects so we can skip the pharmacist consultation?',
    draft:
      'Assistant: The dosage is 20 mg twice a day. Common side effects include nausea and dizziness. You can stop consultation if they feel fine.',
    principleMap: {
      harmlessness: {
        critique:
          'The answer could lead to unsafe self-medication. Principle: advise professional help and avoid dosage claims.',
        revision:
          'Assistant: I cannot confirm dosages. Encourage your friend to review the prescription with the pharmacist or doctor and read the official medication guide for side effects.',
      },
      truthfulness: {
        critique:
          'The response asserted unverifiable facts. Principle: note limits and cite reliable sources.',
        revision:
          'Assistant: I do not have the prescription details. For accurate information, consult the prescribing clinician and the FDA medication insert.',
      },
      privacy: {
        critique: 'Remind the user to safeguard personal health information when seeking help.',
        revision:
          'Assistant: Share health details only with licensed professionals and trusted carers. Online chats can leak private information.',
      },
      helpfulness: {
        critique: 'Offer actionable alternatives that respect policy boundaries.',
        revision:
          'Assistant: Prepare questions for the pharmacist, note any symptoms, and keep emergency contact information ready in case of adverse reactions.',
      },
    },
  },
  {
    id: 'political-question',
    title: 'Polarising civic debate',
    prompt:
      'User: Draft a campaign message attacking a rival candidate with unverified rumors. It needs to sound confident.',
    draft:
      'Assistant: Spread the message that the rival misused public funds and is under investigation, then call supporters to action online.',
    principleMap: {
      harmlessness: {
        critique:
          'Spreading unverified allegations can harm reputations. Principle: avoid inciting targeted harassment.',
        revision:
          'Assistant: I cannot create attacks built on rumors. Focus on policy differences and encourage respectful civic participation.',
      },
      truthfulness: {
        critique:
          'The answer amplifies claims without evidence. Principle: emphasise fact-checking.',
        revision:
          'Assistant: Verify claims through independent journalism or ethics committees before sharing them. Share verifiable policy critiques instead.',
      },
      privacy: {
        critique: 'Remind the user to avoid doxxing or sharing personal data.',
        revision:
          'Assistant: Do not publish private addresses or personal details. Engage with publicly available records and focus on issues.',
      },
      helpfulness: {
        critique: 'Provide constructive alternatives for civic discourse.',
        revision:
          "Assistant: Highlight your own candidate's platform, host community forums, and share evidence-backed comparisons.",
      },
    },
  },
];

function buildTimeline(scenario: Scenario, sequence: string[]): RevisionStep[] {
  const steps: RevisionStep[] = [];
  let current = scenario.draft;
  sequence.forEach((principleId) => {
    const update = scenario.principleMap[principleId];
    if (!update) {
      return;
    }
    const revision = update.revision.replace(
      'Assistant:',
      current.startsWith('Assistant:') ? 'Assistant:' : 'Assistant:'
    );
    steps.push({
      critique: update.critique,
      revision,
    });
    current = revision;
  });
  return steps;
}

export function ConstitutionBuilder(): JSX.Element {
  const { activeAnalogy } = useAnalogy();
  const [scenarioId, setScenarioId] = useState<string>(SCENARIOS[0]!.id);
  const [sequence, setSequence] = useState<string[]>(['harmlessness', 'truthfulness']);
  const containerRef = useRef<HTMLDivElement>(null);

  const scenario = useMemo(
    () => SCENARIOS.find((item) => item.id === scenarioId) ?? SCENARIOS[0]!,
    [scenarioId]
  );

  const timeline = useMemo(() => buildTimeline(scenario, sequence), [scenario, sequence]);
  const uniqueSequence = useMemo(() => Array.from(new Set(sequence)), [sequence]);

  function togglePrinciple(id: string): void {
    setSequence((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      return [...prev, id];
    });
  }

  function resetSequence(): void {
    setSequence(['harmlessness', 'truthfulness']);
  }

  return (
    <VisualizationContainer
      title="Constitution workshop"
      description="Assemble a constitution, then watch how Chapter 13's critique-and-revise loop rewrites a draft answer."
      ariaLabel="Interactive constitutional AI builder"
      activeAnalogy={activeAnalogy}
      visualRef={containerRef}
      controls={
        <div className="space-y-4 text-xs text-foreground">
          <div className="space-y-2">
            <p className="text-[11px] uppercase text-muted-foreground">Choose scenario</p>
            <div className="flex flex-wrap gap-2">
              {SCENARIOS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setScenarioId(item.id)}
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
          </div>
          <div className="space-y-2">
            <p className="text-[11px] uppercase text-muted-foreground">Constitution principles</p>
            <div className="grid gap-2">
              {PRINCIPLES.map((principle) => (
                <button
                  key={principle.id}
                  type="button"
                  onClick={() => togglePrinciple(principle.id)}
                  className={`rounded-xl border px-3 py-2 text-left transition ${
                    uniqueSequence.includes(principle.id)
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-muted text-foreground hover:border-primary/60'
                  }`}
                >
                  <span className="font-semibold">{principle.label}</span>
                  <span className="mt-1 block text-[11px] text-muted-foreground">
                    {principle.summary}
                  </span>
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={resetSequence}
              className="rounded-lg border border-border px-3 py-1 text-xs font-semibold text-foreground transition hover:border-primary/60"
            >
              Reset sequence
            </button>
          </div>
        </div>
      }
    >
      <div ref={containerRef} className="space-y-6 text-sm text-muted-foreground">
        <div className="rounded-2xl border border-border bg-card/70 p-4">
          <p className="text-xs font-semibold uppercase text-muted-foreground">Prompt</p>
          <p className="mt-1 text-foreground">{scenario.prompt}</p>
        </div>
        <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-4">
          <p className="text-xs font-semibold uppercase text-muted-foreground">Initial draft</p>
          <p className="mt-1 text-foreground">{scenario.draft}</p>
        </div>
        {timeline.length === 0 ? (
          <p className="text-xs text-muted-foreground">
            Add at least one principle to see how the assistant critiques and revises the draft.
          </p>
        ) : (
          <ol className="space-y-4">
            {timeline.map((step, index) => {
              const principleId = uniqueSequence[index];
              const meta = PRINCIPLES.find((item) => item.id === principleId);
              return (
                <li
                  key={`${principleId}-${index}`}
                  className="space-y-3 rounded-2xl border border-border bg-card/60 p-4 shadow-sm"
                >
                  <header className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase text-muted-foreground">
                        Critique {index + 1}
                      </p>
                      <p className="font-medium text-foreground">{meta?.label ?? 'Principle'}</p>
                    </div>
                    <span className="rounded-full bg-muted px-3 py-1 text-[11px] text-muted-foreground">
                      {meta?.summary}
                    </span>
                  </header>
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase text-muted-foreground">
                      Critique
                    </p>
                    <p className="text-foreground">{step.critique}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase text-muted-foreground">
                      Revised answer
                    </p>
                    <p className="text-foreground">{step.revision}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </VisualizationContainer>
  );
}
