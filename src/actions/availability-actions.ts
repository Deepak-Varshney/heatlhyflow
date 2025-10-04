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

