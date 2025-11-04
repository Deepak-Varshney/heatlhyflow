import { getMongoUser } from "@/lib/CheckUser";
import connectDB from "@/lib/mongodb"
import User from "@/models/User"

export async function getAllDoctors() {
    await connectDB();

    const user = await getMongoUser();
    if (!user) throw new Error("User not authenticated");

    const query: any = { role: "DOCTOR" };

    // Apply organization filter only if user is not SUPERADMIN
    if (user.role !== "SUPERADMIN") {
        query.organization = user.organization;
    }

    const rawDoctors = await User.find(query)
        .populate({
            path: "appointments",
        })
        .lean(); // lean comes AFTER populate

    const doctors = serialize(rawDoctors);
    return doctors;
}

// Helper to deeply serialize any object (from previous message)
function toPlainObject(obj: any): any {
    if (obj == null) return obj;

    if (Array.isArray(obj)) {
        return obj.map(toPlainObject);
    }

    if (typeof obj === 'object') {
        const result: any = {};
        for (const key in obj) {
            const value = obj[key];
            if (value instanceof Date) {
                result[key] = value.toISOString();
            } else if (value?._bsontype === 'ObjectID' || typeof value?.toString === 'function') {
                result[key] = value.toString();
            } else if (typeof value === 'object') {
                result[key] = toPlainObject(value);
            } else {
                result[key] = value;
            }
        }
        return result;
    }

    return obj;
}

export const serialize = (data: any) => {
    return Array.isArray(data)
        ? data.map(toPlainObject)
        : toPlainObject(data);
};

