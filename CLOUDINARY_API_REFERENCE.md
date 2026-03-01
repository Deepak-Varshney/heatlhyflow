# Cloudinary Upload API Reference

## Server Actions (`src/actions/upload-actions.ts`)

All upload operations are server-side for security. These functions:
- Validate user authentication
- Validate file types and sizes
- Organize files by organization
- Return Cloudinary URLs for display

### `uploadFile(fileData, fileName, folder, options)`

Generic file upload function. Use specific functions below instead.

**Parameters:**
- `fileData` (string): Base64 or data URL
- `fileName` (string): Original filename
- `folder` (string): Cloudinary folder (default: "mednest")
- `options` (UploadOptions): Upload configuration

**Returns:**
```typescript
{
  success: boolean;
  data?: CloudinaryUploadResponse;  // On success
  error?: string;                   // On failure
}
```

**Example:**
```typescript
const result = await uploadFile(
  base64Data,
  "test_report.pdf",
  "test-reports",
  { maxFileSize: 10 * 1024 * 1024 }
);
```

---

### `uploadTestReport(fileData, fileName)`

Upload medical test report images for prescriptions.

**Parameters:**
- `fileData` (string): Base64 or data URL of test image
- `fileName` (string): Original filename

**Returns:**
```typescript
{
  success: boolean;
  url?: string;      // Cloudinary secure URL on success
  error?: string;    // Error message on failure
}
```

**Allowed Formats:** jpg, jpeg, png, gif, pdf
**Max Size:** 10MB

**Example:**
```typescript
import { uploadTestReport } from '@/actions/upload-actions';

const file = e.target.files?.[0];
const reader = new FileReader();

reader.onload = async () => {
  const base64 = reader.result as string;
  const result = await uploadTestReport(base64, file.name);
  
  if (result.success) {
    console.log("Upload URL:", result.url);
    // Store URL in prescription form
    form.setValue("tests.0.reportImageUrl", result.url);
  } else {
    console.error("Upload failed:", result.error);
  }
};

reader.readAsDataURL(file);
```

---

### `uploadWatermark(fileData, fileName)`

Upload clinic watermark images for OPD cards and invoices.

**Parameters:**
- `fileData` (string): Base64 or data URL of watermark
- `fileName` (string): Original filename

**Returns:**
```typescript
{
  success: boolean;
  url?: string;          // Secure Cloudinary URL on success
  publicId?: string;     // Public ID for transformations
  error?: string;        // Error message on failure
}
```

**Allowed Formats:** png, jpeg, jpg, gif, webp
**Max Size:** 5MB
**Recommended:** PNG with transparency for watermarks

**Example:**
```typescript
import { uploadWatermark } from '@/actions/upload-actions';

const file = e.target.files?.[0];
const reader = new FileReader();

reader.onload = async () => {
  const base64 = reader.result as string;
  const result = await uploadWatermark(base64, file.name);
  
  if (result.success) {
    console.log("Watermark URL:", result.url);
    console.log("Public ID:", result.publicId);
    // Save to clinic settings
    await updateClinicSettings({
      watermarkImageUrl: result.url
    });
  }
};

reader.readAsDataURL(file);
```

---

### `uploadClinicImage(fileData, fileName)`

Upload clinic logos or other clinic-related images.

**Parameters:**
- `fileData` (string): Base64 or data URL
- `fileName` (string): Original filename

**Returns:**
```typescript
{
  success: boolean;
  url?: string;      // Cloudinary URL on success
  error?: string;    // Error on failure
}
```

**Allowed Formats:** png, jpeg, jpg, gif, webp
**Max Size:** 5MB

---

### `uploadDocumentImage(fileData, fileName, documentType)`

Upload OPD cards or invoice images.

**Parameters:**
- `fileData` (string): Base64 or data URL
- `fileName` (string): Original filename
- `documentType` (string): "opd-card" | "invoice" (default: "opd-card")

