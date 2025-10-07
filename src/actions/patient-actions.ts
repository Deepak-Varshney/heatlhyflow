"use server";

import { revalidatePath } from "next/cache";
import connectDB from "../lib/mongodb";
import Patient from "@/models/Patient";
import User from "@/models/User";
import { parseSortParameter } from "@/lib/utils"; // We'll create this helper
import { getMongoUser } from "@/lib/CheckUser";
import Appointment from "@/models/Appointment";
import Prescription from "@/models/Prescription";
export async function createPatient(patientData: any) {
  try {
    await connectDB();
    const user = await getMongoUser();
    if (!user) throw new Error("User not authenticated");

    // Create new patient
    const newPatient = new Patient({
      firstName: patientData.firstName,
      lastName: patientData.lastName,
      dateOfBirth: patientData.dateOfBirth,
      email: patientData.email,
      phoneNumber: patientData.phoneNumber,
      address: patientData.address,
      emergencyContact: {
        name: patientData.emergencyContactName,
        phone: patientData.emergencyContactPhone,
      },
      organization: user.organization,
      bp: patientData.bp, // Add blood pressure
      weight: patientData.weight, // Add weight
      occupation: patientData.occupation, // Add occupation
    });

    await newPatient.save();

    revalidatePath("/patients"); // Optional: if you have a patients page

    return { success: true };
  } catch (error) {
    console.error("Error creating patient:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred"
    };
  }
}

interface GetPatientsParams {
  page?: number;
  limit?: number;
  sort?: string;
  search?: string;
  name?: string;
  email?: string;
  phone?: string | any;
  address?: any;
}

export async function getPatients({
  page = 1,
  limit = 10,
  sort,
  search,
  name,
  email,
  phone,
  address,
}: GetPatientsParams) {
  await connectDB();
  const user = await getMongoUser();
  if (!user) throw new Error("User not authenticated");

  const offset = (page - 1) * limit;
  const query: any = {};

  // Only apply organization filter if user is not SUPERADMIN
  if (user.role !== "SUPERADMIN") {
    query.organization = user.organization;
  }

  // General search query across multiple fields
  if (search) {
    query.$or = [
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } },
      { address: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { phoneNumber: { $regex: search, $options: 'i' } },
    ];
  }

  // Specific filters
  if (name) {
    query.$or = [
      { firstName: { $regex: name, $options: 'i' } },
      { lastName: { $regex: name, $options: 'i' } },
    ]
  }
  if (email) query.email = { $regex: email, $options: 'i' };
  if (phone) query.phoneNumber = { $regex: phone, $options: 'i' };
  if (address) query.address = { $regex: address, $options: 'i' };

  const sortQuery = parseSortParameter(sort);

  const total = await Patient.countDocuments(query);
  const data = await Patient.find(query)
    .sort(sortQuery)
    .skip(offset)
    .limit(limit)
    .lean();

  return {
    data: JSON.parse(JSON.stringify(data)),
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
  };
}

export async function getPatientById(patientId: string) {
  try {
    await connectDB();
    const user = await getMongoUser();
    if (!user) throw new Error("User not authenticated");

    const query: any = { _id: patientId };
    
    // Only apply organization filter if user is not SUPERADMIN
    if (user.role !== "SUPERADMIN") {
      query.organization = user.organization;
    }

    const patient = await Patient.findOne(query).lean();

    if (!patient) {
      return null;
    }

    // Patient ke saare appointments fetch karein aur unhe doctor ke naam ke saath populate karein
    const appointments = await Appointment.find({ patient: patientId })
      .populate({ path: 'doctor', model: User, select: 'firstName lastName specialty' })
      .populate({ path: 'prescription', model: Prescription, select: 'diagnosis' }) // NAYA: Prescription bhi fetch karein
      .sort({ startTime: -1 })
      .lean();

    // Patient object ke saath appointments ko bhi return karein
    const patientWithDetails = {
      ...patient,
      appointments,
    };

    return JSON.parse(JSON.stringify(patientWithDetails));
  } catch (error) {
    console.error("Error fetching patient by ID:", error);
    return null;
  }
}


// Yeh type define karta hai ki form se kya data aayega
interface PatientUpdateData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  bloodPressure?: string;
  weight?: number;
  height?: number;
  // Baaki fields bhi add kar sakte hain
}

export async function updatePatient(patientId: string, data: PatientUpdateData) {
  try {
    // Security Check: Sirf logged-in user hi edit kar sakta hai
    const user = await getMongoUser();
    if (!user || (user.role !== 'DOCTOR' && user.role !== 'RECEPTIONIST' && user.role !== 'ADMIN')) {
      throw new Error("Unauthorized access.");
    }

    await connectDB();

    await Patient.findByIdAndUpdate(patientId, data);

    // Yeh bahut zaroori hai! Yeh Next.js ko batata hai ki is page ka data
    // badal gaya hai, aur use naya data fetch karna chahiye.
    revalidatePath(`/patients/${patientId}`);

    return { success: true };
  } catch (error) {
    console.error("Error updating patient:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return { success: false, error: errorMessage };
  }
}