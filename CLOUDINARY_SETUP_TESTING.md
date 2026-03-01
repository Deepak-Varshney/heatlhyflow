# Cloudinary Setup & Testing Guide

## Quick Start Checklist

### ✅ Step 1: Cloudinary Account Setup (5 minutes)

- [ ] Sign up at [https://cloudinary.com/users/register/free](https://cloudinary.com/users/register/free)
- [ ] Verify email
- [ ] Go to [https://cloudinary.com/console/settings/general](https://cloudinary.com/console/settings/general)
- [ ] Copy **Cloud Name**
- [ ] Go to [https://cloudinary.com/console/settings/api-keys](https://cloudinary.com/console/settings/api-keys)
- [ ] Copy **API Key**
- [ ] Copy **API Secret**

### ✅ Step 2: Environment Configuration (2 minutes)

1. Create/Edit `.env.local` in project root:

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

2. Verify `.env.local` is in `.gitignore`:
```
.env.local
```

### ✅ Step 3: Restart Development Server

```bash
# Stop current dev server (Ctrl+C)

# Restart
pnpm dev  # or npm run dev
```

### ✅ Step 4: Verify Setup

Open developer console (_F12 → Console_) and check for Cloudinary errors:

```javascript
// Check if Cloudinary is configured
const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
console.log("Cloud Name:", cloudName);
// Should NOT be undefined
```

---

## Testing Workflows

### Test 1: Upload Test Report (Prescription)

**Location:** Dashboard → Create Prescription → Tests Section

**Steps:**
1. Create a new prescription
2. Scroll to "Tests" section
3. Click "Add Test" button
4. Enter test name (e.g., "Blood Test")
5. Click "Upload Report" button
6. Select an image file (JPG, PNG, PDF)
7. Wait for upload to complete

**Expected Results:**
- ✅ Toast message: "Test report uploaded successfully!"
- ✅ Image URL appears in form
- ✅ Form submits without errors
- ✅ Database saves the URL

**Verify in Cloudinary:**
1. Go to [Cloudinary Media Library](https://cloudinary.com/console/media_library)
2. Navigate to: `mednest/{organizationId}/test-reports/`
3. Find uploaded test image

---

### Test 2: Upload Watermark (Clinic Settings)

**Location:** Dashboard → Settings/Profile → Manage Clinic Settings

**Steps:**
1. Click "Manage Clinic Settings" button
2. Fill in clinic details:
   - Clinic Name: "My Clinic"
   - Clinic Address: "123 Main St"
   - Clinic Phone: "+1 555-1234"
3. Upload watermark image:
   - Click "Upload Image" button
   - Select PNG with transparency (recommended)
   - Wait for upload
4. Click "Save" to submit

**Expected Results:**
- ✅ Toast message: "Watermark uploaded successfully!"
- ✅ Image preview displays
- ✅ Settings save successfully
- ✅ Watermark URL saves to database

**Verify in Database:**
```javascript
// Check User model
db.users.findOne({ clinicName: "My Clinic" })
// Should show:
// clinicName: "My Clinic"
// watermarkImageUrl: "https://res.cloudinary.com/..."
```

---

### Test 3: Test Report Display in Prescription

**Steps:**
1. Create prescription with uploaded test report
2. Submit prescription
3. View prescription details
4. Verify test report image displays

**Expected Results:**
- ✅ Image displays correctly
- ✅ Image loads from Cloudinary URL
- ✅ No broken image icons

---

### Test 4: Watermark Overlay on Invoice

**Location:** Dashboard → Appointments → Generate Invoice (future feature)

**When Implemented:**
1. Generate invoice/OPD card
2. Apply watermark overlay
3. Download PDF

**Expected Results:**
- ✅ Watermark appears on generated document
- ✅ Watermark is semi-transparent
- ✅ Document still readable

---

## Troubleshooting Guide

### ❌ Problem: Upload button does nothing

**Symptoms:**
- Click upload button
- No file picker appears
- Console error: "uploadTestReport is not a function"

**Solution:**
1. Check import statement in component:
   ```typescript
   import { uploadTestReport } from '@/actions/upload-actions';
   ```
2. Verify file exists: `src/actions/upload-actions.ts`
3. Restart dev server

---

### ❌ Problem: "Not authenticated" error

**Symptoms:**
- Toast shows: "Not authenticated"
- Upload fails immediately

**Solution:**
1. Verify user is logged in (check Clerk)
2. Check user has role assigned (DOCTOR, etc.)
3. Verify session is valid

**Test:**
```javascript
// In console
const auth = await fetch('/api/auth/me').then(r => r.json());
console.log(auth);  // Should show logged-in user
```

---

### ❌ Problem: "File size exceeds maximum"

**Symptoms:**
- Toast shows file size error
- Upload fails for large files

**Solution:**
1. Compress image before upload
2. Check file size limits:
   - Test Reports: 10MB
   - Watermarks: 5MB
3. Convert to more efficient format:
   ```bash
   # Using ImageMagick (if installed)
   convert input.jpg -quality 85 -resize 800x600 output.jpg
   ```

---

### ❌ Problem: "Invalid file format"

**Symptoms:**
- Toast shows: "Invalid file format"
- Can't upload certain file types

**Solution:**
1. Check allowed formats per upload type:
   - Test Reports: jpg, jpeg, png, gif, pdf
   - Watermarks: png, jpeg, jpg, gif, webp
2. Convert file to supported format:
   ```bash
   # Convert TIFF to PNG
   convert image.tiff image.png
   ```

---

### ❌ Problem: Environment variables not working

**Symptoms:**
- Cloudinary API errors
- Upload fails with cryptic error
- Console: "cloud_name is undefined"

**Solution:**
1. Check `.env.local` exists in project root
2. Verify variable names are exact:
   ```env
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=...  # Correct
   CLOUDINARY_CLOUD_NAME=...              # WRONG (missing NEXT_PUBLIC_)
   ```
3. Restart dev server after adding variables
4. Never add quotes around values:
   ```env
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=mycloud  # Correct
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="mycloud" # WRONG
   ```

**Check variables are loaded:**
```bash
# In terminal
echo $NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
# Should print your cloud name
```

---

### ❌ Problem: Upload completes but URL is wrong

**Symptoms:**
- Upload succeeds but URL is broken
- Image doesn't display
- URL contains malformed Cloudinary domain

**Solution:**
1. Check environment variable format
2. Verify URL in database:
   ```javascript
   db.prescriptions.findOne({ "tests.0.reportImageUrl": { $exists: true } })
   // Copy URL and open in browser
   ```
3. Check Cloudinary Media Library manually

---

## Performance Verification

### Check Upload Speed

**Metrics to measure:**
- Upload time for 5MB file
- Upload time for 1MB file
- Network request size

**Test:**
1. Open DevTools → Network tab
2. Upload file
3. Check request size and time:
   ```
   File Upload Request:
   - Size: X KB
   - Time: Y ms
   - Status: 200 OK
   ```

**Expected:**
- 1MB file: < 2 seconds
- 5MB file: < 5 seconds
- Large test suites: ~3-4 seconds per file

### Monitor Cloudinary Usage

**Go to:** [https://cloudinary.com/console/dashboard](https://cloudinary.com/console/dashboard)

Check:
- ✅ Total uploads this month
- ✅ Storage used
- ✅ Bandwidth consumed
- ✅ API calls

---

## Database Verification

### Check Test Report URLs

```javascript
// MongoDB query
db.prescriptions.find({
  "tests.reportImageUrl": { $exists: true }
}).project({
  "tests.reportImageUrl": 1
})

// Expected result:
// {
//   _id: ObjectId(...),
//   tests: [
//     {
//       reportImageUrl: "https://res.cloudinary.com/..."
//     }
//   ]
// }
```

### Check Clinic Settings

```javascript
// MongoDB query
db.users.find({
  role: "DOCTOR",
  watermarkImageUrl: { $exists: true }
}).project({
  clinicName: 1,
  watermarkImageUrl: 1
})

// Expected result:
// {
//   _id: ObjectId(...),
//   clinicName: "My Clinic",
//   watermarkImageUrl: "https://res.cloudinary.com/..."
// }
```

---

## Cloudinary Media Library Tours

### Browse Test Reports

1. Go to [Media Library](https://cloudinary.com/console/media_library)
2. Navigate folder: `mednest/{organizationId}/test-reports/`
3. See all uploaded test images
4. Right-click to get URL or delete

### Browse Watermarks

1. Media Library → `mednest/{organizationId}/watermarks/`
2. See all uploaded watermarks
3. Test transformations on any image

### Test Transformation

1. Click any image
2. Click "Transform" button
3. Try:
   ```
   Width: 800
   Height: 600
   Crop: fill
   Quality: auto
   Format: webp
   ```
4. Copy resulting URL

---

## Real-World Testing Scenarios

### Scenario 1: Multi-Doctor Upload

**Setup:**
1. Create 2 doctor accounts
2. Log in as Doctor 1
3. Upload test report → Should go to `test-reports/{org1}/`
4. Log out
5. Log in as Doctor 2 (different org)
6. Upload test report → Should go to `test-reports/{org2}/`

**Verify:**
- Each org's files are separate
- Files don't mix between organizations

### Scenario 2: Multiple File Formats

**Upload each format:**
- [ ] JPG image
- [ ] PNG image
- [ ] PDF document
- [ ] GIF image

**Verify:**
- All formats upload successfully
- URLs are accessible
- Images display correctly

### Scenario 3: Large File Upload

**Upload progressively larger files:**
- [ ] 1MB file → Should be instant
- [ ] 5MB file → Should be quick
- [ ] 10MB file → Should work but slower
- [ ] 11MB file → Should be rejected

**Verify:**
- Size limits are enforced
- Error messages are clear

---

## Monitoring Checklist

**Weekly:**
- [ ] Check Cloudinary usage dashboard
- [ ] Verify no spike in API calls
- [ ] Check storage isn't growing unexpectedly

**Monthly:**
- [ ] Review storage costs
- [ ] Check bandwidth usage
- [ ] Monitor error rates

**Before Production:**
- [ ] Test with real file sizes
- [ ] Load test with multiple uploads
- [ ] Verify error handling
- [ ] Check rate limiting needs

---

## Next Steps

After verification:

1. **Deploy to Production:**
   - Set environment variables in hosting platform
   - Run production build: `npm run build`
   - Monitor uploads in production

2. **Implement Additional Features:**
   - Watermark auto-apply on invoice generation
   - Bulk upload for test reports
   - Image compression before upload
   - Delete old images automation

3. **Optimize Performance:**
   - Enable image lazy loading
   - Set up CDN caching
   - Enable webhooks for monitoring

---

## Support Resources

**If you get stuck:**

1. **Check logs:**
   ```bash
   # Server logs
   npm run dev
   # Look for Cloudinary errors
   ```

2. **Cloudinary Documentation:**
   - [Upload API](https://cloudinary.com/documentation/upload_api)
   - [Transformations](https://cloudinary.com/documentation/image_transformation_reference)
   - [Node SDK](https://github.com/cloudinary/cloudinary_npm)

3. **Next.js Cloudinary:**
   - [next-cloudinary docs](https://next.cloudinary.dev/)
   - [GitHub issues](https://github.com/cloudinary-labs/next-cloudinary/issues)

4. **This Project:**
   - Check existing tests in `/tests/`
   - Review comments in `src/lib/cloudinary.ts`
   - Check action logs in `src/actions/upload-actions.ts`

---

## Success Indicators ✨

You've successfully implemented Cloudinary when:

✅ Test reports upload to prescription form
✅ Watermarks upload to clinic settings
✅ Images display correctly in UI
✅ URLs persist in database
✅ Files organized by organization in Cloudinary
✅ No errors in browser console
✅ No "fake upload" messages in logs
✅ Real Cloudinary URLs in database (not localhost)

**Congratulations! 🎉 Cloudinary is now live in your application!**
