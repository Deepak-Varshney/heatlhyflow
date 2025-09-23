"use server";

import { revalidatePath } from "next/cache";
import connectDB from "@/lib/mongodb";
import Doctor from "@/models/Doctor";
import Availability from "@/models/Availability"; // Assuming you have this model
import { addDays, parse } from 'date-fns';

// A helper type for clarity
interface AvailabilityRule {
  dayOfWeek: string;
  startTime: string; // "HH:MM"
  endTime: string;   // "HH:MM"
}

export async function createDoctor(doctorData: {
  firstName: string;
  lastName:string;
  email: string;
  phoneNumber: string;
  specialization: string;
  availability?: AvailabilityRule[];
}) {
  try {
    await connectDB();

    // 1. Create the new doctor
    const newDoctor = new Doctor({
      firstName: doctorData.firstName,
      lastName: doctorData.lastName,
      email: doctorData.email,
      phoneNumber: doctorData.phoneNumber,
      specialization: doctorData.specialization,
    });
    
    await newDoctor.save();

    // 2. If availability rules are provided, generate time slots
    if (doctorData.availability && doctorData.availability.length > 0) {
      const slots = [];
      const today = new Date();
      const weekDaysMap: { [key: string]: number } = {
        "Sunday": 0, "Monday": 1, "Tuesday": 2, "Wednesday": 3, 
        "Thursday": 4, "Friday": 5, "Saturday": 6
      };

      // Generate slots for the next 365 days
      for (let i = 0; i < 365; i++) {
        const currentDate = addDays(today, i);
        const currentDayName = currentDate.toLocaleDateString('en-US', { weekday: 'long' });

        const rule = doctorData.availability.find(a => a.dayOfWeek === currentDayName);

        if (rule) {
          // Parse the time strings into date objects for today
          const startTime = parse(rule.startTime, "HH:mm", new Date());
          const endTime = parse(rule.endTime, "HH:mm", new Date());
          
          // Set the date part of startTime and endTime to the currentDate
          startTime.setFullYear(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
          endTime.setFullYear(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());

          // Assuming 30-minute slots, but you can change this
          let currentTime = new Date(startTime.getTime());
          
          while (currentTime < endTime) {
            slots.push({
              doctor: newDoctor._id,
              startTime: new Date(currentTime.getTime()),
              endTime: new Date(currentTime.getTime() + 30 * 60000), // 30 minutes later
              status: 'available',
            });
            currentTime.setMinutes(currentTime.getMinutes() + 30);
          }
        }
      }

      // Bulk insert all the generated slots for better performance
      if (slots.length > 0) {
        await Availability.insertMany(slots);
      }
    }

    revalidatePath("/doctors"); // Optional: if you have a doctors page
    return { success: true };

  } catch (error) {
    console.error("Error creating doctor:", error);
    // Handle specific MongoDB duplicate key error for email
    if (error instanceof Error && 'code' in error && error.code === 11000) {
       return { success: false, error: "A doctor with this email already exists." };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}