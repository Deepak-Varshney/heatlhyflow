// // app/doctor/layout.tsx

// import Link from "next/link";
// // You would have your real Header/Sidebar components here
// // import Header from "@/components/layout/header";
// // import DoctorSidebar from "@/components/layout/doctor-sidebar";

// export default function DoctorLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <div className="flex h-screen">
//       <aside className="w-64 bg-gray-100 p-4 border-r">
//         <h2 className="text-xl font-bold mb-4">Doctor Panel</h2>
//         <nav>
//           <ul className="space-y-2">
//             <li><Link href="/doctor/dashboard">Dashboard</Link></li>
//             <li><Link href="/doctor/patients">Patients</Link></li>
//             <li><Link href="/doctor/appointments">Appointments</Link></li>
//             <li><Link href="/doctor/profile">My Profile</Link></li>
//           </ul>
//         </nav>
//       </aside>
//       <div className="flex-1 flex flex-col">
//         <header className="p-4 border-b">{/* <Header /> */}</header>
//         <main className="flex-1 p-8 bg-gray-50">{children}</main>
//       </div>
//     </div>
//   );
// }

import KBar from '@/components/kbar';
import AppSidebar from '@/components/layout/app-sidebar';
import Header from '@/components/layout/header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';

import DashboardSidebar from "@/components/layout/dashboard-sidebar";

export const metadata: Metadata = {
  title: 'Healthyflow',
  description: 'Management Solution For Healthcare Departments'
};

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
// Persisting the sidebar state in the cookie.
const cookieStore = await cookies();
const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"
  return (
    <KBar>
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar />
        <SidebarInset>
          <Header />
          {/* page main content */}
          {children}
          {/* page main content ends */}
        </SidebarInset>
      </SidebarProvider>
    </KBar>
  );
}
