'use client';

import { useState, useEffect } from 'react';

/**
 * Hook to detect if the device is a touch-only device
 * Uses matchMedia to detect devices with (hover: none) and (pointer: coarse)
 * This accurately distinguishes touch devices from desktop devices
 */
export function useTouchDevice(): boolean {
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      return;
    }

    // Create media query for touch devices: no hover capability and coarse pointer
    const mediaQuery = window.matchMedia('(hover: none) and (pointer: coarse)');
    
    // Set initial value
    setIsTouchDevice(mediaQuery.matches);

    // Handle media query changes (for responsive testing or device rotation)
    const handleChange = (event: MediaQueryListEvent | MediaQueryList) => {
      setIsTouchDevice(event.matches);
    };

    // Add listener for changes
    // Modern browsers support addEventListener on MediaQueryList
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => {
        mediaQuery.removeEventListener('change', handleChange);
      };
    } else {
      // Fallback for older browsers that use addListener
      mediaQuery.addListener(handleChange);
      return () => {
        mediaQuery.removeListener(handleChange);
      };
    }
  }, []);

  return isTouchDevice;
}

