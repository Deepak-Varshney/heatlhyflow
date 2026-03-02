// actions/superadmin-actions.ts
"use server";

import { revalidatePath } from "next/cache";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Organization from "@/models/Organization";
import { getMongoUser } from "@/lib/CheckUser";
import { parseSortParameter } from "@/lib/utils";
import { sendEmail } from "@/lib/email-service";

import { clerkClient } from "@clerk/nextjs/server";

export async function updateOrganizationStatus(
  orgId: string, // MongoDB document _id
  status: "ACTIVE" | "DISABLED" | "REJECTED",
  clerkUserId?: string
) {
  // Security Check: Ensure the current user is a SUPERADMIN or DEVIL
  const user = await getMongoUser();
  if (user?.role !== "SUPERADMIN" && user?.role !== "DEVIL") {
    throw new Error("Permission denied: Not a Super Admin or Devil");
  }

  await connectDB();

  await Organization.findByIdAndUpdate(orgId, { status });

  if (clerkUserId && clerkUserId !== "N/A") {
    const client = await clerkClient();
    await client.users.updateUserMetadata(clerkUserId, {
      publicMetadata: {
        organizationStatus: status
      },
    });
  }
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
    .populate('organization', 'name status')
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
    .populate('organization', 'name status clerkOrgId')
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

export async function deleteOrganization(orgId: string) {
  await connectDB();
  const currentUser = await getMongoUser();

  if (!currentUser || (currentUser.role !== "SUPERADMIN" && currentUser.role !== "DEVIL")) {
    return { success: false, error: "Permission denied: Not a Super Admin" };
  }

  const organization = await Organization.findById(orgId).select("members owner");
  if (!organization) {
    return { success: false, error: "Organization not found" };
  }

  const memberIds = [
    ...(organization.members || []).map((memberId: any) => memberId.toString()),
    organization.owner ? organization.owner.toString() : null,
  ].filter((id): id is string => Boolean(id));

  if (memberIds.length > 0) {
    await User.updateMany(
      { _id: { $in: memberIds } },
      { $unset: { organization: 1 } }
    );

    const membersWithClerk = await User.find({ _id: { $in: memberIds } })
      .select("clerkUserId role verificationStatus")
      .lean();

    const client = await clerkClient();
    for (const member of membersWithClerk) {
      if (!member.clerkUserId) continue;

      await client.users.updateUserMetadata(member.clerkUserId, {
        publicMetadata: {
          role: member.role,
          verificationStatus: member.verificationStatus,
          organizationId: null,
          organizationStatus: "DISABLED",
        },
      });
    }
  }

  await Organization.findByIdAndDelete(orgId);

  revalidatePath("/superadmin/clinics");
  revalidatePath("/superadmin/dashboard");
  revalidatePath("/superadmin/users");

  return { success: true, message: "Clinic deleted successfully" };
}

interface CreateOrganizationParams {
  name: string;
  type?: "CLINIC" | "HOSPITAL" | "PRIVATE_PRACTICE" | "NURSING_HOME";
  ownerUserId?: string; // Use existing user as owner
  ownerDetails?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    specialty?: string;
    yearsOfExperience?: number;
  }; // Create new owner
}

