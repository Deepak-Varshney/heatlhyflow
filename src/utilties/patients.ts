import connectDB from "@/lib/mongodb";
import Patient from "@/models/Patient";
import mongoose from "mongoose";
import Appointment from "../models/Appointment";
import { getMongoUser } from "@/lib/CheckUser";

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

    const user = await getMongoUser();
    if (!user) throw new Error("User not authenticated");

    const query: any = {};

    // Apply organization filter only if user is not SUPERADMIN
    if (user.role !== "SUPERADMIN") {
        query.organization = user.organization;
    }

    const rawpatients = await Patient.find(query)
        .populate({
            path: "appointments",
        })
        .lean(); // lean comes AFTER populate

    const patients = serialize(rawpatients);
    return patients;
}
