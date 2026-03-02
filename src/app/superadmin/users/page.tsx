import Link from "next/link";
import { redirect } from "next/navigation";
import PageContainer from "@/components/layout/page-container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getAllUsers, getUserStats } from "@/actions/superadmin-actions";
import { UserStats } from "./components/user-stats";
import { UserDetailsModal } from "./components/user-details-modal";

type UsersSearchParams = Promise<{
  page?: string;
  limit?: string;
  search?: string;
  role?: string;
  verificationStatus?: string;
}>;

export default async function UsersPage({ searchParams }: { searchParams: UsersSearchParams }) {
  const params = await searchParams;
  const page = Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1);
  const limit = Math.max(1, Number.parseInt(params.limit ?? "10", 10) || 10);
  const search = params.search?.trim() ?? "";
  const role = params.role && params.role !== "ALL" ? params.role : undefined;
  const verificationStatus =
    params.verificationStatus && params.verificationStatus !== "ALL"
      ? params.verificationStatus
      : undefined;

  try {
    const [users, stats] = await Promise.all([
      getAllUsers({ page, limit, search, role, verificationStatus }),
      getUserStats(),
    ]);

    const totalPages = Math.max(users.totalPages || 1, 1);
    const buildHref = (nextPage: number) => {
      const query = new URLSearchParams();
      query.set("page", String(nextPage));
      query.set("limit", String(limit));
      if (search) query.set("search", search);
      if (role) query.set("role", role);
      if (verificationStatus) query.set("verificationStatus", verificationStatus);
      return `/superadmin/users?${query.toString()}`;
    };

    return (
      <PageContainer scrollable>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-semibold">User Management</h1>
            <p className="text-sm text-muted-foreground">
              Review all users, filter by role/status, and open individual profiles for updates.
            </p>
          </div>

          <UserStats stats={stats} />

          <Card>
            <CardHeader>
              <CardTitle>Users Directory</CardTitle>
              <CardDescription>Server-rendered listing with reliable filtering and paging.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form action="/superadmin/users" method="get" className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="md:col-span-2 space-y-1">
                  <Label htmlFor="search">Search</Label>
                  <Input id="search" name="search" defaultValue={search} placeholder="Name, email, specialty" />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="role">Role</Label>
                  <select
                    id="role"
                    name="role"
                    defaultValue={role ?? "ALL"}
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  >
                    <option value="ALL">All Roles</option>
                    <option value="DOCTOR">Doctor</option>
                    <option value="RECEPTIONIST">Receptionist</option>
                    <option value="SUPERADMIN">Super Admin</option>
                    <option value="DEVIL">Devil</option>
                    <option value="UNASSIGNED">Unassigned</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="verificationStatus">Status</Label>
                  <select
                    id="verificationStatus"
                    name="verificationStatus"
                    defaultValue={verificationStatus ?? "ALL"}
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  >
                    <option value="ALL">All Status</option>
                    <option value="VERIFIED">Verified</option>
                    <option value="PENDING">Pending</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
                </div>

                <input type="hidden" name="limit" value={String(limit)} />
                <div className="md:col-span-4 flex items-center gap-2">
                  <Button type="submit">Apply Filters</Button>
                  <Button asChild variant="outline">
                    <Link href="/superadmin/users">Reset</Link>
                  </Button>
                </div>
              </form>

              <div className="overflow-x-auto rounded-md border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium">Name</th>
                      <th className="px-4 py-3 text-left font-medium">Email</th>
                      <th className="px-4 py-3 text-left font-medium">Role</th>
                      <th className="px-4 py-3 text-left font-medium">Status</th>
                      <th className="px-4 py-3 text-left font-medium">Organization</th>
                      <th className="px-4 py-3 text-left font-medium">Joined</th>
                      <th className="px-4 py-3 text-right font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.data.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                          No users found for selected filters.
                        </td>
                      </tr>
                    ) : (
                      users.data.map((user: any) => (
                        <tr key={user._id} className="border-t">
                          <td className="px-4 py-3 font-medium">{user.firstName} {user.lastName}</td>
                          <td className="px-4 py-3">{user.email}</td>
                          <td className="px-4 py-3">
                            <Badge variant="outline">{user.role}</Badge>
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant="secondary">{user.verificationStatus}</Badge>
                          </td>
                          <td className="px-4 py-3">{user.organization?.name ?? "-"}</td>
                          <td className="px-4 py-3">{new Date(user.createdAt).toLocaleDateString()}</td>
                          <td className="px-4 py-3 text-right">
                            <UserDetailsModal user={user} />
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Page {users.currentPage} of {totalPages}
                </p>
                <div className="flex items-center gap-2">
                  <Button asChild variant="outline" size="sm" disabled={users.currentPage <= 1}>
                    <Link href={buildHref(Math.max(1, users.currentPage - 1))}>Previous</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    disabled={users.currentPage >= totalPages}
                  >
                    <Link href={buildHref(Math.min(totalPages, users.currentPage + 1))}>Next</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    );
  } catch (error) {
    if (error instanceof Error && error.message.includes("Permission denied")) {
      redirect("/access-blocked");
    }
    throw error;
  }
}