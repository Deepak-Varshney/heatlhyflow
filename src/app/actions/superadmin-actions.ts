// actions/superadmin-actions.ts
"use server";

import { revalidatePath } from "next/cache";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Organization from "@/models/Organization";
import { getMongoUser } from "@/lib/CheckUser";
import { parseSortParameter } from "@/lib/utils";
import { clerkClient } from "@clerk/nextjs/server";

export async function updateOrganizationStatus(
  orgId: string, // MongoDB document _id
  isActive: boolean
) {
  // Security Check: Ensure the current user is a SUPERADMIN or DEVIL
  const user = await getMongoUser();
  if (user?.role !== "SUPERADMIN" && user?.role !== "DEVIL") {
    throw new Error("Permission denied: Not a Super Admin or Devil");
  }

  await connectDB();

  await Organization.findByIdAndUpdate(orgId, {
    isActive,
    disabledAt: isActive ? null : new Date(),
    disabledBy: isActive ? null : user._id,
  });
  // Revalidate paths to refresh the data on the pages
  revalidatePath("/superadmin/dashboard");
  revalidatePath("/superadmin/clinics");

  return { success: true };
}

type VerificationStatus = "PENDING" | "VERIFIED" | "REJECTED" | "ACTIVE" | "DISABLED" | "REJECTED";

export async function manageUserVerification(userId: string, status: VerificationStatus) {
  // Security check
  const currentUser = await getMongoUser();
  if (currentUser?.role !== "SUPERADMIN" && currentUser?.role !== "DEVIL") {
    throw new Error("Permission denied: Not a Super Admin or Devil");
  }

  await connectDB();

  const userToVerify = await User.findById(userId);
  if (!userToVerify) {
    throw new Error("User to update not found.");
  }

  const normalizedStatus = status.toUpperCase() as VerificationStatus;

  // Prevent setting an invalid status
  const validStatuses: VerificationStatus[] = ["PENDING", "VERIFIED", "REJECTED"];
  if (!validStatuses.includes(normalizedStatus)) {
    throw new Error(`Invalid verification status: ${normalizedStatus}`);
  }

  // Update DB
  userToVerify.verificationStatus = normalizedStatus;
  await userToVerify.save();

  // Update Clerk metadata
  const client = await clerkClient();
  await client.users.updateUserMetadata(userToVerify.clerkUserId, {
    publicMetadata: {
      role: userToVerify.role,
      verificationStatus: normalizedStatus,
    },
  });

  // Revalidate pages to reflect changes
  revalidatePath("/superadmin/users");
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

// Get all users (not just doctors) for superadmin management
interface GetAllUsersParams {
  page?: number;
  limit?: number;
  sort?: string;
  search?: string;
  role?: string;
  verificationStatus?: string;
}

export async function getAllUsers({
  page = 1,
  limit = 10,
  sort,
  search,
  role,
  verificationStatus,
}: GetAllUsersParams) {
  await connectDB();
  const user = await getMongoUser();
  if (!user || (user.role !== "SUPERADMIN" && user.role !== "DEVIL")) {
    throw new Error("Permission denied: Not a Super Admin");
  }

  const offset = (page - 1) * limit;
  const query: any = {};

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
  if (role) query.role = role;
  if (verificationStatus) query.verificationStatus = verificationStatus;

  const sortQuery = parseSortParameter(sort);

  const total = await User.countDocuments(query);
  const data = await User.find(query)
    .populate('organization', 'name isActive')
    .select('-weeklyAvailability -appointments') // Exclude heavy fields
    .sort(sortQuery)
    .skip(offset)
    // .limit(limit)
    .lean();

  return {
    data: JSON.parse(JSON.stringify(data)),
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
  };
}

// Get user by ID for detailed view
export async function getUserById(userId: string) {
  await connectDB();
  const user = await getMongoUser();
  if (!user || (user.role !== "SUPERADMIN" && user.role !== "DEVIL")) {
    throw new Error("Permission denied: Not a Super Admin");
  }

  const targetUser = await User.findById(userId)
    .populate('organization', 'name isActive')
    .lean();

  if (!targetUser) {
    return null;
  }

  return JSON.parse(JSON.stringify(targetUser));
}

// Update user details
interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: "UNASSIGNED" | "RECEPTIONIST" | "DOCTOR" | "SUPERADMIN" | "DEVIL";
  specialty?: string;
  experience?: number;
  description?: string;
  verificationStatus?: "PENDING" | "VERIFIED" | "REJECTED";
}


