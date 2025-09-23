"use server";

import { revalidatePath } from "next/cache";
import connectDB from "../lib/mongodb";
import Patient from "@/models/Patient";

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