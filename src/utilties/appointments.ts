import connectDB from "@/lib/mongodb"
import Appointment from "@/models/Appointment"
import Patient from "@/models/Patient"

export async function getAllAppointments() {
    await connectDB()

    const rawappopintments = await Appointment.find({})
        .populate({
            path: "doctor", // Populate the appointments
            // select: "firstName", // Fields to populate
            // match: { status: { $in: ["Scheduled", "Completed"] } }, // Optional filter on appointments
        })
        .populate({
            path: "patient", // Populate the appointments
            // select: "firstName", // Fields to populate
            // match: { status: { $in: ["Scheduled", "Completed"] } }, // Optional filter on appointments
        })
        .lean()
    const appointments = serialize(rawappopintments)
    return appointments
}

// Helper to safely serialize Mongoose documents
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
    return data.map((folioDoc: any) => {
        const appointment = toPlainObject(folioDoc);
        return {
            ...appointment,
            patient: toPlainObject(folioDoc.patient),
            doctor: toPlainObject(folioDoc.doctor),
        };
    });
};
