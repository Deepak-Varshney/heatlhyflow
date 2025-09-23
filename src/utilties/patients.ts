import connectDB from "@/lib/mongodb";
import Patient from "@/models/Patient";
import mongoose from "mongoose";
import Appointment from "../models/Appointment";

interface GetPatientParams {
    page?: number;
    limit?: number;
    sort?: string;
    search?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
    status?: string;
}

export async function getAllPatients() {
    await connectDB()
    const rawpatients = await Patient.find({}).lean()

    // .populate({
    //   path: "appointments", // Populate the appointments
    //   select: "date doctorName reasonForVisit status", // Fields to populate
    //   match: { status: { $in: ["Scheduled", "Completed"] } }, // Optional filter on appointments
    // })
    const patients = serialize(rawpatients)
    return patients
}
export async function getPatients({
    page = 1,
    limit = 10,
    sort,
    search,
    firstName,
    lastName,
    email,
    phoneNumber,
    status,
}: GetPatientParams) {
    await connectDB();
    const offset = (page - 1) * limit;
    const query: any = {};

    // Search query handling
    if (search) {
        query.$or = [
            { firstName: { $regex: search, $options: 'i' } },
            { lastName: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { phoneNumber: { $regex: search, $options: 'i' } },
            { address: { $regex: search, $options: 'i' } },
        ];
    }

    if (firstName) query.firstName = { $regex: firstName, $options: 'i' };
    if (lastName) query.lastName = { $regex: lastName, $options: 'i' };
    if (email) query.email = { $regex: email, $options: 'i' };
    if (phoneNumber) query.phoneNumber = { $regex: phoneNumber, $options: 'i' };
    if (status) query.status = status;

    // Sorting logic
    let sortQuery: Record<string, 1 | -1> = { updatedAt: -1 };
    if (sort) {
        try {
            const sortArray = JSON.parse(sort);
            if (Array.isArray(sortArray) && sortArray.length > 0) {
                sortQuery = sortArray.reduce((acc, item) => {
                    if (item.id && typeof item.desc === 'boolean') {
                        acc[item.id] = item.desc ? -1 : 1;
                    }
                    return acc;
                }, {} as Record<string, 1 | -1>);
            }
        } catch {
            // ignore invalid sort param
        }
    }

    const totalPatients = await Patient.countDocuments(query);
    const rawpatients = await Patient.find(query)
        .skip(offset)
        .limit(limit)
        .sort(sortQuery)
        // .populate({
        //   path: "appointments", // Populate the appointments
        //   select: "date doctorName reasonForVisit status", // Fields to populate
        //   match: { status: { $in: ["Scheduled", "Completed"] } }, // Optional filter on appointments
        // })
        .lean();
    const patients = serialize(rawpatients)

    return {
        patients,
        totalPatients,
        currentPage: page,
    };
}

export const serialize = (data: any) => {
    return data.map((folioDoc: any) => ({
        ...folioDoc,
        _id: folioDoc._id?.toString(),
        createdAt: folioDoc.createdAt?.toLocaleDateString(),
        updatedAt: folioDoc.updatedAt?.toLocaleDateString(),
    }));
}