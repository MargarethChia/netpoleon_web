import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// GET /api/announcement-bar - Fetch announcement bar
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('announcement_bar')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      return NextResponse.json(
        { error: 'Failed to fetch announcement bar' },
        { status: 500 }
      );
    }

    // Return default if no announcement bar exists
    if (!data) {
      return NextResponse.json({
        id: 0,
        text: '',
        is_active: false,
        link: null,
        link_text: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/announcement-bar - Create or update announcement bar
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Basic validation
    if (!body.text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    // Check if announcement bar already exists
    const { data: existingData } = await supabase
      .from('announcement_bar')
      .select('id')
      .limit(1)
      .single();

    let data, error;

    if (existingData) {
      // Update existing announcement bar
      const result = await supabase
        .from('announcement_bar')
        .update({
          text: body.text,
          is_active: body.is_active ?? false,
          link: body.link || null,
          link_text: body.link_text || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingData.id)
        .select()
        .single();

      data = result.data;
      error = result.error;
    } else {
      // Create new announcement bar
      const result = await supabase
        .from('announcement_bar')
        .insert([
          {
            text: body.text,
            is_active: body.is_active ?? false,
            link: body.link || null,
            link_text: body.link_text || null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      data = result.data;
      error = result.error;
    }

    if (error) {
      return NextResponse.json(
        { error: 'Failed to save announcement bar' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
