/**
 * Serialize MongoDB documents and other non-serializable objects to plain objects
 * This is needed because MongoDB ObjectIds and other objects with toJSON methods
 * cannot be passed directly from Server Components to Client Components
 */

export function serializeObject<T>(obj: any): T {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj !== "object") {
    return obj;
  }

  // Handle Mongoose documents first - convert using toObject() if available
  if (typeof obj.toObject === "function") {
    return serializeObject(obj.toObject({ flattenMaps: true }));
  }

  // Handle Date objects
  if (obj instanceof Date) {
    return obj.toISOString() as any;
  }

  // Handle arrays
  if (Array.isArray(obj)) {
    return obj.map((item) => serializeObject(item)) as any;
  }

  // Handle ObjectId - check for the buffer property which is specific to ObjectId
  if (obj.buffer && obj.offset !== undefined) {
    return obj.toString() as any;
  }

  // Handle plain objects and other types
  const serialized: any = {};
  
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];

      if (value === null || value === undefined) {
        serialized[key] = value;
      } else if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
        serialized[key] = value;
      } else if (value instanceof Date) {
        serialized[key] = value.toISOString();
      } else if (Array.isArray(value)) {
        serialized[key] = value.map((item) => serializeObject(item));
      } else if (typeof value === "object") {
        // Check for ObjectId
        if (value.buffer && value.offset !== undefined) {
          serialized[key] = value.toString();
        } else if (typeof value.toObject === "function") {
          // Mongoose document
          serialized[key] = serializeObject(value.toObject({ flattenMaps: true }));
        } else if (typeof value.toJSON === "function") {
          // Other objects with toJSON
          serialized[key] = serializeObject(value.toJSON());
        } else {
          // Recursively serialize
          serialized[key] = serializeObject(value);
        }
      }
    }
  }

  return serialized as T;
}
