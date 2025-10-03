"use server";

import { revalidatePath } from "next/cache";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Appointment from "@/models/Appointment";
import Patient from "@/models/Patient";
import User from "@/models/User"; // Doctor model ki jagah User model ka istemaal karein

// Naye parameters: ab humein slotId nahi, startTime aur endTime chahiye
interface BookAppointmentParams {
  patientId: string;
  doctorId: string;
  startTime: Date;
  endTime: Date;
  reason?: string;
}

export async function bookAppointment(params: BookAppointmentParams) {
  await connectDB();
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { patientId, doctorId, startTime, endTime, reason } = params;

    // Step 1: Check karein ki is time slot mein koi aur appointment to nahi hai.
    // Yeh double-booking ko rokne ka naya tareeka hai.
    const conflictingAppointment = await Appointment.findOne({
      doctor: doctorId,
      // Check for any appointment that overlaps with the selected time range
      $or: [
        { startTime: { $lt: endTime, $gte: startTime } },
        { endTime: { $gt: startTime, $lte: endTime } },
      ],
    }).session(session);

    if (conflictingAppointment) {
      throw new Error("This time slot is no longer available. Please select another time.");
    }

    // Step 2: Naya appointment record banayein.
    const newAppointmentData = {
      patient: patientId,
      doctor: doctorId,
      startTime,
      endTime,
      reason,
      status: 'scheduled',
    };

    const newAppointment = (await Appointment.create([newAppointmentData], { session }))[0];

    // Step 3: Patient aur Doctor ke records mein appointment ID add karein.
    await Patient.updateOne(
      { _id: patientId },
      { $push: { appointments: newAppointment._id } },
      { session }
    );
    await User.updateOne( // Doctor ki jagah User model ka istemaal karein
      { _id: doctorId },
      { $push: { appointments: newAppointment._id } },
      { session }
    );

    await session.commitTransaction();
    revalidatePath("/appointments");
    return { success: true, appointment: JSON.parse(JSON.stringify(newAppointment)) };

  } catch (error) {
    await session.abortTransaction();
    console.error("Transaction Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Booking failed due to an unknown error.",
    };
  } finally {
    session.endSession();
  }
}
