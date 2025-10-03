"use server";

import { revalidatePath } from "next/cache";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Appointment from "@/models/Appointment";
import Patient from "@/models/Patient";
import User from "@/models/User"; // Doctor model ki jagah User model ka istemaal karein
import { parseSortParameter } from "@/lib/utils"; // We'll create this helper

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

  // Step 1: Join (lookup) with patients and users (doctors) collections
  pipeline.push(
    { $lookup: { from: 'patients', localField: 'patient', foreignField: '_id', as: 'patientDetails' } },
    { $lookup: { from: 'users', localField: 'doctor', foreignField: '_id', as: 'doctorDetails' } },
    { $unwind: '$patientDetails' },
    { $unwind: '$doctorDetails' }
  );

  // Step 2: Build the match query
  const matchQuery: any = {};
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
  if(Object.keys(matchQuery).length > 0) {
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