function slugifyOrganizationName(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function generateUniqueOrganizationSlug(name: string) {
  const baseSlug = slugifyOrganizationName(name) || "organization";
  let slug = baseSlug;
  let counter = 1;

  while (await Organization.exists({ slug })) {
    counter += 1;
    slug = `${baseSlug}-${counter}`;
  }

  return slug;
}

export async function createOrganizationAsSuperadmin(params: CreateOrganizationParams) {
  await connectDB();
  const currentUser = await getMongoUser();

  if (!currentUser || (currentUser.role !== "SUPERADMIN" && currentUser.role !== "DEVIL")) {
    return { success: false, error: "Permission denied: Not a Super Admin" };
  }

  const name = params.name?.trim();
  if (!name) {
    return { success: false, error: "Organization name is required" };
  }

  const existingName = await Organization.findOne({ name: { $regex: `^${name}$`, $options: "i" } });
  if (existingName) {
    return { success: false, error: "Organization with this name already exists" };
  }

  try {
    let ownerUser = null;
    let newClerkUserId: string | null = null;

    // Case 1: Create new owner from provided details
    if (params.ownerDetails) {
      const { firstName, lastName, email, phone, specialty, yearsOfExperience } = params.ownerDetails;

      // Check if email already exists
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return { success: false, error: "A user with this email already exists" };
      }

      // Create user in Clerk
      const client = await clerkClient();
      let clerkUser;
      
      try {
        clerkUser = await client.users.createUser({
          emailAddress: [email],
          firstName,
          lastName,
          skipPasswordRequirement: true,
          publicMetadata: {
            role: "DOCTOR",
            verificationStatus: "VERIFIED",
            organizationId: null, // Will be set after org creation
          },
        });
      } catch (clerkError: any) {
        console.error("Clerk createUser failed:", clerkError);
        if (clerkError.code === "user_exists") {
          const existingUsers = await client.users.getUserList({ emailAddress: [email] });
          if (existingUsers.data && existingUsers.data.length > 0) {
            clerkUser = existingUsers.data[0];
          } else {
            return { success: false, error: "Email already exists in authentication system" };
          }
        } else {
          const details = Array.isArray(clerkError?.errors)
            ? clerkError.errors.map((err: any) => err?.message).filter(Boolean).join(" | ")
            : "Unknown error";
          return { success: false, error: `Failed to create user account: ${details}` };
        }
      }

      newClerkUserId = clerkUser.id;

      // Create MongoDB user (will link to org after org is created)
      ownerUser = await User.create({
        clerkUserId: clerkUser.id,
        email: email.toLowerCase(),
        firstName,
        lastName,
        phone,
        imageUrl: clerkUser.imageUrl || undefined,
        role: "DOCTOR",
        organization: null, // Will update after org creation
        verificationStatus: "VERIFIED",
        specialty,
        experience: yearsOfExperience,
        weeklyAvailability: [],
        appointments: [],
      });
    }
    // Case 2: Use existing user
    else if (params.ownerUserId) {
      ownerUser = await User.findById(params.ownerUserId);
      if (!ownerUser) {
        return { success: false, error: "Selected owner user not found" };
      }
      if (ownerUser.role === "SUPERADMIN" || ownerUser.role === "DEVIL") {
        return { success: false, error: "Superadmin/Devil cannot be assigned as organization owner" };
      }
    }

    const slug = await generateUniqueOrganizationSlug(name);

    // Create organization
    const organization = await Organization.create({
      name,
      slug,
      type: params.type || "CLINIC",
      status: "ACTIVE",
      owner: ownerUser?._id,
      members: ownerUser ? [ownerUser._id] : [],
      settings: {
        timezone: "Asia/Kolkata",
        locale: "en-IN",
        branding: {
          logoUrl: undefined,
          primaryColor: undefined,
        },
      },
    });

    // Link owner to organization
    if (ownerUser) {
      ownerUser.organization = organization._id;
      await ownerUser.save();

      // Update Clerk metadata
      if (ownerUser.clerkUserId) {
        const client = await clerkClient();
        await client.users.updateUserMetadata(ownerUser.clerkUserId, {
          publicMetadata: {
            role: ownerUser.role,
            verificationStatus: ownerUser.verificationStatus,
            organizationId: organization._id.toString(),
            organizationStatus: "ACTIVE",
          },
        });
      }

      // Send organization assignment notification email
      try {
        const emailHtml = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${params.ownerDetails ? 'Welcome to HealthyFlow!' : 'Organization Owner Assignment'}</title>
  </head>
  <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f9f9f9;">
    <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); overflow: hidden;">
      <div style="background: linear-gradient(135deg, #4caf50 0%, #45a049 100%); color: white; padding: 40px 20px; text-align: center;">
        <h1 style="margin: 0; font-size: 28px; font-weight: bold;">${params.ownerDetails ? 'Welcome to HealthyFlow! 🎉' : 'Organization Owner Assignment'}</h1>
      </div>
      
      <div style="padding: 40px 30px;">
        <p style="font-size: 16px; margin-bottom: 20px;">Dear ${ownerUser.firstName} ${ownerUser.lastName},</p>
        
        ${params.ownerDetails ? `
        <div style="background-color: #e8f5e9; border-left: 4px solid #4caf50; padding: 20px; margin: 20px 0; border-radius: 4px;">
          <p style="margin: 0; font-size: 16px;">
            Your account has been successfully created, and you have been assigned as the <strong>Owner</strong> of <strong>${organization.name}</strong>!
          </p>
        </div>
        ` : `
        <div style="background-color: #e8f5e9; border-left: 4px solid #4caf50; padding: 20px; margin: 20px 0; border-radius: 4px;">
          <p style="margin: 0; font-size: 16px;">
            You have been assigned as the <strong>Owner</strong> of <strong>${organization.name}</strong>.
          </p>
        </div>
        `}
        
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 4px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #667eea;">Organization Details</h3>
          <div style="padding: 10px 0; border-bottom: 1px solid #ddd;">
            <span style="font-weight: bold; color: #667eea;">Organization Name:</span> ${organization.name}
          </div>
          <div style="padding: 10px 0; border-bottom: 1px solid #ddd;">
            <span style="font-weight: bold; color: #667eea;">Type:</span> ${organization.type}
          </div>
          <div style="padding: 10px 0;">
            <span style="font-weight: bold; color: #667eea;">Status:</span> <span style="display: inline-block; background-color: #4caf50; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: bold;">ACTIVE</span>
          </div>
        </div>
        
        ${params.ownerDetails ? `
        <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 20px; margin: 20px 0; border-radius: 4px;">
          <h3 style="margin-top: 0; color: #997404;">Getting Started</h3>
          <p style="margin: 10px 0;">Your account is ready to use. You can sign in using your email address through Google authentication.</p>
          <ul style="margin: 10px 0; padding-left: 20px;">
            <li style="margin: 8px 0;">Access your organization dashboard</li>
            <li style="margin: 8px 0;">Invite team members (doctors, receptionists)</li>
            <li style="margin: 8px 0;">Set up clinic availability and services</li>
            <li style="margin: 8px 0;">Start managing patient appointments</li>
          </ul>
        </div>
        ` : `
        <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 20px; margin: 20px 0; border-radius: 4px;">
          <h3 style="margin-top: 0; color: #997404;">What's Next?</h3>
          <ul style="margin: 10px 0; padding-left: 20px;">
            <li style="margin: 8px 0;">Access your organization dashboard to configure settings</li>
            <li style="margin: 8px 0;">Invite team members (doctors, receptionists) to join your organization</li>
            <li style="margin: 8px 0;">Set up your clinic's availability and services</li>
            <li style="margin: 8px 0;">Start managing patient appointments</li>
          </ul>
        </div>
        `}
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/auth/sign-in" style="display: inline-block; background-color: #4caf50; color: white; padding: 14px 30px; text-decoration: none; border-radius: 4px; font-weight: bold;">${params.ownerDetails ? 'Sign In Now' : 'Go to Dashboard'}</a>
        </div>
        
        <p style="font-size: 14px; color: #666; margin-top: 30px;">If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        
        <p style="font-size: 12px; color: #999; text-align: center; margin: 0;">
          &copy; ${new Date().getFullYear()} HealthyFlow. All rights reserved.
        </p>
      </div>
    </div>
  </body>
</html>
        `;

        await sendEmail({
          to: ownerUser.email,
          subject: params.ownerDetails 
            ? `Welcome to HealthyFlow! Your ${organization.name} account is ready 🎉`
            : `You've been assigned as owner of ${organization.name} 🏥`,
          html: emailHtml,
        });
      } catch (emailError) {
        console.error("Failed to send organization assignment email:", emailError);
        // Continue execution even if email fails
      }
    }

    revalidatePath("/superadmin/dashboard");
    revalidatePath("/superadmin/clinics");
    revalidatePath("/superadmin/users");

    return {
      success: true,
      organizationId: organization._id.toString(),
      message: params.ownerDetails 
        ? "Clinic and owner account created successfully! Welcome email sent."
        : "Organization created successfully" + (ownerUser ? " and owner notified via email" : ""),
    };
  } catch (error) {
    console.error("Error creating organization:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create organization",
    };
  }
}

