import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/resource-type - Fetch all resource types
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('resource_type')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      return NextResponse.json(
        {
          error: 'Failed to fetch resource types',
          details: error.message,
          code: error.code,
        },
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

// POST /api/resource-type - Create new resource type
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('resource_type')
      .insert([
        {
          name: body.name.toLowerCase().replace(/\s+/g, '-'), // Normalize name
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        {
          error:
            error.code === '23505'
              ? 'Resource type already exists'
              : 'Failed to create resource type',
        },
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
