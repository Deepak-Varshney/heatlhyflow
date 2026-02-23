import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getAllUsers, getUserStats } from "@/app/actions/superadmin-actions";
import { getMongoUser } from "@/lib/CheckUser";
import { UserStats } from "./components/user-stats";
import { UserFilters } from "./components/user-filters";
import { UserCard } from "./components/user-card";
import { Pagination } from "./components/pagination";

// Server Component for Main Content
async function UsersPageContent({ searchParams }: { searchParams: Promise<any> }) {
  const params = await searchParams;
  
  // Get current user role for DEVIL protection
  const currentUser = await getMongoUser();
  const currentUserRole = currentUser?.role;
  
  const users = await getAllUsers({
    page: parseInt(params.page) || 1,
    limit: parseInt(params.limit) || 10,
    search: params.search,
    role: params.role,
    verificationStatus: params.verificationStatus,
  });

  const stats = await getUserStats();

  return (
    <div className="space-y-6">
      {/* Statistics Overview */}
      <UserStats stats={stats} />

      {/* Main Content Card */}
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>
            Manage all users in the system. View, edit, and control user access.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <UserFilters searchParams={params} />

          {/* Users List */}
          <div className="space-y-4 h-[40vh] overflow-x-hidden overflow-scroll">
            {users.data.length > 0 ? (
              users.data.map((user: any) => (
                <UserCard key={user._id} user={user} currentUserRole={currentUserRole} />
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No users found.</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          <Pagination currentPage={users.currentPage} totalPages={users.totalPages} />
        </CardContent>
      </Card>
    </div>
  );
}

// Main Page Component
export default function UsersPage({ searchParams }: { searchParams: Promise<any> }) {
  return (
    <div className="container mx-auto p-6">
      <Suspense fallback={<div>Loading...</div>}>
        <UsersPageContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}