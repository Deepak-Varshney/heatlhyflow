// actions/superadmin-actions.ts
"use server";

import { revalidatePath } from "next/cache";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Organization from "@/models/Organization";
import { getMongoUser } from "@/lib/CheckUser";
import { parseSortParameter } from "@/lib/utils";


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


interface GetDoctorsParams {
  page?: number;
  limit?: number;
  sort?: string;
  search?: string;
  name?: string;
  email?: string;
  specialty?: string;
}

export async function getDoctors({
  page = 1,
  limit = 10,
  sort,
  search,
  name,
  email,
  specialty,
}: GetDoctorsParams) {
  await connectDB();

  const offset = (page - 1) * limit;
  // Base query to only fetch users who are doctors
  const query: any = { role: "DOCTOR" };

  // General search query
  if (search) {
    query.$or = [
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { specialty: { $regex: search, $options: 'i' } },
    ];
  }

  // Specific filters
  if (name) {
    query.$or = [
        { firstName: { $regex: name, $options: 'i' } },
        { lastName: { $regex: name, $options: 'i' } },
    ]
  }
  if (email) query.email = { $regex: email, $options: 'i' };
  if (specialty) query.specialty = { $regex: specialty, $options: 'i' };

  const sortQuery = parseSortParameter(sort);

  const total = await User.countDocuments(query);
  const data = await User.find(query)
    .select('-weeklyAvailability -appointments') // Exclude heavy fields from list view
    .sort(sortQuery)
    .skip(offset)
    .limit(limit)
    .lean();

  return {
    data: JSON.parse(JSON.stringify(data)),
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
  };
}
