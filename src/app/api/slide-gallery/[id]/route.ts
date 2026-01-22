import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/slide-gallery/[id] - Fetch single slide
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const slideId = parseInt(id);

    if (isNaN(slideId)) {
      return NextResponse.json({ error: 'Invalid slide ID' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('slide_gallery')
      .select('*')
      .eq('id', slideId)
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch slide' },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json({ error: 'Slide not found' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/slide-gallery/[id] - Update slide
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const slideId = parseInt(id);

    if (isNaN(slideId)) {
      return NextResponse.json({ error: 'Invalid slide ID' }, { status: 400 });
    }

    const body = await request.json();

    // Basic validation
    if (!body.title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('slide_gallery')
      .update({
        title: body.title,
        subtitle: body.subtitle || null,
        description: body.description || null,
        button_text: body.button_text || null,
        button_link: body.button_link || null,
        is_active: body.is_active ?? true,
        display_order: body.display_order || 1,
        updated_at: new Date().toISOString(),
      })
      .eq('id', slideId)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Failed to update slide' },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json({ error: 'Slide not found' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/slide-gallery/[id] - Delete slide
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const slideId = parseInt(id);

    if (isNaN(slideId)) {
      return NextResponse.json({ error: 'Invalid slide ID' }, { status: 400 });
    }

    const { error } = await supabase
      .from('slide_gallery')
      .delete()
      .eq('id', slideId);

    if (error) {
      return NextResponse.json(
        { error: 'Failed to delete slide' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
