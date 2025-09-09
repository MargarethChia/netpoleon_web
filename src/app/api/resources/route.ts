import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/resources - Fetch all resources
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch resources' },
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

// POST /api/resources - Create new resource
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Basic validation
    if (!body.title || !body.type) {
      return NextResponse.json(
        { error: 'Title and type are required' },
        { status: 400 }
      );
    }

    // Validate type
    if (!['article', 'blog', 'news'].includes(body.type)) {
      return NextResponse.json(
        { error: 'Type must be either "article", "blog", or "news"' },
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
          type: body.type,
          published_at: body.published_at || null,
          is_published: body.is_published || false,
          cover_image_url: body.cover_image_url || null,
          article_link: body.article_link || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to create resource' },
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
