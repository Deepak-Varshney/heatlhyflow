// actions/onboarding-actions.ts
"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
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
  if (!clerkUserId) return { success: false, error: "User not authenticated." };

  try {
    await connectDB();
    const userToUpdate = await User.findOne({ clerkUserId });
    if (!userToUpdate) return { success: false, error: "User not found." };

    // Update DB record
    userToUpdate.role = data.role;
    userToUpdate.verificationStatus = "PENDING"; // Always pending after role selection

    if (data.role === "DOCTOR" && data.doctorDetails) {
      userToUpdate.specialty = data.doctorDetails.specialty;
      userToUpdate.experience = data.doctorDetails.experience;
      userToUpdate.description = data.doctorDetails.description;
    }
    await userToUpdate.save();

    // Sync role AND verification status to Clerk metadata for the middleware
    const client = await clerkClient();
    await client.users.updateUserMetadata(clerkUserId, {
      publicMetadata: {
        role: data.role,
        verificationStatus: "PENDING",
      },
    });

    // Redirect to the new status page instead of the dashboard
    return { success: true, redirectUrl: "/dashboard/awaiting-verification" };

  } catch (error) {
    console.error("Onboarding Error:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}