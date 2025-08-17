import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/resources/featured - Fetch all featured resources
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('featured_resource')
      .select(`
        *,
        resources (*)
      `)
      .order('featured_at', { ascending: false })
    
    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch featured resources' },
        { status: 500 }
      )
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/resources/featured - Add featured resource
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Basic validation
    if (!body.resource_id) {
      return NextResponse.json(
        { error: 'Resource ID is required' },
        { status: 400 }
      )
    }

    const resourceId = parseInt(body.resource_id)
    if (isNaN(resourceId)) {
      return NextResponse.json(
        { error: 'Invalid resource ID' },
        { status: 400 }
      )
    }

    // Check if resource exists
    const { data: resource, error: resourceError } = await supabase
      .from('resources')
      .select('id')
      .eq('id', resourceId)
      .single()
    
    if (resourceError || !resource) {
      return NextResponse.json(
        { error: 'Resource not found' },
        { status: 404 }
      )
    }

    // Remove any existing featured resource first (single selection behavior)
    const { error: deleteError } = await supabase
      .from('featured_resource')
      .delete()
      .neq('id', 0) // Delete all existing featured resources
    
    if (deleteError) {
      console.error('Database error deleting existing featured:', deleteError)
      return NextResponse.json(
        { error: 'Failed to remove existing featured resource' },
        { status: 500 }
      )
    }

    const { data, error } = await supabase
      .from('featured_resource')
      .insert([{
        resource_id: resourceId,
        featured_at: new Date().toISOString()
      }])
      .select()
      .single()
    
    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to add featured resource' },
        { status: 500 }
      )
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/resources/featured - Remove featured resource
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Basic validation
    if (!body.resource_id) {
      return NextResponse.json(
        { error: 'Resource ID is required' },
        { status: 400 }
      )
    }

    const resourceId = parseInt(body.resource_id)
    if (isNaN(resourceId)) {
      return NextResponse.json(
        { error: 'Invalid resource ID' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('featured_resource')
      .delete()
      .eq('resource_id', resourceId)
    
    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to remove featured resource' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 