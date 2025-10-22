import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/events/featured - Fetch all featured events
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('featured_event')
      .select(
        `
        *,
        events (*)
      `
      )
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch featured events' },
        { status: 500 }
      );
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/events/featured - Add featured event
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Basic validation
    if (!body.event_id) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      );
    }

    const eventId = parseInt(body.event_id);
    if (isNaN(eventId)) {
      return NextResponse.json({ error: 'Invalid event ID' }, { status: 400 });
    }

    // Check if event exists
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('id')
      .eq('id', eventId)
      .single();

    if (eventError || !event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    // Check if event is already featured
    const { data: existingFeatured, error: checkError } = await supabase
      .from('featured_event')
      .select('id')
      .eq('event_id', eventId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Database error checking existing featured:', checkError);
      return NextResponse.json(
        { error: 'Failed to check existing featured event' },
        { status: 500 }
      );
    }

    if (existingFeatured) {
      return NextResponse.json(
        { error: 'Event is already featured' },
        { status: 400 }
      );
    }

    // Get the next display order
    const { data: maxOrder } = await supabase
      .from('featured_event')
      .select('display_order')
      .order('display_order', { ascending: false })
      .limit(1)
      .single();

    const nextOrder = maxOrder ? (maxOrder.display_order || 0) + 1 : 1;

    const { data, error } = await supabase
      .from('featured_event')
      .insert([
        {
          event_id: eventId,
          featured_at: new Date().toISOString(),
          display_order: nextOrder,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to add featured event' },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/events/featured - Remove featured event
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();

    // Basic validation
    if (!body.event_id) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      );
    }

    const eventId = parseInt(body.event_id);
    if (isNaN(eventId)) {
      return NextResponse.json({ error: 'Invalid event ID' }, { status: 400 });
    }

    const { error } = await supabase
      .from('featured_event')
      .delete()
      .eq('event_id', eventId);

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to remove featured event' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
