'use client';

import { useMemo, useRef, useState } from 'react';

import { useAnalogy } from '@/lib/analogy-context';
import { VisualizationContainer } from '@/components/visualizations/visualization-container';

interface WorkflowStep {
  id: string;
  label: string;
  description: string;
}

interface WorkflowTemplate {
  id: string;
  title: string;
  summary: string;
  steps: WorkflowStep[];
}

const TEMPLATES: WorkflowTemplate[] = [
  {
    id: 'support-agent',
    title: 'Support agent triage',
    summary: 'Fetch ticket context, call policy lookup tool, draft reply for review.',
    steps: [
      {
        id: 'resource',
        label: 'mcp.get_resource("support_ticket")',
        description: 'Load ticket fields and current status.',
      },
      {
        id: 'tool',
        label: 'lookup_policy',
        description: 'Retrieve escalation policy based on priority.',
      },
      {
        id: 'prompt',
        label: 'compose_reply',
        description: 'Draft summary + action plan for the agent.',
      },
    ],
  },
  {
    id: 'research_agent',
    title: 'Research assistant',
    summary: 'Search docs, scrape highlights, and build outline.',
    steps: [
      { id: 'tool', label: 'web.search', description: 'Search trusted sources with the query.' },
      { id: 'tool', label: 'web.scrape', description: 'Extract key facts for each URL.' },
      {
        id: 'prompt',
        label: 'outline_report',
        description: 'Organise highlights into a structured outline.',
      },
    ],
  },
  {
    id: 'data_pipeline',
    title: 'Data pipeline auditor',
    summary: 'Inspect metrics, run SQL check, and file anomaly report.',
    steps: [
      {
        id: 'tool',
        label: 'metrics.get_timeseries',
        description: 'Pull last 7 days of pipeline KPIs.',
      },
      { id: 'tool', label: 'sql.run_query', description: 'Run validation query for missing rows.' },
      {
        id: 'prompt',
        label: 'summarise_anomaly',
        description: 'Write summary with recommended fix and notify channel.',
      },
    ],
  },
];

export function ToolWorkflowDesigner(): JSX.Element {
  const { activeAnalogy } = useAnalogy();
  const [templateId, setTemplateId] = useState<string>(TEMPLATES[0]!.id);
  const containerRef = useRef<HTMLDivElement>(null);

  const template = useMemo(
    () => TEMPLATES.find((item) => item.id === templateId) ?? TEMPLATES[0]!,
    [templateId]
  );

  return (
    <VisualizationContainer
      title="Tool orchestration planner"
      description="Compose Model Context Protocol style workflows with resources, prompts, and tools."
      ariaLabel="Tool orchestration planner"
      activeAnalogy={activeAnalogy}
      visualRef={containerRef}
      controls={
        <div className="flex flex-wrap gap-2 text-xs text-foreground">
          {TEMPLATES.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTemplateId(item.id)}
              className={`rounded-full border px-3 py-1 font-medium transition ${
                templateId === item.id
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
          {template.summary}
        </p>
        <ol className="space-y-3">
          {template.steps.map((step, index) => (
            <li key={step.id} className="rounded-2xl border border-border bg-card/60 p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <p className="text-xs font-semibold uppercase text-muted-foreground">
                  Step {index + 1}
                </p>
                <span className="rounded-full bg-muted px-3 py-1 text-[11px] text-muted-foreground">
                  {step.id.toUpperCase()}
                </span>
              </div>
              <pre className="mt-2 whitespace-pre-wrap font-mono text-[13px] text-foreground">
                {step.label}
              </pre>
              <p className="mt-2 text-xs text-muted-foreground">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </VisualizationContainer>
  );
}
