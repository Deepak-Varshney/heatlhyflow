"use server";

import { revalidatePath } from "next/cache";
import { clerkClient } from "@clerk/nextjs/server";
import connectDB from "@/lib/mongodb";
import Organization from "@/models/Organization";
import User from "@/models/User";
import { getMongoUser } from "@/lib/CheckUser";
import { sendEmail } from "@/lib/email-service";
import { sendMemberInvitationEmail } from "@/lib/email-templates";

export async function getOrganizationDashboardData() {
  await connectDB();
  const currentUser = await getMongoUser();
  if (!currentUser?.organization) return null;

  const organization = await Organization.findById(currentUser.organization).lean();
  if (!organization) return null;

  const members = await User.find({ organization: organization._id })
    .sort({ createdAt: -1 })
    .lean();

  return {
    organization: JSON.parse(JSON.stringify(organization)),
    members: JSON.parse(JSON.stringify(members)),
    currentUser: JSON.parse(JSON.stringify(currentUser)),
  };
}

interface InviteMemberParams {
  firstName: string;
  lastName: string;
  email: string;
  role: "DOCTOR" | "RECEPTIONIST" | "ADMIN";
}

export async function inviteOrganizationMember(params: InviteMemberParams) {
  await connectDB();
  const currentUser = await getMongoUser();
  if (!currentUser?.organization) {
    return { success: false, error: "Organization not found." };
  }

  const organization = await Organization.findById(currentUser.organization);
  if (!organization) {
    return { success: false, error: "Organization not found." };
  }

  const isOwner = organization.owner?.toString() === currentUser._id.toString();
  const canInvite = currentUser.role === "SUPERADMIN" || currentUser.role === "ADMIN" || isOwner;
  if (!canInvite) {
    return { success: false, error: "You are not allowed to invite members." };
  }

  const client = await clerkClient();

  let clerkUser;
  try {
    clerkUser = await client.users.createUser({
      emailAddress: [params.email],
      firstName: params.firstName,
      lastName: params.lastName,
      skipPasswordRequirement: true,
      publicMetadata: {
        role: params.role,
        verificationStatus: "PENDING",
        organizationId: organization._id.toString(),
        organizationStatus: "ACTIVE",
      },
    });
  } catch (clerkError: any) {
    if (clerkError?.code === "user_exists") {
      const existingUsers = await client.users.getUserList({
        emailAddress: [params.email],
      });
      clerkUser = existingUsers.data?.[0];
    } else {
      const details = Array.isArray(clerkError?.errors)
        ? clerkError.errors.map((err: any) => err?.message).filter(Boolean).join(" | ")
        : "Unknown error";
      return { success: false, error: `Clerk user creation failed: ${details}` };
    }
  }

  if (!clerkUser) {
    return { success: false, error: "Unable to create or find user." };
  }

  const mongoUser = await User.findOneAndUpdate(
    { clerkUserId: clerkUser.id },
    {
      clerkUserId: clerkUser.id,
      email: params.email,
      firstName: params.firstName,
      lastName: params.lastName,
      role: params.role,
      organization: organization._id,
      verificationStatus: "PENDING",
    },
    { upsert: true, new: true }
  );

  await Organization.findByIdAndUpdate(organization._id, {
    $addToSet: { members: mongoUser._id },
  });

  await client.users.updateUserMetadata(clerkUser.id, {
    publicMetadata: {
      role: params.role,
      verificationStatus: "PENDING",
      organizationId: organization._id.toString(),
      organizationStatus: "ACTIVE",
    },
  });

  await sendEmail({
    to: params.email,
    subject: "You have been invited to HealthyFlow",
    html: sendMemberInvitationEmail(params.firstName, organization.name, params.role),
  });

  revalidatePath("/dashboard/organization");

  return { success: true };
}
