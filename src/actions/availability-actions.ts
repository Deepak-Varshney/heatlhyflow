// // // actions/availability-actions.ts
// // "use server";

// // import connectDB from "@/lib/mongodb";
// // import Availability from "@/models/Availability";

// // export async function getAvailableSlots(doctorId: string, date: Date) {
// //   try {
// //     await connectDB();

// //     // Find all slots for the given doctor on the selected day that are 'available'
// //     const availableSlots = await Availability.find({
// //       doctor: doctorId,
// //       status: 'available',
// //       startTime: {
// //         $gte: startOfDay(date), // Greater than or equal to the start of the day
// //         $lt: endOfDay(date),     // Less than the end of the day
// //       },
// //     })
// //     .sort({ startTime: 'asc' }) // Sort them chronologically
// //     .lean(); // Use .lean() for faster, plain JavaScript objects

// //     // Mongoose documents are not serializable, so we convert them
// //     return JSON.parse(JSON.stringify(availableSlots));

// //   } catch (error) {
// //     console.error("Error fetching available slots:", error);
// //     return []; // Return an empty array on error
// //   }
// // }

// "use server";
// import { startOfDay, endOfDay } from "date-fns";
// import { revalidatePath } from "next/cache";
// import connectDB from "@/lib/mongodb";
// import User, { } from "@/models/User";
// import Availability, { IAvailability } from "@/models/Availability";
// import { getMongoUser } from "@/lib/CheckUser";
// import { addDays, parse } from "date-fns";
// import mongoose from "mongoose";

// // export async function getAvailableSlots(doctorId: string, date: Date) {
// //   try {
// //     await connectDB();

// //     // Find all slots for the given doctor on the selected day that are 'available'
// //     const availableSlots = await Availability.find({
// //       doctor: doctorId,
// //       status: 'available',
// //       startTime: {
// //         $gte: startOfDay(date), // Greater than or equal to the start of the day
// //         $lt: endOfDay(date),     // Less than the end of the day
// //       },
// //     })
// //       .sort({ startTime: 'asc' }) // Sort them chronologically
// //       .lean(); // Use .lean() for faster, plain JavaScript objects

// //     // Mongoose documents are not serializable, so we convert them
// //     return JSON.parse(JSON.stringify(availableSlots));

// //   } catch (error) {
// //     console.error("Error fetching available slots:", error);
// //     return []; // Return an empty array on error
// //   }
// // }
// // import { startOfDay, endOfDay } from 'date-fns'; // make sure you're importing these

// export async function getAvailableSlots(doctorId: string, date: Date) {
//   try {
//     await connectDB();

//     // Always fetch from start to end of the day
//     const availableSlots = await Availability.find({
//       doctor: doctorId,
//       // status: 'available',
//       startTime: {
//         $gte: startOfDay(date),
//         $lt: endOfDay(date),
//       },
//     })
//       .sort({ startTime: 'asc' })
//       .lean();

//     return JSON.parse(JSON.stringify(availableSlots));
//   } catch (error) {
//     console.error("Error fetching available slots:", error);
//     return [];
//   }
// }

// /**
//  * Fetches the recurring weekly availability rules for the currently logged-in doctor.
//  */
// export async function getDoctorAvailability() {
//   await connectDB();
//   try {
//     const user = await getMongoUser();
//     if (!user || user.role !== "DOCTOR") {
//       throw new Error("Unauthorized or not a doctor.");
//     }
//     return JSON.parse(JSON.stringify(user.weeklyAvailability || []));
//   } catch (error) {
//     console.error("Error fetching doctor availability:", error);
//     return [];
//   }
// }

// /**
//  * Updates a doctor's weekly availability.
//  * This is a critical transaction that does three things:
//  * 1. Deletes all future, unbooked appointment slots.
//  * 2. Saves the new weekly schedule rules to the doctor's profile.
//  * 3. Generates new available slots for the next 90 days based on the new rules.
//  */
// export async function updateDoctorAvailability(newSchedule: any[]) {
//   await connectDB();

//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const user = await getMongoUser();
//     if (!user || user.role !== "DOCTOR") {
//       throw new Error("Unauthorized or not a doctor.");
//     }

//     // 1. Delete all of the doctor's future slots that are not already booked.
//     await Availability.deleteMany({
//       doctor: user._id,
//       startTime: { $gte: new Date() }, // From today onwards
//       status: 'available',
//     }, { session });

//     // 2. Update the doctor's user model with the new recurring schedule.
//     await User.findByIdAndUpdate(user._id, {
//       weeklyAvailability: newSchedule
//     }, { session });

//     // 3. Generate new availability slots for the next 90 days.
//     const slotsToCreate = [];
//     const today = new Date();

//     for (let i = 0; i < 90; i++) {
//       const currentDate = addDays(today, i);
//       const currentDayName = currentDate.toLocaleDateString('en-US', { weekday: 'long' });

//       const rule = newSchedule.find(r => r.dayOfWeek === currentDayName);

//       if (rule) {
//         const startTime = parse(rule.startTime, "HH:mm", currentDate);
//         const endTime = parse(rule.endTime, "HH:mm", currentDate);

//         // Generate 30-minute slots
//         let currentTime = new Date(startTime.getTime());
//         while (currentTime < endTime) {
//           slotsToCreate.push({
//             doctor: user._id,
//             startTime: new Date(currentTime.getTime()),
//             endTime: new Date(currentTime.getTime() + 30 * 60000), // 30 mins later
//             status: 'available',
//           });
//           currentTime.setMinutes(currentTime.getMinutes() + 30);
//         }
//       }
//     }

