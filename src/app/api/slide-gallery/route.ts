import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Force dynamic rendering - prevent static analysis during build
export const dynamic = 'force-dynamic';

// GET /api/slide-gallery - Fetch all slides
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('slide_gallery')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch slides' },
        { status: 500 }
      );
    }

    return NextResponse.json(data || []);
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/slide-gallery - Create new slide
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Basic validation
    if (!body.title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('slide_gallery')
      .insert([
        {
          title: body.title,
          subtitle: body.subtitle || null,
          description: body.description || null,
          button_text: body.button_text || null,
          button_link: body.button_link || null,
          is_active: body.is_active ?? true,
          display_order: body.display_order || 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Failed to create slide' },
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
