import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Force dynamic rendering - prevent static analysis during build
export const dynamic = 'force-dynamic';

// GET /api/resources - Fetch all resources
export async function GET() {
  try {
    // Fetch resources
    const { data: resources, error: resourcesError } = await supabase
      .from('resources')
      .select('*')
      .order('created_at', { ascending: false });

    if (resourcesError) {
      return NextResponse.json(
        { error: 'Failed to fetch resources' },
        { status: 500 }
      );
    }

    // Fetch all resource types
    const { data: resourceTypes, error: typesError } = await supabase
      .from('resource_type')
      .select('id, name');

    if (typesError) {
      // Continue without types rather than failing
    }

    // Create a map of type_id -> type name
    const typeMap = new Map((resourceTypes || []).map(type => [type.id, type]));

    // Transform data to include type name for backwards compatibility
    const transformedData = (resources || []).map(resource => {
      const resourceType = typeMap.get(resource.type_id);
      return {
        ...resource,
        type: resourceType?.name || null, // Add type name for display
        resource_type: resourceType || null,
      };
    });

    return NextResponse.json(transformedData);
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/resources - Create new resource
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Basic validation
    if (!body.title || !body.type_id) {
      return NextResponse.json(
        { error: 'Title and type_id are required' },
        { status: 400 }
      );
    }

    // Validate type_id exists
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

    // Validate that either content or article_link is provided, but not both
    const hasContent = body.content && body.content.trim().length > 0;
    const hasArticleLink =
      body.article_link && body.article_link.trim().length > 0;

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

    const { data, error } = await supabase
      .from('resources')
      .insert([
        {
          title: body.title,
          description: body.description || null,
          content: body.content || '',
          type_id: body.type_id,
          published_at: body.published_at || null,
          is_published: body.is_published || false,
          cover_image_url: body.cover_image_url || null,
          article_link: body.article_link || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select('*')
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Failed to create resource' },
        { status: 500 }
      );
    }

    // Fetch the resource type for the response
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
