'use client';

import { ChangeEvent, useMemo, useRef, useState } from 'react';

import { useAnalogy } from '@/lib/analogy-context';
import { VisualizationContainer } from '@/components/visualizations/visualization-container';

type TemplateVariant = 'llama' | 'openai';

const VARIANT_OPTIONS: Array<{ id: TemplateVariant; label: string; description: string }> = [
  {
    id: 'llama',
    label: 'LLaMA / Alpaca style',
    description: 'Use [INST] ... [/INST] blocks with BOS/EOS tokens.',
  },
  {
    id: 'openai',
    label: 'OpenAI / ChatML style',
    description: 'Use <|im_start|>role ... markers like in Chapter 9.',
  },
];

function buildTemplate(
  variant: TemplateVariant,
  systemMessage: string,
  userMessage: string,
  assistantMessage: string,
  secondUserMessage: string
): string {
  if (variant === 'openai') {
    const parts = [
      `<|im_start|>system\n${systemMessage.trim()}<|im_end|>`,
      `<|im_start|>user\n${userMessage.trim()}<|im_end|>`,
      `<|im_start|>assistant\n${assistantMessage.trim()}<|im_end|>`,
    ];
    if (secondUserMessage.trim()) {
      parts.push(`<|im_start|>user\n${secondUserMessage.trim()}<|im_end|>`);
      parts.push('<|im_start|>assistant\n');
    }
    return parts.join('\n');
  }

  const base = `<<SYS>>\n${systemMessage.trim()}\n<</SYS>>\n\n`; // LLaMA 3 style
  const firstTurn = `[INST] ${userMessage.trim()} [/INST] ${assistantMessage.trim()}`;
  if (!secondUserMessage.trim()) {
    return base + firstTurn;
  }
  const followUp = `\n[INST] ${secondUserMessage.trim()} [/INST]`;
  return base + firstTurn + followUp;
}

export function ChatTemplateBuilder(): JSX.Element {
  const { activeAnalogy } = useAnalogy();
  const containerRef = useRef<HTMLDivElement>(null);
  const [variant, setVariant] = useState<TemplateVariant>('openai');
  const [systemMessage, setSystemMessage] = useState<string>('You are a helpful assistant.');
  const [userMessage, setUserMessage] = useState<string>('Summarise the key points of RLHF.');
  const [assistantMessage, setAssistantMessage] = useState<string>(
    'RLHF combines instruction tuning, preference data, and policy optimisation to align models.'
  );
  const [secondUserMessage, setSecondUserMessage] = useState<string>(
    'Can you add a safety caveat?'
  );

  const preview = useMemo(
    () =>
      buildTemplate(variant, systemMessage, userMessage, assistantMessage, secondUserMessage)
        .trim()
        .replace(/\n{3,}/g, '\n\n'),
    [variant, systemMessage, userMessage, assistantMessage, secondUserMessage]
  );

  function handleVariantChange(event: ChangeEvent<HTMLSelectElement>): void {
    setVariant(event.target.value as TemplateVariant);
  }

  return (
    <VisualizationContainer
      title="Chat template builder"
      description="Adjust the system prompt and message turns to see how datasets are serialised before instruction tuning, as outlined in Chapter 9."
      ariaLabel="Interactive chat template builder"
      activeAnalogy={activeAnalogy}
      visualRef={containerRef}
    >
      <div ref={containerRef} className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="space-y-4 rounded-2xl border border-border bg-card/70 p-4 shadow-sm text-sm text-foreground">
          <label className="block text-xs font-semibold text-muted-foreground" htmlFor="variant">
            Template
          </label>
          <select
            id="variant"
            value={variant}
            onChange={handleVariantChange}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          >
            {VARIANT_OPTIONS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-muted-foreground">
            {VARIANT_OPTIONS.find((option) => option.id === variant)?.description}
          </p>

          <div className="space-y-3">
            <label
              className="block text-xs font-semibold text-muted-foreground"
              htmlFor="system-message"
            >
              System message
            </label>
            <textarea
              id="system-message"
              value={systemMessage}
              onChange={(event) => setSystemMessage(event.target.value)}
              rows={3}
              className="w-full rounded-lg border border-border bg-background p-2 text-sm"
            />

            <label
              className="block text-xs font-semibold text-muted-foreground"
              htmlFor="user-message"
            >
              User prompt (turn 1)
            </label>
            <textarea
              id="user-message"
              value={userMessage}
              onChange={(event) => setUserMessage(event.target.value)}
              rows={3}
              className="w-full rounded-lg border border-border bg-background p-2 text-sm"
            />

            <label
              className="block text-xs font-semibold text-muted-foreground"
              htmlFor="assistant-message"
            >
              Assistant response (turn 1)
            </label>
            <textarea
              id="assistant-message"
              value={assistantMessage}
              onChange={(event) => setAssistantMessage(event.target.value)}
              rows={3}
              className="w-full rounded-lg border border-border bg-background p-2 text-sm"
            />

            <label
              className="block text-xs font-semibold text-muted-foreground"
              htmlFor="user-message-2"
            >
              Optional user follow-up (turn 2)
            </label>
            <textarea
              id="user-message-2"
              value={secondUserMessage}
              onChange={(event) => setSecondUserMessage(event.target.value)}
              rows={2}
              className="w-full rounded-lg border border-border bg-background p-2 text-sm"
            />
          </div>
        </div>

        <div className="space-y-4">
          <article className="rounded-2xl border border-border bg-card/70 p-4 shadow-sm text-xs text-muted-foreground">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Serialised conversation
            </p>
            <pre className="mt-2 max-h-80 overflow-auto whitespace-pre-wrap text-xs text-foreground">
              {preview}
            </pre>
          </article>
          <div className="rounded-xl border border-dashed border-border bg-muted/40 p-4 text-xs text-muted-foreground">
            <p className="font-semibold text-foreground">Why it matters</p>
            <p className="mt-1">
              Chapter 9 emphasises consistent templates so token masking and preference data align.
              Use this builder to double-check BOS/EOS markers and alternating roles before writing
              dataset converters.
            </p>
          </div>
        </div>
      </div>
    </VisualizationContainer>
  );
}
