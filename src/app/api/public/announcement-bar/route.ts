import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/public/announcement-bar - Fetch active announcement bar (public endpoint)
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('announcement_bar')
      .select('text, link, link_text')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      return NextResponse.json(
        { error: 'Failed to fetch announcement bar' },
        { status: 500 }
      );
    }

    // Return null if no active announcement bar exists
    if (!data) {
      return NextResponse.json(null);
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
