"use server";

import connectDB from "@/lib/mongodb";
import { getMongoUser } from "@/lib/CheckUser";
import Appointment from "@/models/Appointment";
import Patient from "@/models/Patient";
import { endOfDay, startOfDay, parseISO } from "date-fns";

type DashboardOverviewParams = {
  dateFrom?: string;
  dateTo?: string;
};

export async function getDashboardOverview(params: DashboardOverviewParams = {}) {
  await connectDB();
  const user = await getMongoUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

  const organizationFilter = user.role === "SUPERADMIN" ? {} : { organization: user.organization };
  const doctorFilter = user.role === "DOCTOR" ? { doctor: user._id } : {};

  const now = new Date();
  const rangeStart = params.dateFrom ? startOfDay(parseISO(params.dateFrom)) : startOfDay(now);
  const rangeEnd = params.dateTo ? endOfDay(parseISO(params.dateTo)) : endOfDay(now);
  const appointmentRangeFilter = {
    startTime: { $gte: rangeStart, $lte: rangeEnd },
  };
  const patientRangeFilter = {
    createdAt: { $gte: rangeStart, $lte: rangeEnd },
  };

  const [totalPatients, appointmentsInRange, upcomingAppointments, recentAppointments, recentPatients, newPatientsCount] = await Promise.all([
    Patient.countDocuments(organizationFilter),
    Appointment.countDocuments({
      ...organizationFilter,
      ...doctorFilter,
      ...appointmentRangeFilter,
      status: { $in: ["scheduled", "completed"] },
    }),
    rangeEnd < now
      ? []
      : Appointment.find({
          ...organizationFilter,
          ...doctorFilter,
          startTime: { $gte: now, $lte: rangeEnd },
          status: "scheduled",
        })
          .sort({ startTime: 1 })
          .limit(5)
          .populate({ path: "patient", select: "firstName lastName" })
          .populate({ path: "doctor", select: "firstName lastName" })
          .lean(),
    Appointment.find({
      ...organizationFilter,
      ...doctorFilter,
      ...appointmentRangeFilter,
    })
      .sort({ startTime: -1 })
      .limit(10)
      .populate({ path: "patient", select: "firstName lastName" })
      .populate({ path: "doctor", select: "firstName lastName" })
      .lean(),
    Appointment.aggregate([
      {
        $match: {
          ...organizationFilter,
          ...doctorFilter,
          ...appointmentRangeFilter,
        },
      },
      {
        $group: {
          _id: "$patient",
        },
      },
      {
        $lookup: {
          from: "patients",
          localField: "_id",
          foreignField: "_id",
          as: "patientDetails",
        },
      },
      {
        $unwind: "$patientDetails",
      },
      {
        $replaceRoot: { newRoot: "$patientDetails" },
      },
      {
        $limit: 10,
      },
    ]),
    Patient.countDocuments({
      ...organizationFilter,
      ...patientRangeFilter,
    }),
  ]);

  const collectionResult = await Appointment.aggregate([
    {
      $match: {
        ...organizationFilter,
        ...doctorFilter,
        ...appointmentRangeFilter,
        status: "completed",
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: { $ifNull: ["$totalAmount", 0] } },
      },
    },
  ]);

  const collectionTotal = collectionResult[0]?.total || 0;

  return {
    role: user.role,
    firstName: user.firstName,
    lastName: user.lastName,
    totalPatients,
    appointmentsInRange,
    newPatientsCount,
    collectionTotal,
    rangeStart: rangeStart.toISOString(),
    rangeEnd: rangeEnd.toISOString(),
    upcomingAppointments: JSON.parse(JSON.stringify(upcomingAppointments)),
    recentAppointments: JSON.parse(JSON.stringify(recentAppointments)),
    recentPatients: JSON.parse(JSON.stringify(recentPatients)),
  };
}
