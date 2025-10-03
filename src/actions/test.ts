

import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Appointment from "@/models/Appointment";
import Patient from "@/models/Patient";
import User from "@/models/User"; // Doctor model ki jagah User model ka istemaal karein
import { parseSortParameter } from "@/lib/utils"; // We'll create this helper
import { startOfDay, endOfDay } from "date-fns";
import Prescription from "@/models/Prescription";
import { getMongoUser } from "@/lib/CheckUser";

export async function getAppointmentDetails(appointmentId: string) {
  try {
    await connectDB();
    const appointment = await Appointment.findById(appointmentId)
      // Populate the patient's full details from the 'patients' collection
      .populate({ 
        path: 'patient', 
        model: Patient 
      })
      // Populate the doctor's details, but only select the necessary fields
      .populate({ 
        path: 'doctor', 
        model: User, 
        select: 'firstName lastName specialty' 
      })
      // If a prescription exists, populate its details as well
      .populate({ 
        path: 'prescription', 
        model: Prescription 
      })
      .lean(); // .lean() for a faster, plain JavaScript object

    if (!appointment) {
      return null; // Return null if the appointment is not found
    }

    // Convert the Mongoose document to a plain object that can be passed to client components
    return JSON.parse(JSON.stringify(appointment));
  } catch (error) {
    console.error("Error fetching appointment details:", error);
    // In case of an invalid ID or other database error, return null
    return null;
  }
}
