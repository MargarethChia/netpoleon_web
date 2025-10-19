import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/team-members/[id] - Fetch single team member
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const teamMemberId = parseInt(id);

    if (isNaN(teamMemberId)) {
      return NextResponse.json(
        { error: 'Invalid team member ID' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .eq('id', teamMemberId)
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch team member' },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Team member not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/team-members/[id] - Update team member
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const teamMemberId = parseInt(id);

    if (isNaN(teamMemberId)) {
      return NextResponse.json(
        { error: 'Invalid team member ID' },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Basic validation
    if (!body.name || !body.role) {
      return NextResponse.json(
        { error: 'Name and role are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('team_members')
      .update({
        name: body.name,
        role: body.role,
        photo: body.photo || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', teamMemberId)
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to update team member' },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Team member not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/team-members/[id] - Delete team member
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const teamMemberId = parseInt(id);

    if (isNaN(teamMemberId)) {
      return NextResponse.json(
        { error: 'Invalid team member ID' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('team_members')
      .delete()
      .eq('id', teamMemberId);

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to delete team member' },
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
