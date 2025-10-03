import connectDB from "@/lib/mongodb"
import User from "@/models/User"

export async function getAllDoctors() {
    await connectDB();

    const rawpatients = await User.find({role:"DOCTOR"})
        .populate({
            path: "appointments",
            // select: "date doctorName reasonForVisit status", // Uncomment if needed
            // match: { status: { $in: ["Scheduled", "Completed"] } },
        })
        .lean(); // lean comes AFTER populate

    const patients = serialize(rawpatients);
    return patients;
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

