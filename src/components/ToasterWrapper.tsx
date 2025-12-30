'use client';

import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';

export function ToasterWrapper() {
  const [iconColor, setIconColor] = useState('#525252'); // Default to light mode --text-secondary

  const updateIconColor = () => {
    // Get the computed value of --text-secondary from the root element
    const root = document.documentElement;
    const computedColor = getComputedStyle(root).getPropertyValue('--text-secondary').trim();
    
    if (computedColor) {
      setIconColor(computedColor);
    }
  };

  useEffect(() => {
    // Initial update
    updateIconColor();

    // Watch for theme changes by observing the html element's data-theme attribute
    const observer = new MutationObserver(() => {
      updateIconColor();
    });

    const htmlElement = document.documentElement;
    observer.observe(htmlElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 5000,
        style: {
          background: 'var(--bg-primary)',
          color: 'var(--text-primary)',
          border: '1px solid var(--border-color)',
          fontSize: '0.875rem',
        },
        success: {
          iconTheme: {
            primary: iconColor,
            secondary: 'white',
          },
        },
        error: {
          iconTheme: {
            primary: '#ef4444',
            secondary: 'white',
          },
        },
      }}
    />
  );
}

