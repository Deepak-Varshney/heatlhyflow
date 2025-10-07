// // // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// // // import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// // // import { Button } from "@/components/ui/button";
// // // import { Calendar, Users, Activity, MessageSquare } from "lucide-react";
// // // import Link from "next/link";
// // // import { IPatient } from '@/models/Patient';
// // // import { IUser } from '@/models/User';
// // // import { getAllDoctors } from '@/utilties/doctors';
// // // import { getAllPatients } from '@/utilties/patients';
// // // import { getMongoUser } from "@/lib/CheckUser";
// // // import AppointmentBooking from '@/components/appointment-form';
// // // import { getDashboardData } from "@/data-function/receptionist/dashboard";

import RandomGlow from "@/components/effects/glow";

// // // const ReceptionistDashboard = async () => {
// // //   const user = await getMongoUser();
// // //   const stats = await getDashboardData();
// // //   const patients: IPatient[] = await getAllPatients()
// // //   const doctors: IUser[] = await getAllDoctors()
// // //   return (
// // //     <div className="space-y-8 m-4 bg-red-500 h-full">
// // //       {/* Welcome Header */}
// // //       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
// // //         <div className="flex items-center gap-4">
// // //           <Avatar className="h-16 w-16">
// // //             <AvatarImage src={user?.imageUrl} alt={`${user?.firstName} ${user?.lastName}`} />
// // //             <AvatarFallback>{user?.firstName?.[0]}{user?.lastName?.[0]}</AvatarFallback>
// // //           </Avatar>
// // //           <div>
// // //             <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.firstName}!</h1>
// // //             <p className="text-muted-foreground">Here is a summary of your clinic activity today.</p>
// // //           </div>
// // //         </div>
// // //         <AppointmentBooking
// // //           patients={patients}
// // //           doctors={doctors}
// // //         />

// // //       </div>

// // //       {/* Stats Cards */}
// // //       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
// // //         <Link href="/receptionist/appointments">
// // //           <Card>
// // //             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
// // //               <CardTitle className="text-sm font-medium">{`Today's Appointments`}</CardTitle>
// // //               <Calendar className="h-4 w-4 text-muted-foreground" />
// // //             </CardHeader>
// // //             <CardContent>
// // //               <div className="text-2xl font-bold">{stats.todaysAppointments}</div>
// // //               <p className="text-xs text-muted-foreground">Total {stats.upcomingAppointments} In the next 7 days</p>
// // //             </CardContent>
// // //           </Card>
// // //         </Link>
// // //         <Link href="/receptionist/patients">

// // //           <Card>
// // //             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
// // //               <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
// // //               <Users className="h-4 w-4 text-muted-foreground" />
// // //             </CardHeader>
// // //             <CardContent>
// // //               <div className="text-2xl font-bold">{stats.totalPatients}</div>
// // //               <p className="text-xs text-muted-foreground">Under your care</p>
// // //             </CardContent>
// // //           </Card>
// // //         </Link>

// // //         <Card>
// // //           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
// // //             <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
// // //             <MessageSquare className="h-4 w-4 text-muted-foreground" />
// // //           </CardHeader>
// // //           <CardContent>
// // //             <div className="text-2xl font-bold">{stats.totalAppointments}</div>
// // //             <p className="text-xs text-muted-foreground">In your Clinic</p>
// // //           </CardContent>
// // //         </Card>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default ReceptionistDashboard;

// // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// // import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// // import { Calendar, Users, MessageSquare } from "lucide-react";
// // import Link from "next/link";
// // import { IPatient } from '@/models/Patient';
// // import { IUser } from '@/models/User';
// // import { getAllDoctors } from '@/utilties/doctors';
// // import { getAllPatients } from '@/utilties/patients';
// // import { getMongoUser } from "@/lib/CheckUser";
// // import AppointmentBooking from '@/components/appointment-form';
// // import { getDashboardData } from "@/data-function/receptionist/dashboard";

// // const ReceptionistDashboard = async () => {
// //   const user = await getMongoUser();
// //   const stats = await getDashboardData();
// //   const patients: IPatient[] = await getAllPatients();
// //   const doctors: IUser[] = await getAllDoctors();

