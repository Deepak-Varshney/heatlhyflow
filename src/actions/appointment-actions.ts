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
    revalidatePath("/appointments");
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
  // Step 1: Join (lookup) with patients and users (doctors) collections
  pipeline.push(
    { $lookup: { from: 'patients', localField: 'patient', foreignField: '_id', as: 'patientDetails' } },
    { $lookup: { from: 'users', localField: 'doctor', foreignField: '_id', as: 'doctorDetails' } },
    { $unwind: '$patientDetails' },
    { $unwind: '$doctorDetails' }
  );

  // Step 2: Build the match query
  const matchQuery: any = {};
  // Apply role-based filtering for the logged-in user
  if (user.role === "DOCTOR") {
    //  Only fetch appointments where the doctor is the logged-in user
    matchQuery.$or = [
      { doctor: user._id },       // Appointments where the logged-in user is the doctor
      { createdBy: user._id },    // Appointments created by the logged-in user (receptionist)
    ];
  }

  if (status) matchQuery.status = status;
  if (patientName) {
    matchQuery['$or'] = [
      { 'patientDetails.firstName': { $regex: patientName, $options: 'i' } },
      { 'patientDetails.lastName': { $regex: patientName, $options: 'i' } },
    ]
  }
  if (doctorName) {
    matchQuery['$or'] = [
      { 'doctorDetails.firstName': { $regex: doctorName, $options: 'i' } },
      { 'doctorDetails.lastName': { $regex: doctorName, $options: 'i' } },
    ]
  }
  if (search) {
    matchQuery['$or'] = [
      { 'patientDetails.firstName': { $regex: search, $options: 'i' } },
      { 'patientDetails.lastName': { $regex: search, $options: 'i' } },
      { 'doctorDetails.firstName': { $regex: search, $options: 'i' } },
      { 'doctorDetails.lastName': { $regex: search, $options: 'i' } },
      { 'status': { $regex: search, $options: 'i' } },
    ]
  }
  if (Object.keys(matchQuery).length > 0) {
    pipeline.push({ $match: matchQuery });
  }

  // Step 3: Use $facet for pagination and total count in one query
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

  const data = result[0].data;
  const total = result[0].metadata[0]?.total || 0;

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
    const appointment = await Appointment.findById(appointmentId)
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

    const { appointmentId, patientId, chiefComplaint, medicines, tests, notes } = data;

    // 1. Create the new prescription document
    const newPrescription = new Prescription({
      appointment: appointmentId,
      patient: patientId,
      doctor: doctor._id,
      chiefComplaint,
      medicines: medicines?.map((m: any) => ({
        name: m.name,
        dosage: m.dosage,
        timings: m.timings,
      })) || [],
      tests: tests?.map((t: any) => t.name) || [],
      notes,
    });
    await newPrescription.save({ session });

    // 2. Update the appointment to "Completed" and link the prescription
    await Appointment.findByIdAndUpdate(appointmentId, {
      status: 'Completed',
      prescription: newPrescription._id,
    }, { session });

    await session.commitTransaction();
    revalidatePath(`/doctor/appointments/${appointmentId}`);
    revalidatePath('/doctor/dashboard');
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

    const appointments = await Appointment.find({
      doctor: doctor._id,
      startTime: { $gte: todayStart, $lt: todayEnd },
      status: 'scheduled', // Only show upcoming appointments
    })
      .populate({ path: 'patient', model: Patient, select: 'firstName lastName' })
      .sort({ startTime: 'asc' })
      .lean();

    return JSON.parse(JSON.stringify(appointments));
  } catch (error) {
    console.error("Error fetching today's appointments for doctor:", error);
    return [];
  }
}

