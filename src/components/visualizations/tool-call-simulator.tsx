'use client';

import { useMemo, useRef, useState } from 'react';

import { useAnalogy } from '@/lib/analogy-context';
import { VisualizationContainer } from '@/components/visualizations/visualization-container';

interface ToolMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
  name?: string;
}

interface ToolScenario {
  id: string;
  title: string;
  description: string;
  messages: ToolMessage[];
}

const SCENARIOS: ToolScenario[] = [
  {
    id: 'weather-json',
    title: 'Weather API (JSON)',
    description:
      'Chapter 15 highlights JSON schemas for weather lookups. The model emits a function_call payload which the server executes.',
    messages: [
      {
        role: 'system',
        content:
          'You are a weather assistant. Available tool: get_weather(city: string, units: string). Always respond with JSON.',
      },
      {
        role: 'user',
        content: 'Where should I visit in Lisbon this weekend? Give weather and a suggestion.',
      },
      {
        role: 'assistant',
        content: '{"tool_call": "get_weather", "arguments": {"city": "Lisbon", "units": "metric"}}',
      },
      {
        role: 'tool',
        name: 'get_weather',
        content: '{"city": "Lisbon", "forecast": "22C, sunny", "advisory": "Light breeze"}',
      },
      {
        role: 'assistant',
        content:
          'The forecast for Lisbon is 22C and sunny with a light breeze. Consider visiting the Belem waterfront for outdoor cafes.',
      },
    ],
  },
  {
    id: 'python-runner',
    title: 'Python sandbox',
    description:
      'Similar to execution sandboxes described in Chapter 15, the assistant emits Python code which is executed server-side.',
    messages: [
      {
        role: 'system',
        content:
          'You can run code with python_exec(code: string). Do not fabricate outputs; wait for the tool result.',
      },
      {
        role: 'user',
        content: 'Write code that returns the first 5 Fibonacci numbers.',
      },
      {
        role: 'assistant',
        content:
          'python_exec({"code": "def fib(n):\\n    seq=[0,1]\\n    for _ in range(n-2):\\n        seq.append(seq[-1]+seq[-2])\\n    return seq[:n]\\nprint(fib(5))"})',
      },
      {
        role: 'tool',
        name: 'python_exec',
        content: '[0, 1, 1, 2, 3]',
      },
      {
        role: 'assistant',
        content: 'The first five Fibonacci numbers are 0, 1, 1, 2, and 3.',
      },
    ],
  },
  {
    id: 'mcp-workflow',
    title: 'MCP resource lookup',
    description:
      'Chapter 15 introduces Model Context Protocol. Here the model requests a resource then formulates an answer.',
    messages: [
      {
        role: 'system',
        content:
          'You can fetch resources via mcp.get_resource(name: string). Use it to gather documentation before answering.',
      },
      {
        role: 'user',
        content: 'Summarise the supported fields in our support_ticket resource.',
      },
      {
        role: 'assistant',
        content: '{"tool_call": "mcp.get_resource", "arguments": {"name": "support_ticket"}}',
      },
      {
        role: 'tool',
        name: 'mcp.get_resource',
        content: '{"fields": ["id", "priority", "status", "owner", "updated_at"]}',
      },
      {
        role: 'assistant',
        content:
          'The support_ticket resource exposes id, priority, status, owner, and updated_at. Use priority and status to triage before assigning an owner.',
      },
    ],
  },
];

export function ToolCallSimulator(): JSX.Element {
  const { activeAnalogy } = useAnalogy();
  const [scenarioId, setScenarioId] = useState<string>(SCENARIOS[0]!.id);
  const containerRef = useRef<HTMLDivElement>(null);

  const scenario = useMemo(
    () => SCENARIOS.find((item) => item.id === scenarioId) ?? SCENARIOS[0]!,
    [scenarioId]
  );

  return (
    <VisualizationContainer
      title="Tool call simulator"
      description="Inspect sample tool-calling transcripts from Chapter 15 (JSON, Python execution, MCP)."
      ariaLabel="Tool call simulator"
      activeAnalogy={activeAnalogy}
      visualRef={containerRef}
      controls={
        <div className="flex flex-wrap gap-2 text-xs text-foreground">
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
      }
    >
      <div ref={containerRef} className="space-y-4 text-sm text-muted-foreground">
        <p className="rounded-2xl border border-border bg-card/70 p-4 shadow-sm">
          {scenario.description}
        </p>
        <div className="space-y-3 rounded-2xl border border-border bg-card/50 p-4 shadow-sm">
          {scenario.messages.map((message, index) => (
            <div
              key={index}
              className={`rounded-xl border p-3 ${
                message.role === 'tool'
                  ? 'border-accent bg-muted/50'
                  : 'border-border bg-background'
              }`}
            >
              <p className="text-xs font-semibold uppercase text-muted-foreground">
                {message.role}
                {message.name ? `  -  ${message.name}` : ''}
              </p>
              <pre className="mt-1 whitespace-pre-wrap font-mono text-[13px] text-foreground">
                {message.content}
              </pre>
            </div>
          ))}
        </div>
      </div>
    </VisualizationContainer>
  );
}
