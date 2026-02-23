"use server";

import { revalidatePath } from "next/cache";
import connectDB from "@/lib/mongodb";
import OnboardingRequest, { IOnboardingRequest } from "@/models/OnboardingRequest";
import User from "@/models/User";
import Organization from "@/models/Organization";
import { sendEmail } from "@/lib/email-service";
import {
  sendOnboardingRequestConfirmationEmail,
  sendApprovalEmail,
  sendRejectionEmail,
} from "@/lib/email-templates";
import { clerkClient } from "@clerk/nextjs/server";
import { getMongoUser } from "@/lib/CheckUser";

interface SubmitOnboardingRequestParams {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  organizationName: string;
  organizationType: "CLINIC" | "HOSPITAL" | "PRIVATE_PRACTICE" | "NURSING_HOME";
  registrationDocument?: string;
  licenseDocument?: string;
  treatments: string[];
  yearsOfExperience?: number;
  specialty?: string;
  staffCount?: number;
  operatingHours?: string;
}

/**
 * Submit onboarding request for a new clinic/hospital
 */
export async function submitOnboardingRequest(
  params: SubmitOnboardingRequestParams
) {
  await connectDB();

  try {
    // Check if email already exists
    const existingRequest = await OnboardingRequest.findOne({ email: params.email });
    if (existingRequest) {
      if (existingRequest.status === "PENDING") {
        return {
          success: false,
          error: "A request with this email is already pending approval",
        };
      }
      if (existingRequest.status === "APPROVED") {
        return {
          success: false,
          error: "This email has already been approved. Please log in.",
        };
      }
    }

    // Create onboarding request
    const request = await OnboardingRequest.create({
      firstName: params.firstName,
      lastName: params.lastName,
      email: params.email,
      phone: params.phone,
      address: params.address,
      organizationName: params.organizationName,
      organizationType: params.organizationType,
      registrationDocument: params.registrationDocument,
      licenseDocument: params.licenseDocument,
      treatments: params.treatments,
      yearsOfExperience: params.yearsOfExperience,
      specialty: params.specialty,
      staffCount: params.staffCount,
      operatingHours: params.operatingHours,
      status: "PENDING",
    });

    // Send confirmation email
    const html = sendOnboardingRequestConfirmationEmail(
      params.firstName,
      params.organizationName,
      params.email
    );

    await sendEmail({
      to: params.email,
      subject: "HealthyFlow - Onboarding Request Received ✓",
      html,
    });

    return {
      success: true,
      message: `Thank you! Your onboarding request has been submitted. Check your email at ${params.email} for confirmation.`,
      requestId: request._id.toString(),
    };
  } catch (error) {
    console.error("Error submitting onboarding request:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to submit request",
    };
  }
}

/**
 * Get all onboarding requests (for superadmin)
 */
export async function getOnboardingRequests(
  status?: "PENDING" | "APPROVED" | "REJECTED"
) {
  await connectDB();
  const user = await getMongoUser();

  if (!user || user.role !== "SUPERADMIN") {
    return {
      success: false,
      error: "Unauthorized - SuperAdmin only",
    };
  }

  try {
    const query = status ? { status } : {};
    const requests = await OnboardingRequest.find(query)
      .sort({ createdAt: -1 })
      .lean();

    // Ensure dates are properly serialized
    const serializedRequests = requests.map(req => ({
      ...req,
      _id: req._id?.toString(),
      createdAt: req.createdAt instanceof Date ? req.createdAt.toISOString() : req.createdAt,
      updatedAt: req.updatedAt instanceof Date ? req.updatedAt.toISOString() : req.updatedAt,
    }));

    return {
      success: true,
      requests: serializedRequests,
    };
  } catch (error) {
    console.error("Error fetching requests:", error);
    return {
      success: false,
      error: "Failed to fetch requests",
    };
  }
}

/**
 * Get single onboarding request details
 */
export async function getOnboardingRequest(requestId: string) {
  await connectDB();
  const user = await getMongoUser();

  if (!user || user.role !== "SUPERADMIN") {
    return {
      success: false,
      error: "Unauthorized",
    };
  }

  try {
    const request = await OnboardingRequest.findById(requestId).lean();

    if (!request) {
      return {
        success: false,
        error: "Request not found",
      };
    }

    // Serialize the request document
    const serialized = {
      ...request,
      _id: request._id?.toString(),
      createdAt: request.createdAt instanceof Date ? request.createdAt.toISOString() : request.createdAt,
      updatedAt: request.updatedAt instanceof Date ? request.updatedAt.toISOString() : request.updatedAt,
    };

    return {
      success: true,
      request: serialized,
    };
  } catch (error) {
    console.error("Error fetching request:", error);
    return {
      success: false,
      error: "Failed to fetch request",
    };
  }
}

/**
 * Approve onboarding request
 * - Creates Clerk user
 * - Creates MongoDB Organization and User
 * - Sends approval email
 */
