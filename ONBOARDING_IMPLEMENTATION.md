# Implementation Guide - Onboarding System & Route Consolidation

## Overview
This document outlines the complete implementation of the new onboarding request system, unified routes, and custom authentication pages for HealthyFlow.

## Files Created/Modified

### 1. **Database Models**
- ✅ `src/models/OnboardingRequest.ts` - New model for clinic onboarding requests

### 2. **Email Templates & Service**
- ✅ `src/lib/email-templates.ts` - Professional HTML email templates
- ✅ `src/lib/email-service.ts` - Email sending utility (Nodemailer)

### 3. **Server Actions**
- ✅ `src/actions/onboarding-request-actions.ts` - Onboarding workflow actions
  - `submitOnboardingRequest()` - Submit clinic application
  - `getOnboardingRequests()` - Get requests (SuperAdmin)
  - `approveOnboardingRequest()` - Approve & create Clerk user
  - `rejectOnboardingRequest()` - Reject with reason

### 4. **Public Pages**
- ✅ `src/app/page.tsx` - Beautiful landing page
- ✅ `src/app/onboarding/page.tsx` - Onboarding request form
- ✅ `src/app/onboarding/success/page.tsx` - Submission success page

### 5. **Authentication**
- ✅ `src/app/auth/sign-in/page.tsx` - Custom branded sign-in page

### 6. **Admin Panel**
- ✅ `src/app/superadmin/join-requests/page.tsx` - Approve/reject requests

### 7. **Components**
- ✅ `src/components/onboarding-form.tsx` - Onboarding form with validation

### 8. **Configuration**
- ✅ Updated `package.json` - Added nodemailer dependency
- ✅ Updated `.env` - Email service configuration

---

## Setup Instructions

### Step 1: Install Dependencies

```bash
pnpm install
# or
npm install
```

This will install `nodemailer` and other required packages.

### Step 2: Configure Email Service

Update your `.env` file with email configuration:

```bash
# Gmail Example (using App Password):
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
EMAIL_SECURE="false"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASSWORD="your-app-password"
EMAIL_FROM="noreply@healthyflow.com"

# OR SendGrid:
EMAIL_HOST="smtp.sendgrid.net"
EMAIL_PORT="587"
EMAIL_USER="apikey"
EMAIL_PASSWORD="SG.xxx..."

# OR AWS SES:
EMAIL_HOST="email-smtp.region.amazonaws.com"
EMAIL_PORT="587"
EMAIL_USER="username"
EMAIL_PASSWORD="password"
```

**For Gmail:**
1. Go to https://myaccount.google.com/apppasswords
2. Create an App Password for "Mail" and "Windows Computer"
3. Copy the 16-character password to `EMAIL_PASSWORD`

### Step 3: Update Middleware (Optional for Protected Routes)

The middleware currently protects `/dashboard`, `/doctor/*`, `/receptionist/*`, `/superadmin/*` routes.

To add protection for the new join-requests page, update `src/middleware.ts`:

```typescript
// Add after existing protected routes
if (pathname.startsWith('/superadmin/join-requests')) {
  const role = publicMetadata?.role;
  if (role !== 'SUPERADMIN') {
    return NextResponse.redirect(new URL('/auth/sign-in', req.url));
  }
}
```

### Step 4: Route Consolidation (Future Phase)

Current route structure is being consolidated from:
- `/doctor/*` → `/dashboard/*`
- `/receptionist/*` → `/dashboard/*`

This phase involves:
1. Creating unified `(dashboard)` route group
2. Merging pages with role-aware rendering
3. Updating navigation to point to new routes
4. Testing all role combinations

---

## Feature Workflow

### 1. **Public Onboarding** (No Auth Required)
1. User visits `/` or `/onboarding`
2. Fills out clinic/hospital application form
3. Form validates email uniqueness and required fields
4. Request submitted to MongoDB
5. Confirmation email sent to applicant
6. User redirected to `/onboarding/success`

### 2. **SuperAdmin Approval** (Admin Only)
1. SuperAdmin logs in to `/superadmin/join-requests`
2. Views all pending requests in tabs (Pending/Approved/Rejected)
3. Can view request details and approve/reject
4. On approval:
   - Clerk user created automatically
   - MongoDB user created with role "DOCTOR"
   - MongoDB organization created
   - Approval email sent with login instructions
