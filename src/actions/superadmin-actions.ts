// actions/superadmin-actions.ts
"use server";

import { revalidatePath } from "next/cache";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Organization from "@/models/Organization";
import { getMongoUser } from "@/lib/CheckUser";

export async function updateOrganizationStatus(
  orgId: string, // MongoDB document _id
  status: "ACTIVE" | "DISABLED" | "REJECTED"
) {
  // Security Check: Ensure the current user is a SUPERADMIN
  const user = await getMongoUser();
  if (user?.role !== "SUPERADMIN") {
    throw new Error("Permission denied: Not a Super Admin");
  }

  await connectDB();

  await Organization.findByIdAndUpdate(orgId, { status });

  // Revalidate paths to refresh the data on the pages
  revalidatePath("/superadmin/dashboard");
  revalidatePath("/superadmin/clinics");

  return { success: true };
}

// actions/superadmin-actions.ts
import { clerkClient } from "@clerk/nextjs/server";
// ... other imports

export async function manageUserVerification(userId: string, status: string) { // userId is the MongoDB _id
  // Security Check: Ensure the current user is a SUPERADMIN
  const currentUser = await getMongoUser();
  if (currentUser?.role !== "SUPERADMIN") {
    throw new Error("Permission denied: Not a Super Admin");
  }

  await connectDB();

  const userToVerify = await User.findById(userId);
  if (!userToVerify) {
    throw new Error("User to update not found.");
  }

  // 1. Update their status in our DB
  userToVerify.verificationStatus = status.toUpperCase();
  await userToVerify.save();

  // 2. Update their public metadata in Clerk for the middleware
  const client = await clerkClient();

  client.users.updateUserMetadata(userToVerify.clerkUserId, {
    publicMetadata: {
      role: userToVerify.role, // Keep their chosen role
      verificationStatus: status.toUpperCase(),
    },
  });

  revalidatePath("/superadmin");
  return { success: true };
}