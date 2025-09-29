// // actions/availability-actions.ts
// "use server";

// import connectDB from "@/lib/mongodb";
// import Availability from "@/models/Availability";

// export async function getAvailableSlots(doctorId: string, date: Date) {
//   try {
//     await connectDB();

//     // Find all slots for the given doctor on the selected day that are 'available'
//     const availableSlots = await Availability.find({
//       doctor: doctorId,
//       status: 'available',
//       startTime: {
//         $gte: startOfDay(date), // Greater than or equal to the start of the day
//         $lt: endOfDay(date),     // Less than the end of the day
//       },
//     })
//     .sort({ startTime: 'asc' }) // Sort them chronologically
//     .lean(); // Use .lean() for faster, plain JavaScript objects

//     // Mongoose documents are not serializable, so we convert them
//     return JSON.parse(JSON.stringify(availableSlots));

//   } catch (error) {
//     console.error("Error fetching available slots:", error);
//     return []; // Return an empty array on error
//   }
// }

"use server";
import { startOfDay, endOfDay } from "date-fns";
import { revalidatePath } from "next/cache";
import connectDB from "@/lib/mongodb";
import User, { } from "@/models/User";
import Availability, { IAvailability } from "@/models/Availability";
import { getMongoUser } from "@/lib/CheckUser";
import { addDays, parse } from "date-fns";
import mongoose from "mongoose";

// export async function getAvailableSlots(doctorId: string, date: Date) {
//   try {
//     await connectDB();

//     // Find all slots for the given doctor on the selected day that are 'available'
//     const availableSlots = await Availability.find({
//       doctor: doctorId,
//       status: 'available',
//       startTime: {
//         $gte: startOfDay(date), // Greater than or equal to the start of the day
//         $lt: endOfDay(date),     // Less than the end of the day
//       },
//     })
//       .sort({ startTime: 'asc' }) // Sort them chronologically
//       .lean(); // Use .lean() for faster, plain JavaScript objects

//     // Mongoose documents are not serializable, so we convert them
//     return JSON.parse(JSON.stringify(availableSlots));

//   } catch (error) {
//     console.error("Error fetching available slots:", error);
//     return []; // Return an empty array on error
//   }
// }
// import { startOfDay, endOfDay } from 'date-fns'; // make sure you're importing these

export async function getAvailableSlots(doctorId: string, date: Date) {
  try {
    await connectDB();

    // Always fetch from start to end of the day
    const availableSlots = await Availability.find({
      doctor: doctorId,
      // status: 'available',
      startTime: {
        $gte: startOfDay(date),
        $lt: endOfDay(date),
      },
    })
      .sort({ startTime: 'asc' })
      .lean();

    return JSON.parse(JSON.stringify(availableSlots));
  } catch (error) {
    console.error("Error fetching available slots:", error);
    return [];
  }
}

/**
 * Fetches the recurring weekly availability rules for the currently logged-in doctor.
 */
export async function getDoctorAvailability() {
  await connectDB();
  try {
    const user = await getMongoUser();
    if (!user || user.role !== "DOCTOR") {
      throw new Error("Unauthorized or not a doctor.");
    }
    return JSON.parse(JSON.stringify(user.weeklyAvailability || []));
  } catch (error) {
    console.error("Error fetching doctor availability:", error);
    return [];
  }
}

/**
 * Updates a doctor's weekly availability.
 * This is a critical transaction that does three things:
 * 1. Deletes all future, unbooked appointment slots.
 * 2. Saves the new weekly schedule rules to the doctor's profile.
 * 3. Generates new available slots for the next 90 days based on the new rules.
 */
export async function updateDoctorAvailability(newSchedule: any[]) {
  await connectDB();

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = await getMongoUser();
    if (!user || user.role !== "DOCTOR") {
      throw new Error("Unauthorized or not a doctor.");
    }

    // 1. Delete all of the doctor's future slots that are not already booked.
    await Availability.deleteMany({
      doctor: user._id,
      startTime: { $gte: new Date() }, // From today onwards
      status: 'available',
    }, { session });

    // 2. Update the doctor's user model with the new recurring schedule.
    await User.findByIdAndUpdate(user._id, {
      weeklyAvailability: newSchedule
    }, { session });

    // 3. Generate new availability slots for the next 90 days.
    const slotsToCreate = [];
    const today = new Date();

    for (let i = 0; i < 90; i++) {
      const currentDate = addDays(today, i);
      const currentDayName = currentDate.toLocaleDateString('en-US', { weekday: 'long' });

      const rule = newSchedule.find(r => r.dayOfWeek === currentDayName);

      if (rule) {
        const startTime = parse(rule.startTime, "HH:mm", currentDate);
        const endTime = parse(rule.endTime, "HH:mm", currentDate);

        // Generate 30-minute slots
        let currentTime = new Date(startTime.getTime());
        while (currentTime < endTime) {
          slotsToCreate.push({
            doctor: user._id,
            startTime: new Date(currentTime.getTime()),
            endTime: new Date(currentTime.getTime() + 30 * 60000), // 30 mins later
            status: 'available',
          });
          currentTime.setMinutes(currentTime.getMinutes() + 30);
        }
      }
    }

    if (slotsToCreate.length > 0) {
      await Availability.insertMany(slotsToCreate, { session });
    }

    // If everything is successful, commit the transaction.
    await session.commitTransaction();
    revalidatePath("/doctor/profile"); // Refresh the profile page
    return { success: true };

  } catch (error) {
    // If anything fails, abort the entire transaction.
    await session.abortTransaction();
    console.error("Failed to update availability:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return { success: false, error: errorMessage };
  } finally {
    session.endSession();
  }
}
