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
      .insert([
        {
          title: body.title,
          description: body.description || null,
          content: body.content,
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

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
