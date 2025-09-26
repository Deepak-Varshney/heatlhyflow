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