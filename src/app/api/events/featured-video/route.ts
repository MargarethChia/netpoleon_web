import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/events/featured-video - Fetch featured event video
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('featured_event_video')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No featured video found
        return NextResponse.json({ data: null });
      }
      return NextResponse.json(
        { error: 'Failed to fetch featured event video' },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/events/featured-video - Set featured event video
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Basic validation
    if (!body.video_url) {
      return NextResponse.json(
        { error: 'Video URL is required' },
        { status: 400 }
      );
    }

    // Remove any existing featured video first (single selection behavior)
    const { error: deleteError } = await supabase
      .from('featured_event_video')
      .delete()
      .neq('id', 0); // Delete all existing featured videos

    if (deleteError) {
      return NextResponse.json(
        { error: 'Failed to remove existing featured video' },
        { status: 500 }
      );
    }

    const { data, error } = await supabase
      .from('featured_event_video')
      .insert([
        {
          video_url: body.video_url,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Failed to set featured event video' },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/events/featured-video - Update featured event video
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    // Basic validation
    if (!body.video_url) {
      return NextResponse.json(
        { error: 'Video URL is required' },
        { status: 400 }
      );
    }

    // Get the current featured video
    const { data: currentVideo, error: fetchError } = await supabase
      .from('featured_event_video')
      .select('id')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      return NextResponse.json(
        { error: 'Failed to fetch current featured video' },
        { status: 500 }
      );
    }

    if (!currentVideo) {
      // No existing video, create new one
      const { data, error } = await supabase
        .from('featured_event_video')
        .insert([
          {
            video_url: body.video_url,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) {
        return NextResponse.json(
          { error: 'Failed to create featured event video' },
          { status: 500 }
        );
      }

      return NextResponse.json(data);
    } else {
      // Update existing video
      const { data, error } = await supabase
        .from('featured_event_video')
        .update({
          video_url: body.video_url,
          updated_at: new Date().toISOString(),
        })
        .eq('id', currentVideo.id)
        .select()
        .single();

      if (error) {
        return NextResponse.json(
          { error: 'Failed to update featured event video' },
          { status: 500 }
        );
      }

      return NextResponse.json(data);
    }
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/events/featured-video - Remove featured event video
export async function DELETE() {
  try {
    const { error } = await supabase
      .from('featured_event_video')
      .delete()
      .neq('id', 0); // Delete all featured videos

    if (error) {
      return NextResponse.json(
        { error: 'Failed to remove featured event video' },
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
