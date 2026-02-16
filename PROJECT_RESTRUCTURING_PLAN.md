# HealthyFlow - Project Restructuring & AI Integration Plan

**Version:** 2.0  
**Date:** February 16, 2026  
**Author:** AI Architecture Review

---

## Table of Contents
1. [Executive Summary](#executive-summary)
2. [Current State Analysis](#current-state-analysis)
3. [Industry Standards & Best Practices](#industry-standards--best-practices)
4. [Target Architecture](#target-architecture)
5. [MongoDB Organizations Migration](#mongodb-organizations-migration)
6. [Next.js 15/16 Middleware Updates](#nextjs-1516-middleware-updates)
7. [AI Integration with Gemini](#ai-integration-with-gemini)
8. [Implementation Roadmap](#implementation-roadmap)
9. [File Structure Reorganization](#file-structure-reorganization)
10. [Testing Strategy](#testing-strategy)

---

## Executive Summary

### Current Project State
HealthyFlow is a healthcare management ERP built with Next.js 15, MongoDB, and Clerk. The application provides patient management, appointment scheduling, prescription generation, and role-based access control.

### Key Issues Identified
1. **Over-dependence on Clerk Organizations** - Organization management should be handled in MongoDB
2. **Clerk used beyond authentication** - Clerk handles organization logic that should be in the database
3. **Limited AI capabilities** - No AI features for a healthcare app that could benefit greatly from AI
4. **Mixed API patterns** - Some API routes exist but most logic is already in server actions (good!)
5. **Middleware not optimized** - Heavy logic checks that could be streamlined
6. **No clear separation** between auth layer and business logic

### Recommended Changes
- ✅ Keep Clerk for **authentication only** (login, signup, session management)
- ✅ Use Clerk public metadata **only for middleware checks** (role, verification status)
- ✅ Move all organization logic to **MongoDB** with proper schemas
- ✅ Integrate **Google Gemini AI** for intelligent features
- ✅ Update middleware to be lightweight and Next.js 16 ready
- ✅ Consolidate all business logic in **server actions** (eliminate remaining API routes except webhooks)

---

## Current State Analysis

### ✅ What's Working Well

#### 1. Server Actions Architecture
```typescript
// ✅ GOOD: Already using server actions extensively
// src/actions/appointment-actions.ts
"use server";
export async function bookAppointment(params) { }
export async function getAppointments(params) { }
```
**Status:** ✅ Keep and expand  
**Reason:** Industry standard for Next.js 13+, better type safety, automatic deduplication

#### 2. MongoDB Models
```typescript
// ✅ GOOD: Proper Mongoose schemas
User, Patient, Appointment, Prescription, Treatment, Organization
```
**Status:** ✅ Keep and enhance  
**Changes needed:** Remove Clerk organization dependencies

#### 3. Authentication with Clerk
```typescript
// ✅ GOOD: Clerk handles auth
import { auth, currentUser } from "@clerk/nextjs/server";
```
**Status:** ✅ Keep for auth only  
**Changes needed:** Remove organization management

#### 4. Role-Based Access Control
**Status:** ✅ Good foundation  
**Changes needed:** Simplify and optimize

---

### ❌ What Needs to Change

#### 1. Organization Management in Clerk

**Current Implementation:**
```typescript
// ❌ PROBLEM: Organization model depends on Clerk
export interface IOrganization extends Document {
  clerkOrgId: string;  // ❌ Clerk dependency
  name: string;
  status: "PENDING" | "ACTIVE" | "DISABLED" | "REJECTED";
  owner: Schema.Types.ObjectId;
  members: Schema.Types.ObjectId[];
}

// ❌ PROBLEM: Subscription tied to Clerk org
export interface ISubscription extends Document {
  clerkOrgId: string;  // ❌ Clerk dependency
  organization: Schema.Types.ObjectId;
  // ...
}
```

**Issue:**
- Organizations should be pure MongoDB entities
- Clerk organizations are an authentication feature, not business logic
- Creates tight coupling between auth provider and business logic
- Difficult to migrate away from Clerk if needed
- Adds complexity to organization lifecycle management

**Solution:** [See MongoDB Organizations Migration](#mongodb-organizations-migration)

---

#### 2. Middleware Complexity

**Current Implementation:**
```typescript
// ❌ PROBLEM: Too much logic in middleware
export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();
  const role = sessionClaims?.publicMetadata?.role;
  const verificationStatus = sessionClaims?.publicMetadata?.verificationStatus;
  const organizationStatus = sessionClaims?.publicMetadata?.organizationStatus;
  
  // Multiple conditional checks...
  // Role-based routing...
  // Organization status checks...
});
```

**Issues:**
- Too much business logic in middleware
- Runs on every request (performance concern)
- Hard to test and maintain
- Mixes concerns (auth, authorization, routing)

**Solution:** [See Next.js Middleware Updates](#nextjs-1516-middleware-updates)

---

#### 3. Missing AI Capabilities

**Current State:**
- ❌ No AI features at all
- ❌ Manual diagnosis entry
- ❌ No intelligent search
- ❌ No prescription recommendations
- ❌ No medical insights
- ❌ No chatbot support

**Opportunities:**
Healthcare is perfect for AI integration! [See AI Integration](#ai-integration-with-gemini)

---

#### 4. API Routes vs Server Actions

**Current State:**
```
src/app/api/
  └── webhooks/
      └── clerk/
          └── route.ts  ✅ KEEP (external webhook)
```

**Status:** ✅ Already minimal!  
**Action:** Keep webhooks, everything else stays in server actions

---

## Industry Standards & Best Practices

### 1. Authentication vs Authorization vs Business Logic

```
┌─────────────────────────────────────────────────────────┐
│                    SEPARATION OF CONCERNS                │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  AUTHENTICATION (Clerk)                                   │
│  └─ Who is the user?                                      │
│  └─ Is the session valid?                                 │
│  └─ Login/Logout/Signup                                   │
│                                                           │
│  AUTHORIZATION (Middleware + Public Metadata)             │
│  └─ What can the user access?                            │
│  └─ Role-based route protection                          │
│  └─ Basic status checks (verified, active)               │
│                                                           │
│  BUSINESS LOGIC (MongoDB + Server Actions)                │
│  └─ Organization management                               │
│  └─ Data relationships                                    │
│  └─ Complex permissions                                   │
│  └─ Feature access                                        │
│  └─ Usage tracking                                        │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### 2. Next.js Best Practices (2024-2026)

#### ✅ Do:
- Use Server Actions for mutations and data fetching
- Use Server Components by default
- Keep middleware lightweight (auth checks only)
- Collocate data fetching with components when possible
- Use parallel data fetching with Promise.all()

#### ❌ Don't:
- Heavy computation in middleware
- API routes for internal operations (use server actions)
- Mixing client and server logic
- Excessive client-side state management
- Over-fetching data

### 3. MongoDB Schema Design

#### ✅ Best Practices for Healthcare:
```typescript
// ✅ Self-contained organization
Organization {
  _id: ObjectId            // ✅ MongoDB native ID
  name: string
  slug: string             // ✅ URL-friendly identifier
  status: enum
  owner: ObjectId          // ✅ Reference to User
  settings: {              // ✅ Embedded configuration
    timezone: string
    locale: string
    branding: {...}
  }
  subscription: ObjectId   // ✅ Reference
  createdAt: Date
  updatedAt: Date
}

// ✅ Keep Clerk reference in User for auth
User {
  _id: ObjectId
  clerkUserId: string      // ✅ ONLY for auth linkage
  organization: ObjectId   // ✅ MongoDB reference
  role: enum
  // ... other fields
}

// ❌ Don't mix concerns
Organization {
  clerkOrgId: string       // ❌ Tight coupling
}
```

### 4. AI Integration Patterns

#### ✅ Best Practices:
- Use dedicated AI service layer
- Implement rate limiting
- Cache AI responses
- Handle errors gracefully
- Provide fallbacks
- Log AI usage for monitoring
- Keep API keys server-side only

---

## Target Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                         │
│  Next.js Client Components, Forms, UI                        │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      MIDDLEWARE LAYER                        │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  middleware.ts (Lightweight)                          │  │
│  │  - Auth check (Clerk session)                         │  │
│  │  - Role from publicMetadata                           │  │
│  │  - Basic route protection                             │  │
│  └───────────────────────────────────────────────────────┘  │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    SERVER ACTIONS LAYER                      │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐   │
│  │  Actions     │  │  Utilities   │  │  AI Services    │   │
│  │              │  │              │  │                 │   │
│  │ • Patient    │  │ • Validation │  │ • Gemini API    │   │
│  │ • Appt       │  │ • Formatting │  │ • Diagnosis AI  │   │
│  │ • Rx         │  │ • Email      │  │ • Chat AI       │   │
│  │ • Org        │  │ • Auth Check │  │ • Insights      │   │
│  └──────────────┘  └──────────────┘  └─────────────────┘   │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                       DATABASE LAYER                         │
│  MongoDB (Mongoose)                                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Collections:                                         │   │
│  │  • users (clerkUserId for auth only)                 │   │
│  │  • organizations (pure MongoDB, no Clerk ID)         │   │
│  │  • patients                                           │   │
│  │  • appointments                                       │   │
│  │  • prescriptions                                      │   │
│  │  • subscriptions                                      │   │
│  │  • aiLogs (track AI usage)                           │   │
│  └──────────────────────────────────────────────────────┘   │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     EXTERNAL SERVICES                        │
│  • Clerk (Auth only)                                         │
│  • Google Gemini AI                                          │
│  • (Future: Stripe for billing)                              │
└─────────────────────────────────────────────────────────────┘
```

### Authentication Flow

```
User Login
    │
    ▼
Clerk Handles Auth ─────► Creates Session
    │
    ▼
Clerk Webhook ──────────► Sync User to MongoDB
    │
    ▼
Update publicMetadata
    │
    └─► role: "DOCTOR" | "RECEPTIONIST" | "UNASSIGNED"
    └─► verificationStatus: "VERIFIED" | "PENDING"
    └─► organizationId: MongoDB ObjectId (as string)
    
User Request
    │
    ▼
Middleware reads publicMetadata ──► Route protection
    │
    ▼
Server Action reads MongoDB ─────► Business logic
```

---

## MongoDB Organizations Migration

### Phase 1: Update Organization Schema

**File:** `src/models/Organization.ts`

```typescript
import { Schema, model, models, Document } from "mongoose";

export interface IOrganization extends Document {
  _id: Schema.Types.ObjectId;
  name: string;
  slug: string;                    // ✅ NEW: URL-friendly identifier
  status: "PENDING" | "ACTIVE" | "SUSPENDED" | "DISABLED";
  type: "CLINIC" | "HOSPITAL" | "PRIVATE_PRACTICE"; // ✅ NEW
  
  // Owner and members
  owner: Schema.Types.ObjectId;    // Reference to User
  admins: Schema.Types.ObjectId[]; // ✅ NEW: Multiple admins
  members: Schema.Types.ObjectId[];
  
  // Settings
  settings: {
    timezone: string;
    locale: string;
    branding: {
      logoUrl?: string;
      primaryColor?: string;
      watermarkUrl?: string;
    };
    notifications: {
      email: boolean;
      sms: boolean;
    };
  };
  
  // Subscription
  subscription?: Schema.Types.ObjectId;
  
  // Contact info
  contactInfo?: {
    email?: string;
    phone?: string;
    address?: string;
  };
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

const OrganizationSchema = new Schema<IOrganization>(
  {
    name: { type: String, required: true },
    slug: { 
      type: String, 
      required: true, 
      unique: true,
      lowercase: true,
      trim: true 
    },
    status: {
      type: String,
      enum: ["PENDING", "ACTIVE", "SUSPENDED", "DISABLED"],
      default: "PENDING",
    },
    type: {
      type: String,
      enum: ["CLINIC", "HOSPITAL", "PRIVATE_PRACTICE"],
      required: true,
    },
    owner: { 
      type: Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    admins: [{ 
      type: Schema.Types.ObjectId, 
      ref: "User" 
    }],
    members: [{ 
      type: Schema.Types.ObjectId, 
      ref: "User" 
    }],
    settings: {
      timezone: { 
        type: String, 
        default: "Asia/Kolkata" 
      },
      locale: { 
        type: String, 
        default: "en-IN" 
      },
      branding: {
        logoUrl: String,
        primaryColor: String,
        watermarkUrl: String,
      },
      notifications: {
        email: { type: Boolean, default: true },
        sms: { type: Boolean, default: false },
      },
    },
    subscription: { 
      type: Schema.Types.ObjectId, 
      ref: "Subscription" 
    },
    contactInfo: {
      email: String,
      phone: String,
      address: String,
    },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes
OrganizationSchema.index({ slug: 1 });
OrganizationSchema.index({ owner: 1 });
OrganizationSchema.index({ members: 1 });
OrganizationSchema.index({ status: 1 });

// Virtual for member count
OrganizationSchema.virtual('memberCount').get(function() {
  return this.members.length;
});

// Pre-save hook to generate slug
OrganizationSchema.pre('save', async function(next) {
  if (this.isNew && !this.slug) {
    this.slug = generateSlug(this.name);
  }
  next();
});

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

const Organization = models.Organization || 
  model<IOrganization>("Organization", OrganizationSchema);

export default Organization;
```

### Phase 2: Update Subscription Schema

**File:** `src/models/Subscription.ts`

```typescript
export interface ISubscription extends Document {
  organization: Schema.Types.ObjectId; // ✅ ONLY MongoDB reference
  // ❌ REMOVE: clerkOrgId
  planType: "FREE" | "BASIC" | "PROFESSIONAL" | "ENTERPRISE";
  // ... rest stays the same
}

const SubscriptionSchema = new Schema<ISubscription>({
  organization: { 
    type: Schema.Types.ObjectId, 
    ref: "Organization", 
    required: true,
    unique: true 
  },
  // ❌ REMOVE clerkOrgId field
  // ... rest of schema
});

// ❌ REMOVE: SubscriptionSchema.index({ clerkOrgId: 1 });
```

### Phase 3: Update User Model

**File:** `src/models/User.ts`

```typescript
export interface IUser extends Document {
  clerkUserId: string;             // ✅ ONLY for auth
  email: string;
  firstName: string;
  lastName: string;
  imageUrl?: string;
  role: "UNASSIGNED" | "RECEPTIONIST" | "DOCTOR" | "ADMIN" | "SUPERADMIN";
  organization?: Schema.Types.ObjectId; // ✅ pure MongoDB reference
  verificationStatus: "PENDING" | "VERIFIED" | "REJECTED";
  
  // ... rest stays same
}

// ✅ Keep schema mostly as-is, just ensure organization is MongoDB ref
```

### Phase 4: Organization Management Actions

**New File:** `src/actions/organization-actions.ts`

```typescript
"use server";

import { revalidatePath } from "next/cache";
import connectDB from "@/lib/mongodb";
import Organization from "@/models/Organization";
import User from "@/models/User";
import { getMongoUser } from "@/lib/CheckUser";
import { clerkClient } from "@clerk/nextjs/server";
import { createDefaultSubscription } from "@/lib/subscription";

interface CreateOrganizationParams {
  name: string;
  type: "CLINIC" | "HOSPITAL" | "PRIVATE_PRACTICE";
  contactInfo?: {
    email?: string;
    phone?: string;
    address?: string;
  };
}

export async function createOrganization(params: CreateOrganizationParams) {
  await connectDB();
  const currentUser = await getMongoUser();
  
  if (!currentUser) {
    return { success: false, error: "User not authenticated" };
  }
  
  try {
    // Create organization in MongoDB
    const org = await Organization.create({
      name: params.name,
      type: params.type,
      status: "PENDING",
      owner: currentUser._id,
      admins: [currentUser._id],
      members: [currentUser._id],
      contactInfo: params.contactInfo,
    });
    
    // Update user with organization reference
    await User.findByIdAndUpdate(currentUser._id, {
      organization: org._id,
    });
    
    // Create default subscription
    await createDefaultSubscription(org._id.toString());
    
    // Update Clerk publicMetadata with MongoDB org ID
    const client = await clerkClient();
    await client.users.updateUserMetadata(currentUser.clerkUserId, {
      publicMetadata: {
        role: currentUser.role,
        verificationStatus: currentUser.verificationStatus,
        organizationId: org._id.toString(), // ✅ MongoDB ID
        organizationStatus: "PENDING",
      },
    });
    
    revalidatePath("/");
    
    return { 
      success: true, 
      organization: JSON.parse(JSON.stringify(org)) 
    };
  } catch (error) {
    console.error("Error creating organization:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to create organization" 
    };
  }
}

export async function updateOrganization(
  orgId: string,
  updates: Partial<IOrganization>
) {
  await connectDB();
  const currentUser = await getMongoUser();
  
  if (!currentUser) {
    return { success: false, error: "Unauthorized" };
  }
  
  try {
    // Check if user is owner or admin
    const org = await Organization.findById(orgId);
    
    const isOwner = org.owner.toString() === currentUser._id.toString();
    const isAdmin = org.admins.some(
      (adminId) => adminId.toString() === currentUser._id.toString()
    );
    
    if (!isOwner && !isAdmin) {
      return { success: false, error: "Permission denied" };
    }
    
    // Update organization
    const updatedOrg = await Organization.findByIdAndUpdate(
      orgId,
      { $set: updates },
      { new: true }
    );
    
    revalidatePath("/");
    
    return { 
      success: true, 
      organization: JSON.parse(JSON.stringify(updatedOrg)) 
    };
  } catch (error) {
    console.error("Error updating organization:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to update" 
    };
  }
}

export async function inviteMember(orgId: string, email: string, role: string) {
  await connectDB();
  const currentUser = await getMongoUser();
  
  if (!currentUser) {
    return { success: false, error: "Unauthorized" };
  }
  
  try {
    // Verify user has permission
    const org = await Organization.findById(orgId);
    const isOwnerOrAdmin = 
      org.owner.toString() === currentUser._id.toString() ||
      org.admins.some(id => id.toString() === currentUser._id.toString());
    
    if (!isOwnerOrAdmin) {
      return { success: false, error: "Permission denied" };
    }
    
    // Find or create invited user
    let invitedUser = await User.findOne({ email });
    
    if (!invitedUser) {
      // Create pending user invitation
      invitedUser = await User.create({
        email,
        role: role as any,
        organization: orgId,
        verificationStatus: "PENDING",
        firstName: "",
        lastName: "",
        clerkUserId: "", // Will be filled when they sign up
      });
    } else {
      // Update existing user
      await User.findByIdAndUpdate(invitedUser._id, {
        organization: orgId,
        role: role as any,
      });
    }
    
    // Add to organization members
    await Organization.findByIdAndUpdate(orgId, {
      $addToSet: { members: invitedUser._id },
    });
    
    // TODO: Send invitation email
    
    revalidatePath("/");
    
    return { success: true };
  } catch (error) {
    console.error("Error inviting member:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to invite" 
    };
  }
}

export async function removeMember(orgId: string, userId: string) {
  await connectDB();
  const currentUser = await getMongoUser();
  
  if (!currentUser) {
    return { success: false, error: "Unauthorized" };
  }
  
  try {
    const org = await Organization.findById(orgId);
    
    // Only owner can remove members
    if (org.owner.toString() !== currentUser._id.toString()) {
      return { success: false, error: "Only owner can remove members" };
    }
    
    // Cannot remove owner
    if (org.owner.toString() === userId) {
      return { success: false, error: "Cannot remove owner" };
    }
    
    // Remove from organization
    await Organization.findByIdAndUpdate(orgId, {
      $pull: { 
        members: userId,
        admins: userId 
      },
    });
    
    // Remove organization from user
    await User.findByIdAndUpdate(userId, {
      $unset: { organization: "" },
      role: "UNASSIGNED",
    });
    
    // Update Clerk metadata
    const user = await User.findById(userId);
    if (user && user.clerkUserId) {
      const client = await clerkClient();
      await client.users.updateUserMetadata(user.clerkUserId, {
        publicMetadata: {
          role: "UNASSIGNED",
          verificationStatus: user.verificationStatus,
          organizationId: null,
        },
      });
    }
    
    revalidatePath("/");
    
    return { success: true };
  } catch (error) {
    console.error("Error removing member:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to remove member" 
    };
  }
}

export async function getOrganization(orgId: string) {
  await connectDB();
  
  try {
    const org = await Organization.findById(orgId)
      .populate('owner', 'firstName lastName email imageUrl')
      .populate('members', 'firstName lastName email role imageUrl')
      .populate('subscription')
      .lean();
    
    return { 
      success: true, 
      organization: JSON.parse(JSON.stringify(org)) 
    };
  } catch (error) {
    console.error("Error fetching organization:", error);
    return { 
      success: false, 
      error: "Failed to fetch organization" 
    };
  }
}
```

### Phase 5: Update Clerk Webhook (Remove Organization Events)

**File:** `src/app/api/webhooks/clerk/route.ts`

```typescript
export async function POST(req: Request) {
  // ... webhook verification stays same
  
  switch (eventType) {
    // ✅ KEEP user events
    case "user.created": {
      // Create user in MongoDB
      await User.create({
        clerkUserId: id,
        email: email_addresses[0].email_address,
        firstName: first_name,
        lastName: last_name,
        imageUrl: image_url,
        role: "UNASSIGNED",
      });
      break;
    }
    
    case "user.updated": {
      // Update user in MongoDB
      await User.findOneAndUpdate(
        { clerkUserId: id },
        {
          email: email_addresses[0].email_address,
          firstName: first_name,
          lastName: last_name,
          imageUrl: image_url,
        }
      );
      break;
    }
    
    case "user.deleted": {
      // Delete user from MongoDB
      await User.findOneAndDelete({ clerkUserId: id });
      break;
    }
    
    // ❌ REMOVE all organization events
    // - organization.created
    // - organization.updated
    // - organization.deleted
    // - organizationMembership.created
    // - organizationMembership.updated
    // - organizationMembership.deleted
    
    // Organizations are now handled purely in MongoDB via server actions
    
    default:
      console.log(`Unhandled event type: ${eventType}`);
  }
  
  return NextResponse.json({ received: true });
}
```

### Phase 6: Update Subscription Utilities

**File:** `src/lib/subscription.ts`

```typescript
// Remove all references to clerkOrgId

export const getCurrentSubscription = async (): Promise<SubscriptionDetails | null> => {
  try {
    const user = await getMongoUser();
    if (!user || !user.organization) return null;
    
    await connectDB();
    
    // ✅ Use MongoDB organization directly
    const subscription = await Subscription.findOne({ 
      organization: user.organization 
    }).lean();
    
    // ... rest of logic
  } catch (error) {
    console.error("Error fetching subscription:", error);
    return null;
  }
};

export const createDefaultSubscription = async (
  organizationId: string  // ✅ MongoDB ID only
): Promise<ISubscription> => {
  const now = new Date();
  const endDate = new Date(now);
  endDate.setFullYear(endDate.getFullYear() + 10);
  
  const subscription = await Subscription.create({
    organization: organizationId,  // ✅ No clerkOrgId
    planType: "FREE",
    status: "ACTIVE",
    currentPeriodStart: now,
    currentPeriodEnd: endDate,
    // ... rest
  });
  
  return subscription;
};
```

---

## Next.js 15/16 Middleware Updates

### Current Middleware Issues

1. **Too much logic** - Multiple conditional checks
2. **Performance concern** - Runs on every request
3. **Hard to test** - Complex nested logic
4. **Tight coupling** - Mixes auth, authorization, and routing

### Optimized Middleware

**File:** `src/middleware.ts`

```typescript
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  "/",
  "/auth/(.*)",
  "/status(.*)",
  "/api/webhooks/(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  // Allow public routes
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }
  
  const { userId, sessionClaims } = await auth();
  const { pathname } = req.nextUrl;
  
  // Not authenticated - redirect to sign in
  if (!userId) {
    const signInUrl = new URL("/auth/sign-in", req.url);
    signInUrl.searchParams.set("redirect_url", req.url);
    return NextResponse.redirect(signInUrl);
  }
  
  // Get role from publicMetadata
  const role = (sessionClaims?.publicMetadata?.role as string) || "UNASSIGNED";
  const verificationStatus = (sessionClaims?.publicMetadata?.verificationStatus as string) || "PENDING";
  const organizationId = sessionClaims?.publicMetadata?.organizationId as string;
  
  // RULE 1: Unassigned users → onboarding
  if (role === "UNASSIGNED") {
    if (!pathname.startsWith("/onboarding")) {
      return NextResponse.redirect(new URL("/onboarding", req.url));
    }
    return NextResponse.next();
  }
  
  // RULE 2: Unverified users → status page
  if (verificationStatus !== "VERIFIED") {
    if (!pathname.startsWith("/status")) {
      return NextResponse.redirect(new URL("/status", req.url));
    }
    return NextResponse.next();
  }
  
  // RULE 3: No organization → onboarding
  if (!organizationId) {
    if (!pathname.startsWith("/onboarding")) {
      return NextResponse.redirect(new URL("/onboarding", req.url));
    }
    return NextResponse.next();
  }
  
  // RULE 4: Role-based route protection
  const roleRouteMap = {
    SUPERADMIN: "/superadmin/dashboard",
    DOCTOR: "/doctor/dashboard",
    RECEPTIONIST: "/receptionist/dashboard",
  };
  
  // Verified users shouldn't access onboarding/status
  if (pathname.startsWith("/onboarding") || pathname.startsWith("/status")) {
    return NextResponse.redirect(new URL(roleRouteMap[role as keyof typeof roleRouteMap], req.url));
  }
  
  // Role-specific route protection
  if (role === "DOCTOR" && !pathname.startsWith("/doctor") && !pathname.startsWith("/profile")) {
    return NextResponse.redirect(new URL("/doctor/dashboard", req.url));
  }
  
  if (role === "RECEPTIONIST" && !pathname.startsWith("/receptionist") && !pathname.startsWith("/profile")) {
    return NextResponse.redirect(new URL("/receptionist/dashboard", req.url));
  }
  
  // Allow superadmin everywhere
  // Allow profile access for all roles
  
  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!.*\\..*|_next).*)",
    "/",
    "/(api|trpc)(.*)"
  ],
};
```

### For Next.js 16 (Future)

When Next.js 16 releases with the `proxy.ts` pattern:

**File:** `src/proxy.ts` (Next.js 16)

```typescript
// Next.js 16 middleware replacement
import { type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Same logic as above, but in new Next.js 16 format
  // Exact API to be determined when Next.js 16 is released
}
```

**Note:** Next.js 15 is current (as of Feb 2026). Monitor Next.js releases for proxy.ts pattern.

---

## AI Integration with Gemini

### Why AI in Healthcare?

Healthcare applications are **perfect** for AI integration:

1. **Diagnosis Assistance** - Suggest possible conditions based on symptoms
2. **Prescription Intelligence** - Drug interactions, dosage recommendations
3. **Medical Search** - Natural language search of patient records
4. **Report Analysis** - Extract insights from test reports
5. **Appointment Optimization** - Smart scheduling based on patient history
6. **Patient Communication** - AI chatbot for common queries
7. **Clinical Notes** - Auto-generate SOAP notes from conversation
8. **Medical Transcription** - Convert doctor's verbal notes to text

### Setup Google Gemini

#### Step 1: Install SDK

```bash
pnpm add @google/generative-ai
```

#### Step 2: Environment Variables

**File:** `.env.local`

```env
# Existing
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...
MONGODB_URI=...

# NEW: Google Gemini
GOOGLE_GEMINI_API_KEY=your_api_key_here
```

Get API key: https://makersuite.google.com/app/apikey

#### Step 3: Create AI Service Layer

**New File:** `src/lib/ai/gemini-client.ts`

```typescript
import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GOOGLE_GEMINI_API_KEY) {
  throw new Error("GOOGLE_GEMINI_API_KEY is not set");
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

// Models
export const geminiPro = genAI.getGenerativeModel({ model: "gemini-pro" });
export const geminiProVision = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

// Rate limiting helper (simple in-memory)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(userId: string, maxRequests = 20): boolean {
  const now = Date.now();
  const userLimit = rateLimitMap.get(userId);
  
  if (!userLimit || now > userLimit.resetAt) {
    rateLimitMap.set(userId, {
      count: 1,
      resetAt: now + 60 * 60 * 1000, // 1 hour
    });
    return true;
  }
  
  if (userLimit.count >= maxRequests) {
    return false;
  }
  
  userLimit.count++;
  return true;
}
```

**New File:** `src/lib/ai/prompts.ts`

```typescript
export const DIAGNOSIS_PROMPT = `You are an AI medical assistant helping doctors with diagnosis suggestions.

Based on the following patient information, suggest possible diagnoses and relevant tests.

**Important Guidelines:**
- Provide 3-5 possible differential diagnoses
- Rank by likelihood
- Suggest relevant diagnostic tests
- Include red flags to watch for
- Keep suggestions evidence-based
- Remember: This is decision support, not final diagnosis

Patient Information:
{patientInfo}

Chief Complaint:
{chiefComplaint}

Provide response in JSON format:
{
  "differentialDiagnosis": [
    {
      "condition": "condition name",
      "likelihood": "high|medium|low",
      "reasoning": "explanation"
    }
  ],
  "recommendedTests": ["test1", "test2"],
  "redFlags": ["symptom to watch"],
  "additionalNotes": "any other relevant information"
}`;

export const PRESCRIPTION_CHECK_PROMPT = `You are a pharmaceutical AI assistant.

Check the following prescription for:
- Drug interactions
- Contraindications
- Dosage appropriateness
- Duration correctness

Patient Info:
{patientInfo}

Prescribed Medicines:
{medicines}

Provide response in JSON format:
{
  "interactions": [
    {
      "drugs": ["drug1", "drug2"],
      "severity": "high|medium|low",
      "description": "interaction description"
    }
  ],
  "warnings": ["warning1", "warning2"],
  "suggestions": ["suggestion1"],
  "overall": "safe|review_needed|unsafe"
}`;

export const MEDICAL_SEARCH_PROMPT = `Search the patient database and return relevant information.

Query: {query}

Context: {context}

Provide concise, relevant results focusing on:
- Patient demographics when relevant
- Related appointments
- Previous diagnoses
- Treatment history

Format as natural language summary.`;

export const REPORT_ANALYSIS_PROMPT = `Analyze the following medical test report and extract key findings.

Report Type: {reportType}
Report Data: {reportData}

Provide structured analysis:
{
  "keyFindings": ["finding1", "finding2"],
  "abnormalValues": [
    {
      "parameter": "name",
      "value": "actual",
      "normalRange": "range",
      "interpretation": "high|low|critical"
    }
  ],
  "summary": "brief summary",
  "recommendations": ["recommendation1"]
}`;
```

### AI Feature Implementation

#### Feature 1: Diagnosis Assistant

**New File:** `src/actions/ai-actions.ts`

```typescript
"use server";

import { geminiPro, checkRateLimit } from "@/lib/ai/gemini-client";
import { getMongoUser } from "@/lib/CheckUser";
import { DIAGNOSIS_PROMPT, PRESCRIPTION_CHECK_PROMPT } from "@/lib/ai/prompts";
import connectDB from "@/lib/mongodb";
import Patient from "@/models/Patient";
import AILog from "@/models/AILog"; // New model for tracking

interface DiagnosisRequest {
  patientId: string;
  chiefComplaint: string;
  symptoms: string[];
  vitalSigns?: {
    bp?: string;
    temperature?: string;
    pulse?: string;
  };
}

export async function getDiagnosisSuggestions(request: DiagnosisRequest) {
  await connectDB();
  const user = await getMongoUser();
  
  if (!user) {
    return { success: false, error: "Unauthorized" };
  }
  
  // Check if user is doctor
  if (user.role !== "DOCTOR" && user.role !== "SUPERADMIN") {
    return { success: false, error: "Only doctors can use AI diagnosis" };
  }
  
  // Rate limiting
  if (!checkRateLimit(user._id.toString())) {
    return { success: false, error: "Rate limit exceeded. Please try again later." };
  }
  
  try {
    // Get patient info
    const patient = await Patient.findById(request.patientId);
    if (!patient) {
      return { success: false, error: "Patient not found" };
    }
    
    // Prepare prompt
    const patientInfo = `
Age: ${calculateAge(patient.dateOfBirth)}
Gender: ${patient.gender || "Not specified"}
Vital Signs: ${JSON.stringify(request.vitalSigns || {})}
Symptoms: ${request.symptoms.join(", ")}
    `.trim();
    
    const prompt = DIAGNOSIS_PROMPT
      .replace("{patientInfo}", patientInfo)
      .replace("{chiefComplaint}", request.chiefComplaint);
    
    // Call Gemini
    const result = await geminiPro.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse JSON response
    const suggestions = JSON.parse(extractJSON(text));
    
    // Log AI usage
    await AILog.create({
      user: user._id,
      organization: user.organization,
      feature: "DIAGNOSIS_SUGGESTION",
      prompt: prompt,
      response: text,
      patient: patient._id,
    });
    
    return {
      success: true,
      suggestions,
    };
  } catch (error) {
    console.error("AI Diagnosis Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "AI service unavailable",
    };
  }
}

interface PrescriptionCheckRequest {
  patientId: string;
  medicines: Array<{
    name: string;
    dosage: string;
  }>;
}

export async function checkPrescriptionSafety(request: PrescriptionCheckRequest) {
  await connectDB();
  const user = await getMongoUser();
  
  if (!user || user.role !== "DOCTOR") {
    return { success: false, error: "Unauthorized" };
  }
  
  if (!checkRateLimit(user._id.toString())) {
    return { success: false, error: "Rate limit exceeded" };
  }
  
  try {
    const patient = await Patient.findById(request.patientId);
    if (!patient) {
      return { success: false, error: "Patient not found" };
    }
    
    const patientInfo = `
Age: ${calculateAge(patient.dateOfBirth)}
Weight: ${patient.weight || "Not specified"}
    `.trim();
    
    const medicines = request.medicines
      .map(m => `${m.name} - ${m.dosage}`)
      .join("\n");
    
    const prompt = PRESCRIPTION_CHECK_PROMPT
      .replace("{patientInfo}", patientInfo)
      .replace("{medicines}", medicines);
    
    const result = await geminiPro.generateContent(prompt);
    const text = (await result.response).text();
    const analysis = JSON.parse(extractJSON(text));
    
    // Log AI usage
    await AILog.create({
      user: user._id,
      organization: user.organization,
      feature: "PRESCRIPTION_CHECK",
      prompt: prompt,
      response: text,
      patient: patient._id,
    });
    
    return {
      success: true,
      analysis,
    };
  } catch (error) {
    console.error("Prescription Check Error:", error);
    return {
      success: false,
      error: "AI analysis failed",
    };
  }
}

export async function searchMedicalRecords(query: string) {
  await connectDB();
  const user = await getMongoUser();
  
  if (!user) {
    return { success: false, error: "Unauthorized" };
  }
  
  if (!checkRateLimit(user._id.toString(), 50)) { // Higher limit for search
    return { success: false, error: "Rate limit exceeded" };
  }
  
  try {
    // Get relevant data from MongoDB
    // (simplified - in reality, you'd use vector search or more sophisticated retrieval)
    const patients = await Patient.find({
      organization: user.organization,
      $or: [
        { firstName: new RegExp(query, "i") },
        { lastName: new RegExp(query, "i") },
        { phoneNumber: new RegExp(query, "i") },
      ],
    }).limit(10).lean();
    
    // Use AI to provide intelligent summary
    const context = JSON.stringify(patients);
    const prompt = MEDICAL_SEARCH_PROMPT
      .replace("{query}", query)
      .replace("{context}", context);
    
    const result = await geminiPro.generateContent(prompt);
    const summary = (await result.response).text();
    
    return {
      success: true,
      results: patients,
      summary,
    };
  } catch (error) {
    console.error("Search Error:", error);
    return {
      success: false,
      error: "Search failed",
    };
  }
}

// Helper functions
function calculateAge(dob: Date): number {
  const ageDiff = Date.now() - dob.getTime();
  const ageDate = new Date(ageDiff);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

function extractJSON(text: string): string {
  // Extract JSON from markdown code blocks if present
  const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```/);
  if (jsonMatch) {
    return jsonMatch[1];
  }
  
  // Try to find JSON object
  const objectMatch = text.match(/\{[\s\S]*\}/);
  if (objectMatch) {
    return objectMatch[0];
  }
  
  return text;
}
```

#### Feature 2: AI Chatbot

**New File:** `src/actions/ai-chat-actions.ts`

```typescript
"use server";

import { geminiPro } from "@/lib/ai/gemini-client";
import { getMongoUser } from "@/lib/CheckUser";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function chatWithAI(messages: ChatMessage[]) {
  const user = await getMongoUser();
  
  if (!user) {
    return { success: false, error: "Unauthorized" };
  }
  
  try {
    // Build conversation context
    const context = `You are HealthyFlow AI Assistant, helping healthcare professionals with:
- Medical terminology
- General healthcare queries
- Workflow guidance
- Non-diagnostic support

Important: You cannot provide diagnosis or treatment advice. Always recommend consulting with qualified healthcare professionals for medical decisions.

User Role: ${user.role}
Organization: Healthcare facility

Previous conversation:
${messages.map(m => `${m.role}: ${m.content}`).join("\n")}
`;
    
    const lastMessage = messages[messages.length - 1];
    
    const result = await geminiPro.generateContent(context + "\nUser: " + lastMessage.content);
    const response = (await result.response).text();
    
    return {
      success: true,
      message: response,
    };
  } catch (error) {
    console.error("Chat Error:", error);
    return {
      success: false,
      error: "AI service unavailable",
    };
  }
}
```

#### Feature 3: AI Model for Logging

**New File:** `src/models/AILog.ts`

```typescript
import { Schema, model, models, Document } from "mongoose";

export interface IAILog extends Document {
  user: Schema.Types.ObjectId;
  organization: Schema.Types.ObjectId;
  feature: "DIAGNOSIS_SUGGESTION" | "PRESCRIPTION_CHECK" | "MEDICAL_SEARCH" | "CHAT" | "REPORT_ANALYSIS";
  prompt: string;
  response: string;
  patient?: Schema.Types.ObjectId;
  tokensUsed?: number;
  responseTime?: number;
  createdAt: Date;
}

const AILogSchema = new Schema<IAILog>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    organization: { type: Schema.Types.ObjectId, ref: "Organization", required: true },
    feature: {
      type: String,
      enum: ["DIAGNOSIS_SUGGESTION", "PRESCRIPTION_CHECK", "MEDICAL_SEARCH", "CHAT", "REPORT_ANALYSIS"],
      required: true,
    },
    prompt: { type: String, required: true },
    response: { type: String, required: true },
    patient: { type: Schema.Types.ObjectId, ref: "Patient" },
    tokensUsed: { type: Number },
    responseTime: { type: Number },
  },
  { timestamps: true }
);

AILogSchema.index({ user: 1, createdAt: -1 });
AILogSchema.index({ organization: 1, feature: 1 });

const AILog = models.AILog || model<IAILog>("AILog", AILogSchema);
export default AILog;
```

### UI Components for AI

#### Component: Diagnosis Assistant

**New File:** `src/components/ai/diagnosis-assistant.tsx`

```tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Loader2 } from "lucide-react";
import { getDiagnosisSuggestions } from "@/actions/ai-actions";
import { Badge } from "@/components/ui/badge";

interface DiagnosisAssistantProps {
  patientId: string;
  chiefComplaint: string;
  symptoms: string[];
  vitalSigns?: {
    bp?: string;
    temperature?: string;
    pulse?: string;
  };
}

export function DiagnosisAssistant(props: DiagnosisAssistantProps) {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<any>(null);
  
  const handleGetSuggestions = async () => {
    setLoading(true);
    try {
      const result = await getDiagnosisSuggestions(props);
      if (result.success) {
        setSuggestions(result.suggestions);
      } else {
        alert(result.error);
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-500" />
          AI Diagnosis Assistant
        </CardTitle>
        <CardDescription>
          Get AI-powered differential diagnosis suggestions
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!suggestions ? (
          <Button 
            onClick={handleGetSuggestions} 
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Get AI Suggestions
              </>
            )}
          </Button>
        ) : (
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Differential Diagnosis:</h4>
              <div className="space-y-2">
                {suggestions.differentialDiagnosis.map((dx: any, i: number) => (
                  <div key={i} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{dx.condition}</span>
                      <Badge
                        variant={
                          dx.likelihood === "high"
                            ? "destructive"
                            : dx.likelihood === "medium"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {dx.likelihood}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{dx.reasoning}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {suggestions.recommendedTests.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Recommended Tests:</h4>
                <ul className="list-disc list-inside space-y-1">
                  {suggestions.recommendedTests.map((test: string, i: number) => (
                    <li key={i} className="text-sm">{test}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {suggestions.redFlags.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2 text-red-600">Red Flags:</h4>
                <ul className="list-disc list-inside space-y-1">
                  {suggestions.redFlags.map((flag: string, i: number) => (
                    <li key={i} className="text-sm text-red-600">{flag}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <Button 
              variant="outline" 
              onClick={() => setSuggestions(null)}
              className="w-full"
            >
              Get New Suggestions
            </Button>
          </div>
        )}
        
        <p className="text-xs text-muted-foreground mt-4">
          ⚠️ AI suggestions are for reference only. Always use clinical judgment.
        </p>
      </CardContent>
    </Card>
  );
}
```

#### Component: AI Chat Widget

**New File:** `src/components/ai/ai-chat-widget.tsx`

```tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { MessageCircle, X, Send } from "lucide-react";
import { chatWithAI } from "@/actions/ai-chat-actions";
import { ScrollArea } from "@/components/ui/scroll-area";

export function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{role: "user" | "assistant"; content: string}>>([
    {
      role: "assistant",
      content: "Hello! I'm your HealthyFlow AI Assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  
  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);
    
    try {
      const result = await chatWithAI([...messages, { role: "user", content: userMessage }]);
      if (result.success) {
        setMessages(prev => [...prev, { role: "assistant", content: result.message! }]);
      } else {
        setMessages(prev => [
          ...prev,
          { role: "assistant", content: "Sorry, I'm having trouble responding right now." },
        ]);
      }
    } finally {
      setLoading(false);
    }
  };
  
  if (!isOpen) {
    return (
      <Button
        className="fixed bottom-4 right-4 rounded-full h-14 w-14 shadow-lg"
        onClick={() => setIsOpen(true)}
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }
  
  return (
    <Card className="fixed bottom-4 right-4 w-96 h-[500px] shadow-xl flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-purple-500" />
          <span className="font-semibold">AI Assistant</span>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <p className="text-sm">{msg.content}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg p-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask me anything..."
            disabled={loading}
          />
          <Button onClick={handleSend} disabled={loading}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
```

### Where to Add AI Features

1. **Doctor Dashboard** (`src/app/doctor/dashboard/page.tsx`)
   - Add AI chat widget
   - Show AI usage statistics

2. **Prescription Form** (`src/components/prescription-form.tsx`)
   - Add DiagnosisAssistant component
   - Add prescription safety check button

3. **Patient Details** (`src/components/patient-details.tsx`)
   - Add AI-powered search
   - Show AI-generated patient summaries

4. **Appointment Form** (`src/components/appointment-form.tsx`)
   - AI-powered appointment suggestions
   - Optimal time slot recommendations

---

## Implementation Roadmap

### Phase 1: Foundation (Week 1-2)

#### ✅ Milestone 1.1: Update MongoDB Models
- [ ] Update Organization schema (remove clerkOrgId)
- [ ] Update Subscription schema
- [ ] Create AILog model
- [ ] Add indexes

#### ✅ Milestone 1.2: Create Organization Actions
- [ ] Create `organization-actions.ts`
- [ ] Implement createOrganization
- [ ] Implement updateOrganization
- [ ] Implement member management
- [ ] Test all actions

#### ✅ Milestone 1.3: Update Middleware
- [ ] Simplify middleware logic
- [ ] Use MongoDB organizationId in publicMetadata
- [ ] Test route protection

### Phase 2: Migration (Week 3)

#### ✅ Milestone 2.1: Data Migration
- [ ] Write migration script to convert existing data
- [ ] Create organizations in MongoDB
- [ ] Update user references
- [ ] Update subscriptions
- [ ] Verify data integrity

#### ✅ Milestone 2.2: Update Clerk Webhook
- [ ] Remove organization event handlers
- [ ] Keep user event handlers
- [ ] Test webhook functionality

#### ✅ Milestone 2.3: Update Existing Actions
- [ ] Update all actions to use MongoDB orgs
- [ ] Remove clerkOrgId references
- [ ] Update subscription utilities
- [ ] Test all functionality

### Phase 3: AI Integration (Week 4-5)

#### ✅ Milestone 3.1: Setup AI Infrastructure
- [ ] Install Gemini SDK
- [ ] Create AI client utility
- [ ] Create prompt templates
- [ ] Setup rate limiting
- [ ] Create AILog model

#### ✅ Milestone 3.2: Implement AI Features
- [ ] Diagnosis assistant
- [ ] Prescription safety check
- [ ] Medical search
- [ ] AI chatbot
- [ ] Test all AI features

#### ✅ Milestone 3.3: UI Integration
- [ ] Create AI components
- [ ] Integrate into doctor dashboard
- [ ] Integrate into prescription form
- [ ] Add chat widget
- [ ] Polish UI/UX

### Phase 4: Testing & Polish (Week 6)

#### ✅ Milestone 4.1: Comprehensive Testing
- [ ] Test organization management
- [ ] Test all user roles
- [ ] Test AI features
- [ ] Test error handling
- [ ] Performance testing

#### ✅ Milestone 4.2: Documentation
- [ ] Update README
- [ ] API documentation
- [ ] User guide
- [ ] Deployment guide

#### ✅ Milestone 4.3: Deployment
- [ ] Environment setup
- [ ] Deploy to production
- [ ] Monitor logs
- [ ] Fix any issues

---

## File Structure Reorganization

### Current Structure (Simplified)
```
src/
├── actions/              ✅ Good
├── app/                  ✅ Good
├── components/           ⚠️ Could be better organized
├── lib/                  ✅ Good
├── models/               ✅ Good
└── utils/                ❌ Should be utilities or lib
```

### Recommended Structure

```
src/
├── actions/                      # Server Actions (Keep)
│   ├── appointment-actions.ts
│   ├── patient-actions.ts
│   ├── prescription-actions.ts
│   ├── organization-actions.ts   # NEW
│   ├── ai-actions.ts             # NEW
│   └── ai-chat-actions.ts        # NEW
│
├── app/                          # Next.js App Router (Keep)
│   ├── (auth)/                   # Route group for auth
│   │   └── auth/
│   ├── (dashboard)/              # Route group for authenticated
│   │   ├── doctor/
│   │   ├── receptionist/
│   │   └── superadmin/
│   ├── api/
│   │   └── webhooks/
│   └── ...
│
├── components/                   # React Components
│   ├── ui/                       # shadcn ui components
│   ├── forms/                    # NEW: Form components
│   │   ├── appointment-form.tsx
│   │   ├── patient-form.tsx
│   │   └── prescription-form.tsx
│   ├── ai/                       # NEW: AI components
│   │   ├── diagnosis-assistant.tsx
│   │   ├── ai-chat-widget.tsx
│   │   └── prescription-checker.tsx
│   ├── layout/                   # Layout components
│   │   ├── nav-main.tsx
│   │   └── org-switcher.tsx
│   └── ...
│
├── lib/                          # Utilities & Config
│   ├── ai/                       # NEW: AI utilities
│   │   ├── gemini-client.ts
│   │   ├── prompts.ts
│   │   └── rate-limiter.ts
│   ├── auth/                     # NEW: Auth utilities
│   │   ├── check-user.ts
│   │   └── permissions.ts
│   ├── db/                       # NEW: Database utilities
│   │   ├── mongodb.ts
│   │   └── queries.ts
│   ├── utils.ts
│   ├── format.ts
│   └── ...
│
├── models/                       # Mongoose Models
│   ├── User.ts
│   ├── Organization.ts           # UPDATED
│   ├── Patient.ts
│   ├── Appointment.ts
│   ├── Prescription.ts
│   ├── Subscription.ts           # UPDATED
│   ├── AILog.ts                  # NEW
│   └── ...
│
├── types/                        # TypeScript Types
│   ├── index.ts
│   ├── organization.ts           # NEW
│   ├── ai.ts                     # NEW
│   └── ...
│
├── hooks/                        # React Hooks
│   ├── use-subscription.ts
│   └── ...
│
└── middleware.ts                 # UPDATED: Simplified
```

---

## Testing Strategy

### Unit Tests

```typescript
// __tests__/lib/ai/gemini-client.test.ts
import { checkRateLimit } from "@/lib/ai/gemini-client";

describe("AI Rate Limiting", () => {
  it("should allow requests within limit", () => {
    const userId = "test-user";
    expect(checkRateLimit(userId, 5)).toBe(true);
  });
  
  it("should block requests over limit", () => {
    const userId = "test-user-2";
    for (let i = 0; i < 5; i++) {
      checkRateLimit(userId, 5);
    }
    expect(checkRateLimit(userId, 5)).toBe(false);
  });
});
```

### Integration Tests

```typescript
// __tests__/actions/organization-actions.test.ts
import { createOrganization } from "@/actions/organization-actions";
import connectDB from "@/lib/mongodb";

beforeAll(async () => {
  await connectDB();
});

describe("Organization Actions", () => {
  it("should create organization", async () => {
    const result = await createOrganization({
      name: "Test Clinic",
      type: "CLINIC",
    });
    
    expect(result.success).toBe(true);
    expect(result.organization).toHaveProperty("_id");
  });
});
```

### E2E Tests (Cypress/Playwright)

```typescript
// e2e/organization.spec.ts
import { test, expect } from "@playwright/test";

test("create organization flow", async ({ page }) => {
  await page.goto("/onboarding");
  
  // Fill form
  await page.fill('input[name="organizationName"]', "My Clinic");
  await page.click('button[type="submit"]');
  
  // Verify redirect
  await expect(page).toHaveURL("/doctor/dashboard");
});
```

---

## Migration Script

**New File:** `scripts/migrate-to-mongodb-orgs.ts`

```typescript
import connectDB from "@/lib/mongodb";
import Organization from "@/models/Organization";
import User from "@/models/User";
import Subscription from "@/models/Subscription";
import { clerkClient } from "@clerk/nextjs/server";

async function migrateOrganizations() {
  await connectDB();
  
  console.log("Starting migration...");
  
  // Get all organizations with clerkOrgId
  const organizations = await Organization.find({ clerkOrgId: { $exists: true } });
  
  console.log(`Found ${organizations.length} organizations to migrate`);
  
  for (const org of organizations) {
    console.log(`\nMigrating: ${org.name}`);
    
    try {
      // 1. Organization is already in MongoDB, just needs cleanup
      // Remove clerkOrgId field
      await Organization.findByIdAndUpdate(org._id, {
        $unset: { clerkOrgId: "" },
      });
      
      // 2. Update all users in this org with publicMetadata
      const users = await User.find({ organization: org._id });
      const client = await clerkClient();
      
      for (const user of users) {
        if (user.clerkUserId) {
          await client.users.updateUserMetadata(user.clerkUserId, {
            publicMetadata: {
              role: user.role,
              verificationStatus: user.verificationStatus,
              organizationId: org._id.toString(), // MongoDB ID
              organizationStatus: org.status,
            },
          });
          console.log(`  Updated user: ${user.email}`);
        }
      }
      
      // 3. Update subscription
      await Subscription.findOneAndUpdate(
        { clerkOrgId: org.clerkOrgId },
        { $unset: { clerkOrgId: "" } }
      );
      
      console.log(`✅ Migrated: ${org.name}`);
    } catch (error) {
      console.error(`❌ Error migrating ${org.name}:`, error);
    }
  }
  
  console.log("\n✅ Migration complete!");
}

// Run migration
migrateOrganizations()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Migration failed:", error);
    process.exit(1);
  });
```

**Run migration:**
```bash
npx tsx scripts/migrate-to-mongodb-orgs.ts
```

---

## Summary & Next Steps

### What We're Changing

1. **✅ Organization Management**
   - Move from Clerk organizations to pure MongoDB
   - Better control, flexibility, and vendor independence
   
2. **✅ Middleware Optimization**
   - Simplify logic
   - Improve performance
   - Better maintainability

3. **✅ AI Integration**
   - Diagnosis assistance
   - Prescription safety
   - Medical search
   - Chat support

### What We're Keeping

1. **✅ Clerk for Authentication** - Sign in/out, session management
2. **✅ Server Actions** - Already following best practices
3. **✅ MongoDB Models** - Good foundation, just enhancing
4. **✅ UI Components** - Keep and enhance

### Industry Standards Achieved

- ✅ Separation of concerns (auth vs business logic)
- ✅ Server-side rendering with Next.js
- ✅ Server Actions for data mutations
- ✅ Type-safe with TypeScript
- ✅ Proper MongoDB schema design
- ✅ AI integration with proper safety measures
- ✅ Scalable and maintainable architecture

### Start Here

1. **Read this document thoroughly**
2. **Backup your database**
3. **Create a new Git branch**: `git checkout -b feature/restructuring`
4. **Follow the Implementation Roadmap**
5. **Test each phase thoroughly**
6. **Deploy incrementally**

---

## Questions & Support

For questions about this restructuring plan:

1. Review the specific section in detail
2. Check the code examples
3. Refer to official documentation:
   - [Next.js Docs](https://nextjs.org/docs)
   - [MongoDB Best Practices](https://www.mongodb.com/docs/manual/administration/production-notes/)
   - [Google Gemini AI](https://ai.google.dev/docs)
   - [Clerk Docs](https://clerk.com/docs)

---

**End of Document**

*Last Updated: February 16, 2026*
*Version: 2.0*
