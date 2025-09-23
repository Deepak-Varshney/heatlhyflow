// In a new file: actions/appointment-actions.ts

"use server";

import { revalidatePath } from "next/cache";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Appointment from "@/models/Appointment";
import Availability from "@/models/Availability";
import Patient from "@/models/Patient";
import Doctor from "@/models/Doctor";

interface BookAppointmentParams {
  patientId: string;
  doctorId: string;
  availabilitySlotId: string;
  reason?: string;
}

export async function bookAppointment(params: BookAppointmentParams) {
  await connectDB();
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { patientId, doctorId, availabilitySlotId, reason } = params;

    // Step 1: Find the availability slot and ensure it's still available.
    // This is a critical step to prevent race conditions (double-booking).
    const slot = await Availability.findOneAndUpdate(
      { _id: availabilitySlotId, status: 'available' }, // Find an available slot
      { status: 'booked' }, // Mark it as booked
      { new: true, session } // `new: true` returns the updated doc, `session` makes it part of the transaction
    );

    // If the slot is null, it was already booked by someone else or doesn't exist.
    if (!slot) {
      throw new Error("This time slot is no longer available. Please select another time.");
    }

    // Step 2: Create the new appointment record.
    const newAppointmentData = {
      patient: patientId,
      doctor: doctorId,
      availabilitySlot: availabilitySlotId,
      startTime: slot.startTime,
      endTime: slot.endTime,
      reason: reason,
      status: 'scheduled',
    };

    const newAppointment = (await Appointment.create([newAppointmentData], { session }))[0];

    // Step 3: Update the patient and doctor records with the new appointment ID.
    await Patient.updateOne(
        { _id: patientId },
        { $push: { appointments: newAppointment._id } },
        { session }
    );
    await Doctor.updateOne(
        { _id: doctorId },
        { $push: { appointments: newAppointment._id } },
        { session }
    );

    // If all operations were successful, commit the transaction.
    await session.commitTransaction();

    revalidatePath("/appointments"); // Revalidate any page that lists appointments

    return { success: true, appointment: JSON.parse(JSON.stringify(newAppointment)) };
  } catch (error) {
    // If any error occurred, abort the entire transaction.
    await session.abortTransaction();
    console.error("Transaction Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Booking failed due to an unknown error.",
    };
  } finally {
    // End the session
    session.endSession();
  }
}