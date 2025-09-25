import connectDB from "@/lib/mongodb"
import Doctor from "@/models/Doctor"

export async function getAllDoctors() {
    await connectDB()

    const rawpatients = await Doctor.find({})

    .populate({
      path: "appointments", // Populate the appointments
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