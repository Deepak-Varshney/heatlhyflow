"use server";

import { revalidatePath } from "next/cache";
import connectDB from "../lib/mongodb";
import Patient from "@/models/Patient";
import { parseSortParameter } from "@/lib/utils"; // We'll create this helper

export async function createPatient(patientData: any) {
  try {
    await connectDB();
    
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
    });

    await newPatient.save();
    
    revalidatePath("/patients"); // Optional: if you have a patients page
    
    return { success: true};
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
  phone?: string;
}

export async function getPatients({
  page = 1,
  limit = 10,
  sort,
  search,
  name,
  email,
  phone,
}: GetPatientsParams) {
  await connectDB();

  const offset = (page - 1) * limit;
  const query: any = {};

  // General search query across multiple fields
  if (search) {
    query.$or = [
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } },
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
