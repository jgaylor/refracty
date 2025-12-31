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
    return stored;
  });

  const [effectiveTheme, setEffectiveTheme] = useState<EffectiveTheme>(() => {
    // Compute initial effective theme
    const stored = getStoredAppearance();
    const theme = getEffectiveTheme(stored);
    return theme;
  });

  // Apply theme when effectiveTheme changes
  useEffect(() => {
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
    setEffectiveTheme(newTheme);
  }, [appearance]);

  const setAppearancePreference = useCallback((newAppearance: AppearancePreference) => {
    setAppearance(newAppearance);
    saveAppearance(newAppearance);
    // Immediately compute and apply the new effective theme
    const newTheme = getEffectiveTheme(newAppearance);
    setEffectiveTheme(newTheme);
    applyTheme(newTheme);
  }, []);

  return {
    appearance,
    effectiveTheme,
    setAppearance: setAppearancePreference,
  };
}

