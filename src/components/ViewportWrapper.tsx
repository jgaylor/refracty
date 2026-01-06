'use client';

import { useDrawer } from './DrawerContext';
import { useTouchDevice } from '@/hooks/useTouchDevice';

interface ViewportWrapperProps {
  children: React.ReactNode;
}

export function ViewportWrapper({ children }: ViewportWrapperProps) {
  const { isOpen, setIsOpen } = useDrawer();
  const isTouchPointer = useTouchDevice();

  // Define touchModal: modal drawer behaviors only apply when menu is open AND device has touch pointer
  const touchModal = isOpen && isTouchPointer;

  return (
    <div
      className={`md:hidden fixed inset-0 z-40 transition-transform duration-300 ease-in-out transition-shadow ${
        isOpen ? 'translate-x-80 shadow-2xl' : 'translate-x-0'
      }`}
      style={{
        backgroundColor: 'var(--bg-secondary)',
        willChange: 'transform',
        overflow: 'hidden', // Contain the fixed container
      }}
    >
      {/* Scrim overlay - only rendered when touchModal is true */}
      {touchModal && (
        <div
          onClick={() => setIsOpen(false)}
          className="absolute inset-0"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            pointerEvents: 'auto',
            zIndex: 1,
            touchAction: 'pan-y', // Allow vertical scrolling
          }}
          aria-hidden="true"
        />
      )}
      {/* Main content wrapper - must have full height to allow scrolling */}
      <div
        style={{
          position: 'relative',
          zIndex: 0,
          height: '100%',
          width: '100%',
          overflow: 'visible', // Don't block child scrolling
        }}
      >
        {children}
      </div>
    </div>
  );
}

