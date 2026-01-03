'use client';

import { useDrawer } from './DrawerContext';

interface ViewportWrapperProps {
  children: React.ReactNode;
}

export function ViewportWrapper({ children }: ViewportWrapperProps) {
  const { isOpen } = useDrawer();

  return (
    <div
      className={`md:hidden fixed inset-0 z-40 transition-transform duration-300 ease-in-out transition-shadow ${
        isOpen ? 'translate-x-80 shadow-2xl' : 'translate-x-0'
      }`}
      style={{
        backgroundColor: 'var(--bg-secondary)',
        willChange: 'transform',
      }}
    >
      {children}
    </div>
  );
}

