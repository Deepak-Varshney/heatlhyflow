"use server";

import { revalidatePath } from "next/cache";
import Treatment from "@/models/Treatment";
import { getMongoUser } from "@/lib/CheckUser";
import connectDB from "@/lib/mongodb";
import { getCurrentOrganizationFromCookie } from "./handleOrganizations";

export async function getDoctorTreatments() {
  try {
    await connectDB();
    const user = await getMongoUser();
    if (!user || user.role !== "DOCTOR") {
      throw new Error("Unauthorized");
    }
    const orgFromCookie = await getCurrentOrganizationFromCookie();
    const organizationId = orgFromCookie?.id || user.organization;

    if (!organizationId) {
      console.error("Doctor organization is missing while fetching treatments", {
        doctorId: user._id,
      });
      return [];
    }

    const treatments = await Treatment.find({
      doctor: user._id,
      organization: organizationId,
      isActive: true,
    })
      .sort({ name: 1 })
      .lean();

    return JSON.parse(JSON.stringify(treatments));
  } catch (error) {
    console.error("Error fetching doctor treatments:", error);
    return [];
  }
}

export async function createTreatment(data: { name: string; price: number }) {
  try {
    await connectDB();
    const user = await getMongoUser();
    if (!user || user.role !== "DOCTOR") {
      return { success: false, error: "Unauthorized" };
    }
    const orgFromCookie = await getCurrentOrganizationFromCookie();
    const organizationId = orgFromCookie?.id || user.organization;

    if (!organizationId) {
      return {
        success: false,
        error: "Doctor organization is missing. Please select an organization and try again.",
      };
    }

    const treatment = new Treatment({
      name: data.name,
      price: data.price,
      doctor: user._id,
      organization: organizationId,
      isActive: true,
    });

    await treatment.save();

    revalidatePath("/dashboard/profile");
    return { success: true, treatment: JSON.parse(JSON.stringify(treatment)) };
  } catch (error) {
    console.error("Error creating treatment:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export async function updateTreatment(
  treatmentId: string,
  data: { name?: string; price?: number }
) {
  try {
    await connectDB();
    const user = await getMongoUser();
    if (!user || user.role !== "DOCTOR") {
      return { success: false, error: "Unauthorized" };
    }

    const orgFromCookie = await getCurrentOrganizationFromCookie();
    const organizationId = orgFromCookie?.id || user.organization;

    const treatment = await Treatment.findOne({
      _id: treatmentId,
      doctor: user._id,
      ...(organizationId ? { organization: organizationId } : {}),
    });

    if (!treatment) {
      return { success: false, error: "Treatment not found" };
    }

    if (data.name !== undefined) treatment.name = data.name;
    if (data.price !== undefined) treatment.price = data.price;

    await treatment.save();

    revalidatePath("/dashboard/profile");
    return { success: true };
  } catch (error) {
    console.error("Error updating treatment:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export async function deleteTreatment(treatmentId: string) {
  try {
    await connectDB();
    const user = await getMongoUser();
    if (!user || user.role !== "DOCTOR") {
      return { success: false, error: "Unauthorized" };
    }

    const orgFromCookie = await getCurrentOrganizationFromCookie();
    const organizationId = orgFromCookie?.id || user.organization;

    // Soft delete by setting isActive to false
    await Treatment.findOneAndUpdate(
      {
        _id: treatmentId,
        doctor: user._id,
        ...(organizationId ? { organization: organizationId } : {}),
      },
      { isActive: false }
    );

    revalidatePath("/dashboard/profile");
    return { success: true };
  } catch (error) {
    console.error("Error deleting treatment:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export async function getConsultationFee() {
  try {
    await connectDB();
    const user = await getMongoUser();
    if (!user || user.role !== "DOCTOR") {
      return { success: false, error: "Unauthorized" };
    }

    return { success: true, consultationFee: user.consultationFee || 0 };
  } catch (error) {
    console.error("Error fetching consultation fee:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
      consultationFee: 0,
    };
  }
}

export async function updateConsultationFee(fee: number) {
  try {
    await connectDB();
    const user = await getMongoUser();
    if (!user || user.role !== "DOCTOR") {
      return { success: false, error: "Unauthorized" };
    }

    const User = (await import("@/models/User")).default;
    await User.findByIdAndUpdate(user._id, { consultationFee: fee });

    revalidatePath("/dashboard/profile");
    return { success: true };
  } catch (error) {
    console.error("Error updating consultation fee:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export async function getClinicSettings() {
  try {
    await connectDB();
    const user = await getMongoUser();
    if (!user || user.role !== "DOCTOR") {
      return { success: false, error: "Unauthorized" };
    }

    const User = (await import("@/models/User")).default;
    const doctor = await User.findById(user._id).lean() as any;

    return {
      success: true,
      clinicName: doctor?.clinicName || "",
      clinicAddress: doctor?.clinicAddress || "",
      clinicPhone: doctor?.clinicPhone || "",
      watermarkImageUrl: doctor?.watermarkImageUrl || "",
    };
  } catch (error) {
    console.error("Error fetching clinic settings:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export async function updateClinicSettings(data: {
  clinicName?: string;
  clinicAddress?: string;
  clinicPhone?: string;
  watermarkImageUrl?: string;
}) {
  try {
    await connectDB();
    const user = await getMongoUser();
    if (!user || user.role !== "DOCTOR") {
      return { success: false, error: "Unauthorized" };
    }

    const User = (await import("@/models/User")).default;
    const updateData: any = {};
    
    if (data.clinicName !== undefined) updateData.clinicName = data.clinicName;
    if (data.clinicAddress !== undefined) updateData.clinicAddress = data.clinicAddress;
    if (data.clinicPhone !== undefined) updateData.clinicPhone = data.clinicPhone;
    if (data.watermarkImageUrl !== undefined) updateData.watermarkImageUrl = data.watermarkImageUrl;

    await User.findByIdAndUpdate(user._id, updateData);

    revalidatePath("/dashboard/profile");
    return { success: true };
  } catch (error) {
    console.error("Error updating clinic settings:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

