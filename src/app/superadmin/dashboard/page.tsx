import connectDB from "@/lib/mongodb";
import Organization from "@/models/Organization";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { updateOrganizationStatus, manageUserVerification, getUserStats } from "@/actions/superadmin-actions";
import User from "@/models/User";
import { ThemePasteDialog } from "./theme-editor";
import { Users, Building2, UserCheck, UserX, Clock, TrendingUp, CreditCard, DollarSign, Calendar } from "lucide-react";
import Link from "next/link";
// ActionForm for Organization status updates
const ActionForm = ({ orgId, status, children, variant, clerkUserId }: {
    orgId: string,
    status: "ACTIVE" | "REJECTED",
    children: React.ReactNode,
    variant: "default" | "destructive",
    clerkUserId: string
}) => {
    return (
        <form action={async () => {
            "use server";
            await updateOrganizationStatus(orgId, status, clerkUserId);
        }}>
            <Button type="submit" variant={variant}>{children}</Button>
        </form>
    );
};

// ActionForm for User status updates (New Component)
const UserActionForm = ({ userId, status, children, variant }: {
    userId: string,
    status: "PENDING" | "VERIFIED" | "REJECTED",
    children: React.ReactNode,
    variant: "default" | "destructive",
}) => {
    return (
        <form action={async () => {
            "use server";
            // NOTE: Assuming an 'updateUserStatus' server action is available
            await manageUserVerification(userId, status);
        }}>
            <Button type="submit" variant={variant}>{children}</Button>
        </form>
    );
};

const SuperAdminDashboard = async () => {
    await connectDB();
    // Populate the 'owner' field for organizations to get user details
    const pendingOrgs = await Organization.find({ status: "PENDING" }).populate("owner");
    // Fetch pending users
    const pendingUsers = await User.find({ verificationStatus: "PENDING" });
    
    // Get user statistics
    const userStats = await getUserStats();
    
    // Get organization statistics
    const totalOrgs = await Organization.countDocuments();
    const activeOrgs = await Organization.countDocuments({ status: "ACTIVE" });
    const pendingOrgCount = await Organization.countDocuments({ status: "PENDING" });
    
    // Calculate subscription stats from organizations
    const orgsWithSubscriptions = await Organization.countDocuments({ 
      status: "ACTIVE",
      subscription: { $exists: true }
    });
    
    // Mock revenue calculation - in real implementation, this would come from Clerk
    const estimatedMonthlyRevenue = activeOrgs * 10; // Assuming $10/month per active org
    
    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-8 overflow-scroll h-[90vh]">
            {/* Statistics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3">
                            <Users className="h-8 w-8 text-blue-600" />
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                                <p className="text-2xl font-bold">{userStats.totalUsers}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3">
                            <UserCheck className="h-8 w-8 text-green-600" />
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Verified Users</p>
                                <p className="text-2xl font-bold">{userStats.verifiedUsers}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3">
                            <Clock className="h-8 w-8 text-yellow-600" />
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Pending Users</p>
                                <p className="text-2xl font-bold">{userStats.pendingUsers}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3">
                            <Building2 className="h-8 w-8 text-purple-600" />
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Active Organizations</p>
                                <p className="text-2xl font-bold">{activeOrgs}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Subscription Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3">
                            <CreditCard className="h-8 w-8 text-indigo-600" />
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Active Subscriptions</p>
                                <p className="text-2xl font-bold">{orgsWithSubscriptions}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3">
                            <DollarSign className="h-8 w-8 text-green-600" />
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Estimated Revenue</p>
                                <p className="text-2xl font-bold">${estimatedMonthlyRevenue}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3">
                            <TrendingUp className="h-8 w-8 text-orange-600" />
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Organizations</p>
                                <p className="text-2xl font-bold">{totalOrgs}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3">
                            <Calendar className="h-8 w-8 text-red-600" />
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Pending Approvals</p>
                                <p className="text-2xl font-bold">{pendingOrgCount}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-4">
                <Link href="/superadmin/users">
                    <Button variant="outline" className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Manage Users
                    </Button>
                </Link>
                <Link href="/superadmin/clinics">
                    <Button variant="outline" className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        Manage Organizations
                    </Button>
                </Link>
                <Link href="/superadmin/subscriptions">
                    <Button variant="outline" className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        Manage Subscriptions
                    </Button>
                </Link>
                <ThemePasteDialog />
            </div>
            {/* Pending Clinic Approvals Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Pending Clinic Approvals</CardTitle>
                    <CardDescription>Review and approve or reject new clinic registrations.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {pendingOrgs.length > 0 ? (
                            pendingOrgs.map((org: any) => ( // Using 'any' for simplicity, should use proper type for Organization
                                <div key={org._id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-md gap-4">
                                    <div>
                                        <p className="font-bold text-lg">{org.name}</p>
                                        <p className="text-sm text-muted-foreground">
                                            Owner: {org.owner.firstName} {org.owner.lastName} ({org.owner.email})
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Role: {org.owner.role}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Request Date: {new Date(org.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="flex gap-2 self-end sm:self-center">
                                        <ActionForm
                                            orgId={org._id.toString()}
                                            clerkUserId={org.owner.clerkUserId.toString()}
                                            status="ACTIVE"
                                            variant="default"
                                        >
                                            Approve
                                        </ActionForm>
                                        <ActionForm
                                            orgId={org._id.toString()}
                                            clerkUserId={org.owner.clerkUserId.toString()}
                                            status="REJECTED"
                                            variant="destructive"
                                        >
                                            Reject
                                        </ActionForm>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-muted-foreground py-8">No pending approvals.</p>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* --- */}

            {/* Pending User Approvals Card (New Section) */}
            <Card>
                <CardHeader>
                    <CardTitle>Pending User Approvals</CardTitle>
                    <CardDescription>Review and approve or reject new user registrations without a clinic.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {pendingUsers.length > 0 ? (
                            pendingUsers.map((user: any) => ( // Using 'any' for simplicity, should use proper type for User
                                <div key={user._id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-md gap-4">
                                    <div>
                                        <p className="font-bold text-lg">{user.firstName} {user.lastName}</p>
                                        <p className="text-sm text-muted-foreground">
                                            Email: {user.email}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Role: {user.role}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Request Date: {new Date(user.createdAt).toLocaleDateString()}
                                        </p>
                                        <Badge variant="secondary" className="mt-1">{user.role}</Badge>
                                    </div>
                                    <div className="flex gap-2 self-end sm:self-center">
                                        <UserActionForm
                                            userId={user._id.toString()}
                                            status="VERIFIED"
                                            variant="default"
                                        >
                                            Approve User
                                        </UserActionForm>
                                        <UserActionForm
                                            userId={user._id.toString()}
                                            status="REJECTED"
                                            variant="destructive"
                                        >
                                            Reject User
                                        </UserActionForm>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-muted-foreground py-8">No pending user approvals.</p>
                        )}
                    </div>
                </CardContent>
            </Card>

        </div>
    );
};

export default SuperAdminDashboard;