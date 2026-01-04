import { getPersonById, updatePerson } from '@/lib/supabase/people';
import { getUser } from '@/lib/supabase/auth';
import { NextResponse } from 'next/server';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get current person to toggle favorite status
    const person = await getPersonById(id);
    if (!person) {
      return NextResponse.json({ error: 'Person not found' }, { status: 404 });
    }

    // Toggle favorite status
    const result = await updatePerson(id, {
      is_favorite: !person.is_favorite,
    });

    if (result.success) {
      return NextResponse.json({ success: true, person: result.person });
    } else {
      return NextResponse.json(
        { error: result.error || 'Failed to toggle favorite' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error in PATCH /api/people/[id]/favorite:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

