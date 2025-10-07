import { supabaseClient } from './supabase-client';

const BUCKET_NAME = 'images';
const FOLDER_NAME = 'public';

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export const uploadImage = async (file: File): Promise<UploadResult> => {
  try {
    console.log(
      'Starting upload for file:',
      file.name,
      'Size:',
      file.size,
      'Type:',
      file.type
    );

    // Check if user is authenticated
    const {
      data: { session },
    } = await supabaseClient.auth.getSession();
    if (!session) {
      return {
        success: false,
        error: 'Authentication required. Please log in to upload images.',
      };
    }

    console.log('User authenticated:', session.user.email);

    // Validate file type
    if (!file.type.startsWith('image/')) {
      console.log('File type validation failed:', file.type);
      return {
        success: false,
        error: 'File must be an image',
      };
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      console.log('File size validation failed:', file.size);
      return {
        success: false,
        error: 'File size must be less than 5MB',
      };
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const fullPath = `${FOLDER_NAME}/${fileName}`;

    console.log('Uploading to path:', fullPath);
    console.log('Bucket:', BUCKET_NAME);
    console.log('Using authenticated client');

    // Upload using authenticated client
    const { data, error } = await supabaseClient.storage
      .from(BUCKET_NAME)
      .upload(fullPath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Upload error:', error);
      console.error('Error details:', {
        message: error.message,
        name: error.name,
      });
      return {
        success: false,
        error: error.message,
      };
    }

    console.log('Upload successful, data:', data);

    // Get public URL
    const { data: urlData } = supabaseClient.storage
      .from(BUCKET_NAME)
      .getPublicUrl(fullPath);

    console.log('Public URL data:', urlData);

    return {
      success: true,
      url: urlData.publicUrl,
    };
  } catch (error) {
    console.error('Unexpected error during upload:', error);
    return {
      success: false,
      error: 'Failed to upload image',
    };
  }
};

export const deleteImage = async (fileName: string): Promise<boolean> => {
  try {
    // Check if user is authenticated
    const {
      data: { session },
    } = await supabaseClient.auth.getSession();
    if (!session) {
      console.error('Authentication required for deletion');
      return false;
    }

    const { error } = await supabaseClient.storage
      .from(BUCKET_NAME)
      .remove([fileName]);

    if (error) {
      console.error('Delete error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Unexpected error during delete:', error);
    return false;
  }
};

// Extract filename from URL for deletion
export const getFileNameFromUrl = (url: string) => {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    return pathParts[pathParts.length - 1];
  } catch {
    return null;
  }
};

// Test bucket access
export const testBucketAccess = async () => {
  try {
    console.log('Testing bucket access for:', BUCKET_NAME);

    // Check if user is authenticated
    const {
      data: { session },
    } = await supabaseClient.auth.getSession();
    if (!session) {
      console.error('Authentication required for bucket access test');
      return false;
    }

    const { data, error } = await supabaseClient.storage
      .from(BUCKET_NAME)
      .list(FOLDER_NAME, { limit: 1 });

    if (error) {
      console.error('Bucket access test failed:', error);
      return false;
    }

    console.log('Bucket access test successful:', data);
    return true;
  } catch (error) {
    console.error('Bucket access test error:', error);
    return false;
  }
};

// PDF upload function for vendor portfolio
export const uploadVendorPortfolio = async (
  file: File
): Promise<UploadResult> => {
  try {
    console.log(
      'Starting PDF upload for file:',
      file.name,
      'Size:',
      file.size,
      'Type:',
      file.type
    );

    // Check if user is authenticated
    const {
      data: { session },
    } = await supabaseClient.auth.getSession();
    if (!session) {
      return {
        success: false,
        error: 'Authentication required. Please log in to upload files.',
      };
    }

    console.log('User authenticated:', session.user.email);

    // Validate file type
    if (file.type !== 'application/pdf') {
      console.log('File type validation failed:', file.type);
      return {
        success: false,
        error: 'File must be a PDF',
      };
    }

    // Validate file size (max 10MB for PDFs)
    if (file.size > 10 * 1024 * 1024) {
      console.log('File size validation failed:', file.size);
      return {
        success: false,
        error: 'File size must be less than 10MB',
      };
    }

    // Use fixed filename for vendor portfolio
    const fileName = 'Netpoleon ANZ Vendor Portfolio.pdf';
    const fullPath = `public/${fileName}`;

    console.log('Uploading PDF to path:', fullPath);
    console.log('Files bucket: files');
    console.log('Using authenticated client');

    // Upload to Supabase storage in the files bucket
    const { data, error } = await supabaseClient.storage
      .from('files')
      .upload(fullPath, file, {
        cacheControl: '3600',
        upsert: true, // This will replace the file if it exists
      });

    if (error) {
      console.error('PDF upload error:', error);
      console.error('Error details:', {
        message: error.message,
        name: error.name,
      });
      return {
        success: false,
        error: error.message,
      };
    }

    console.log('PDF upload successful, data:', data);

    // Get public URL
    const { data: urlData } = supabaseClient.storage
      .from('files')
      .getPublicUrl(fullPath);

    console.log('Public URL data:', urlData);

    return {
      success: true,
      url: urlData.publicUrl,
    };
  } catch (error) {
    console.error('Unexpected error during PDF upload:', error);
    return {
      success: false,
      error: 'Failed to upload PDF',
    };
  }
};

// Get vendor portfolio URL
export const getVendorPortfolioUrl = (): string => {
  const { data } = supabaseClient.storage
    .from('files')
    .getPublicUrl('public/Netpoleon ANZ Vendor Portfolio.pdf');

  return data.publicUrl;
};

// Vendor Registration Form upload function
export const uploadVendorRegistrationForm = async (
  file: File
): Promise<UploadResult> => {
  try {
    console.log(
      'Starting Registration Form upload for file:',
      file.name,
      'Size:',
      file.size,
      'Type:',
      file.type
    );

    // Check if user is authenticated
    const {
      data: { session },
    } = await supabaseClient.auth.getSession();
    if (!session) {
      return {
        success: false,
        error: 'Authentication required. Please log in to upload files.',
      };
    }

    console.log('User authenticated:', session.user.email);

    // Validate file type
    if (file.type !== 'application/pdf') {
      console.log('File type validation failed:', file.type);
      return {
        success: false,
        error: 'File must be a PDF',
      };
    }

    // Validate file size (max 10MB for PDFs)
    if (file.size > 10 * 1024 * 1024) {
      console.log('File size validation failed:', file.size);
      return {
        success: false,
        error: 'File size must be less than 10MB',
      };
    }

    // Use fixed filename for vendor registration form
    const fileName = 'Netpoleon ANZ Vendor Registration Form.pdf';
    const fullPath = `public/${fileName}`;

    console.log('Uploading Registration Form to path:', fullPath);
    console.log('Files bucket: files');
    console.log('Using authenticated client');

    // Upload to Supabase storage in the files bucket
    const { data, error } = await supabaseClient.storage
      .from('files')
      .upload(fullPath, file, {
        cacheControl: '3600',
        upsert: true, // This will replace the file if it exists
      });

    if (error) {
      console.error('Registration Form upload error:', error);
      console.error('Error details:', {
        message: error.message,
        name: error.name,
      });
      return {
        success: false,
        error: error.message,
      };
    }

    console.log('Registration Form upload successful, data:', data);

    // Get public URL
    const { data: urlData } = supabaseClient.storage
      .from('files')
      .getPublicUrl(fullPath);

    console.log('Public URL data:', urlData);

    return {
      success: true,
      url: urlData.publicUrl,
    };
  } catch (error) {
    console.error('Unexpected error during Registration Form upload:', error);
    return {
      success: false,
      error: 'Failed to upload Registration Form',
    };
  }
};

// Get vendor registration form URL
export const getVendorRegistrationFormUrl = (): string => {
  const { data } = supabaseClient.storage
    .from('files')
    .getPublicUrl('public/Netpoleon ANZ Vendor Registration Form.pdf');

  return data.publicUrl;
};
