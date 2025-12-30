import { createClient } from './server';
import { getUser } from './auth';

export type AppearancePreference = 'system' | 'light' | 'dark';

export interface UserProfile {
  id: string;
  appearance: AppearancePreference;
  created_at?: string;
  updated_at?: string;
}

/**
 * Get user profile including appearance preference
 */
export async function getUserProfile(): Promise<UserProfile | null> {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/e167765d-2db9-4a7f-8487-28e2f87e5d24',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'profile.ts:16',message:'getUserProfile called',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
  // #endregion
  const user = await getUser();
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/e167765d-2db9-4a7f-8487-28e2f87e5d24',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'profile.ts:19',message:'getUser result',data:{hasUser:!!user,userId:user?.id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
  // #endregion
  if (!user) {
    return null;
  }

  const supabase = await createClient();
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/e167765d-2db9-4a7f-8487-28e2f87e5d24',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'profile.ts:25',message:'Before profiles query',data:{userId:user.id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
  // #endregion
  const { data, error } = await supabase
    .from('profiles')
    .select('id, appearance, created_at, updated_at')
    .eq('id', user.id)
    .single();

  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/e167765d-2db9-4a7f-8487-28e2f87e5d24',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'profile.ts:32',message:'After profiles query',data:{hasError:!!error,errorCode:error?.code,errorMessage:error?.message,hasData:!!data},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
  // #endregion

  if (error) {
    // If profile doesn't exist, return default
    if (error.code === 'PGRST116') {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/e167765d-2db9-4a7f-8487-28e2f87e5d24',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'profile.ts:36',message:'Profile not found, returning default',data:{userId:user.id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
      // #endregion
      return {
        id: user.id,
        appearance: 'system',
      };
    }
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/e167765d-2db9-4a7f-8487-28e2f87e5d24',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'profile.ts:42',message:'Error fetching profile',data:{errorCode:error.code,errorMessage:error.message,errorDetails:error},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
    // #endregion
    console.error('Error fetching profile:', error);
    return null;
  }

  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/e167765d-2db9-4a7f-8487-28e2f87e5d24',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'profile.ts:48',message:'Profile fetched successfully',data:{profileId:data.id,appearance:data.appearance},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
  // #endregion
  return {
    id: data.id,
    appearance: (data.appearance as AppearancePreference) || 'system',
    created_at: data.created_at,
    updated_at: data.updated_at,
  };
}

/**
 * Update user appearance preference
 */
export async function updateAppearance(
  appearance: AppearancePreference
): Promise<{ success: boolean; error?: string }> {
  const user = await getUser();
  if (!user) {
    return { success: false, error: 'User not authenticated' };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from('profiles')
    .upsert(
      {
        id: user.id,
        appearance,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: 'id',
      }
    );

  if (error) {
    console.error('Error updating appearance:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