//     if (slotsToCreate.length > 0) {
//       await Availability.insertMany(slotsToCreate, { session });
//     }

//     // If everything is successful, commit the transaction.
//     await session.commitTransaction();
//     revalidatePath("/doctor/profile"); // Refresh the profile page
//     return { success: true };

//   } catch (error) {
//     // If anything fails, abort the entire transaction.
//     await session.abortTransaction();
//     console.error("Failed to update availability:", error);
//     const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
//     return { success: false, error: errorMessage };
//   } finally {
//     session.endSession();
//   }
// }


"use server";

import { revalidatePath } from "next/cache";
import { parse, startOfDay, endOfDay, format } from "date-fns";
import connectDB from "@/lib/mongodb";
import User, { IAvailabilityRule } from "@/models/User";
import type { IUser } from "@/models/User";
import Appointment from "@/models/Appointment"; // Appointment model ko import karna zaroori hai
import { getMongoUser } from "@/lib/CheckUser";

/**
 * [ADVANCED VERSION - ON-THE-FLY CALCULATION]
 * Yeh function real-time mein available slots ko calculate karta hai.
 * Yeh database mein future slots store nahi karta.
 */
export async function getAvailableSlots(doctorId: string, date: Date) {
  try {
    await connectDB();

    // 1. Doctor ka user document fetch karein taaki humein weekly rules mil sakein.
    const doctor = await User.findById(doctorId).lean<IUser | null>();
    if (!doctor || !doctor.weeklyAvailability || doctor.weeklyAvailability.length === 0) {
      return []; // Agar doctor ne schedule set nahi kiya hai.
    }

    // 2. Uss din (e.g., "Monday") ke liye rule dhoondein.
    const dayOfWeek = format(date, 'EEEE'); // 'EEEE' se poora din ka naam milta hai, jaise "Monday".
    const rule = doctor.weeklyAvailability.find(r => r.dayOfWeek === dayOfWeek);

    if (!rule) {
      return []; // Doctor uss din kaam nahi karta.
    }

    // 3. Uss din ke liye working hours ka ek "virtual" block banayein.
    const blockStartTime = parse(rule.startTime, "HH:mm", date);
    const blockEndTime = parse(rule.endTime, "HH:mm", date);

    // 4. Uss din ke saare "booked" appointments database se fetch karein.
    const bookedAppointments = await Appointment.find({
      doctor: doctorId,
      startTime: { $gte: startOfDay(date), $lt: endOfDay(date) },
    }).lean();

    // 5. Potential 30-minute slots generate karein aur unmein se booked aur past slots ko hata dein.
    const finalSlots: { _id: string, startTime: Date, endTime: Date, status: 'available' }[] = [];
    let potentialSlotStart = new Date(blockStartTime);
    const now = new Date();

    while (potentialSlotStart < blockEndTime) {
      const potentialSlotEnd = new Date(potentialSlotStart.getTime() + 30 * 60000); // 30 min baad
      if (potentialSlotEnd > blockEndTime) break; // Slot working hours se bahar ja raha hai.

      // Check karein ki yeh slot kisi booked appointment se overlap to nahi ho raha.
      const isBooked = bookedAppointments.some(appt => 
        potentialSlotStart < appt.endTime && potentialSlotEnd > appt.startTime
      );
      
      // Sirf future ke aur jo booked nahi hain, unhi slots ko include karein.
      if (!isBooked && potentialSlotStart >= now) {
        finalSlots.push({
          _id: `slot-${potentialSlotStart.getTime()}`, // Frontend ke liye ek temporary unique ID
          startTime: new Date(potentialSlotStart),
          endTime: potentialSlotEnd,
          status: 'available',
        });
      }
      potentialSlotStart.setMinutes(potentialSlotStart.getMinutes() + 30);
    }
    
    return JSON.parse(JSON.stringify(finalSlots));

  } catch (error) {
    console.error("Error calculating available slots:", error);
    return [];
  }
}

/**
 * [UNCHANGED]
 * Doctor ke save kiye gaye rules ko form mein load karta hai.
 */
export async function getDoctorAvailability() {
  try {
    const user = await getMongoUser();
    if (!user || user.role !== "DOCTOR") throw new Error("Unauthorized.");
    return JSON.parse(JSON.stringify(user.weeklyAvailability || []));
  } catch (error) {
    console.error("Error fetching doctor availability rules:", error);
    return [];
  }
}

/**
 * [ULTRA-EFFICIENT VERSION]
 * Doctor ka schedule update karna ab sirf ek simple database operation hai.
 * Yeh koi bhi availability slots create ya delete nahi karta.
 */
export async function updateDoctorAvailability(newSchedule: IAvailabilityRule[]) {
  try {
    const user = await getMongoUser();
    if (!user || user.role !== "DOCTOR") throw new Error("Unauthorized.");

    // Poora logic ab sirf ek simple update hai.
    await User.findByIdAndUpdate(user._id, {
      weeklyAvailability: newSchedule
    });

    revalidatePath("/doctor/profile");
    return { success: true };
  } catch (error) {
    console.error("Failed to update availability:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return { success: false, error: errorMessage };
  }
}

