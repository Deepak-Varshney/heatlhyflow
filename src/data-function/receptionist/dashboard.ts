import { getMongoUser } from "@/lib/CheckUser";
import connectDB from "@/lib/mongodb";
import Appointment from "@/models/Appointment";
import Patient from "@/models/Patient";

export async function getDashboardData() {
    await connectDB();
    const currentUser = await getMongoUser(); // Fetch current user
    // Initialize totalPatients query
    let totalPatientsQuery = {};

    if (currentUser.role === "DOCTOR") {
        // If role is DOCTOR, filter patients who have appointments with the doctor
        const doctorAppointments = await Appointment.find({ doctor: currentUser._id });
        const patientIds = doctorAppointments.map((appointment) => appointment.patient);

        // Modify query to only count patients who have appointments with this doctor
        totalPatientsQuery = { _id: { $in: patientIds } };
    }

    // Fetch total number of patients based on the query
    const totalPatients = await Patient.find(totalPatientsQuery).countDocuments();

    const totalAppointments = await Appointment.countDocuments();

    // Get the current date and time
    const currentDate = new Date();

    // Get the date for 7 days from now
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(currentDate.getDate() + 7);

    // Set up the base query
    let query: any = {
        startTime: {
            $gte: currentDate, // startTime should be greater than or equal to current date
            $lte: sevenDaysFromNow, // startTime should be less than or equal to 7 days from now
        },
        status: "scheduled", // Only show scheduled appointments
    };

    // Check role and modify the query accordingly
    if (currentUser.role === "DOCTOR") {
        // If role is DOCTOR, filter by createdBy and doctor
        query.createdBy = currentUser._id;
        query.doctor = currentUser._id;
    }

    // Query for upcoming appointments based on role
    const upcomingAppointments = await Appointment.find(query).countDocuments();
    let todayquery: any = {
        startTime: {
            $gte: currentDate, // startTime should be greater than or equal to current date
        },
        status: "scheduled", // Only show scheduled appointments
    };
    if (currentUser.role === "DOCTOR") {
        // If role is DOCTOR, filter by createdBy and doctor
        todayquery.createdBy = currentUser._id;
        todayquery.doctor = currentUser._id;
    }
    const todaysAppointments = await Appointment.find({
        todayquery
    }).countDocuments();

    return {
        totalPatients,
        todaysAppointments,
        totalAppointments,
        upcomingAppointments, // return the upcoming appointments count
    };
}