5. On rejection:
   - Rejection reason required
   - Rejection email sent to applicant

### 3. **Email Communication**

**Confirmation Email** (Sent immediately after submission)
- Subject: "HealthyFlow - Onboarding Request Received ✓"
- Status: Pending Review (yellow badge)
- Contents: Request details, 24-48hr timeline

**Approval Email** (Sent on SuperAdmin approval)
- Subject: "Welcome to HealthyFlow! Your Account is Ready 🎉"
- Status: Approved (green badge)
- Contents: Login instructions, getting started guide

**Rejection Email** (Sent when rejected)
- Subject: "HealthyFlow Onboarding Request Status Update"
- Status: Rejected (red badge)
- Contents: Rejection reason, appeal instructions

---

## API Reference

### Server Actions

#### `submitOnboardingRequest(params)`
Submits a new onboarding request.

**Parameters:**
```typescript
{
  firstName: string              // Required
  lastName: string               // Required
  email: string                  // Required, unique
  phone: string                  // Required
  address: string                // Required
  organizationName: string       // Required
  organizationType: "CLINIC" | "HOSPITAL" | "PRIVATE_PRACTICE" | "NURSING_HOME"
  registrationDocument?: string  // Optional, URL or base64
  licenseDocument?: string       // Optional, URL or base64
  treatments: string[]           // Required
  yearsOfExperience?: number     // Optional
  specialty?: string             // Optional
  staffCount?: number            // Optional
  operatingHours?: string        // Optional
}
```

**Return:**
```typescript
{
  success: boolean
  message?: string
  requestId?: string
  error?: string
}
```

#### `getOnboardingRequests(status?)`
Get all onboarding requests (SuperAdmin only).

**Parameters:**
```typescript
status?: "PENDING" | "APPROVED" | "REJECTED"  // Optional filter
```

**Return:**
```typescript
{
  success: boolean
  requests: OnboardingRequestData[]
  error?: string
}
```

#### `approveOnboardingRequest(requestId)`
Approve a request and create Clerk user (SuperAdmin only).

**Process:**
1. Creates Clerk user with provided credentials
2. Creates MongoDB organization
3. Creates MongoDB user with "DOCTOR" role
4. Updates request status to "APPROVED"
5. Sends approval email

**Return:**
```typescript
{
  success: boolean
  message?: string
  clerkUserId?: string
  organizationId?: string
  userId?: string
  error?: string
}
```

#### `rejectOnboardingRequest(requestId, rejectionReason)`
Reject a request with reason (SuperAdmin only).

**Return:**
```typescript
{
  success: boolean
  message?: string
  error?: string
}
```

---

## Database Schema

### OnboardingRequest Collection

```typescript
{
  _id: ObjectId
  
  // Personal Information
  firstName: String (required)
  lastName: String (required)
  email: String (required, unique, indexed)
  phone: String (required)
  address: String (required)
  
  // Organization
  organizationName: String (required)
  organizationType: Enum: "CLINIC" | "HOSPITAL" | "PRIVATE_PRACTICE" | "NURSING_HOME"
  
  // Documents (Optional)
  registrationDocument: String
  licenseDocument: String
  
  // Services
  treatments: [String]
  
  // Professional Details
  yearsOfExperience: Number
  specialty: String
  staffCount: Number
  operatingHours: String
  
  // Status Workflow
  status: Enum: "PENDING" | "APPROVED" | "REJECTED" (indexed)
  approvedBy: ObjectId (ref: User)
  approvalDate: Date
  rejectionReason: String
  
  // Clerk Integration
  clerkUserId: String
  
  // Timestamps
  createdAt: Date (indexed)
  updatedAt: Date
}
```

---

## Environment Variables

### Email Configuration

```bash
# SINGLE EMAIL SENDER (Gmail recommended)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@healthyflow.com
```

### Clerk Configuration (Existing)

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/auth/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/auth/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding
```

### Database Configuration (Existing)

```bash
MONGODB_URI=mongodb+srv://...
```

---

## User Flows

### Flow 1: New Clinic Onboarding
```
Public User
    ↓
   (/) Landing Page
    ↓
   Click "Get Started" / "Request Access"
    ↓
   (/onboarding) Onboarding Form
    ↓
   Fill form + Submit
    ↓
   Confirmation email sent
    ↓
   (/onboarding/success) Success page
    ↓
   Application pending approval
