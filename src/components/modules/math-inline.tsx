'use client';

import katex from 'katex';
import { useMemo } from 'react';

interface MathInlineProps {
  expression: string;
}

export function MathInline({ expression }: MathInlineProps): JSX.Element {
  const rendered = useMemo(
    () =>
      katex.renderToString(expression, {
        displayMode: false,
        throwOnError: false,
        strict: false,
      }),
    [expression]
  );

  return <span dangerouslySetInnerHTML={{ __html: rendered }} />;
}