export async function updateUser(userId: string, data: UpdateUserData) {
  await connectDB();
  const user = await getMongoUser();
  if (!user || (user.role !== "SUPERADMIN" && user.role !== "DEVIL")) {
    throw new Error("Permission denied: Not a Super Admin");
  }

  const targetUser = await User.findById(userId);
  if (!targetUser) {
    throw new Error("User not found");
  }

  // Keep a copy of the old email to detect change
  const oldEmail = targetUser.email;

  // Update MongoDB user record
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: data },
    { new: true, runValidators: true }
  ).lean();

  // Sync to Clerk: require clerkUserId on targetUser
  try {
    if (targetUser.clerkUserId) {
      // 1) Update basic fields on Clerk user (firstName, lastName, publicMetadata)
      const clerkUpdatePayload: any = {};
      if (data.firstName) clerkUpdatePayload.firstName = data.firstName;
      if (data.lastName) clerkUpdatePayload.lastName = data.lastName;

      const client = await clerkClient();
      const clerkUser = await client.users.getUser(targetUser.clerkUserId);

      // Merge existing Clerk metadata with any Mongo-stored metadata before overriding specific keys.
      const mergedPublicMetadata = {
        ...(clerkUser.publicMetadata || {}),
        ...(targetUser.publicMetadata || {}),
      };
      const incomingRole = data.role ?? targetUser.role;
      const incomingVerification = data.verificationStatus ?? targetUser.verificationStatus;
      if (incomingRole) mergedPublicMetadata.role = incomingRole;
      if (incomingVerification) mergedPublicMetadata.verificationStatus = incomingVerification;
      clerkUpdatePayload.publicMetadata = mergedPublicMetadata;

      // Update the Clerk user (first name / last name / metadata)
      await client.users.updateUser(targetUser.clerkUserId, clerkUpdatePayload);
    } else {
      // If clerkUserId missing, log or handle it (you should store clerkUserId on registration)
      console.warn(`updateUser: target user ${userId} has no clerkUserId; Clerk not updated.`);
    }
  } catch (err) {
    // Don't crash the whole action silently — bubble a helpful error
    console.error("Failed to sync user with Clerk:", err);
    // Option A: throw to signal failure (uncomment if you want action to fail)
    // throw new Error("User updated in DB but failed to sync with Clerk: " + (err as Error).message);

    // Option B: swallow but log (keeps DB change); choose whichever fits your policy.
    // Here we continue while having logged the failure.
  }

  revalidatePath("/superadmin/users");

  return { success: true, user: updatedUser };
}

// Delete user (soft delete by setting verificationStatus to REJECTED)
export async function deleteUser(userId: string) {
  await connectDB();
  const user = await getMongoUser();
  if (!user || (user.role !== "SUPERADMIN" && user.role !== "DEVIL")) {
    throw new Error("Permission denied: Not a Super Admin");
  }

  const targetUser = await User.findById(userId);
  if (!targetUser) {
    throw new Error("User not found");
  }

  // Prevent deleting superadmin users
  if (targetUser.role === "SUPERADMIN") {
    throw new Error("Cannot delete Super Admin users");
  }

  // Soft delete by setting verification status to REJECTED
  await User.findByIdAndUpdate(userId, {
    verificationStatus: "REJECTED"
  });

  // Update Clerk metadata
  const client = await clerkClient();
  await client.users.updateUserMetadata(targetUser.clerkUserId, {
    publicMetadata: {
      role: targetUser.role,
      verificationStatus: "REJECTED",
    },
  });

  revalidatePath("/superadmin/users");

  return { success: true };
}

// Hard delete user (permanently remove from database)
export async function permanentlyDeleteUser(userId: string) {
  await connectDB();
  const user = await getMongoUser();
  if (!user || (user.role !== "SUPERADMIN" && user.role !== "DEVIL")) {
    throw new Error("Permission denied: Not a Super Admin");
  }

  const targetUser = await User.findById(userId);
  if (!targetUser) {
    throw new Error("User not found");
  }

  // Prevent deleting superadmin users
  if (targetUser.role === "SUPERADMIN") {
    throw new Error("Cannot delete Super Admin users");
  }

  // Delete from Clerk first
  const client = await clerkClient();
  await client.users.deleteUser(targetUser.clerkUserId);

  // Then delete from MongoDB
  await User.findByIdAndDelete(userId);

  revalidatePath("/superadmin/users");

  return { success: true };
}

// Bulk operations
export async function bulkUpdateUsers(userIds: string[], data: Partial<UpdateUserData>) {
  await connectDB();
  const user = await getMongoUser();
  if (!user || (user.role !== "SUPERADMIN" && user.role !== "DEVIL")) {
    throw new Error("Permission denied: Not a Super Admin");
  }

  const client = await clerkClient();

  for (const userId of userIds) {
    const targetUser = await User.findById(userId);
    if (targetUser) {
      // Update MongoDB
      await User.findByIdAndUpdate(userId, { $set: data });

      // Update Clerk if needed
      if (data.role || data.verificationStatus) {
        await client.users.updateUserMetadata(targetUser.clerkUserId, {
          publicMetadata: {
            role: data.role || targetUser.role,
            verificationStatus: data.verificationStatus || targetUser.verificationStatus,
          },
        });
      }
    }
  }

  revalidatePath("/superadmin/users");

  return { success: true, updatedCount: userIds.length };
}

// Get user statistics for dashboard
export async function getUserStats() {
  await connectDB();
  const user = await getMongoUser();
  if (!user || (user.role !== "SUPERADMIN" && user.role !== "DEVIL")) {
    throw new Error("Permission denied: Not a Super Admin");
  }

  const [
    totalUsers,
    verifiedUsers,
    pendingUsers,
    rejectedUsers,
    doctors,
    receptionists,
    unassignedUsers
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ verificationStatus: "VERIFIED" }),
    User.countDocuments({ verificationStatus: "PENDING" }),
    User.countDocuments({ verificationStatus: "REJECTED" }),
    User.countDocuments({ role: "DOCTOR" }),
    User.countDocuments({ role: "RECEPTIONIST" }),
    User.countDocuments({ role: "UNASSIGNED" })
  ]);

  return {
    totalUsers,
    verifiedUsers,
    pendingUsers,
    rejectedUsers,
    doctors,
    receptionists,
    unassignedUsers
  };
}