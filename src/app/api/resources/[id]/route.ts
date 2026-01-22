import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/resources/[id] - Fetch single resource
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const resourceId = parseInt(id);

    if (isNaN(resourceId)) {
      return NextResponse.json(
        { error: 'Invalid resource ID' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .eq('id', resourceId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Resource not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: 'Failed to fetch resource' },
        { status: 500 }
      );
    }

    // Fetch the resource type
    const { data: resourceType } = await supabase
      .from('resource_type')
      .select('id, name')
      .eq('id', data.type_id)
      .single();

    // Transform response
    return NextResponse.json({
      ...data,
      type: resourceType?.name || null,
      resource_type: resourceType || null,
    });
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/resources/[id] - Update resource
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const resourceId = parseInt(id);

    if (isNaN(resourceId)) {
      return NextResponse.json(
        { error: 'Invalid resource ID' },
        { status: 400 }
      );
    }

    const body = await request.json();

    // For partial updates, we need to fetch the existing resource first
    const { data: existingResource, error: fetchError } = await supabase
      .from('resources')
      .select('*')
      .eq('id', resourceId)
      .single();

    if (fetchError) {
      return NextResponse.json(
        { error: 'Failed to fetch existing resource' },
        { status: 500 }
      );
    }

    // Merge existing data with updates
    const updatedData = {
      ...existingResource,
      ...body,
      updated_at: new Date().toISOString(),
    };

    // Basic validation for the merged data
    if (!updatedData.title || !updatedData.type_id) {
      return NextResponse.json(
        { error: 'Title and type_id are required' },
        { status: 400 }
      );
    }

    // Validate type_id exists if it was changed
    if (body.type_id && body.type_id !== existingResource.type_id) {
      const { data: typeExists } = await supabase
        .from('resource_type')
        .select('id')
        .eq('id', body.type_id)
        .single();

      if (!typeExists) {
        return NextResponse.json(
          { error: 'Invalid resource type' },
          { status: 400 }
        );
      }
    }

    // Validate that either content or article_link is provided, but not both
    const hasContent =
      updatedData.content && updatedData.content.trim().length > 0;
    const hasArticleLink =
      updatedData.article_link && updatedData.article_link.trim().length > 0;

    if (!hasContent && !hasArticleLink) {
      return NextResponse.json(
        { error: 'Either content or article link is required' },
        { status: 400 }
      );
    }

    if (hasContent && hasArticleLink) {
      return NextResponse.json(
        { error: 'Cannot provide both content and article link' },
        { status: 400 }
      );
    }

    // Remove any non-column fields from update (these are joined fields, not database columns)
    const updateFields = { ...updatedData };
    delete updateFields.resource_types;
    delete updateFields.resource_type;
    delete updateFields.type;

    const { data, error } = await supabase
      .from('resources')
      .update(updateFields)
      .eq('id', resourceId)
      .select('*')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Resource not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: 'Failed to update resource' },
        { status: 500 }
      );
    }

    // Fetch the resource type
    const { data: resourceType } = await supabase
      .from('resource_type')
      .select('id, name')
      .eq('id', data.type_id)
      .single();

    // Transform response
    return NextResponse.json({
      ...data,
      type: resourceType?.name || null,
      resource_type: resourceType || null,
    });
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/resources/[id] - Delete resource
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const resourceId = parseInt(id);

    if (isNaN(resourceId)) {
      return NextResponse.json(
        { error: 'Invalid resource ID' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('resources')
      .delete()
      .eq('id', resourceId);

    if (error) {
      return NextResponse.json(
        { error: 'Failed to delete resource' },
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
