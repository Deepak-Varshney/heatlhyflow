"use server";

import connectDB from "@/lib/mongodb";
import { getMongoUser } from "@/lib/CheckUser";
import User from "@/models/User";

function toPlainObject(obj: any): any {
  if (obj == null) return obj;

  if (Array.isArray(obj)) {
    return obj.map(toPlainObject);
  }

  if (typeof obj === "object") {
    const result: any = {};
    for (const key in obj) {
      const value = obj[key];
      if (value instanceof Date) {
        result[key] = value.toISOString();
      } else if (value?._bsontype === "ObjectID" || typeof value?.toString === "function") {
        result[key] = value.toString();
      } else if (typeof value === "object") {
        result[key] = toPlainObject(value);
      } else {
        result[key] = value;
      }
    }
    return result;
  }

  return obj;
}

export const serialize = async(data: any) => {
  return Array.isArray(data) ? data.map(toPlainObject) : toPlainObject(data);
};

export async function getAllDoctors() {
  await connectDB();

  const user = await getMongoUser();
  if (!user) throw new Error("User not authenticated");

  const query: any = { role: "DOCTOR" };

  if (user.role !== "SUPERADMIN") {
    query.organization = user.organization;
  }

  const rawDoctors = await User.find(query)
    .populate({
      path: "appointments",
    })
    .lean();

  return serialize(rawDoctors);
}
