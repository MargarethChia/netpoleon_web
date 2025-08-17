import { supabase } from './supabase'

const BUCKET_NAME = 'images'
const FOLDER_NAME = 'public'

export interface UploadResult {
  success: boolean
  url?: string
  error?: string
}

export const uploadImage = async (file: File): Promise<UploadResult> => {
  try {
    console.log('Starting upload for file:', file.name, 'Size:', file.size, 'Type:', file.type)
    console.log('Environment check - Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not set')
    console.log('Environment check - Supabase Anon Key:', process.env.NEXT_PUBLIC_ANON_KEY ? 'Set' : 'Not set')
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      console.log('File type validation failed:', file.type)
      return {
        success: false,
        error: 'File must be an image'
      }
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      console.log('File size validation failed:', file.size)
      return {
        success: false,
        error: 'File size must be less than 5MB'
      }
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const fullPath = `${FOLDER_NAME}/${fileName}`
    
    console.log('Uploading to path:', fullPath)
    console.log('Bucket:', BUCKET_NAME)
    console.log('Supabase client:', !!supabase)
    console.log('Supabase client details:', {
      hasStorage: !!supabase.storage
    })

    // Test bucket access first
    console.log('Testing bucket access...')
    const bucketAccess = await testBucketAccess()
    if (!bucketAccess) {
      return {
        success: false,
        error: 'Cannot access storage bucket. Please check permissions.'
      }
    }

    // Upload to Supabase storage in the public folder
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fullPath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Upload error:', error)
      console.error('Error details:', {
        message: error.message,
        name: error.name
      })
      return {
        success: false,
        error: error.message
      }
    }

    console.log('Upload successful, data:', data)

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(fullPath)

    console.log('Public URL data:', urlData)

    return {
      success: true,
      url: urlData.publicUrl
    }
  } catch (error) {
    console.error('Unexpected error during upload:', error)
    return {
      success: false,
      error: 'Failed to upload image'
    }
  }
}

export const deleteImage = async (fileName: string): Promise<boolean> => {
  try {
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([fileName])

    if (error) {
      console.error('Delete error:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Unexpected error during delete:', error)
    return false
  }
}

// Extract filename from URL for deletion
export const getFileNameFromUrl = (url: string): string | null => {
  try {
    const urlObj = new URL(url)
    const pathParts = urlObj.pathname.split('/')
    return pathParts[pathParts.length - 1]
  } catch {
    return null
  }
}

// Test bucket access
export const testBucketAccess = async (): Promise<boolean> => {
  try {
    console.log('Testing bucket access for:', BUCKET_NAME)
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .list(FOLDER_NAME, { limit: 1 })
    
    if (error) {
      console.error('Bucket access test failed:', error)
      return false
    }
    
    console.log('Bucket access test successful:', data)
    return true
  } catch (error) {
    console.error('Bucket access test error:', error)
    return false
  }
} 