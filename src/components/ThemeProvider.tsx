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
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/e167765d-2db9-4a7f-8487-28e2f87e5d24',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ThemeProvider.tsx:14',message:'ThemeProvider render',data:{initialAppearance},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'G'})}).catch(()=>{});
  // #endregion
  const { appearance, setAppearance } = useTheme();

  // Sync with server-provided initial appearance if available
  useEffect(() => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/e167765d-2db9-4a7f-8487-28e2f87e5d24',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ThemeProvider.tsx:20',message:'ThemeProvider sync effect',data:{initialAppearance,currentAppearance:appearance,shouldSync:initialAppearance && initialAppearance !== appearance},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'G'})}).catch(()=>{});
    // #endregion
    if (initialAppearance && initialAppearance !== appearance) {
      setAppearance(initialAppearance);
    }
  }, [initialAppearance, appearance, setAppearance]);

  return <>{children}</>;
}

