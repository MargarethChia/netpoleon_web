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
      .order('featured_at', { ascending: false });

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

    // Remove any existing featured event first (single selection behavior)
    const { error: deleteError } = await supabase
      .from('featured_event')
      .delete()
      .neq('id', 0); // Delete all existing featured events

    if (deleteError) {
      console.error('Database error deleting existing featured:', deleteError);
      return NextResponse.json(
        { error: 'Failed to remove existing featured event' },
        { status: 500 }
      );
    }

    const { data, error } = await supabase
      .from('featured_event')
      .insert([
        {
          event_id: eventId,
          featured_at: new Date().toISOString(),
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
