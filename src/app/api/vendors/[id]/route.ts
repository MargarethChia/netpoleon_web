import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/vendors/[id] - Fetch single vendor
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const vendorId = parseInt(id)
    
    if (isNaN(vendorId)) {
      return NextResponse.json(
        { error: 'Invalid vendor ID' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('vendors')
      .select('*')
      .eq('id', vendorId)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Vendor not found' },
          { status: 404 }
        )
      }
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch vendor' },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/vendors/[id] - Update vendor
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const vendorId = parseInt(id)
    
    if (isNaN(vendorId)) {
      return NextResponse.json(
        { error: 'Invalid vendor ID' },
        { status: 400 }
      )
    }

    const body = await request.json()
    
    // Basic validation
    if (!body.name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('vendors')
      .update({
        name: body.name,
        content: body.content,
        logo_url: body.logo_url || null,
        description: body.description || null,
        content: body.content || null,
        image_url: body.image_url || null,
        link: body.link || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', vendorId)
      .select()
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Vendor not found' },
          { status: 404 }
        )
      }
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to update vendor' },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/vendors/[id] - Delete vendor
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const vendorId = parseInt(id)
    
    if (isNaN(vendorId)) {
      return NextResponse.json(
        { error: 'Invalid vendor ID' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('vendors')
      .delete()
      .eq('id', vendorId)
    
    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to delete vendor' },
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