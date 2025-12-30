/**
 * Blocking script to apply theme before React hydration
 * This prevents flash of wrong theme on initial load
 */
export function getThemeScript() {
  return `
    (function() {
      try {
        var appearance = localStorage.getItem('appearance-preference') || 'system';
        var theme = 'light';
        
        if (appearance === 'light') {
          theme = 'light';
        } else if (appearance === 'dark') {
          theme = 'dark';
        } else {
          // appearance === 'system'
          theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        
        document.documentElement.setAttribute('data-theme', theme);
      } catch (e) {
        // Fallback to light if anything fails
        document.documentElement.setAttribute('data-theme', 'light');
      }
    })();
  `;
}

