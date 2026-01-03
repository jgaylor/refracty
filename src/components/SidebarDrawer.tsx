'use client';

import { useEffect, useRef } from 'react';
import { SidebarContent } from './Sidebar';
import type { User } from '@supabase/supabase-js';
import { useDrawer } from './DrawerContext';

interface SidebarDrawerProps {
  initialUser?: User | null;
}

export function SidebarDrawer({ initialUser }: SidebarDrawerProps) {
  const { isOpen, setIsOpen } = useDrawer();
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close drawer when clicking on a link
  useEffect(() => {
    const handleLinkClick = (event: MouseEvent) => {
      // Close drawer when clicking on any link inside the drawer
      const target = event.target as HTMLElement;
      if (target.closest('a') && drawerRef.current?.contains(target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('click', handleLinkClick);
    }

    return () => {
      document.removeEventListener('click', handleLinkClick);
    };
  }, [isOpen]);

  // Close drawer on ESC key
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen]);

  return (
    <div
      ref={drawerRef}
      className="md:hidden fixed top-0 left-0 h-screen w-80 z-30"
      style={{ backgroundColor: 'var(--bg-primary)', borderRightColor: 'var(--border-color)' }}
    >
      <aside className="h-full w-full border-r sidebar-bg">
        <SidebarContent initialUser={initialUser} />
      </aside>
    </div>
  );
}