// //   return (
// //     <div className="relative h-full w-full overflow-hidden">
// //       {/* 🌈 Background Gradient Layer */}
// //       <div
// //         className="absolute inset-0 z-0 bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-indigo-500/20 dark:from-pink-900/10 dark:via-purple-900/10 dark:to-indigo-900/10"
// //         style={{
// //           backgroundImage: `radial-gradient(at top center, rgba(255, 0, 128, 0.15), transparent 70%)`,
// //         }}
// //       />

// //       {/* 🌈 Glow Animation */}
// //       <div className="absolute top-[-100px] left-1/2 transform -translate-x-1/2 w-[400px] h-[400px] bg-pink-500/30 rounded-full blur-[120px] animate-pulse-slow z-0" />

// //       {/* Main Content */}
// //       <div className="relative z-10 space-y-8 m-4">
// //         {/* Welcome Header */}
// //         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
// //           <div className="flex items-center gap-4">
// //             <Avatar className="h-16 w-16">
// //               <AvatarImage src={user?.imageUrl} alt={`${user?.firstName} ${user?.lastName}`} />
// //               <AvatarFallback>{user?.firstName?.[0]}{user?.lastName?.[0]}</AvatarFallback>
// //             </Avatar>
// //             <div>
// //               <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.firstName}!</h1>
// //               <p className="text-muted-foreground">Here is a summary of your clinic activity today.</p>
// //             </div>
// //           </div>
// //           <AppointmentBooking patients={patients} doctors={doctors} />
// //         </div>

// //         {/* Stats Cards */}
// //         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
// //           <Link href="/receptionist/appointments">
// //             <Card className="relative bg-white/20 dark:bg-white/5 border border-white/30 dark:border-white/10 backdrop-blur-md shadow-md hover:shadow-lg transition-shadow">
// //               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
// //                 <CardTitle className="text-sm font-medium">{`Today&apos;s Appointments`}</CardTitle>
// //                 <Calendar className="h-4 w-4 text-muted-foreground" />
// //               </CardHeader>
// //               <CardContent>
// //                 <div className="text-2xl font-bold">{stats.todaysAppointments}</div>
// //                 <p className="text-xs text-muted-foreground">Total {stats.upcomingAppointments} In the next 7 days</p>
// //               </CardContent>
// //             </Card>
// //           </Link>

// //           <Link href="/receptionist/patients">
// //             <Card className="relative bg-white/20 dark:bg-white/5 border border-white/30 dark:border-white/10 backdrop-blur-md shadow-md hover:shadow-lg transition-shadow">
// //               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
// //                 <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
// //                 <Users className="h-4 w-4 text-muted-foreground" />
// //               </CardHeader>
// //               <CardContent>
// //                 <div className="text-2xl font-bold">{stats.totalPatients}</div>
// //                 <p className="text-xs text-muted-foreground">Under your care</p>
// //               </CardContent>
// //             </Card>
// //           </Link>

// //           <Card className="relative bg-white/20 dark:bg-white/5 border border-white/30 dark:border-white/10 backdrop-blur-md shadow-md hover:shadow-lg transition-shadow">
// //             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
// //               <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
// //               <MessageSquare className="h-4 w-4 text-muted-foreground" />
// //             </CardHeader>
// //             <CardContent>
// //               <div className="text-2xl font-bold">{stats.totalAppointments}</div>
// //               <p className="text-xs text-muted-foreground">In your Clinic</p>
// //             </CardContent>
// //           </Card>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default ReceptionistDashboard;


// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Calendar, Users, MessageSquare } from "lucide-react";
// import Link from "next/link";
// import { IPatient } from '@/models/Patient';
// import { IUser } from '@/models/User';
// import { getAllDoctors } from '@/utilties/doctors';
// import { getAllPatients } from '@/utilties/patients';
// import { getMongoUser } from "@/lib/CheckUser";
// import AppointmentBooking from '@/components/appointment-form';
// import { getDashboardData } from "@/data-function/receptionist/dashboard";

// const ReceptionistDashboard = async () => {
//   const user = await getMongoUser();
//   const stats = await getDashboardData();
//   const patients: IPatient[] = await getAllPatients();
//   const doctors: IUser[] = await getAllDoctors();

