import { NextResponse } from 'next/server';
import { createSamplePerson } from '@/lib/supabase/people';

export async function POST() {
  try {
    const result = await createSamplePerson();
    
    if (result.success) {
      return NextResponse.json({ success: true, person: result.person });
    } else {
      return NextResponse.json(
        { error: result.error || 'Failed to create sample person' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in POST /api/people/sample:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

