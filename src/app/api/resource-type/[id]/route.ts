import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// DELETE /api/resource-type/[id] - Delete resource type
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const typeId = parseInt(id);

    if (isNaN(typeId)) {
      return NextResponse.json(
        { error: 'Invalid resource type ID' },
        { status: 400 }
      );
    }

    // Check if any resources are using this type
    const { data: resources, error: checkError } = await supabase
      .from('resources')
      .select('id')
      .eq('type_id', typeId)
      .limit(1);

    if (checkError) {
      // Error checking resource usage
    } else if (resources && resources.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete resource type that is in use' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('resource_type')
      .delete()
      .eq('id', typeId);

    if (error) {
      return NextResponse.json(
        { error: 'Failed to delete resource type' },
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
