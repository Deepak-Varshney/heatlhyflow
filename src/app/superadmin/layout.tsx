import KBar from '@/components/kbar';
import AppSidebar from '@/components/layout/app-sidebar';
import Header from '@/components/layout/header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';

import DashboardSidebar from "@/components/layout/dashboard-sidebar";
import { superAdminNavItems } from '@/constants/data';
import RandomGlowMoving from '@/components/effects/random-glow';

export const metadata: Metadata = {
  title: 'Healthyflow | Super Admin',
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
        <AppSidebar navItems={superAdminNavItems} />
        <SidebarInset>
          <RandomGlowMoving speed={40} size={400} />
          <Header />
          {/* page main content */}
          {children}
          {/* page main content ends */}
        </SidebarInset>
      </SidebarProvider>
    </KBar>
  );
}
