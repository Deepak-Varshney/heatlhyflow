import connectDB from "@/lib/mongodb"
import Doctor from "@/models/Doctor"
import User from "@/models/User"

export async function getAllDoctors() {
    await connectDB()

    const rawpatients = await User.find({role:"DOCTOR"})
    .populate({
      path: "doctorAppointments", // Populate the appointments
      select: "date doctorName reasonForVisit status", // Fields to populate
      match: { status: { $in: ["Scheduled", "Completed"] } }, // Optional filter on appointments
    }).lean()
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