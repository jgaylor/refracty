import { createClient } from './server';
import { getUser } from './auth';

export type InsightCategory =
  | 'motivated_by'
  | 'preferred_communication'
  | 'works_best_when'
  | 'collaboration_style'
  | 'feedback_approach';

export interface Insight {
  id: string;
  person_id: string;
  user_id: string;
  category: InsightCategory;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface CreateInsightInput {
  person_id: string;
  category: InsightCategory;
  content: string;
}

export interface UpdateInsightInput {
  content: string;
}

/**
 * Get all insights for a specific person
 */
export async function getInsightsByPerson(personId: string): Promise<Insight[]> {
  const user = await getUser();
  if (!user) {
    return [];
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('insights')
    .select('*')
    .eq('person_id', personId)
    .eq('user_id', user.id)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching insights:', error);
    return [];
  }

  return data || [];
}

/**
 * Get insights for a specific category
 */
export async function getInsightsByCategory(
  personId: string,
  category: InsightCategory
): Promise<Insight[]> {
  const user = await getUser();
  if (!user) {
    return [];
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('insights')
    .select('*')
    .eq('person_id', personId)
    .eq('user_id', user.id)
    .eq('category', category)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching insights by category:', error);
    return [];
  }

  return data || [];
}

/**
 * Create a new insight
 */
export async function createInsight(
  input: CreateInsightInput
): Promise<{ success: boolean; insight?: Insight; error?: string }> {
  const user = await getUser();
  if (!user) {
    return { success: false, error: 'User not authenticated' };
  }

  if (!input.content || input.content.trim().length === 0) {
    return { success: false, error: 'Content is required' };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('insights')
    .insert({
      person_id: input.person_id,
      user_id: user.id,
      category: input.category,
      content: input.content.trim(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating insight:', error);
    return { success: false, error: error.message };
  }

  return { success: true, insight: data };
}

/**
 * Update an existing insight
 */
export async function updateInsight(
  id: string,
  input: UpdateInsightInput
): Promise<{ success: boolean; insight?: Insight; error?: string }> {
  const user = await getUser();
  if (!user) {
    return { success: false, error: 'User not authenticated' };
  }

  if (!input.content || input.content.trim().length === 0) {
    return { success: false, error: 'Content is required' };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('insights')
    .update({
      content: input.content.trim(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) {
    console.error('Error updating insight:', error);
    return { success: false, error: error.message };
  }

  return { success: true, insight: data };
}

/**
 * Delete an insight
 */
export async function deleteInsight(
  id: string
): Promise<{ success: boolean; error?: string }> {
  const user = await getUser();
  if (!user) {
    return { success: false, error: 'User not authenticated' };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from('insights')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    console.error('Error deleting insight:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

