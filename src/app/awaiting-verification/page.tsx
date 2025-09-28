import Header from "@/components/layout/header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getMongoUser } from "@/lib/CheckUser";
import { AlertCircle } from "lucide-react";

// const AwaitingVerificationPage = async () => {
//   // We can still get the user's data to display it, but we won't redirect.
//   // The middleware has already guaranteed that only PENDING users can see this page.
// const mongoUser = await getMongoUser();

//   return (
// <div className="flex items-center justify-center min-h-screen">
//   <Header />
//   <Card className="w-full max-w-md">
//     <CardHeader className="text-center">
//       <AlertCircle className="mx-auto h-12 w-12 text-yellow-500" />
//       <CardTitle className="mt-4">Verification Pending</CardTitle>
//     </CardHeader>
//     <CardContent className="text-center">
//       <p className="text-muted-foreground mb-2">
//         Hello, {mongoUser?.firstName}!
//       </p>
//       <p className="text-muted-foreground">
//         Your profile has been submitted and is currently under review.
//       </p>
//       <div className="mt-6">
//         <p>Your current status is:</p>
//         <Badge variant="destructive" className="mt-2 text-lg">
//           PENDING
//         </Badge>
//       </div>
//     </CardContent>
//   </Card>
// </div>
//   );
// };

// export default AwaitingVerificationPage;

import KBar from '@/components/kbar';
import AppSidebar from '@/components/layout/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';

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
  const mongoUser = await getMongoUser();

  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"
  return (
    <KBar>
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar />
        <SidebarInset>
          {/* page main content */}
          <Header />
          <div className="flex items-center justify-center min-h-screen">
            <Card className="w-full max-w-md">
              <CardHeader className="text-center">
                <AlertCircle className="mx-auto h-12 w-12 text-yellow-500" />
                <CardTitle className="mt-4">Verification Pending</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-2">
                  Hello, {mongoUser?.firstName}!
                </p>
                <p className="text-muted-foreground">
                  Your profile has been submitted and is currently under review.
                </p>
                <div className="mt-6">
                  <p>Your current status is:</p>
                  <Badge variant="destructive" className="mt-2 text-lg">
                    PENDING
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
          {/* page main content ends */}
        </SidebarInset>
      </SidebarProvider>
    </KBar>
  );
}
