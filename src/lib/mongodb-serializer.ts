/**
 * MongoDB Object Serialization Utilities
 * Converts Mongoose documents with ObjectId and Date fields to JSON-serializable plain objects
 * Required for passing Server Component data to Client Components
 */

/**
 * Convert a single MongoDB ObjectId field to string
 * Handles Mongoose ObjectId objects with internal buffer structure
 */
export function serializeObjectId(
  value: any
): string | null {
  if (!value) return null;
  if (typeof value === "string") return value;
  
  // Handle ObjectId objects which have a toString method
  if (typeof value === "object") {
    // If it's an ObjectId with buffer (Mongoose internal structure)
    if (value.buffer || value._id) {
      if (value.toString && typeof value.toString === "function") {
        return value.toString();
      }
    }
    // Try converting to string
    const stringified = String(value);
    if (stringified && stringified !== "[object Object]") {
      return stringified;
    }
  }
  
  // Last resort: return toString() result
  if (value.toString && typeof value.toString === "function") {
    return value.toString();
  }
  
  return String(value);
}

/**
 * Convert a Date field to ISO string or leave as-is
 */
export function serializeDate(value: any): string | null {
  if (!value) return null;
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "string") return value;
  return null;
}

/**
 * Generic serializer for MongoDB documents
 * Converts ObjectIds and Dates to plain JSON values
 */
export function serializeMongoDocument(doc: any): any {
  if (!doc) return null;

  const serialized: any = {};

  for (const [key, value] of Object.entries(doc)) {
    // Skip null/undefined values
    if (value === null || value === undefined) {
      serialized[key] = value;
      continue;
    }

    // Handle ObjectId fields (commonly named with Id or ending with Id, or specific known fields)
    if (
      key === "_id" ||
      key === "userId" ||
      key === "organizationId" ||
      key === "approvedBy" ||
      key === "rejectedBy" ||
      key === "createdBy" ||
      key === "updatedBy" ||
      key === "owner" ||
      key === "members" ||
      key.endsWith("Id") ||
      key.endsWith("ID")
    ) {
      if (
        key === "createdAt" ||
        key === "updatedAt" ||
        key === "approvalDate" ||
        key === "rejectionDate"
      ) {
        // These are dates, not IDs
        serialized[key] = serializeDate(value);
      } else if (Array.isArray(value)) {
        // Handle arrays of ObjectIds
        serialized[key] = value.map((item) => {
          if (typeof item === "object" && item !== null) {
            return serializeObjectId(item);
          }
          return item;
        });
      } else {
        // These are IDs
        serialized[key] = serializeObjectId(value);
      }
    }
    // Handle Date fields
    else if (
      key === "createdAt" ||
      key === "updatedAt" ||
      key === "approvalDate" ||
      key === "rejectionDate" ||
      key === "approvedAt" ||
      key === "rejectedAt" ||
      key === "startTime" ||
      key === "endTime"
    ) {
      serialized[key] = serializeDate(value);
    }
    // Handle nested objects and arrays
    else if (Array.isArray(value)) {
      serialized[key] = value.map((item) =>
        typeof item === "object" && item !== null ? serializeMongoDocument(item) : item
      );
    } else if (value !== null && typeof value === "object") {
      const objectValue = value as { buffer?: unknown; _id?: unknown; constructor?: { name?: string } };

      // Check if it looks like an ObjectId object (has toString, constructor name ObjectId, or has buffer property)
      if (
        (objectValue.constructor && objectValue.constructor.name === "ObjectId") ||
        objectValue.buffer !== undefined ||
        objectValue._id !== undefined
      ) {
        serialized[key] = serializeObjectId(value);
      } else {
        serialized[key] = serializeMongoDocument(value);
      }
    } else {
      // Primitive value, keep as-is
      serialized[key] = value;
    }
  }

  return serialized;
}

/**
 * Serialize an array of MongoDB documents
 */
export function serializeMongoDocuments(docs: any[]): any[] {
  return docs.map(serializeMongoDocument);
}
