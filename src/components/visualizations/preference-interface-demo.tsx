'use client';

import { useMemo, useRef, useState } from 'react';

import { useAnalogy } from '@/lib/analogy-context';
import { VisualizationContainer } from '@/components/visualizations/visualization-container';

interface CompletionOption {
  id: 'A' | 'B';
  title: string;
  text: string;
  highlights: string[];
}

const OPTIONS: CompletionOption[] = [
  {
    id: 'A',
    title: 'Completion A',
    text: 'Sure thing! The refund is already processed. Feel free to keep the product and still enjoy the discount on your next order.',
    highlights: [
      'Guarantees an action that may violate policy.',
      'Friendly tone but skips safety checks.',
    ],
  },
  {
    id: 'B',
    title: 'Completion B',
    text: 'Thanks for reaching out. I can start a refund as soon as the item is returned in its original condition within 30 days. Would you like the return label emailed to you?',
    highlights: ['States policy accurately.', 'Offers a concrete next step while staying polite.'],
  },
];

export function PreferenceInterfaceDemo(): JSX.Element {
  const [selected, setSelected] = useState<'A' | 'B' | null>('B');
  const [notes, setNotes] = useState<string>('Clear explanation of policy, friendly tone.');
  const containerRef = useRef<HTMLDivElement>(null);
  const { activeAnalogy } = useAnalogy();

  const record = useMemo(
    () => ({
      prompt: 'Refund policy question from customer service queue',
      chosen: selected ?? 'A',
      rejected: selected === 'A' ? 'B' : 'A',
      annotator_notes: notes,
    }),
    [selected, notes]
  );

  return (
    <VisualizationContainer
      title="Preference annotation workstation"
      description="Simulate the pairwise interface described in Chapter 6. Pick the better completion and see how the dataset row is stored."
      ariaLabel="Interactive preference annotation example"
      activeAnalogy={activeAnalogy}
      visualRef={containerRef}
    >
      <div ref={containerRef} className="space-y-4 text-sm text-foreground">
        <div className="rounded-2xl border border-border bg-card/70 p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Prompt
          </p>
          <p className="mt-1 text-sm text-foreground">
            “Our customer wants to know how to request a refund on a headphone purchase delivered 10
            days ago. Draft a response that is helpful, polite, and policy compliant.”
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {OPTIONS.map((option) => {
            const isSelected = selected === option.id;
            return (
              <article
                key={option.id}
                className={`flex h-full flex-col gap-3 rounded-2xl border p-4 shadow-sm transition ${
                  isSelected
                    ? 'border-analogy-writing-500 bg-analogy-writing-50/60 dark:bg-analogy-writing-900/20'
                    : 'border-border bg-card/70'
                }`}
              >
                <header className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {option.title}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelected(option.id)}
                    className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-foreground transition hover:border-foreground/50 hover:bg-accent"
                  >
                    {isSelected ? 'Selected' : 'Select'}
                  </button>
                </header>
                <p className="text-sm leading-relaxed text-foreground">{option.text}</p>
                <ul className="mt-auto space-y-2 text-xs text-muted-foreground">
                  {option.highlights.map((highlight) => (
                    <li key={highlight} className="flex items-start gap-2">
                      <span aria-hidden="true">•</span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
        <div className="rounded-xl border border-dashed border-border bg-muted/40 p-4 text-xs text-muted-foreground">
          <label className="block text-xs font-semibold text-foreground" htmlFor="annotator-notes">
            Annotator notes
          </label>
          <textarea
            id="annotator-notes"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            rows={3}
            className="mt-2 w-full rounded-lg border border-border bg-background p-2 text-sm"
          />
          <p className="mt-3 text-xs text-muted-foreground">
            Chapter 6 recommends capturing rationale to identify biases and triage disagreements
            across annotators.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Logged comparison row
          </p>
          <pre className="mt-2 overflow-x-auto rounded-2xl border border-border bg-card/70 p-4 text-xs text-muted-foreground">
            {JSON.stringify(record, null, 2)}
          </pre>
        </div>
      </div>
    </VisualizationContainer>
  );
}
