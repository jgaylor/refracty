import { createClient } from '@/lib/supabase/server';
import { getUser } from '@/lib/supabase/auth';
import { NextResponse } from 'next/server';

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

    const body = await request.json();

    if (!body.content || body.content.trim().length === 0) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
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

    // Create the note
    const { data: note, error: noteError } = await supabase
      .from('notes')
      .insert({
        person_id: id,
        user_id: user.id,
        content: body.content.trim(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (noteError) {
      console.error('Error creating note:', noteError);
      return NextResponse.json({ error: noteError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, note });
  } catch (error) {
    console.error('Error in POST /api/people/[id]/notes:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