//   return (
//     <div className="relative h-full w-full overflow-hidden">
//       <RandomGlow />
//       {/* Main Content */}
//       <div className="relative z-10 space-y-8 m-4">
//         {/* Welcome Header */}
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//           <div className="flex items-center gap-4">
//             <Avatar className="h-16 w-16">
//               <AvatarImage src={user?.imageUrl} alt={`${user?.firstName} ${user?.lastName}`} />
//               <AvatarFallback>{user?.firstName?.[0]}{user?.lastName?.[0]}</AvatarFallback>
//             </Avatar>
//             <div>
//               <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.firstName}!</h1>
//               <p className="text-muted-foreground">Here is a summary of your clinic activity today.</p>
//             </div>
//           </div>
//           <AppointmentBooking patients={patients} doctors={doctors} />
//         </div>

//         {/* Stats Cards */}
//         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//           <Link href="/receptionist/appointments">
//             <Card className="relative bg-white/20 dark:bg-white/5 border border-white/30 dark:border-white/10 backdrop-blur-md shadow-md hover:shadow-lg transition-shadow">
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-medium">{`Today&apos;s Appointments`}</CardTitle>
//                 <Calendar className="h-4 w-4 text-muted-foreground" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">{stats.todaysAppointments}</div>
//                 <p className="text-xs text-muted-foreground">Total {stats.upcomingAppointments} In the next 7 days</p>
//               </CardContent>
//             </Card>
//           </Link>

//           <Link href="/receptionist/patients">
//             <Card className="relative bg-white/20 dark:bg-white/5 border border-white/30 dark:border-white/10 backdrop-blur-md shadow-md hover:shadow-lg transition-shadow">
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
//                 <Users className="h-4 w-4 text-muted-foreground" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">{stats.totalPatients}</div>
//                 <p className="text-xs text-muted-foreground">Under your care</p>
//               </CardContent>
//             </Card>
//           </Link>

//           <Card className="relative bg-white/20 dark:bg-white/5 border border-white/30 dark:border-white/10 backdrop-blur-md shadow-md hover:shadow-lg transition-shadow">
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
//               <MessageSquare className="h-4 w-4 text-muted-foreground" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">{stats.totalAppointments}</div>
//               <p className="text-xs text-muted-foreground">In your Clinic</p>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ReceptionistDashboard;



import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Users, MessageSquare } from "lucide-react";
import Link from "next/link";
import { IPatient } from '@/models/Patient';
import { IUser } from '@/models/User';
import { getAllDoctors } from '@/utilties/doctors';
import { getAllPatients } from '@/utilties/patients';
import { getMongoUser } from "@/lib/CheckUser";
import AppointmentBooking from '@/components/appointment-form';
import { getDashboardData } from "@/data-function/receptionist/dashboard";
import AnimatedGradient from "@/components/effects/animated-gradient";
import ParallaxBackground from "@/components/effects/parallax-background";
import ParticleBackground from "@/components/effects/particle-background";
import MorphingBlob from "@/components/effects/morphing-blob";
import RandomGlowMoving from "@/components/effects/random-glow";
import CursorTrail from "@/components/effects/cursor-trail";

// Import all visual effects components here


const ReceptionistDashboard = async () => {
  const user = await getMongoUser();
  const stats = await getDashboardData();
  const patients: IPatient[] = await getAllPatients();
  const doctors: IUser[] = await getAllDoctors();

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Layered visual backgrounds */}
      {/* <AnimatedGradient /> */}
      {/* <ParallaxBackground /> */}
      <ParticleBackground />
      {/* <MorphingBlob /> */}
      <RandomGlowMoving speed={20} size={400} />
      <CursorTrail />

      {/* Main Content (on top) */}
      <div className="relative z-10 space-y-8 m-4">
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
          <AppointmentBooking patients={patients} doctors={doctors} />
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Link href="/receptionist/appointments">
            <Card className="relative bg-white/20 dark:bg-white/5 border border-white/30 dark:border-white/10 backdrop-blur-md shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{`Today&apos;s Appointments`}</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.todaysAppointments}</div>
                <p className="text-xs text-muted-foreground">Total {stats.upcomingAppointments} In the next 7 days</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/receptionist/patients">
            <Card className="relative bg-white/20 dark:bg-white/5 border border-white/30 dark:border-white/10 backdrop-blur-md shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalPatients}</div>
                <p className="text-xs text-muted-foreground">Under your care</p>
              </CardContent>
            </Card>
          </Link>

          <Card className="relative bg-white/20 dark:bg-white/5 border border-white/30 dark:border-white/10 backdrop-blur-md shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAppointments}</div>
              <p className="text-xs text-muted-foreground">In your Clinic</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ReceptionistDashboard;