export async function approveOnboardingRequest(
  requestId: string
) {
  await connectDB();
  const superAdmin = await getMongoUser();

  if (!superAdmin || superAdmin.role !== "SUPERADMIN") {
    return {
      success: false,
      error: "Unauthorized",
    };
  }

  try {
    const request = await OnboardingRequest.findById(requestId);

    if (!request) {
      return {
        success: false,
        error: "Request not found",
      };
    }

    if (request.status !== "PENDING") {
      return {
        success: false,
        error: `Cannot approve a request that is ${request.status}`,
      };
    }

    // Step 1: Create Clerk user
    const client = await clerkClient();
    
    let clerkUser;
    try {
      clerkUser = await client.users.createUser({
        emailAddress: [request.email],
        firstName: request.firstName,
        lastName: request.lastName,
        skipPasswordRequirement: true,
        publicMetadata: {
          role: "DOCTOR",
          verificationStatus: "VERIFIED",
          organizationId: null, // Will be set after org creation
        },
      });
    } catch (clerkError: any) {
      console.error("Clerk createUser failed:", {
        status: clerkError?.status,
        code: clerkError?.code,
        errors: clerkError?.errors,
        traceId: clerkError?.clerkTraceId
      });
      // If user already exists, try to get them
      if (clerkError.code === "user_exists") {
        const existingUsers = await client.users.getUserList({
          emailAddress: [request.email],
        });
        if (existingUsers.data && existingUsers.data.length > 0) {
          clerkUser = existingUsers.data[0];
        } else {
          throw new Error("Failed to create or find Clerk user");
        }
      } else {
        const details = Array.isArray(clerkError?.errors)
          ? clerkError.errors.map((err: any) => err?.message).filter(Boolean).join(" | ")
          : "Unknown error";
        throw new Error(`Clerk user creation failed: ${details}`);
      }
    }

    // Step 2: Create Organization in MongoDB
    const organization = await Organization.create({
      name: request.organizationName,
      slug: request.organizationName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-"),
      type: request.organizationType,
      status: "ACTIVE",
      owner: null, // Will update after user creation
      members: [],
      settings: {
        timezone: "Asia/Kolkata", // Default
        locale: "en-IN",
        branding: {
          logoUrl: undefined,
          primaryColor: undefined,
        },
      },
    });

    // Step 3: Create User in MongoDB and link to organization
    const mongoUser = await User.create({
      clerkUserId: clerkUser.id,
      email: request.email,
      firstName: request.firstName,
      lastName: request.lastName,
      imageUrl: clerkUser.imageUrl || undefined,
      role: "DOCTOR",
      organization: organization._id,
      verificationStatus: "VERIFIED",
      specialty: request.specialty,
      experience: request.yearsOfExperience,
      weeklyAvailability: [],
      appointments: [],
    });

    // Step 4: Update organization with owner and members
    organization.owner = mongoUser._id;
    organization.members = [mongoUser._id];
    await organization.save();

    // Step 5: Update Clerk user with organization info
    await client.users.updateUserMetadata(clerkUser.id, {
      publicMetadata: {
        role: "DOCTOR",
        verificationStatus: "VERIFIED",
        organizationId: organization._id.toString(),
        organizationStatus: "ACTIVE",
      },
    });

    // Step 6: Update onboarding request
    request.status = "APPROVED";
    request.approvedBy = superAdmin._id;
    request.approvalDate = new Date();
    request.clerkUserId = clerkUser.id;
    await request.save();

    // Step 7: Send approval email
    const html = sendApprovalEmail(
      request.firstName,
      request.email,
      "" // No temp password needed with Google auth
    );

    await sendEmail({
      to: request.email,
      subject: "Welcome to HealthyFlow! Your Account is Ready 🎉",
      html,
    });

    revalidatePath("/superadmin/join-requests");

    return {
      success: true,
      message: `Onboarding request approved! Account created for ${request.firstName} ${request.lastName}`,
      clerkUserId: clerkUser.id,
      organizationId: organization._id.toString(),
      userId: mongoUser._id.toString(),
    };
  } catch (error) {
    console.error("Error approving onboarding request:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to approve request",
    };
  }
}

/**
 * Reject onboarding request
 */
export async function rejectOnboardingRequest(
  requestId: string,
  rejectionReason: string
) {
  await connectDB();
  const superAdmin = await getMongoUser();

  if (!superAdmin || superAdmin.role !== "SUPERADMIN") {
    return {
      success: false,
      error: "Unauthorized",
    };
  }

  try {
    const request = await OnboardingRequest.findById(requestId);

    if (!request) {
      return {
        success: false,
        error: "Request not found",
      };
    }

    if (request.status !== "PENDING") {
      return {
        success: false,
        error: `Cannot reject a request that is ${request.status}`,
      };
    }

    // Update request
    request.status = "REJECTED";
    request.approvedBy = superAdmin._id;
    request.rejectionReason = rejectionReason;
    request.approvalDate = new Date();
    await request.save();

    // Send rejection email
    const html = sendRejectionEmail(
      request.firstName,
      request.organizationName,
      rejectionReason
    );

    await sendEmail({
      to: request.email,
      subject: "HealthyFlow Onboarding Request Status Update",
      html,
    });

    revalidatePath("/superadmin/join-requests");

    return {
      success: true,
      message: `Onboarding request rejected. Email sent to ${request.email}`,
    };
  } catch (error) {
    console.error("Error rejecting onboarding request:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to reject request",
    };
  }
}
