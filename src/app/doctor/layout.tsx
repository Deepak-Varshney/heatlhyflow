// // // // app/doctor/layout.tsx

// // // import Link from "next/link";
// // // // You would have your real Header/Sidebar components here
// // // // import Header from "@/components/layout/header";
// // // // import DoctorSidebar from "@/components/layout/doctor-sidebar";

// // // export default function DoctorLayout({
// // //   children,
// // // }: {
// // //   children: React.ReactNode;
// // // }) {
// // //   return (
// // //     <div className="flex h-screen">
// // //       <aside className="w-64 bg-gray-100 p-4 border-r">
// // //         <h2 className="text-xl font-bold mb-4">Doctor Panel</h2>
// // //         <nav>
// // //           <ul className="space-y-2">
// // //             <li><Link href="/doctor/dashboard">Dashboard</Link></li>
// // //             <li><Link href="/doctor/patients">Patients</Link></li>
// // //             <li><Link href="/doctor/appointments">Appointments</Link></li>
// // //             <li><Link href="/doctor/profile">My Profile</Link></li>
// // //           </ul>
// // //         </nav>
// // //       </aside>
// // //       <div className="flex-1 flex flex-col">
// // //         <header className="p-4 border-b">{/* <Header /> */}</header>
// // //         <main className="flex-1 p-8 bg-gray-50">{children}</main>
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // import KBar from '@/components/kbar';
// // import AppSidebar from '@/components/layout/app-sidebar';
// // import Header from '@/components/layout/header';
// // import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
// // import type { Metadata } from 'next';
// // import { cookies } from 'next/headers';

// // import DashboardSidebar from "@/components/layout/dashboard-sidebar";
// // import { doctorNavItems } from '@/constants/data';

// // export const metadata: Metadata = {
// //   title: 'Healthyflow | Doctor',
// //   description: 'Management Solution For Healthcare Departments'
// // };

// // export default async function DashboardLayout({
// //   children
// // }: {
// //   children: React.ReactNode;
// // }) {
// // // Persisting the sidebar state in the cookie.
// // const cookieStore = await cookies();
// // const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"
// //   return (
// //     <KBar>
// //       <SidebarProvider defaultOpen={defaultOpen}>
// //         <AppSidebar navItems={doctorNavItems}/>
// //         <SidebarInset>
// //           <Header />
// //           {/* page main content */}
// //           {children}
// //           {/* page main content ends */}
// //         </SidebarInset>
// //       </SidebarProvider>
// //     </KBar>
// //   );
// // }


import KBar from '@/components/kbar';
import AppSidebar from '@/components/layout/app-sidebar';
import Header from '@/components/layout/header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';

import DashboardSidebar from "@/components/layout/dashboard-sidebar";
import { doctorNavItems } from '@/constants/data';
import RandomGlowMoving from '@/components/effects/random-glow';
import CursorTrail from '@/components/effects/cursor-trail';


// export const metadata: Metadata = {
//   title: 'Healthyflow | Doctor',
//   description: 'Management Solution For Healthcare Departments'
// };

// export default async function DashboardLayout({
//   children
// }: {
//   children: React.ReactNode;
// }) {
//   // Persisting the sidebar state in the cookie.
//   const cookieStore = await cookies();
//   const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

//   return (
//     <KBar>
//       <SidebarProvider defaultOpen={defaultOpen}>
//         <AppSidebar navItems={doctorNavItems} />

//         {/* Wrap main content & effects */}
//         <SidebarInset className="relative overflow-hidden">
//           <Header />

//           {/* Glow & Cursor Effects - Positioned absolutely to not affect layout */}
//           <RandomGlowMoving speed={20} size={400} />
//           <CursorTrail className="pointer-events-none fixed top-0 left-0 w-full h-full z-10" />

//           {/* Main content container with relative z-index above glow but below cursor */}
//             {children}
//         </SidebarInset>
//       </SidebarProvider>
//     </KBar>
//   );
// }


export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <KBar>
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar navItems={doctorNavItems} />

        <SidebarInset className="relative overflow-hidden">
          <RandomGlowMoving
            speed={20}
            size={400}
          />
          <Header />
          {/* Render children directly without wrapping */}
          {children}
        </SidebarInset>
      </SidebarProvider>
    </KBar>
  );
}
