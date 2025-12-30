'use client';

import { useEffect, useState, useCallback } from 'react';

export type AppearancePreference = 'system' | 'light' | 'dark';
export type EffectiveTheme = 'light' | 'dark';

const STORAGE_KEY = 'appearance-preference';

/**
 * Get the effective theme based on appearance preference
 */
function getEffectiveTheme(appearance: AppearancePreference): EffectiveTheme {
  if (appearance === 'light') return 'light';
  if (appearance === 'dark') return 'dark';
  
  // appearance === 'system'
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

/**
 * Apply theme to document root
 */
function applyTheme(theme: EffectiveTheme) {
  if (typeof document === 'undefined') return;
  document.documentElement.setAttribute('data-theme', theme);
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/e167765d-2db9-4a7f-8487-28e2f87e5d24',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useTheme.ts:27',message:'applyTheme executed',data:{theme,actualAttribute:document.documentElement.getAttribute('data-theme')},timestamp:Date.now(),sessionId:'debug-session',runId:'run3',hypothesisId:'M'})}).catch(()=>{});
  // #endregion
}

/**
 * Get appearance preference from localStorage
 */
function getStoredAppearance(): AppearancePreference {
  if (typeof window === 'undefined') return 'dark';
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark' || stored === 'system') {
    return stored;
  }
  return 'dark';
}

/**
 * Save appearance preference to localStorage
 */
function saveAppearance(appearance: AppearancePreference) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, appearance);
}

export function useTheme() {
  const [appearance, setAppearance] = useState<AppearancePreference>(() => {
    // Initialize from localStorage on mount
    const stored = getStoredAppearance();
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/e167765d-2db9-4a7f-8487-28e2f87e5d24',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useTheme.ts:52',message:'useTheme init appearance',data:{storedAppearance:stored},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
    // #endregion
    return stored;
  });

  const [effectiveTheme, setEffectiveTheme] = useState<EffectiveTheme>(() => {
    // Compute initial effective theme
    const stored = getStoredAppearance();
    const theme = getEffectiveTheme(stored);
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/e167765d-2db9-4a7f-8487-28e2f87e5d24',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useTheme.ts:60',message:'useTheme init effectiveTheme',data:{storedAppearance:stored,effectiveTheme:theme},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
    // #endregion
    return theme;
  });

  // Apply theme when effectiveTheme changes
  useEffect(() => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/e167765d-2db9-4a7f-8487-28e2f87e5d24',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useTheme.ts:65',message:'Applying theme',data:{effectiveTheme},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
    // #endregion
    applyTheme(effectiveTheme);
  }, [effectiveTheme]);

  // Subscribe to system theme changes when appearance is 'system'
  useEffect(() => {
    if (appearance !== 'system') {
      // Not in system mode, no need to listen
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      const newTheme = getEffectiveTheme('system');
      setEffectiveTheme(newTheme);
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, [appearance]);

  // Update effective theme when appearance changes
  useEffect(() => {
    const newTheme = getEffectiveTheme(appearance);
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/e167765d-2db9-4a7f-8487-28e2f87e5d24',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useTheme.ts:106',message:'Appearance changed, updating effectiveTheme',data:{appearance,newTheme,currentEffectiveTheme:effectiveTheme},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'L'})}).catch(()=>{});
    // #endregion
    setEffectiveTheme(newTheme);
  }, [appearance]);

  const setAppearancePreference = useCallback((newAppearance: AppearancePreference) => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/e167765d-2db9-4a7f-8487-28e2f87e5d24',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useTheme.ts:114',message:'setAppearancePreference called',data:{newAppearance},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'L'})}).catch(()=>{});
    // #endregion
    setAppearance(newAppearance);
    saveAppearance(newAppearance);
    // Immediately compute and apply the new effective theme
    const newTheme = getEffectiveTheme(newAppearance);
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/e167765d-2db9-4a7f-8487-28e2f87e5d24',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useTheme.ts:120',message:'Immediately applying theme from setAppearancePreference',data:{newAppearance,newTheme},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'L'})}).catch(()=>{});
    // #endregion
    setEffectiveTheme(newTheme);
    applyTheme(newTheme);
  }, []);

  return {
    appearance,
    effectiveTheme,
    setAppearance: setAppearancePreference,
  };
}

