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
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch resource' },
        { status: 500 }
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

    // Basic validation
    if (!body.title || !body.type) {
      return NextResponse.json(
        { error: 'Title and type are required' },
        { status: 400 }
      );
    }

    // Content is only required for blog posts, not for articles
    if (body.type === 'blog' && !body.content) {
      return NextResponse.json(
        { error: 'Content is required for blog posts' },
        { status: 400 }
      );
    }

    // Article link is required for articles
    if (body.type === 'article' && !body.article_link) {
      return NextResponse.json(
        { error: 'Article link is required for articles' },
        { status: 400 }
      );
    }

    // Validate type
    if (!['article', 'blog'].includes(body.type)) {
      return NextResponse.json(
        { error: 'Type must be either "article" or "blog"' },
        { status: 400 }
      );
    }

    // Validate article_link is only provided for articles
    if (body.article_link && body.type !== 'article') {
      return NextResponse.json(
        {
          error: 'Article link can only be provided for article type resources',
        },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('resources')
      .update({
        title: body.title,
        description: body.description || null,
        content: body.content,
        type: body.type,
        published_at: body.published_at || null,
        is_published: body.is_published || false,
        cover_image_url: body.cover_image_url || null,
        article_link: body.article_link || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', resourceId)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Resource not found' },
          { status: 404 }
        );
      }
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to update resource' },
        { status: 500 }
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
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to delete resource' },
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
