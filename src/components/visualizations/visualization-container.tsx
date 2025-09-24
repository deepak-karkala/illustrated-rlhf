'use client';

import { toPng } from 'html-to-image';
import { useCallback, useState } from 'react';

import type { AnalogyType } from '@/lib/types';
import { cn } from '@/lib/utils';

interface VisualizationContainerProps {
  title: string;
  description: string;
  ariaLabel: string;
  visualRef: React.RefObject<HTMLDivElement>;
  children: React.ReactNode;
  controls?: React.ReactNode;
  activeAnalogy?: AnalogyType;
}

export function VisualizationContainer({
  title,
  description,
  ariaLabel,
  visualRef,
  children,
  controls,
  activeAnalogy,
}: VisualizationContainerProps): JSX.Element {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPng = useCallback(async () => {
    const node = visualRef.current;
    if (!node) return;
    try {
      setIsExporting(true);
      const dataUrl = await toPng(node, { cacheBust: true, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.error('Failed to export visualization', error);
      }
    } finally {
      setIsExporting(false);
    }
  }, [title, visualRef]);

  const handleExportSvg = useCallback(() => {
    const node = visualRef.current;
    if (!node) return;
    const svg = node.querySelector('svg');
    if (!svg) return;
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svg);
    const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.svg`;
    link.click();
    URL.revokeObjectURL(url);
  }, [title, visualRef]);

  return (
    <section className="space-y-4">
      <header className="space-y-2">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </header>
      <div className="flex flex-col gap-4 rounded-3xl border border-border bg-card/60 p-4 shadow-sm lg:flex-row">
        {controls ? (
          <div className="lg:w-64">
            <h4 className="text-sm font-semibold text-foreground">Parameters</h4>
            <div className="mt-3 space-y-3 text-sm text-muted-foreground">{controls}</div>
          </div>
        ) : null}
        <div className="flex-1 space-y-3">
          <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
            <span>Interactive visualization</span>
            <div className="flex items-center gap-2">
              {activeAnalogy ? (
                <span className="hidden rounded-full bg-muted px-2 py-1 text-[11px] font-medium text-foreground md:inline">
                  Analogy: {activeAnalogy}
                </span>
              ) : null}
              <button
                type="button"
                onClick={handleExportSvg}
                className="rounded-full border border-border px-3 py-1 font-medium transition hover:border-foreground/50 hover:bg-accent"
              >
                Export SVG
              </button>
              <button
                type="button"
                onClick={handleExportPng}
                disabled={isExporting}
                className={cn(
                  'rounded-full border border-border px-3 py-1 font-medium transition hover:border-foreground/50 hover:bg-accent',
                  isExporting && 'opacity-60'
                )}
              >
                {isExporting ? 'Exporting…' : 'Export PNG'}
              </button>
            </div>
          </div>
          <div
            ref={visualRef}
            role="img"
            aria-label={ariaLabel}
            className="relative overflow-hidden rounded-2xl border border-border bg-background p-4"
          >
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
