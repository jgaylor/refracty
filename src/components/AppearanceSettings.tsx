'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { createClient } from '@/lib/supabase/client';
import type { AppearancePreference } from '@/lib/supabase/profile';

export function AppearanceSettings({ initialAppearance }: { initialAppearance?: AppearancePreference }) {
  const { appearance, setAppearance } = useTheme();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentAppearance, setCurrentAppearance] = useState<AppearancePreference>(
    initialAppearance || appearance
  );

  // Sync with initialAppearance only when it changes from server (not from user interaction)
  // We don't want to override user's selection while they're interacting
  useEffect(() => {
    if (initialAppearance && initialAppearance !== currentAppearance) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/e167765d-2db9-4a7f-8487-28e2f87e5d24',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AppearanceSettings.tsx:19',message:'Syncing currentAppearance from initialAppearance',data:{initialAppearance,currentAppearance},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'K'})}).catch(()=>{});
      // #endregion
      setCurrentAppearance(initialAppearance);
    }
  }, [initialAppearance]); // Only sync when initialAppearance changes (from server)

  const handleChange = async (newAppearance: AppearancePreference) => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/e167765d-2db9-4a7f-8487-28e2f87e5d24',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AppearanceSettings.tsx:27',message:'handleChange called',data:{newAppearance,previousAppearance:currentAppearance},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'K'})}).catch(()=>{});
    // #endregion
    const previousAppearance = currentAppearance;
    
    // Optimistic update - update local state first
    setCurrentAppearance(newAppearance);
    setError(null);
    setSaving(true);
    
    // Update global theme hook
    setAppearance(newAppearance);

    try {
      const supabase = createClient();
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/e167765d-2db9-4a7f-8487-28e2f87e5d24',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AppearanceSettings.tsx:35',message:'Before getUser',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H'})}).catch(()=>{});
      // #endregion
      const { data: { user } } = await supabase.auth.getUser();
      
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/e167765d-2db9-4a7f-8487-28e2f87e5d24',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AppearanceSettings.tsx:38',message:'After getUser',data:{hasUser:!!user,userId:user?.id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H'})}).catch(()=>{});
      // #endregion
      if (!user) {
        throw new Error('User not authenticated');
      }

      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/e167765d-2db9-4a7f-8487-28e2f87e5d24',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AppearanceSettings.tsx:44',message:'Before profiles upsert',data:{userId:user.id,appearance:newAppearance},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'I'})}).catch(()=>{});
      // #endregion
      const { error: updateError } = await supabase
        .from('profiles')
        .upsert(
          {
            id: user.id,
            appearance: newAppearance,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: 'id',
          }
        );

      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/e167765d-2db9-4a7f-8487-28e2f87e5d24',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AppearanceSettings.tsx:57',message:'After profiles upsert',data:{hasError:!!updateError,errorCode:updateError?.code,errorMessage:updateError?.message},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'I'})}).catch(()=>{});
      // #endregion

      if (updateError) {
        throw updateError;
      }
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/e167765d-2db9-4a7f-8487-28e2f87e5d24',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AppearanceSettings.tsx:61',message:'Appearance update success',data:{appearance:newAppearance,currentAppearanceState:currentAppearance},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'K'})}).catch(()=>{});
      // #endregion
    } catch (err) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/e167765d-2db9-4a7f-8487-28e2f87e5d24',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AppearanceSettings.tsx:64',message:'Appearance update error',data:{errorMessage:err instanceof Error ? err.message : String(err),revertingTo:previousAppearance},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'I'})}).catch(()=>{});
      // #endregion
      // Revert on error
      setCurrentAppearance(previousAppearance);
      setAppearance(previousAppearance);
      setError(err instanceof Error ? err.message : 'Failed to save preference');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-3 block" style={{ color: 'var(--text-secondary)' }}>
          Appearance
        </label>
        <div className="space-y-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="appearance"
              value="system"
              checked={currentAppearance === 'system'}
              onChange={() => handleChange('system')}
              disabled={saving}
              className="w-4 h-4 text-primary focus:ring-primary"
            />
            <div className="flex-1">
              <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>System</span>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>Matches your device setting</p>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="appearance"
              value="light"
              checked={currentAppearance === 'light'}
              onChange={() => handleChange('light')}
              disabled={saving}
              className="w-4 h-4 text-primary focus:ring-primary"
            />
            <div className="flex-1">
              <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Light</span>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="appearance"
              value="dark"
              checked={currentAppearance === 'dark'}
              onChange={() => handleChange('dark')}
              disabled={saving}
              className="w-4 h-4 text-primary focus:ring-primary"
            />
            <div className="flex-1">
              <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Dark</span>
            </div>
          </label>
        </div>
      </div>

      {error && (
        <div className="alert-error">
          {error}
        </div>
      )}
    </div>
  );
}

