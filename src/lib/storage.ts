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

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return {
        success: false,
        error: 'File must be an image',
      };
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return {
        success: false,
        error: 'File size must be less than 5MB',
      };
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const fullPath = `${FOLDER_NAME}/${fileName}`;

    // Upload using authenticated client
    const { error } = await supabaseClient.storage
      .from(BUCKET_NAME)
      .upload(fullPath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    // Get public URL
    const { data: urlData } = supabaseClient.storage
      .from(BUCKET_NAME)
      .getPublicUrl(fullPath);

    return {
      success: true,
      url: urlData.publicUrl,
    };
  } catch {
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
      return false;
    }

    const { error } = await supabaseClient.storage
      .from(BUCKET_NAME)
      .remove([fileName]);

    if (error) {
      return false;
    }

    return true;
  } catch {
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
    // Check if user is authenticated
    const {
      data: { session },
    } = await supabaseClient.auth.getSession();
    if (!session) {
      return false;
    }

    const { error } = await supabaseClient.storage
      .from(BUCKET_NAME)
      .list(FOLDER_NAME, { limit: 1 });

    if (error) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
};

// PDF upload function for vendor portfolio
export const uploadVendorPortfolio = async (
  file: File
): Promise<UploadResult> => {
  try {
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

    // Validate file type
    if (file.type !== 'application/pdf') {
      return {
        success: false,
        error: 'File must be a PDF',
      };
    }

    // Validate file size (max 10MB for PDFs)
    if (file.size > 10 * 1024 * 1024) {
      return {
        success: false,
        error: 'File size must be less than 10MB',
      };
    }

    // Use fixed filename for vendor portfolio
    const fileName = 'Netpoleon ANZ Vendor Portfolio.pdf';
    const fullPath = `public/${fileName}`;

    // Upload to Supabase storage in the files bucket
    const { error } = await supabaseClient.storage
      .from('files')
      .upload(fullPath, file, {
        cacheControl: '3600',
        upsert: true, // This will replace the file if it exists
      });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    // Get public URL
    const { data: urlData } = supabaseClient.storage
      .from('files')
      .getPublicUrl(fullPath);

    return {
      success: true,
      url: urlData.publicUrl,
    };
  } catch {
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

    // Validate file type
    if (file.type !== 'application/pdf') {
      return {
        success: false,
        error: 'File must be a PDF',
      };
    }

    // Validate file size (max 10MB for PDFs)
    if (file.size > 10 * 1024 * 1024) {
      return {
        success: false,
        error: 'File size must be less than 10MB',
      };
    }

    // Use fixed filename for vendor registration form
    const fileName = 'Netpoleon ANZ Vendor Registration Form.pdf';
    const fullPath = `public/${fileName}`;

    // Upload to Supabase storage in the files bucket
    const { error } = await supabaseClient.storage
      .from('files')
      .upload(fullPath, file, {
        cacheControl: '3600',
        upsert: true, // This will replace the file if it exists
      });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    // Get public URL
    const { data: urlData } = supabaseClient.storage
      .from('files')
      .getPublicUrl(fullPath);

    return {
      success: true,
      url: urlData.publicUrl,
    };
  } catch {
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