**Returns:**
```typescript
{
  success: boolean;
  url?: string;      // Cloudinary URL on success
  error?: string;    // Error on failure
}
```

**Allowed Formats:** png, jpeg, jpg, pdf, webp
**Max Size:** 10MB

**Example:**
```typescript
import { uploadDocumentImage } from '@/actions/upload-actions';

// Upload invoice
const result = await uploadDocumentImage(
  pdfBase64,
  "invoice_doc.pdf",
  "invoice"
);
```

---

## Utilities (`src/lib/cloudinary.ts`)

Low-level functions for advanced use cases.

### `generateUploadSignature(folder)`

Generate secure upload signature for client-side uploads (advanced).

**Parameters:**
- `folder` (string): Folder for uploads

**Returns:**
```typescript
{
  signature: string;
  timestamp: number;
  folder: string;
}
```

**Use Case:** Direct browser uploads without server intermediary (less secure).

---

### `getCloudinaryUrl(publicId, options)`

Get image URL with optional transformations.

**Parameters:**
- `publicId` (string): Cloudinary public ID
- `options` (object):
  - `width` (number): Image width in pixels
  - `height` (number): Image height in pixels
  - `crop` (string): "fill", "fit", "thumb", etc.
  - `quality` (string): "auto", "80", etc.
  - `format` (string): "webp", "auto", "jpg", etc.

**Returns:** (string) Full Cloudinary URL

**Example:**
```typescript
import { getCloudinaryUrl } from '@/lib/cloudinary';

const thumbnailUrl = getCloudinaryUrl(publicId, {
  width: 200,
  height: 200,
  crop: 'thumb',
  format: 'webp'
});

const optimizedUrl = getCloudinaryUrl(publicId, {
  width: 800,
  quality: 'auto',
  format: 'auto'
});
```

---

### `getWatermarkUrl(publicId, opacity)`

Get watermark URL with transparency.

**Parameters:**
- `publicId` (string): Cloudinary public ID
- `opacity` (number): 0-1 range (0=transparent, 1=opaque)

**Returns:** (string) URL with opacity applied

**Example:**
```typescript
import { getWatermarkUrl } from '@/lib/cloudinary';

// 30% opacity watermark
const watermarkUrl = getWatermarkUrl(publicId, 0.3);

// Display on invoice
<img src={watermarkUrl} alt="Watermark" />
```

---

### `generateWatermarkedUrl(documentUrl, watermarkPublicId, options)`

Overlay watermark on document image.

**Parameters:**
- `documentUrl` (string): Original document URL or public ID
- `watermarkPublicId` (string): Watermark image public ID
- `options` (object):
  - `gravity` (string): Position - "center", "north", "south", "east", "west", "north_east", etc.
  - `opacity` (number): Watermark opacity 0-1 (default: 0.3)
  - `scale` (number): Watermark scale 0-1 (default: 0.3)

**Returns:** (string) URL with watermark overlay

**Example:**
```typescript
import { generateWatermarkedUrl } from '@/lib/cloudinary';

const watermarkedInvoice = generateWatermarkedUrl(
  "invoices/2024_001",
  "watermarks/clinic_logo.png",
  {
    gravity: 'center',
    opacity: 0.25,
    scale: 0.4
  }
);

// Use in PDF generation or as image
<img src={watermarkedInvoice} alt="Watermarked Invoice" />
```

---

### `deleteFromCloudinary(publicId)`

Delete image from Cloudinary.

**Parameters:**
- `publicId` (string): Cloudinary public ID

**Returns:** (boolean) true on success

**Example:**
```typescript
import { deleteFromCloudinary } from '@/lib/cloudinary';

await deleteFromCloudinary("test-reports/report_123");
```

---

## Complete Integration Examples

### Example 1: Test Report in Prescription

