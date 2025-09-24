'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

import { Button } from './button';

export function ThemeToggle(): JSX.Element {
  const { setTheme, theme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <Button aria-label="Toggle theme" variant="ghost" size="icon" disabled>
        <Sun className="h-5 w-5" aria-hidden="true" />
      </Button>
    );
  }

  const isDark = theme === 'dark';

  return (
    <Button
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
    >
      {isDark ? (
        <Sun className="h-5 w-5" aria-hidden="true" />
      ) : (
        <Moon className="h-5 w-5" aria-hidden="true" />
      )}
    </Button>
  );
}
