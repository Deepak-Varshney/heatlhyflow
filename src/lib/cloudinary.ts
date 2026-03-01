/**
 * Cloudinary Upload Service
 * Handles image uploads for test reports, clinic settings, and watermarks
 */

import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface CloudinaryUploadResponse {
  url: string;
  secure_url: string;
  public_id: string;
  width?: number;
  height?: number;
  format?: string;
  size?: number;
  duration?: number;
}

export interface UploadOptions {
  folder?: string;
  resource_type?: 'image' | 'video' | 'raw' | 'auto';
  maxFileSize?: number; // in bytes
  allowedFormats?: string[];
}

/**
 * Generate Cloudinary upload signature for client-side uploads
 * More secure than server-side uploads
 */
export function generateUploadSignature(folder: string = 'mednest') {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const params = {
    folder,
    timestamp,
  };

  const paramsStr = Object.entries(params)
    .sort()
    .map(([key, value]) => `${key}=${value}`)
    .join('&');

  const signature = require('crypto')
    .createHash('sha256')
    .update(paramsStr + process.env.CLOUDINARY_API_SECRET!)
    .digest('hex');

  return { signature, timestamp, folder };
}

/**
 * Upload file to Cloudinary (server-side)
 * Use this for server-side uploads where security is critical
 */
export async function uploadToCloudinary(
  file: File | Buffer | string,
  options: UploadOptions = {}
): Promise<CloudinaryUploadResponse> {
  const {
    folder = 'mednest',
    resource_type = 'auto',
    maxFileSize = 10 * 1024 * 1024, // 10MB default
    allowedFormats = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'pdf'],
  } = options;

  try {
    // Validate file size if it's a File object
    if (file instanceof File && file.size > maxFileSize) {
      throw new Error(
        `File size exceeds maximum allowed size of ${maxFileSize / (1024 * 1024)}MB`
      );
    }

    // Convert File to Buffer if needed
    let uploadData: any;
    if (file instanceof File) {
      uploadData = await file.arrayBuffer();
    } else if (typeof file === 'string') {
      uploadData = file; // Data URL or file path
    } else {
      uploadData = file; // Already a buffer
    }

    // Upload to Cloudinary
    const result = await new Promise<CloudinaryUploadResponse>(
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder,
            resource_type,
            allowed_formats: allowedFormats,
            eager: [
              {
                quality: 'auto',
                fetch_format: 'auto',
              },
            ],
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result as CloudinaryUploadResponse);
            }
          }
        );

        if (uploadData instanceof ArrayBuffer) {
          uploadStream.end(Buffer.from(uploadData));
        } else {
          uploadStream.end(uploadData);
        }
      }
    );

    return result;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error(
      `Failed to upload file: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Delete image from Cloudinary
 */
export async function deleteFromCloudinary(publicId: string): Promise<boolean> {
  try {
    await cloudinary.uploader.destroy(publicId);
    return true;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error(
      `Failed to delete file: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Get Cloudinary image URL with transformations
 */
export function getCloudinaryUrl(
  publicId: string,
  options?: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string;
    format?: string;
  }
): string {
  const params = new URLSearchParams();
  if (options?.width) params.append('w', options.width.toString());
  if (options?.height) params.append('h', options.height.toString());
  if (options?.crop) params.append('c', options.crop);
  if (options?.quality) params.append('q', options.quality);
  if (options?.format) params.append('f', options.format);

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const baseUrl = `https://res.cloudinary.com/${cloudName}/image/upload`;
  
  if (Object.keys(params).length === 0) {
    return `${baseUrl}/${publicId}`;
  }
  
  return `${baseUrl}?${params.toString()}/${publicId}`;
}

/**
 * Transform image URL for watermark display on OPD card and invoice
 * Applies opacity and positioning for watermark effect
 */
export function getWatermarkUrl(
  publicId: string,
  opacity: number = 0.3
): string {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  
  // Use Cloudinary's transformation API
  // e_opacity:${Math.round(opacity * 100)} sets the opacity
  return `https://res.cloudinary.com/${cloudName}/image/upload/e_opacity:${Math.round(
    opacity * 100
  )}/${publicId}`;
}

/**
 * Generate watermarked image (overlays watermark on document)
 * Useful for OPD card and invoice watermarking
 */
export function generateWatermarkedUrl(
  documentUrl: string,
  watermarkPublicId: string,
  options?: {
    gravity?: 'center' | 'north' | 'south' | 'east' | 'west' | 'north_east' | 'north_west' | 'south_east' | 'south_west';
    opacity?: number;
    scale?: number;
  }
): string {
  const {
    gravity = 'center',
    opacity = 0.3,
    scale = 0.3,
  } = options || {};

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  // Create transformation with watermark overlay
  const transformation = `e_opacity:${Math.round(
    opacity * 100
  )},w_${Math.round(scale * 1000)},g_${gravity},x_0,y_0`;

  // Encode the watermark source
  const watermarkUrl = `${cloudName}/${watermarkPublicId}`;

  // Use l_ (layer) parameter for overlay
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformation}/l_${watermarkUrl}/fl_layer_apply,g_${gravity}/${documentUrl}`;
}

export default {
  generateUploadSignature,
  uploadToCloudinary,
  deleteFromCloudinary,
  getCloudinaryUrl,
  getWatermarkUrl,
  generateWatermarkedUrl,
};