```typescript
// In PrescriptionForm component
import { uploadTestReport } from '@/actions/upload-actions';

const handleTestReportUpload = async (file: File) => {
  const reader = new FileReader();
  
  return new Promise<string>((resolve, reject) => {
    reader.onload = async () => {
      try {
        const base64 = reader.result as string;
        const result = await uploadTestReport(base64, file.name);
        
        if (result.success && result.url) {
          // Add to tests array
          appendTest({
            name: "Test Name",
            reportImageUrl: result.url,
            price: 500
          });
          
          resolve(result.url);
        } else {
          reject(new Error(result.error));
        }
      } catch (error) {
        reject(error);
      }
    };
    
    reader.readAsDataURL(file);
  });
};
```

### Example 2: Clinic Watermark Setup

```typescript
// In ClinicSettingsDialog component
import { uploadWatermark } from '@/actions/upload-actions';
import { updateClinicSettings } from '@/app/actions/treatment-actions';

const handleWatermarkUpload = async (file: File) => {
  const reader = new FileReader();
  
  return new Promise<string>((resolve) => {
    reader.onload = async () => {
      const base64 = reader.result as string;
      const result = await uploadWatermark(base64, file.name);
      
      if (result.success) {
        // Save to clinic settings
        await updateClinicSettings({
          watermarkImageUrl: result.url
        });
        
        // Update form display
        form.setValue("watermarkImageUrl", result.url);
        
        resolve(result.url);
      }
    };
    
    reader.readAsDataURL(file);
  });
};
```

### Example 3: Generate Watermarked Invoice

```typescript
// When generating invoice PDF
import { generateWatermarkedUrl } from '@/lib/cloudinary';

const generateInvoicePdf = async (invoiceData, watermarkUrl) => {
  // Get watermarked version
  const watermarkedUrl = generateWatermarkedUrl(
    invoiceData.imageUrl,
    watermarkUrl,
    {
      gravity: 'center',
      opacity: 0.2,
      scale: 0.35
    }
  );
  
  // Use in PDF generation
  const pdfDoc = new jsPDF();
  pdfDoc.addImage(watermarkedUrl, 'PNG', 10, 10, 190, 277);
  pdfDoc.save('invoice.pdf');
};
```

---

## Error Handling

All functions return structured responses:

**Success Response:**
```typescript
{
  success: true,
  url: "https://res.cloudinary.com/.../...",
  publicId?: "folder/filename"
}
```

**Error Response:**
```typescript
{
  success: false,
  error: "File size exceeds maximum allowed size of 10MB"
}
```

**Common Errors:**
- "Not authenticated" - User not logged in
- "File size exceeds..." - File too large
- "Invalid file format" - Format not allowed
- "Upload failed" - Network or Cloudinary error

---

## Performance Tips

1. **Compress before upload**
   - Use ImageMagick or similar to compress
   - Reduces upload time and storage

2. **Use transformations**
   - The `getCloudinaryUrl` with transformations
   - Cloudinary handles resizing, not your server

3. **Lazy load images**
   - Use `loading="lazy"` on img tags
   - Improves page performance

4. **Set quality to "auto"**
   - Cloudinary optimizes based on device
   - Balances quality and performance

---

## Testing

```typescript
// Example test
import { uploadTestReport } from '@/actions/upload-actions';

test('should upload test report', async () => {
  // Create test file
  const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
  const reader = new FileReader();
  
  const base64 = await new Promise(resolve => {
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
  
  const result = await uploadTestReport(base64 as string, file.name);
  
  expect(result.success).toBe(true);
  expect(result.url).toContain('cloudinary.com');
});
```

---

## Rate Limiting (Future)

For production, consider adding rate limiting:

```typescript
// In upload-actions.ts (future enhancement)
import { Ratelimit } from "@upstash/ratelimit";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "1 h"),
});

export async function uploadFile(...) {
  const { success, limit, reset, remaining, pending } = await ratelimit.limit(userId);
  
  if (!success) {
    throw new Error('Rate limit exceeded');
  }
  
  // Continue with upload...
}
```
