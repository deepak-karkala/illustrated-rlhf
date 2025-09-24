'use client';

import katex from 'katex';
import { useMemo } from 'react';

interface MathBlockProps {
  expression: string;
  inline?: boolean;
}

export function MathBlock({ expression, inline = false }: MathBlockProps): JSX.Element {
  const rendered = useMemo(
    () =>
      katex.renderToString(expression, {
        displayMode: !inline,
        throwOnError: false,
        strict: false,
      }),
    [expression, inline]
  );

  return (
    <span
      className={inline ? '' : 'block overflow-x-auto py-2'}
      dangerouslySetInnerHTML={{ __html: rendered }}
    />
  );
}
