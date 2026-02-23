"use server";

import { revalidatePath } from "next/cache";
import User from "@/models/User";
import { parseSortParameter } from "@/lib/utils"; // We'll create this helper
import { getMongoUser } from "@/lib/CheckUser";
import Appointment from "@/models/Appointment";
import Prescription from "@/models/Prescription";
import connectDB from "@/lib/mongodb";
import Patient from "@/models/Patient";
import { getCurrentOrganizationFromCookie } from "./handleOrganizations";
export async function createPatient(patientData: any) {
  try {
    await connectDB();
    const user = await getMongoUser();
    if (!user) throw new Error("User not authenticated");
    const orgId = await getCurrentOrganizationFromCookie();
    const organizationId = orgId?.id || (user.organization ? user.organization.toString() : null);
    if (!organizationId) {
      throw new Error("Organization not found for current user.");
    }

    // Create new patient
    const newPatient = new Patient({
      firstName: patientData.firstName,
      lastName: patientData.lastName,
      dateOfBirth: patientData.dateOfBirth,
      phoneNumber: patientData.phoneNumber,
      email: patientData.email || undefined,
      address: patientData.address || undefined,
      emergencyContact: patientData.emergencyContactPhone ? {
        phone: patientData.emergencyContactPhone,
      } : undefined,
      organization: organizationId,
      bp: patientData.bp || undefined,
      weight: patientData.weight || undefined,
      occupation: patientData.occupation || undefined,
    });

    await newPatient.save();

    revalidatePath("/dashboard/patients");

    return { success: true };
  } catch (error) {
    console.error("Error creating patient:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred"
    };
  }
}

interface GetPatientsParams {
  page?: number;
  limit?: number;
  sort?: string;
  search?: string;
  name?: string;
  email?: string;
  phone?: string | any;
  address?: any;
}

export async function getPatients({
  page = 1,
  limit = 10,
  sort,
  search,
}: GetPatientsParams) {
  await connectDB();
  const user = await getMongoUser();
  if (!user) throw new Error("User not authenticated");
  const orgId = await getCurrentOrganizationFromCookie();
  const organizationId = orgId?.id || (user.organization ? user.organization.toString() : null);

  const offset = (page - 1) * limit;
  const query: any = {};

  // Organization restriction unless SUPERADMIN
  if (user.role !== "SUPERADMIN") {
    if (!organizationId) {
      throw new Error("Organization not found for current user.");
    }
    query.organization = organizationId;
  }

  // Unified search across all fields
  if (search) {
    const regex = { $regex: search, $options: "i" };
    query.$or = [
      { firstName: regex },
      { lastName: regex },
      { email: regex },
      { phoneNumber: regex },
      { address: regex },
    ];
  }

  const sortQuery = parseSortParameter(sort);

  const total = await Patient.countDocuments(query);
  const data = await Patient.find(query)
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


export async function getPatientById(patientId: string) {
  try {
    await connectDB();
    const user = await getMongoUser();
    if (!user) throw new Error("User not authenticated");
    const orgId = await getCurrentOrganizationFromCookie();
    const organizationId = orgId?.id || (user.organization ? user.organization.toString() : null);

    const query: any = { _id: patientId };
    
    // Only apply organization filter if user is not SUPERADMIN
    if (user.role !== "SUPERADMIN") {
      if (!organizationId) {
        throw new Error("Organization not found for current user.");
      }
      query.organization = organizationId;
    }

    const patient = await Patient.findOne(query).lean();

    if (!patient) {
      return null;
    }

    // Patient ke saare appointments fetch karein aur unhe doctor ke naam ke saath populate karein
    const appointments = await Appointment.find({ patient: patientId })
      .populate({ path: 'doctor', model: User, select: 'firstName lastName specialty' })
      .populate({ path: 'prescription', model: Prescription, select: 'diagnosis' }) // NAYA: Prescription bhi fetch karein
      .sort({ startTime: -1 })
      .lean();

    // Patient object ke saath appointments ko bhi return karein
    const patientWithDetails = {
      ...patient,
      appointments,
    };

    return JSON.parse(JSON.stringify(patientWithDetails));
  } catch (error) {
    console.error("Error fetching patient by ID:", error);
    return null;
  }
}


// Yeh type define karta hai ki form se kya data aayega
interface PatientUpdateData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  bloodPressure?: string;
  weight?: number;
  height?: number;
  // Baaki fields bhi add kar sakte hain
}

export async function updatePatient(patientId: string, data: PatientUpdateData) {
  try {
    // Security Check: Sirf logged-in user hi edit kar sakta hai
    const user = await getMongoUser();
    if (!user || (user.role !== 'DOCTOR' && user.role !== 'RECEPTIONIST' && user.role !== 'ADMIN')) {
      throw new Error("Unauthorized access.");
    }

    await connectDB();

    await Patient.findByIdAndUpdate(patientId, data);

    // Yeh bahut zaroori hai! Yeh Next.js ko batata hai ki is page ka data
    // badal gaya hai, aur use naya data fetch karna chahiye.
    revalidatePath(`/dashboard/patients/${patientId}`);

    return { success: true };
  } catch (error) {
    console.error("Error updating patient:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return { success: false, error: errorMessage };
  }
}

export async function deletePatient(patientId: string) {
  try {
    await connectDB();
    const user = await getMongoUser();
    if (!user) throw new Error("User not authenticated");
    if (user.role !== 'DOCTOR' && user.role !== 'RECEPTIONIST' && user.role !== 'ADMIN' && user.role !== 'SUPERADMIN') {
      throw new Error("Unauthorized access.");
    }

    const orgId = await getCurrentOrganizationFromCookie();
    const organizationId = orgId?.id || (user.organization ? user.organization.toString() : null);

    const query: any = { _id: patientId };
    if (user.role !== 'SUPERADMIN') {
      if (!organizationId) throw new Error("Organization not found for current user.");
      query.organization = organizationId;
    }

    const appointmentIds = await Appointment.find({ patient: patientId })
      .select('_id doctor')
      .lean();

    if (appointmentIds.length > 0) {
      const ids = appointmentIds.map((appt) => appt._id);
      await Appointment.deleteMany({ _id: { $in: ids } });
      await User.updateMany(
        { appointments: { $in: ids } },
        { $pull: { appointments: { $in: ids } } }
      );
    }

    await Patient.findOneAndDelete(query);

    revalidatePath('/dashboard/patients');

    return { success: true };
  } catch (error) {
    console.error("Error deleting patient:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}