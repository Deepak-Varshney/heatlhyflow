// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";

// // You would fetch these from your server actions
// import { format } from "date-fns";
// import PatientRegistrationDialog from "@/components/PatientRegistration";
// import { getAllPatients } from "@/utilties/patients";
// import { getAllDoctors } from "@/utilties/doctors";
// import AppointmentBooking from "@/components/appointment-form";

// const ReceptionistDashboard = async () => {
//   // In a real app, you'd fetch this data from your database
//   // const todaysAppointments = await getTodaysAppointments();
//   const patients = await getAllPatients();
//   const doctors = await getAllDoctors();

//   return (
//     <div className="m-4 flex flex-col gap-4">
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight">Receptionist Dashboard</h1>
//           <p className="text-muted-foreground">Manage patients and book appointments.</p>
//         </div>
//         <div className="flex gap-2">
//           <PatientRegistrationDialog />
//           <AppointmentBooking patients={patients} doctors={doctors} />
//         </div>
//       </div>

//       <Card>
//         <CardHeader>
//           <CardTitle>{`Today's Appointments`}</CardTitle>
//           <CardDescription>
//             A list of all appointments scheduled for today.
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Time</TableHead>
//                 <TableHead>Patient</TableHead>
//                 <TableHead>Doctor</TableHead>
//                 <TableHead>Status</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {/* {todaysAppointments.length > 0 ? (
//                 todaysAppointments.map((appt) => (
//                   <TableRow key={appt._id}>
//                     <TableCell className="font-medium">
//                       {format(new Date(appt.startTime), "p")}
//                     </TableCell>
//                     <TableCell>{appt.patient.firstName} {appt.patient.lastName}</TableCell>
//                     <TableCell>Dr. {appt.doctor.lastName}</TableCell>
//                     <TableCell>
//                       <Badge>{appt.status}</Badge>
//                     </TableCell>
//                   </TableRow>
//                 ))
//               ) : (
//                 <TableRow>
//                   <TableCell colSpan={4} className="text-center">
//                     No appointments scheduled for today.
//                   </TableCell>
//                 </TableRow>
//               )} */}
//             </TableBody>
//           </Table>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default ReceptionistDashboard;


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Activity, MessageSquare } from "lucide-react";
import Link from "next/link";
import { IPatient } from '@/models/Patient';
import { IUser } from '@/models/User';
import { getAllAppointments } from '@/utilties/appointments';
import { getAllDoctors } from '@/utilties/doctors';
import { getAllPatients, getPatients } from '@/utilties/patients';
import { getMongoUser } from "@/lib/CheckUser";
import AppointmentBooking from '@/components/appointment-form';

// Ek real app mein, aap is data ko fetch karenge
const getDashboardStats = async () => {
  return {
    upcomingAppointments: 8,
    totalPatients: 124,
    recentActivity: [
      { id: 1, text: "New patient Alice Smith registered." },
      { id: 2, text: "Appointment with John Doe confirmed for tomorrow." },
      { id: 3, text: "Received new message from Bob Johnson." },
    ],
  };
};

const ReceptionistDashboard = async () => {
  const user = await getMongoUser();
  const stats = await getDashboardStats();
  const patients: IPatient[] = await getAllPatients()
  const doctors: IUser[] = await getAllDoctors()
  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user?.imageUrl} alt={`${user?.firstName} ${user?.lastName}`} />
            <AvatarFallback>{user?.firstName?.[0]}{user?.lastName?.[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.firstName}!</h1>
            <p className="text-muted-foreground">Here is a summary of your clinic activity today.</p>
          </div>
        </div>
        <AppointmentBooking
          patients={patients}
          doctors={doctors}
        />

      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingAppointments}</div>
            <p className="text-xs text-muted-foreground">In the next 7 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPatients}</div>
            <p className="text-xs text-muted-foreground">Under your care</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Awaiting your reply</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Prescriptions to review</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Section */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <p className="text-sm text-muted-foreground">
            Latest updates from your clinic.
          </p>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {stats.recentActivity.map((activity) => (
              <li key={activity.id} className="flex items-center gap-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Activity className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm">{activity.text}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReceptionistDashboard;