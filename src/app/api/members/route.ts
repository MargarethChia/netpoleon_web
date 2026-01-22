import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Force dynamic rendering - prevent static analysis during build
export const dynamic = 'force-dynamic';

// Fetch all team members
export async function GET() {
  const { data, error } = await supabase.from('team_members').select('*');
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}
// Create a new team member
export async function POST(request: NextRequest) {
  const { name, role, photo, secondary_photo } = await request.json();
  const { data, error } = await supabase
    .from('team_members')
    .insert({ name, photo, role, secondary_photo });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

// Delete a team member
export async function DELETE(request: NextRequest) {
  const { id } = await request.json();
  const { data, error } = await supabase
    .from('team_members')
    .delete()
    .eq('id', id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}
