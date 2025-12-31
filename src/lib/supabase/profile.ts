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
  const user = await getUser();
  if (!user) {
    return null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('id, appearance, created_at, updated_at')
    .eq('id', user.id)
    .single();

  if (error) {
    // If profile doesn't exist, return default
    if (error.code === 'PGRST116') {
      return {
        id: user.id,
        appearance: 'system',
      };
    }
    console.error('Error fetching profile:', error);
    return null;
  }

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

