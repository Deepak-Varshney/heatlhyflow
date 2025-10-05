// // app/page.tsx
// import { auth } from "@clerk/nextjs/server";
// import { redirect } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import Link from "next/link";

// export default async function LandingPage() {
//   const { userId, sessionClaims } = await auth();

//   if (userId) {
//     const role = (sessionClaims as any)?.publicMetadata?.role as string;

//     // Redirect based on role
//     switch (role) {
//       case "DOCTOR":
//         return redirect("/doctor/dashboard");
//       case "RECEPTIONIST":
//         return redirect("/receptionist/dashboard");
//       case "SUPERADMIN":
//         return redirect("/superadmin/dashboard");
//       case "ADMIN":
//         return redirect("/admin/dashboard");
//       default:
//         return redirect("/onboarding"); // If role is missing or UNASSIGNED
//     }
//   }

//   // Not logged in: Show landing page
//   return (
//     <main className="min-h-screen bg-white text-gray-900 flex flex-col items-center justify-center px-6 py-12">
//       <div className="max-w-4xl text-center space-y-8">
//         <h1 className="text-5xl font-bold tracking-tight text-blue-600">
//           HealthyFlow
//         </h1>
//         <h2 className="text-2xl font-semibold text-gray-700">
//           ERP Solution for Healthcare Management
//         </h2>

//         <p className="text-gray-600 text-lg">
//           A streamlined platform for clinics and hospitals to manage patient
//           care, appointments, and OPD records. Tailored for doctors and
//           receptionists with secure role-based access.
//         </p>

//         <div className="grid gap-4 text-left text-gray-700 text-sm md:grid-cols-2 mt-8">
//           <div>
//             <h3 className="text-base font-semibold mb-2">Key Features:</h3>
//             <ul className="list-disc list-inside space-y-1">
//               <li>Patient Registration & Appointment Booking</li>
//               <li>Doctor Dashboard with OPD card finalization</li>
//               <li>PDF generation for OPD cards</li>
//               <li>Role-Based Access Control (RBAC)</li>
//             </ul>
//           </div>
//           <div>
//             <h3 className="text-base font-semibold mb-2">Tech Stack:</h3>
//             <ul className="list-disc list-inside space-y-1">
//               <li>Next.js + Tailwind CSS + ShadCN UI</li>
//               <li>Node.js & MongoDB</li>
//               <li>Clerk Authentication</li>
//               <li>React Context API or Zustand</li>
//             </ul>
//           </div>
//         </div>

//         <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
//           <Link href="/auth/sign-in">
//             <Button size="lg">Get Started</Button>
//           </Link>
//           <a
//             href="https://github.com/Deepak-Varshney"
//             target="_blank"
//             rel="noopener noreferrer"
//             className="text-blue-500 hover:underline"
//           >
//             View on GitHub
//           </a>
//         </div>
//       </div>
//     </main>
//   );
// }


import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function Page() {
  const { userId, sessionClaims } = await auth();
  const role = (sessionClaims as any)?.publicMetadata?.role as string;
  if (!userId) {
    return redirect('/auth/sign-in');
  } else if (role === 'SUPERADMIN') {
    redirect('/superadmin/dashboard');
  } else {
    redirect('/dashboard/overview');
  }
}
