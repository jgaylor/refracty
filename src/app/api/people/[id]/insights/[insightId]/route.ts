import { createClient } from '@/lib/supabase/server';
import { getUser } from '@/lib/supabase/auth';
import { NextResponse } from 'next/server';
import { UpdateInsightInput } from '@/lib/supabase/insights';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; insightId: string }> }
) {
  try {
    const { id, insightId } = await params;
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: UpdateInsightInput = await request.json();

    // At least one field must be provided
    if (!body.content && !body.category) {
      return NextResponse.json({ error: 'Either content or category must be provided' }, { status: 400 });
    }

    // Content validation (only if provided)
    if (body.content !== undefined && (!body.content || body.content.trim().length === 0)) {
      return NextResponse.json({ error: 'Content cannot be empty' }, { status: 400 });
    }

    const supabase = await createClient();

    const updateData: { content?: string; category?: string; updated_at: string } = {
      updated_at: new Date().toISOString(),
    };

    if (body.content !== undefined) {
      updateData.content = body.content.trim();
    }

    if (body.category !== undefined) {
      updateData.category = body.category;
    }

    // Verify insight belongs to user and person
    const { data: insight, error: insightError } = await supabase
      .from('insights')
      .update(updateData)
      .eq('id', insightId)
      .eq('user_id', user.id)
      .eq('person_id', id)
      .select()
      .single();

    if (insightError) {
      console.error('Error updating insight:', insightError);
      return NextResponse.json({ error: insightError.message }, { status: 500 });
    }

    if (!insight) {
      return NextResponse.json({ error: 'Insight not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, insight });
  } catch (error) {
    console.error('Error in PATCH /api/people/[id]/insights/[insightId]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; insightId: string }> }
) {
  try {
    const { id, insightId } = await params;
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createClient();

    // Verify insight belongs to user and person, then delete
    const { error } = await supabase
      .from('insights')
      .delete()
      .eq('id', insightId)
      .eq('user_id', user.id)
      .eq('person_id', id);

    if (error) {
      console.error('Error deleting insight:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/people/[id]/insights/[insightId]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