export async function moveUserToOrganization(userId: string, organizationId: string) {
  await connectDB();
  const currentUser = await getMongoUser();

  if (!currentUser || (currentUser.role !== "SUPERADMIN" && currentUser.role !== "DEVIL")) {
    return { success: false, error: "Permission denied: Not a Super Admin" };
  }

  const user = await User.findById(userId);
  if (!user) {
    return { success: false, error: "User not found" };
  }

  if (user.role === "SUPERADMIN" || user.role === "DEVIL") {
    return { success: false, error: "Superadmin/Devil cannot be moved to organizations" };
  }

  const targetOrganization = await Organization.findById(organizationId);
  if (!targetOrganization) {
    return { success: false, error: "Target organization not found" };
  }

  const previousOrganizationId = user.organization?.toString();

  user.organization = targetOrganization._id;
  await user.save();

  await Organization.findByIdAndUpdate(targetOrganization._id, {
    $addToSet: { members: user._id },
  });

  if (previousOrganizationId && previousOrganizationId !== organizationId) {
    await Organization.findByIdAndUpdate(previousOrganizationId, {
      $pull: { members: user._id },
    });
  }

  if (user.clerkUserId) {
    const client = await clerkClient();
    await client.users.updateUserMetadata(user.clerkUserId, {
      publicMetadata: {
        role: user.role,
        verificationStatus: user.verificationStatus,
        organizationId: targetOrganization._id.toString(),
        organizationStatus: targetOrganization.status,
      },
    });
  }

  revalidatePath("/superadmin/dashboard");
  revalidatePath("/superadmin/clinics");
  revalidatePath("/superadmin/users");

  return { success: true, message: "User moved successfully" };
}
