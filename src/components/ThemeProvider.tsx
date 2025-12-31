'use client';

import { useEffect } from 'react';
import { useTheme } from '@/hooks/useTheme';

interface ThemeProviderProps {
  children: React.ReactNode;
  initialAppearance?: 'system' | 'light' | 'dark';
}

/**
 * Theme provider that initializes theme from props and syncs with hook
 */
export function ThemeProvider({ children, initialAppearance }: ThemeProviderProps) {
  const { appearance, setAppearance } = useTheme();

  // Sync with server-provided initial appearance if available
  useEffect(() => {
    if (initialAppearance && initialAppearance !== appearance) {
      setAppearance(initialAppearance);
    }
  }, [initialAppearance, appearance, setAppearance]);

  return <>{children}</>;
}

