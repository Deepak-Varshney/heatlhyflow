import KBar from '@/components/kbar';
import AppSidebar from '@/components/layout/app-sidebar';
import Header from '@/components/layout/header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';

import DashboardSidebar from "@/components/layout/dashboard-sidebar";
import { doctorNavItems } from '@/constants/data';
import RandomGlowMoving from '@/components/effects/random-glow';

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
