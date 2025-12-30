import { createClient } from '@/lib/supabase/server';
import { getUser } from '@/lib/supabase/auth';
import { NextResponse } from 'next/server';
import { CreateInsightInput, UpdateInsightInput, InsightCategory } from '@/lib/supabase/insights';

const VALID_CATEGORIES: InsightCategory[] = [
  'motivated_by',
  'preferred_communication',
  'works_best_when',
  'collaboration_style',
  'feedback_approach',
];

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: CreateInsightInput = await request.json();

    if (!body.content || body.content.trim().length === 0) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    if (!VALID_CATEGORIES.includes(body.category)) {
      return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
    }

    // Verify person belongs to user
    const supabase = await createClient();
    const { data: person, error: personError } = await supabase
      .from('people')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (personError || !person) {
      return NextResponse.json({ error: 'Person not found' }, { status: 404 });
    }

    // Create the insight
    const { data: insight, error: insightError } = await supabase
      .from('insights')
      .insert({
        person_id: id,
        user_id: user.id,
        category: body.category,
        content: body.content.trim(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (insightError) {
      console.error('Error creating insight:', insightError);
      return NextResponse.json({ error: insightError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, insight });
  } catch (error) {
    console.error('Error in POST /api/people/[id]/insights:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

