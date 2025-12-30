import { createClient } from '@/lib/supabase/server';
import { getUser } from '@/lib/supabase/auth';
import { NextResponse } from 'next/server';
import { InsightCategory } from '@/lib/supabase/insights';

const VALID_CATEGORIES: InsightCategory[] = [
  'motivated_by',
  'preferred_communication',
  'works_best_when',
  'collaboration_style',
  'feedback_approach',
];

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string; noteId: string }> }
) {
  try {
    const { id, noteId } = await params;
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    if (!body.category || !VALID_CATEGORIES.includes(body.category)) {
      return NextResponse.json({ error: 'Valid category is required' }, { status: 400 });
    }

    const supabase = await createClient();

    // First, get the note content
    const { data: note, error: noteError } = await supabase
      .from('notes')
      .select('content')
      .eq('id', noteId)
      .eq('user_id', user.id)
      .eq('person_id', id)
      .single();

    if (noteError || !note) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }

    // Create the insight from the note content
    const { data: insight, error: insightError } = await supabase
      .from('insights')
      .insert({
        person_id: id,
        user_id: user.id,
        category: body.category,
        content: note.content,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (insightError) {
      console.error('Error creating insight:', insightError);
      return NextResponse.json({ error: insightError.message }, { status: 500 });
    }

    // Delete the original note
    const { error: deleteError } = await supabase
      .from('notes')
      .delete()
      .eq('id', noteId)
      .eq('user_id', user.id)
      .eq('person_id', id);

    if (deleteError) {
      console.error('Error deleting note after moving to insight:', deleteError);
      // Note: Insight was created, but note deletion failed. This is not ideal but we'll still return success
    }

    return NextResponse.json({ success: true, insight });
  } catch (error) {
    console.error('Error in POST /api/people/[id]/notes/[noteId]/move-to-insight:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

