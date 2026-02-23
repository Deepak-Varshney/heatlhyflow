"use server";

import { revalidatePath } from "next/cache";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Appointment from "@/models/Appointment";
import Patient from "@/models/Patient";
import User from "@/models/User"; // Doctor model ki jagah User model ka istemaal karein
import { parseSortParameter } from "@/lib/utils"; // We'll create this helper
import { startOfDay, endOfDay } from "date-fns";
import Prescription from "@/models/Prescription";
import { getMongoUser } from "@/lib/CheckUser";

// Naye parameters: ab humein slotId nahi, startTime aur endTime chahiye
interface BookAppointmentParams {
  patientId: string;
  doctorId: string;
  startTime: Date;
  endTime: Date;
  reason?: string;
}

export async function bookAppointment(params: BookAppointmentParams) {
  await connectDB();
  const user = await getMongoUser();
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { patientId, doctorId, startTime, endTime, reason } = params;

    // Step 1: Check karein ki is time slot mein koi aur appointment to nahi hai.
    // Yeh double-booking ko rokne ka naya tareeka hai.
    const conflictingAppointment = await Appointment.findOne({
      doctor: doctorId,
      // Check for any appointment that overlaps with the selected time range
      $or: [
        { startTime: { $lt: endTime, $gte: startTime } },
        { endTime: { $gt: startTime, $lte: endTime } },
      ],
    }).session(session);

    if (conflictingAppointment) {
      throw new Error("This time slot is no longer available. Please select another time.");
    }

    // Step 2: Naya appointment record banayein.
    const newAppointmentData = {
      patient: patientId,
      doctor: doctorId,
      organization: user.organization,
      startTime,
      endTime,
      reason,
      status: 'scheduled',
      createdBy: user._id
    };

    const newAppointment = (await Appointment.create([newAppointmentData], { session }))[0];

    // Step 3: Patient aur Doctor ke records mein appointment ID add karein.
    await Patient.updateOne(
      { _id: patientId },
      { $push: { appointments: newAppointment._id } },
      { session }
    );
    await User.updateOne( // Doctor ki jagah User model ka istemaal karein
      { _id: doctorId },
      { $push: { appointments: newAppointment._id } },
      { session }
    );

    await session.commitTransaction();
    revalidatePath("/dashboard/appointments");
    return { success: true, appointment: JSON.parse(JSON.stringify(newAppointment)) };

  } catch (error) {
    await session.abortTransaction();
    console.error("Transaction Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Booking failed due to an unknown error.",
    };
  } finally {
    session.endSession();
  }
}
interface GetAppointmentsParams {
  page?: number;
  limit?: number;
  sort?: string;
  search?: string;
  status?: string;
  patientName?: string;
  doctorName?: string;
}

export async function getAppointments({
  page = 1,
  limit = 10,
  sort,
  search,
  status,
  patientName,
  doctorName,
}: GetAppointmentsParams) {
  await connectDB();

  const offset = (page - 1) * limit;
  const sortQuery = parseSortParameter(sort);
  const pipeline: mongoose.PipelineStage[] = [];
  const user = await getMongoUser();
  
  // --- Step 1: Join (lookup) with patients and users (doctors) collections ---
  pipeline.push(
    { $lookup: { from: 'patients', localField: 'patient', foreignField: '_id', as: 'patient' } },
    { $lookup: { from: 'users', localField: 'doctor', foreignField: '_id', as: 'doctorDetails' } },
    { $lookup: { from: 'prescriptions', localField: 'prescription', foreignField: '_id', as: 'prescription' } },
    { $unwind: '$patient' },
    { $unwind: '$doctorDetails' },
    // 💡 IMPORTANT FIX: Use 'preserveNullAndEmptyArrays: true' for optional fields like prescription
    { $unwind: { path: '$prescription', preserveNullAndEmptyArrays: true } }, 
  );

  // --- Step 2: Build the combined $match query using $and ---
  const andConditions: any[] = [];
  const orSearchConditions: any[] = []; // Collects all search/name-based $or conditions
  
  // 1. Apply organization filtering (Must be an $AND condition) - Skip for SUPERADMIN
  if (user.role !== "SUPERADMIN") {
    andConditions.push({ organization: user.organization });
  }
  
  // 2. Apply role-based filtering (Must be an $AND condition) - Skip for SUPERADMIN
  if (user.role === "DOCTOR") {
    // This filter is required AND must be met (doctor OR creator)
    andConditions.push({
      $or: [
        { doctor: user._id },     
        { createdBy: user._id },
      ],
    });
  }

  // 3. Apply explicit status filter (Must be an $AND condition)
  if (status) {
    andConditions.push({ status: status });
  }

  // 4. Collect all name and general search filters into a single $OR group

  // Patient Name Search
  if (patientName) {
    orSearchConditions.push(
      { 'patient.firstName': { $regex: patientName, $options: 'i' } },
      { 'patient.lastName': { $regex: patientName, $options: 'i' } },
    );
  }
  
  // Doctor Name Search
  if (doctorName) {
    orSearchConditions.push(
      { 'doctorDetails.firstName': { $regex: doctorName, $options: 'i' } },
      { 'doctorDetails.lastName': { $regex: doctorName, $options: 'i' } },
    );
  }
  
  // General Search term
  if (search) {
    // If a general search is present, it is often intended to replace/override explicit name filters.
    // However, if all are passed, they are combined here with OR logic.
    orSearchConditions.push(
      { 'patient.firstName': { $regex: search, $options: 'i' } },
      { 'patient.lastName': { $regex: search, $options: 'i' } },
      { 'doctorDetails.firstName': { $regex: search, $options: 'i' } },
      { 'doctorDetails.lastName': { $regex: search, $options: 'i' } },
      { 'status': { $regex: search, $options: 'i' } },
    );
  }
  
  // 5. Add the collected $OR search group to the main $AND conditions
  if (orSearchConditions.length > 0) {
    andConditions.push({ $or: orSearchConditions });
  }
  
  // 6. Finalize the $match stage
  if (andConditions.length > 0) {
    // If we have any conditions, push a single $match with an $and operator
    pipeline.push({ $match: { $and: andConditions } });
  }

  // --- Step 3: Use $facet for pagination and total count in one query ---
  pipeline.push({
    $facet: {
      metadata: [{ $count: 'total' }],
      data: [
        { $sort: sortQuery },
        { $skip: offset },
        { $limit: limit },
      ],
    },
  });

  const result = await Appointment.aggregate(pipeline);

  const data = result[0]?.data || [];
  const total = result[0]?.metadata[0]?.total || 0;

  return {
    data: JSON.parse(JSON.stringify(data)),
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
  };
}


