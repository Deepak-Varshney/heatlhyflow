"use server";

import { revalidatePath } from "next/cache";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Prescription from "@/models/Prescription";
import Appointment from "@/models/Appointment";
import { getMongoUser } from "@/lib/CheckUser";

// Yeh data prescription form se aayega
interface CreatePrescriptionParams {
  appointmentId: string;
  medicines: {
    name: string;
    dosage: string;
    timings: {
      beforeBreakfast: boolean;
      afterBreakfast: boolean;
      beforeLunch: boolean;
      afterLunch: boolean;
      beforeDinner: boolean;
      afterDinner: boolean;
    };
  }[];
  tests: { name: string }[];
  notes?: string;
}

export async function createPrescription(data: CreatePrescriptionParams) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = await getMongoUser();
    if (!user || user.role !== "DOCTOR") throw new Error("Unauthorized");
    await connectDB();

    const { appointmentId, medicines, tests, notes } = data;

    // 1. Naya prescription document create karo
    const newPrescription = new Prescription({
      appointment: appointmentId,
      patient: (await Appointment.findById(appointmentId).select('patient')).patient, // Get patient ID from appointment
      doctor: user._id,
      organization: user.organization,
      medicines: medicines,
      tests: tests.map(t => t.name), // Sirf naam store karo
      notes: notes,
    });
    await newPrescription.save({ session });

    // 2. Appointment ko update karo: status "Completed" karo aur prescription ID link karo
    await Appointment.findByIdAndUpdate(appointmentId, {
      status: "completed",
      prescription: newPrescription._id,
    }, { session });

    await session.commitTransaction();
    revalidatePath(`/dashboard/overview`);
    revalidatePath(`/dashboard/appointments/${appointmentId}`);
    return { success: true, prescriptionId: newPrescription._id };

  } catch (error) {
    await session.abortTransaction();
    console.error("Failed to create prescription:", error);
    return { success: false, error: "Failed to save prescription." };
  } finally {
    session.endSession();
  }
}
