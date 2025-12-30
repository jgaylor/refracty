import { getAllInsights } from '@/lib/supabase/insights';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    
    const offset = (page - 1) * limit;
    
    const { insights, hasMore } = await getAllInsights(limit, offset);
    
    return NextResponse.json({
      success: true,
      insights,
      hasMore,
      page,
    });
  } catch (error) {
    console.error('Error in GET /api/insights:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

