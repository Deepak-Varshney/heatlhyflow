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

export async function getAllPatients() {
    await connectDB();

    const rawpatients = await Patient.find({})
        .populate({
            path: "appointments",
            // select: "date doctorName reasonForVisit status", // Uncomment if needed
            // match: { status: { $in: ["Scheduled", "Completed"] } },
        })
        .lean(); // lean comes AFTER populate

    const patients = serialize(rawpatients);
    return patients;
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

