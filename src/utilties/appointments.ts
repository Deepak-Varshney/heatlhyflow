import connectDB from "@/lib/mongodb"
import Appointment from "@/models/Appointment"
import Availability from "@/models/Availability"
import Doctor from "@/models/Doctor"
import Patient from "@/models/Patient"

export async function getAllAppointments() {
    await connectDB()

    const rawpatients = await Appointment.find({})
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
        .populate({
            path: "availabilitySlot", // Populate the appointments
            // select: "firstName", // Fields to populate
            // match: { status: { $in: ["Scheduled", "Completed"] } }, // Optional filter on appointments
        })
        .lean()
    const patients = serialize(rawpatients)
    return patients
}
export const serialize = (data: any) => {
    return data.map((folioDoc: any) => ({
        ...folioDoc,
        _id: folioDoc._id?.toString(),
        createdAt: folioDoc.createdAt?.toLocaleDateString(),
        updatedAt: folioDoc.updatedAt?.toLocaleDateString(),


    }));
}