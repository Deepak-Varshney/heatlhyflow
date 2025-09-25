// actions/onboarding-actions.ts
"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

interface OnboardingData {
  role: "DOCTOR" | "RECEPTIONIST";
  doctorDetails?: {
    specialty: string;
    experience: number;
    description: string;
  };
}

export async function updateUserOnboarding(data: OnboardingData) {
  const { userId: clerkUserId } = await auth();

  if (!clerkUserId) {
    return { success: false, error: "User not authenticated." };
  }

  try {
    await connectDB();

    const userToUpdate = await User.findOne({ clerkUserId });

    if (!userToUpdate) {
      return { success: false, error: "User not found in database." };
    }

    // Update the user's role in your database
    userToUpdate.role = data.role;

    // If the user is a doctor, add their professional details
    if (data.role === "DOCTOR" && data.doctorDetails) {
      userToUpdate.specialty = data.doctorDetails.specialty;
      userToUpdate.experience = data.doctorDetails.experience;
      userToUpdate.description = data.doctorDetails.description;
      userToUpdate.verificationStatus = "PENDING"; // Doctors need verification
    }

    await userToUpdate.save();

    // IMPORTANT: Also update the user's role in Clerk's public metadata.
    // This allows you to protect routes based on role using Clerk's middleware.
    const client = await clerkClient()
    client.users.updateUserMetadata(clerkUserId, {
      publicMetadata: {
        role: data.role,
      },
    });

    return { success: true, redirectUrl: "/dashboard" };

  } catch (error) {
    console.error("Onboarding Error:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}   