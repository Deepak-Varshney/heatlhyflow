import KBar from '@/components/kbar';
import AppSidebar from '@/components/layout/app-sidebar';
import Header from '@/components/layout/header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';

import { getNavItemsForRole } from '@/constants/data';
import { getMongoUser } from '@/lib/CheckUser';

export const metadata: Metadata = {
  title: 'Healthyflow',
  description: 'Management Solution For Healthcare Departments'
};


export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getMongoUser();
  const navItems = getNavItemsForRole(user?.role);

  // Persisting the sidebar state in the cookie.
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"
  return (
    <div className="flex h-screen">
      {/* <DashboardSidebar /> */}
      <div className="flex-1 flex flex-col">
        <KBar>
          <SidebarProvider defaultOpen={defaultOpen}>

            <AppSidebar navItems={navItems} />
            <SidebarInset>

              <Header />
              <main className="flex-1">{children}</main>
            </SidebarInset>
          </SidebarProvider>
        </KBar>
      </div>
    </div>
  );
}