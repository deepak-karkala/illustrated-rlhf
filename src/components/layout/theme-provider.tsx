'use client';

import type { ThemeProviderProps } from 'next-themes/dist/types';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

export function ThemeProvider({ children, ...props }: ThemeProviderProps): JSX.Element {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem {...props}>
      {children}
    </NextThemesProvider>
  );
}
