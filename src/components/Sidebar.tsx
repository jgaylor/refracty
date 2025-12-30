'use client';

import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { User } from '@supabase/supabase-js';
import { SidebarSkeleton } from './skeletons/SidebarSkeleton';

// Icon components defined outside the main component
const UsersIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const ChartIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const SettingsIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

interface SidebarProps {
  initialUser?: User | null;
}

export function Sidebar({ initialUser = null }: SidebarProps = {}) {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/e167765d-2db9-4a7f-8487-28e2f87e5d24',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Sidebar.tsx:34',message:'Sidebar render start',data:{hasInitialUser:!!initialUser,initialUserId:initialUser?.id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
  // #endregion
  const [user, setUser] = useState<User | null>(initialUser);
  const [loading, setLoading] = useState(!initialUser);
  const pathname = usePathname();
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/e167765d-2db9-4a7f-8487-28e2f87e5d24',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Sidebar.tsx:38',message:'Sidebar state initialized',data:{userState:!!user,userId:user?.id,loading},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
  // #endregion

  useEffect(() => {
    const supabase = createClient();

    // If we have an initial user, we can skip the initial check
    if (initialUser) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/e167765d-2db9-4a7f-8487-28e2f87e5d24',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Sidebar.tsx:43',message:'Sidebar: Using initialUser, skipping client check',data:{initialUserId:initialUser?.id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      // #endregion
      setLoading(false);
    } else {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/e167765d-2db9-4a7f-8487-28e2f87e5d24',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Sidebar.tsx:47',message:'Sidebar: No initialUser, checking client auth',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      // #endregion
      // Get initial session
      supabase.auth.getUser().then(({ data: { user } }) => {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/e167765d-2db9-4a7f-8487-28e2f87e5d24',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Sidebar.tsx:50',message:'Sidebar: Client auth check result',data:{hasUser:!!user,userId:user?.id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
        // #endregion
        setUser(user);
        setLoading(false);
      });
    }

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/e167765d-2db9-4a7f-8487-28e2f87e5d24',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Sidebar.tsx:58',message:'Sidebar: Auth state changed',data:{event:_event,hasSession:!!session,hasUser:!!session?.user,userId:session?.user?.id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      // #endregion
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [initialUser]);

  // Show skeleton while loading
  if (loading) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/e167765d-2db9-4a7f-8487-28e2f87e5d24',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Sidebar.tsx:65',message:'Sidebar: Rendering skeleton (loading)',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    return <SidebarSkeleton />;
  }

  // Don't render if not logged in
  if (!user) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/e167765d-2db9-4a7f-8487-28e2f87e5d24',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Sidebar.tsx:70',message:'Sidebar: Returning null (no user)',data:{hasInitialUser:!!initialUser},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    return null;
  }
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/e167765d-2db9-4a7f-8487-28e2f87e5d24',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Sidebar.tsx:73',message:'Sidebar: Rendering sidebar content',data:{userId:user?.id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
  // #endregion

  const isActive = (path: string) => pathname === path;

  const sidebarContent = (
    <div className="h-full flex flex-col">
      {/* Header with branding */}
      <div className="flex items-center justify-between py-8 px-4">
        <Link href="/people" className="flex items-center gap-3 px-3 hover:opacity-80 transition-opacity">
          {/* Avatar placeholder with "R" - aligned with menu icons */}
          <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center flex-shrink-0">
            <span className="text-white font-medium text-sm">R</span>
          </div>
          <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Refracty</span>
        </Link>
      </div>

      {/* Navigation items */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {/* People */}
        <Link
          href="/people"
          className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            isActive('/people')
              ? 'bg-primary text-white'
              : 'sidebar-link'
          }`}
        >
          <UsersIcon className="w-5 h-5 flex-shrink-0" />
          <span>People</span>
        </Link>

        {/* Insights */}
        <Link
          href="/insights"
          className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            isActive('/insights')
              ? 'bg-primary text-white'
              : 'sidebar-link'
          }`}
        >
          <ChartIcon className="w-5 h-5 flex-shrink-0" />
          <span>Insights</span>
        </Link>

        {/* Settings */}
        <Link
          href="/settings"
          className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            isActive('/settings')
              ? 'bg-primary text-white'
              : 'sidebar-link'
          }`}
        >
          <SettingsIcon className="w-5 h-5 flex-shrink-0" />
          <span>Settings</span>
        </Link>
      </nav>
    </div>
  );

  return (
    <aside className="flex-shrink-0 h-full w-56 sidebar-bg border-r">
      {sidebarContent}
    </aside>
  );
}

