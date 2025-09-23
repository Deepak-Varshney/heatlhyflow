// actions/availability-actions.ts
"use server";

import connectDB from "@/lib/mongodb";
import Availability from "@/models/Availability";
import { startOfDay, endOfDay } from "date-fns";

export async function getAvailableSlots(doctorId: string, date: Date) {
  try {
    await connectDB();

    // Find all slots for the given doctor on the selected day that are 'available'
    const availableSlots = await Availability.find({
      doctor: doctorId,
      status: 'available',
      startTime: {
        $gte: startOfDay(date), // Greater than or equal to the start of the day
        $lt: endOfDay(date),     // Less than the end of the day
      },
    })
    .sort({ startTime: 'asc' }) // Sort them chronologically
    .lean(); // Use .lean() for faster, plain JavaScript objects

    // Mongoose documents are not serializable, so we convert them
    return JSON.parse(JSON.stringify(availableSlots));

  } catch (error) {
    console.error("Error fetching available slots:", error);
    return []; // Return an empty array on error
  }
}