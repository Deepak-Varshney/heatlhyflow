# Cloudinary Integration Guide

## Overview

This document describes the complete Cloudinary integration for:
- **Test Report Images**: Medical test reports uploaded by doctors per prescription
- **Clinic Settings & Watermarks**: Clinic logos and watermark images for OPD cards and invoices
- **Document Watermarking**: Automatic watermark overlay on invoices and OPD cards

## Setup Instructions

### 1. Get Cloudinary Credentials

1. Sign up at [Cloudinary.com](https://cloudinary.com)
2. Go to your Dashboard to find:
   - **Cloud Name**: Your unique Cloudinary identifier
   - **API Key**: Used for authenticated requests
   - **API Secret**: Keep this private, use only on server-side

### 2. Environment Variables

Add these to your `.env.local` file:

```env
# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

⚠️ **Security Note**: 
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` is public (exposed in browser)
- `CLOUDINARY_API_KEY` and `CLOUDINARY_API_SECRET` are private and used only on server

### 3. Verify Configuration

Run the app and check:
```bash
npm run dev  # or pnpm dev
```

## Implementation Details

### File Structure

```
src/
├── lib/
│   └── cloudinary.ts          # Cloudinary utilities & transformations
├── actions/
│   └── upload-actions.ts      # Server-side upload actions
├── components/
│   ├── prescription-form.tsx  # Test report uploads
│   └── doctor-clinic-settings.tsx # Watermark uploads
```

### Cloudinary Service (`src/lib/cloudinary.ts`)

Provides utility functions:

```typescript
// Generate upload signature for client-side uploads
generateUploadSignature(folder)

// Upload file to Cloudinary (server-side)
uploadToCloudinary(file, options)

// Delete image from Cloudinary
deleteFromCloudinary(publicId)

// Get URL with transformations
getCloudinaryUrl(publicId, options)

// Get watermark URL with opacity
getWatermarkUrl(publicId, opacity)

// Generate watermarked image (overlay)
generateWatermarkedUrl(documentUrl, watermarkPublicId, options)
```

### Server Actions (`src/actions/upload-actions.ts`)

All uploads are server-side for security:

```typescript
// Generic file upload
uploadFile(fileData, fileName, folder, options)

// Test report specific
uploadTestReport(fileData, fileName)

// Watermark specific
uploadWatermark(fileData, fileName)

// Clinic images
uploadClinicImage(fileData, fileName)

// OPD card and invoice
uploadDocumentImage(fileData, fileName, documentType)
```

## Usage Examples

### Test Report Upload (Prescription Form)

```typescript
import { uploadTestReport } from '@/actions/upload-actions';

const handleImageUpload = async (file: File): Promise<string> => {
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onload = async () => {
      const base64Data = reader.result as string;
      const result = await uploadTestReport(base64Data, file.name);
      
      if (result.success && result.url) {
        resolve(result.url); // Use URL in prescription
      } else {
        reject(new Error(result.error));
      }
    };
    reader.readAsDataURL(file);
  });
};
```

### Watermark Upload (Clinic Settings)

```typescript
import { uploadWatermark } from '@/actions/upload-actions';

const handleWatermarkUpload = async (file: File): Promise<string> => {
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onload = async () => {
      const base64Data = reader.result as string;
      const result = await uploadWatermark(base64Data, file.name);
      
      if (result.success && result.url) {
        resolve(result.url);
      } else {
        reject(new Error(result.error));
      }
    };
    reader.readAsDataURL(file);
  });
};
```

### Apply Watermark to Document

```typescript
import { generateWatermarkedUrl } from '@/lib/cloudinary';

// Apply watermark to invoice/OPD card
const watermarkedUrl = generateWatermarkedUrl(
  invoicePublicId,
  watermarkPublicId,
  {
    gravity: 'center',    // Position: center, north, south, etc.
    opacity: 0.3,         // 30% opacity
    scale: 0.3            // Scale watermark to 30% of image
  }
);
```

## Folder Structure in Cloudinary

Uploads are organized by type and organization:

```
mednest/
├── {organizationId}/
│   ├── test-reports/       # Medical test report images
│   ├── watermarks/         # Clinic watermark logos
│   ├── clinic-images/      # Other clinic images
│   └── documents/
│       ├── opd-card/       # OPD card images
│       └── invoice/        # Invoice images
```

## File Upload Limits

- **Test Reports**: 10MB max (supports jpg, jpeg, png, gif, pdf)
- **Watermarks**: 5MB max (supports png, jpeg, jpg, gif, webp)
- **Clinic Images**: 5MB max (supports png, jpeg, jpg, gif, webp)
- **Documents**: 10MB max (supports png, jpeg, jpg, pdf, webp)

## Database Schema

### Prescription Model (Test Reports)

```typescript
interface ITest {
  name: string;
  notes?: string;
  reportImageUrl?: string;  // Cloudinary URL
  price?: number;
}
```

### User Model (Clinic Settings)

```typescript
interface IUser {
  clinicName?: string;
  clinicAddress?: string;
  clinicPhone?: string;
  watermarkImageUrl?: string;  // Cloudinary URL
}
```

## Security Considerations

✅ **Server-Side Uploads**: All uploads validated on server
✅ **Organization Isolation**: Files organized by organization
✅ **API Secret Protection**: Never exposed in client code
✅ **File Type Validation**: Only allowed formats accepted
✅ **Size Limits**: Enforced per file type

⚠️ **Best Practices**:
- Don't expose `CLOUDINARY_API_SECRET` in frontend
- Always validate file types before upload
- Use organization folders for multi-tenant isolation
- Implement rate limiting for file uploads
- Monitor Cloudinary usage to avoid unexpected charges

## Cloudinary Dashboard Features

Your Cloudinary dashboard provides:
- **Media Library**: Browse all uploaded files
- **Transformations**: Test image transformations
- **Usage Statistics**: Monitor storage and bandwidth
- **API Rate Limits**: Check API quota
- **Webhooks**: Set up event notifications

## Transformations Examples

```typescript
// Get optimized image
getCloudinaryUrl(publicId, {
  width: 800,
  crop: 'fill',
  quality: 'auto',
  format: 'webp'
})

// Get thumbnail
getCloudinaryUrl(publicId, {
  width: 200,
  height: 200,
  crop: 'thumb',
  format: 'auto'
})

// Get watermark with opacity
getWatermarkUrl(publicId, 0.2) // 20% opacity
```

## Troubleshooting

### Upload Fails

**Error**: "Not authenticated"
- Ensure user is logged in
- Check Clerk authentication status

**Error**: "File size exceeds maximum"
- Check file size against limits above
- Compress test reports before upload

**Error**: "Invalid file format"
- Only jpg, jpeg, png, gif, webp, pdf supported
- Convert other formats before upload

### Watermark Not Displaying

**Issue**: Watermark overlay looks wrong
- Check gravity setting (center, north, south, etc.)
- Verify opacity value (0-1 range)
- Test in Cloudinary media library

**Issue**: Wrong image dimensions
- Use `getCloudinaryUrl` with width/height
- Test transformations in Cloudinary UI

### Performance Issues

**Slow uploads**: 
- Check file size
- Optimize images before upload
- Monitor network connection

**Slow display**:
- Use `auto` quality for optimization
- Use `webp` format for better compression
- Enable image lazy loading

## Testing

### Manual Testing Checklist

- [ ] Upload test report to prescription
- [ ] Verify image displays in prescription form
- [ ] Upload watermark to clinic settings
- [ ] Verify watermark saves to database
- [ ] Apply watermark to invoice
- [ ] Verify watermark appears correctly
- [ ] Test with different file sizes
- [ ] Test with different image formats
- [ ] Verify multi-organization isolation

### Automated Testing

```typescript
// Example test
test('should upload test report', async () => {
  const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
  const result = await uploadTestReport(base64Data, file.name);
  
  expect(result.success).toBe(true);
  expect(result.url).toContain('cloudinary.com');
});
```

## Monitoring & Analytics

Monitor these in Cloudinary dashboard:

1. **Storage Usage**: Total amount of storage used
2. **Bandwidth**: Data transferred to users
3. **API Calls**: Number of upload/delete operations
4. **Transformation Requests**: Image transformations
5. **Monthly Costs**: Estimate based on usage

## Migration from Previous Solution

If you had placeholder uploads before:

```typescript
// Old code (placeholder)
const fakeUrl = `https://fake-upload-service.com/uploads/${file.name}`;

// New code (real Cloudinary)
const result = await uploadTestReport(base64Data, file.name);
const realUrl = result.url; // Real Cloudinary URL
```

## Support & Resources

- [Cloudinary Docs](https://cloudinary.com/documentation)
- [Node.js SDK](https://github.com/cloudinary/cloudinary_npm)
- [next-cloudinary](https://next.cloudinary.dev/)
- [Issue Repository](https://github.com/cloudinary-labs/next-cloudinary)

## Changelog

### v1.0.0 (Initial Implementation)
- ✅ Test report image uploads
- ✅ Clinic watermark uploads
- ✅ Watermark overlay transformation
- ✅ Organization-based file organization
- ✅ Server-side upload security