```

### Flow 2: SuperAdmin Approval
```
Pending Application
    ↓
   SuperAdmin logs in
    ↓
   (/superadmin/join-requests) View requests
    ↓
   Click "Approve" on request
    ↓
   Approval dialog shown
    ↓
   Click "Approve Application"
    ↓
   Clerk user created
    ↓
   MongoDB user + org created
    ↓
   Approval email sent
    ↓
   (/auth/sign-in) New user can login
    ↓
   (/dashboard) Access dashboard
```

### Flow 3: Rejection
```
Pending Application
    ↓
   SuperAdmin logs in
    ↓
   (/superadmin/join-requests) View requests
    ↓
   Click "Reject" on request
    ↓
   Rejection dialog shown
    ↓
   Enter reason
    ↓
   Click "Reject Application"
    ↓
   Rejection email sent
    ↓
   Status updated to REJECTED
```

---

## Testing Checklist

### Email Testing
- [ ] Email credentials configured correctly
- [ ] Confirmation email sent on form submission
- [ ] Email contains correct clinic name and details
- [ ] Approval email sent on admin approval
- [ ] Rejection email sent on rejection with reason

### Onboarding Form
- [ ] Form validation works (required fields)
- [ ] Email uniqueness validated
- [ ] Phone format validation
- [ ] Date parsing works correctly
- [ ] Form resets on successful submission

### Approval Workflow
- [ ] Clerk user created successfully
- [ ] MongoDB user created with correct role
- [ ] MongoDB organization created
- [ ] User can login with Google OAuth
- [ ] User can reset password via Clerk

### SuperAdmin Interface
- [ ] SuperAdmin can view all requests
- [ ] Can filter by status (Pending/Approved/Rejected)
- [ ] Can view request details
- [ ] Approve button works
- [ ] Reject button works with reason
- [ ] Loading states work during processing

### Public Pages
- [ ] Landing page displays correctly
- [ ] Sign-in page displays correctly
- [ ] Onboarding form accessible without auth
- [ ] Success page shows after submission

---

## Troubleshooting

### Email Not Sending
1. Check `.env` variables are set correctly
2. Verify `EMAIL_USER` and `EMAIL_PASSWORD` are correct
3. For Gmail, ensure App Password is used (not regular password)
4. Check email logs in server console
5. Try calling `verifyEmailConfig()` manually to test connection

### Clerk User Creation Failing
1. Verify `CLERK_SECRET_KEY` is correct
2. Check Clerk dashboard for errors
3. Ensure email address is unique
4. Check for special characters in names

### MongoDB Connection Issues
1. Verify `MONGODB_URI` is correct
2. Check IP whitelist in MongoDB Atlas
3. Ensure Mongoose is installed
4. Check database has proper indexes

### Form Validation Issues
1. Check Zod schema in `onboarding-form.tsx`
2. Verify all required fields are present
3. Check email format validation
4. Review phone number format requirements

---

## Future Enhancements

### Phase 2: Route Consolidation
- [ ] Create unified `(dashboard)` route group
- [ ] Merge `/doctor` and `/receptionist` pages
- [ ] Update navigation with role-aware rendering
- [ ] Test all role combinations
- [ ] Remove old route folders

### Phase 3: Document Upload
- [ ] Integrate file upload (S3/Cloudinary)
- [ ] Add document validation
- [ ] Create document viewer in approval dialog
- [ ] Store document URLs in database

### Phase 4: Audit Trail
- [ ] Add approval/rejection audit log
- [ ] Track who approved/rejected
- [ ] Store decision reasons
- [ ] Create audit report view

### Phase 5: AI Integration
- [ ] Auto-validate clinic details
- [ ] Suggest treatment categories
- [ ] Detect suspicious applications
- [ ] Generate approval summaries

---

## Support

For issues or questions:
1. Check error logs in server console
2. Review this documentation
3. Check Clerk dashboard for auth issues
4. Check MongoDB logs for database issues
5. Contact development team

---

**Last Updated:** 2024
**Status:** Production Ready
**Version:** 1.0.0
