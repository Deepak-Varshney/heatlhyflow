# MongoDB Serialization Fix - Next.js Server/Client Component Error

## Problem
The application was throwing serialization errors when passing MongoDB documents from Server Components to Client Components:

```
Only plain objects can be passed to Client Components from Server Components. 
Objects with toJSON methods are not supported. Convert it manually to a 
simple value before passing it to props.
```

This error was occurring on routes:
- GET /dashboard
- GET /superadmin/dashboard
- POST /superadmin/dashboard

## Root Cause
MongoDB/Mongoose documents contain special fields with serialization methods:
- **ObjectId fields**: When using `.lean()`, MongoDB ObjectIds still contain internal properties like `{buffer: ...}` that can't be serialized
- **Fields affected**: `_id`, `approvedBy`, and other ObjectId references

The error specifically pointed to the `approvedBy` field which is a Mongoose ObjectId reference that wasn't properly converted to a string.

## Solution

### 1. Created MongoDB Serializer Utility (`lib/mongodb-serializer.ts`)
A reusable utility library that:
- Identifies ObjectId fields (by name pattern and common field names)
- Identifies Date fields and converts them to ISO strings
- Recursively serializes nested objects and arrays
- Safely converts all non-serializable types to plain JSON values

**Key Functions:**
- `serializeObjectId()`: Converts MongoDB ObjectIds to strings
- `serializeDate()`: Converts Date objects to ISO strings
- `serializeMongoDocument()`: Generic serializer for single documents
- `serializeMongoDocuments()`: Serializer for document arrays

### 2. Updated getOnboardingRequests Action
**Before:**
```typescript
const serializedRequests = requests.map(req => ({
  ...req,
  _id: req._id?.toString(),
  createdAt: req.createdAt instanceof Date ? req.createdAt.toISOString() : req.createdAt,
  updatedAt: req.updatedAt instanceof Date ? req.updatedAt.toISOString() : req.updatedAt,
  // Missing: approvedBy was not serialized!
}));
```

**After:**
```typescript
const serializedRequests = serializeMongoDocuments(requests);
// Now properly handles all ObjectId and Date fields
```

### 3. Updated getOnboardingRequest Action
Applies the same serialization to single-document queries.

## Files Modified

### 1. `src/lib/mongodb-serializer.ts` (NEW)
- Generic serialization utility for all MongoDB documents
- Handles ObjectId, Date, nested objects, and arrays
- Can be imported and used across all server actions

### 2. `src/actions/onboarding-request-actions.ts`
- Added import: `import { serializeMongoDocument, serializeMongoDocuments } from "@/lib/mongodb-serializer"`
- Updated `getOnboardingRequests()` to use `serializeMongoDocuments()`
- Updated `getOnboardingRequest()` to use `serializeMongoDocument()`

## Benefits

1. **Reusable**: Can be imported and used in any server action
2. **Maintainable**: Centralized serialization logic
3. **Comprehensive**: Handles ObjectIds, Dates, nested objects, and arrays
4. **Extensible**: Easy to add more field types or custom serialization rules
5. **Type-Safe**: Proper TypeScript support

## How to Use

In any server action that returns Mongoose documents to Client Components:

```typescript
import { serializeMongoDocuments, serializeMongoDocument } from "@/lib/mongodb-serializer";

// For multiple documents
const docs = await MyModel.find({}).lean();
const serialized = serializeMongoDocuments(docs);
return { success: true, data: serialized };

// For single document
const doc = await MyModel.findById(id).lean();
const serialized = serializeMongoDocument(doc);
return { success: true, data: serialized };
```

## Field Detection

The serializer automatically handles these ObjectId fields:
- `_id` (always)
- Fields ending with `Id` or `ID`
- Specific known fields: `userId`, `approvedBy`, `rejectedBy`, `createdBy`, `updatedBy`

And these Date fields:
- `createdAt`, `updatedAt`
- `approvalDate`, `rejectionDate`
- `approvedAt`, `rejectedAt`
- `startTime`, `endTime`

## Testing

To verify the fix:
1. Navigate to `/dashboard` - should no longer show serialization errors
2. Navigate to `/superadmin/dashboard` - should properly display request cards
3. Check browser console for any remaining serialization warnings

## Related Components Affected

- `src/components/request-details-modal.tsx` (uses onboarding requests)
- `src/app/superadmin/dashboard/page.tsx` (displays request cards)
- `src/app/superadmin/join-requests/page.tsx` (displays request list)

All these components now receive properly serialized data from the server actions.
