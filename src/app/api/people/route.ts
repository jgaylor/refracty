import { createClient } from '@/lib/supabase/server';
import { getUser } from '@/lib/supabase/auth';
import { NextResponse } from 'next/server';
import { CreatePersonInput, getPeople, getFavorites } from '@/lib/supabase/people';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const favorites = searchParams.get('favorites') === 'true';
    
    const people = favorites ? await getFavorites() : await getPeople();
    return NextResponse.json({ people });
  } catch (error) {
    console.error('Error in GET /api/people:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: CreatePersonInput = await request.json();

    if (!body.name || body.name.trim().length === 0) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const supabase = await createClient();

    // Create the person
    const { data: person, error: personError } = await supabase
      .from('people')
      .insert({
        user_id: user.id,
        name: body.name.trim(),
        vibe_summary: body.vibe_summary?.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (personError) {
      console.error('Error creating person:', personError);
      return NextResponse.json({ error: personError.message }, { status: 500 });
    }

    // Create the first note if provided
    if (body.first_note && body.first_note.trim().length > 0) {
      const { error: noteError } = await supabase
        .from('notes')
        .insert({
          person_id: person.id,
          user_id: user.id,
          content: body.first_note.trim(),
          updated_at: new Date().toISOString(),
        });

      if (noteError) {
        console.error('Error creating note:', noteError);
        // Person was created but note failed - still return success with person
        return NextResponse.json({
          success: true,
          person,
          warning: 'Person created but note failed to save',
        });
      }
    }

    return NextResponse.json({ success: true, person });
  } catch (error) {
    console.error('Error in POST /api/people:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

