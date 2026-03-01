'use server';

import { uploadToCloudinary, UploadOptions, CloudinaryUploadResponse } from '@/lib/cloudinary';
import { getMongoUser } from '@/lib/CheckUser';

/**
 * Upload file to Cloudinary with authentication
 * Server-side upload for security
 */
export async function uploadFile(
  fileData: string, // Base64 or data URL
  fileName: string,
  folder: string = 'mednest',
  options: UploadOptions = {}
): Promise<{ success: boolean; data?: CloudinaryUploadResponse; error?: string }> {
  try {
    // Verify user is authenticated
    const user = await getMongoUser();
    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Validate file data
    if (!fileData || !fileName) {
      return { success: false, error: 'File data and name are required' };
    }

    // Add organization folder for better organization in Cloudinary
    const folderPath = `${folder}/${user.organization}`;

    // Upload to Cloudinary
    const result = await uploadToCloudinary(fileData, {
      ...options,
      folder: folderPath,
    });

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error('Upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    };
  }
}

/**
 * Upload test report image
 */
export async function uploadTestReport(
  fileData: string,
  fileName: string
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const result = await uploadFile(fileData, fileName, 'test-reports', {
      resource_type: 'image',
      folder: 'test-reports',
      maxFileSize: 10 * 1024 * 1024, // 10MB for medical images
      allowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'pdf'],
    });

    if (result.success && result.data) {
      return { success: true, url: result.data.secure_url };
    }

    return { success: false, error: result.error };
  } catch (error) {
    console.error('Test report upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    };
  }
}

/**
 * Upload clinic watermark image
 */
export async function uploadWatermark(
  fileData: string,
  fileName: string
): Promise<{ success: boolean; url?: string; publicId?: string; error?: string }> {
  try {
    const result = await uploadFile(fileData, fileName, 'watermarks', {
      resource_type: 'image',
      folder: 'watermarks',
      maxFileSize: 5 * 1024 * 1024, // 5MB for watermarks
      allowedFormats: ['png', 'jpeg', 'jpg', 'gif', 'webp'],
    });

    if (result.success && result.data) {
      return {
        success: true,
        url: result.data.secure_url,
        publicId: result.data.public_id,
      };
    }

    return { success: false, error: result.error };
  } catch (error) {
    console.error('Watermark upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    };
  }
}

/**
 * Upload clinic logo or other clinic settings images
 */
export async function uploadClinicImage(
  fileData: string,
  fileName: string
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const result = await uploadFile(fileData, fileName, 'clinic-images', {
      resource_type: 'image',
      folder: 'clinic-images',
      maxFileSize: 5 * 1024 * 1024, // 5MB
      allowedFormats: ['png', 'jpeg', 'jpg', 'gif', 'webp'],
    });

    if (result.success && result.data) {
      return { success: true, url: result.data.secure_url };
    }

    return { success: false, error: result.error };
  } catch (error) {
    console.error('Clinic image upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    };
  }
}

/**
 * Upload OPD card or invoice image
 */
export async function uploadDocumentImage(
  fileData: string,
  fileName: string,
  documentType: 'opd-card' | 'invoice' = 'opd-card'
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const result = await uploadFile(fileData, fileName, `documents/${documentType}`, {
      resource_type: 'image',
      folder: `documents/${documentType}`,
      maxFileSize: 10 * 1024 * 1024, // 10MB
      allowedFormats: ['png', 'jpeg', 'jpg', 'pdf', 'webp'],
    });

    if (result.success && result.data) {
      return { success: true, url: result.data.secure_url };
    }

    return { success: false, error: result.error };
  } catch (error) {
    console.error('Document upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    };
  }
}
