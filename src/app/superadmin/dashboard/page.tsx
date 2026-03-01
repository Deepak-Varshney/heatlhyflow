import { Building2, CheckCircle2, Clock3, ShieldAlert, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import PageContainer from "@/components/layout/page-container";
import connectDB from "@/lib/mongodb";
import Organization from "@/models/Organization";
import { getUserStats } from "@/actions/superadmin-actions";
import { getOnboardingRequests } from "@/actions/onboarding-request-actions";
import { RequestDetailsModal } from "@/components/request-details-modal";
import Link from 'next/link';

const glassCardClass =
    "relative overflow-hidden border border-primary/15 bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60";

export default async function SuperAdminDashboard() {
    await connectDB();

    const userStats = await getUserStats();
    const organizationsTotal = await Organization.countDocuments();
    const organizationsActive = await Organization.countDocuments({ status: "ACTIVE" });
    const organizationsPending = await Organization.countDocuments({ status: "PENDING" });

    const allRequestsResult = await getOnboardingRequests();
    const allRequests: any[] = allRequestsResult.success
        ? (allRequestsResult.requests ?? [])
        : [];
    const pendingRequests = allRequests.filter((request: any) => request.status === 'PENDING');
    const approvedRequests = allRequests.filter((request: any) => request.status === 'APPROVED');
    const rejectedRequests = allRequests.filter((request: any) => request.status === 'REJECTED');
    const recentRequests = allRequests.slice(0, 5);

    return (
        <PageContainer scrollable={true}>
            <div className="w-full space-y-8">
                <section className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20">
                            <ShieldAlert className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-semibold">Superadmin Control Center</h1>
                            <p className="text-sm text-muted-foreground">
                                Global oversight for users, organizations, and onboarding approvals.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                    <StatCard
                        icon={<Users className="h-5 w-5 text-primary" />}
                        label="Total Users"
                        value={userStats.totalUsers}
                        trend="All accounts"
                    />
                    <StatCard
                        icon={<CheckCircle2 className="h-5 w-5 text-emerald-600" />}
                        label="Verified Users"
                        value={userStats.verifiedUsers}
                        trend="Cleared access"
                    />
                    <StatCard
                        icon={<Building2 className="h-5 w-5 text-sky-600" />}
                        label="Organizations"
                        value={organizationsTotal}
                        trend={`${organizationsActive} active`}
                    />
                    <StatCard
                        icon={<Clock3 className="h-5 w-5 text-amber-600" />}
                        label="Pending Orgs"
                        value={organizationsPending}
                        trend="Awaiting approval"
                    />
                </section>

                <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className={`${glassCardClass} lg:col-span-2`}>
                        <CardHeader>
                            <CardTitle>Onboarding Requests</CardTitle>
                            <CardDescription>
                                Review pending, approved, and rejected clinic applications.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                <StatusPill label="Pending" value={pendingRequests.length} tone="warning" />
                                <StatusPill label="Approved" value={approvedRequests.length} tone="success" />
                                <StatusPill label="Rejected" value={rejectedRequests.length} tone="danger" />
                            </div>
                            {recentRequests.length === 0 ? (
                                <EmptyState />
                            ) : (
                                recentRequests.map((request: any) => (
                                    <div
                                        key={request._id}
                                        className="rounded-xl border border-border/60 bg-background/80 p-4 space-y-4"
                                    >
                                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="text-base font-semibold">
                                                        {request.organizationName}
                                                    </h3>
                                                    <Badge variant="secondary">{request.organizationType}</Badge>
                                                    <Badge variant="outline">{request.status}</Badge>
                                                </div>
                                                <p className="text-sm text-muted-foreground">
                                                    {request.firstName} {request.lastName} · {request.email}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    Submitted {new Date(request.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="flex flex-col sm:flex-row gap-2">
                                                <RequestDetailsModal request={request} />
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                            <div className="flex justify-end">
                                <Button variant="outline" size="sm" asChild>
                                    <Link href="/superadmin/join-requests">View all requests</Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className={glassCardClass}>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                            <CardDescription>Instant access to high-impact actions.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <QuickAction
                                title="Review Join Requests"
                                description="Approve clinics faster"
                                href="/superadmin/join-requests"
                            />
                            <Separator />
                            <QuickAction
                                title="Audit Users"
                                description="Verify or suspend access"
                                href="/superadmin/users"
                            />
                            <Separator />
                            <QuickAction
                                title="Manage Organizations"
                                description="Edit, deactivate, or delete"
                                href="/superadmin/clinics"
                            />
                        </CardContent>
                    </Card>
                </section>

                <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className={glassCardClass}>
                        <CardHeader>
                            <CardTitle>Role Breakdown</CardTitle>
                            <CardDescription>Live headcount by role.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <RoleRow label="Doctors" value={userStats.doctors} />
                            <RoleRow label="Receptionists" value={userStats.receptionists} />
                            <RoleRow label="Unassigned" value={userStats.unassignedUsers} />
                        </CardContent>
                    </Card>

                    <Card className={glassCardClass}>
                        <CardHeader>
                            <CardTitle>Compliance & Alerts</CardTitle>
                            <CardDescription>Keep the system clean and safe.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <AlertRow title="Pending Approvals" value={organizationsPending} />
                            <AlertRow title="Rejected Users" value={userStats.rejectedUsers} />
                            <AlertRow title="Pending Users" value={userStats.pendingUsers} />
                        </CardContent>
                    </Card>
                </section>
            </div>
        </PageContainer>
    );
}

function StatCard({
    icon,
    label,
    value,
    trend
}: {
    icon: React.ReactNode;
    label: string;
    value: number;
    trend: string;
}) {
    return (
        <Card className={glassCardClass}>
            <CardContent className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                    <div className="h-10 w-10 rounded-xl bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20">
                        {icon}
                    </div>
                    <span className="text-xs text-muted-foreground">{trend}</span>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">{label}</p>
                    <p className="text-2xl font-semibold">{value}</p>
                </div>
            </CardContent>
        </Card>
    );
}

function QuickAction({ title, description, href }: { title: string; description: string; href: string }) {
    return (
        <div className="flex items-center justify-between gap-4">
            <div>
                <p className="text-sm font-medium">{title}</p>
                <p className="text-xs text-muted-foreground">{description}</p>
            </div>
            <Button variant="outline" size="sm" asChild>
                <Link href={href}>Open</Link>
            </Button>
        </div>
    );
}

function StatusPill({
    label,
    value,
    tone,
}: {
    label: string;
    value: number;
    tone: 'warning' | 'success' | 'danger';
}) {
    const toneClass =
        tone === 'success'
            ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
            : tone === 'danger'
              ? 'border-rose-200 bg-rose-50 text-rose-700'
              : 'border-amber-200 bg-amber-50 text-amber-700';

    return (
        <div className={`rounded-xl border px-4 py-3 ${toneClass}`}>
            <p className="text-xs uppercase tracking-wide">{label}</p>
            <p className="text-2xl font-semibold">{value}</p>
        </div>
    );
}

function RoleRow({ label, value }: { label: string; value: number }) {
    return (
        <div className="flex items-center justify-between rounded-lg border border-border/60 bg-background/80 px-3 py-2">
            <span className="text-sm text-muted-foreground">{label}</span>
            <span className="text-sm font-semibold">{value}</span>
        </div>
    );
}

function AlertRow({ title, value }: { title: string; value: number }) {
    return (
        <div className="flex items-center justify-between rounded-lg border border-border/60 bg-background/80 px-3 py-2">
            <span className="text-sm text-muted-foreground">{title}</span>
            <Badge variant="secondary">{value}</Badge>
        </div>
    );
}

function EmptyState() {
    return (
        <div className="rounded-xl border border-dashed border-border/60 p-8 text-center space-y-2">
            <p className="text-sm font-medium">No pending requests</p>
            <p className="text-xs text-muted-foreground">
                New clinic applications will appear here for approval.
            </p>
        </div>
    );
}