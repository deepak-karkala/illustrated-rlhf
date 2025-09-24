'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

import { ANALOGY_CONFIG, ANALOGY_TYPES, LOCAL_STORAGE_KEYS } from '@/lib/constants';
import type { AnalogyType } from '@/lib/types';

interface AnalogyContextValue {
  activeAnalogy: AnalogyType;
  setAnalogy: (type: AnalogyType) => void;
  availableAnalogies: AnalogyType[];
}

const DEFAULT_ANALOGY: AnalogyType = ANALOGY_TYPES.ATARI;
const ANALOGY_LIST = Object.values(ANALOGY_TYPES) as AnalogyType[];

const AnalogyContext = createContext<AnalogyContextValue | undefined>(undefined);

function readStoredAnalogy(): AnalogyType | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const stored = window.localStorage.getItem(LOCAL_STORAGE_KEYS.ANALOGY_PREFERENCE);
  if (!stored) {
    return null;
  }

  if (Object.values(ANALOGY_TYPES).includes(stored as AnalogyType)) {
    return stored as AnalogyType;
  }

  return null;
}

function persistAnalogy(type: AnalogyType): void {
  if (typeof window === 'undefined') {
    return;
  }
  window.localStorage.setItem(LOCAL_STORAGE_KEYS.ANALOGY_PREFERENCE, type);
}

export function AnalogyProvider({ children }: { children: ReactNode }): JSX.Element {
  const [analogy, setAnalogyState] = useState<AnalogyType>(DEFAULT_ANALOGY);

  useEffect(() => {
    const stored = readStoredAnalogy();
    if (stored) {
      setAnalogyState(stored);
    }
  }, []);

  const handleSetAnalogy = useCallback((type: AnalogyType) => {
    setAnalogyState(type);
    persistAnalogy(type);
  }, []);

  const value = useMemo<AnalogyContextValue>(
    () => ({
      activeAnalogy: analogy,
      setAnalogy: handleSetAnalogy,
      availableAnalogies: ANALOGY_LIST,
    }),
    [analogy, handleSetAnalogy]
  );

  return <AnalogyContext.Provider value={value}>{children}</AnalogyContext.Provider>;
}

export function useAnalogy(): AnalogyContextValue {
  const context = useContext(AnalogyContext);
  if (!context) {
    throw new Error('useAnalogy must be used within an AnalogyProvider');
  }
  return context;
}

export function useAnalogyDetails(type: AnalogyType) {
  return ANALOGY_CONFIG[type];
}
