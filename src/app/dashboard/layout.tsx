import KBar from '@/components/kbar';
import AppSidebar from '@/components/layout/app-sidebar';
import Header from '@/components/layout/header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';

import DashboardSidebar from "@/components/layout/dashboard-sidebar";

// export const metadata: Metadata = {
//   title: 'Healthyflow',
//   description: 'Management Solution For Healthcare Departments'
// };

// export default async function DashboardLayout({
//   children
// }: {
//   children: React.ReactNode;
// }) {
// // Persisting the sidebar state in the cookie.
// const cookieStore = await cookies();
// const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"
//   return (
//     <KBar>
//       <SidebarProvider defaultOpen={defaultOpen}>
//         <AppSidebar />
//         <SidebarInset>
//           <Header />
//           {/* page main content */}
//           {children}
//           {/* page main content ends */}
//         </SidebarInset>
//       </SidebarProvider>
//     </KBar>
//   );
// }


// app/dashboard/layout.tsx


export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  // Persisting the sidebar state in the cookie.
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"
  return (
    <div className="flex h-screen">
      {/* <DashboardSidebar /> */}
      <div className="flex-1 flex flex-col">
        <KBar>
          <SidebarProvider defaultOpen={defaultOpen}>

            <AppSidebar />
            <SidebarInset>

              <Header />
              <main className="flex-1 p-8 bg-gray-50">{children}</main>
            </SidebarInset>
          </SidebarProvider>
        </KBar>
      </div>
    </div>
  );
}