/**
 * Fetches the complete details for a single appointment by its ID.
 * It populates the patient, doctor, and prescription information, making it
 * ready to be displayed on the appointment details page.
 */
export async function getAppointmentDetails(appointmentId: string) {
  try {
    await connectDB();
    const user = await getMongoUser();
    if (!user) throw new Error("User not authenticated");
    
    const query: any = { _id: appointmentId };
    
    // Only apply organization filter if user is not SUPERADMIN
    if (user.role !== "SUPERADMIN") {
      query.organization = user.organization;
    }
    
    const appointment = await Appointment.findOne(query)
      // Populate the patient's full details from the 'patients' collection
      .populate({
        path: 'patient',
        model: Patient
      })
      // Populate the doctor's details, but only select the necessary fields
      .populate({
        path: 'doctor',
        model: User,
        select: 'firstName lastName specialty'
      })
      // If a prescription exists, populate its details as well
      .populate({
        path: 'prescription',
        model: Prescription
      })
      .lean(); // .lean() for a faster, plain JavaScript object

    if (!appointment) {
      return null; // Return null if the appointment is not found
    }

    // Convert the Mongoose document to a plain object that can be passed to client components
    return JSON.parse(JSON.stringify(appointment));
  } catch (error) {
    console.error("Error fetching appointment details:", error);
    // In case of an invalid ID or other database error, return null
    return null;
  }
}

/**
 * Creates a new prescription and updates the corresponding appointment's status.
 */
export async function createPrescription(data: any) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const doctor = await getMongoUser();
    if (!doctor) throw new Error("Doctor not authenticated");

    const {
      appointmentId,
      patientId,
      chiefComplaint,
      diagnosis,
      medicines,
      tests,
      notes,
      treatments,
      doctorFee,
      discount,
    } = data;

    // Calculate total amount
    const treatmentsTotal = treatments?.reduce((sum: number, t: any) => sum + (t.price || 0), 0) || 0;
    const testsTotal = tests?.reduce((sum: number, t: any) => sum + (t.price || 0), 0) || 0;
    const fee = doctorFee || 0;
    const discountAmount = discount || 0;
    const totalAmount = treatmentsTotal + testsTotal + fee - discountAmount;

    // 1. Create the new prescription document
    const newPrescription = new Prescription({
      appointment: appointmentId,
      patient: patientId,
      doctor: doctor._id,
      organization: doctor.organization,
      chiefComplaint,
      diagnosis,
      medicines: medicines?.map((m: any) => ({
        name: m.name,
        dosage: m.dosage,
        timings: m.timings,
      })) || [],
      tests: tests?.map((t: any) => ({
        name: t.name,
        notes: t.notes,
        reportImageUrl: t.reportImageUrl,
        price: t.price || 0,
      })) || [],
      notes,
    });
    await newPrescription.save({ session });

    // 2. Update the appointment to "completed" and link the prescription with pricing info
    await Appointment.findByIdAndUpdate(
      appointmentId,
      {
        status: 'completed',
        prescription: newPrescription._id,
        treatments: treatments?.map((t: any) => ({
          treatment: t.treatmentId,
          name: t.name,
          price: t.price,
        })),
        doctorFee: fee,
        discount: discountAmount,
        totalAmount: Math.max(0, totalAmount), // Ensure total is not negative
      },
      { session }
    );

    await session.commitTransaction();
    revalidatePath(`/dashboard/appointments/${appointmentId}`);
    revalidatePath('/dashboard/overview');
    return { success: true };
  } catch (error) {
    await session.abortTransaction();
    console.error("Error creating prescription:", error);
    return { success: false, error: "Failed to save prescription." };
  } finally {
    session.endSession();
  }
}

/**
 * Fetches all appointments scheduled for today for the logged-in doctor.
 */
export async function getTodaysAppointmentsForDoctor() {
  try {
    const doctor = await getMongoUser();
    if (!doctor) throw new Error("Not authenticated");

    await connectDB();
    const todayStart = startOfDay(new Date());
    const todayEnd = endOfDay(new Date());

    const query: any = {
      startTime: { $gte: todayStart, $lt: todayEnd },
      status: 'scheduled', // Only show upcoming appointments
    };
    
    // Only apply doctor and organization filters if user is not SUPERADMIN
    if (doctor.role !== "SUPERADMIN") {
      query.doctor = doctor._id;
      query.organization = doctor.organization;
    }
    
    const appointments = await Appointment.find(query)
      .populate({ path: 'patient', model: Patient, select: 'firstName lastName' })
      .sort({ startTime: 'asc' })
      .lean();

    return JSON.parse(JSON.stringify(appointments));
  } catch (error) {
    console.error("Error fetching today&apos;s appointments for doctor:", error);
    return [];
  }
}

