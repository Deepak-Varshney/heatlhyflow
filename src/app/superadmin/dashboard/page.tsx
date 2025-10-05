// app/superadmin/dashboard/page.tsx

import connectDB from "@/lib/mongodb";
import Organization from "@/models/Organization";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { updateOrganizationStatus } from "@/actions/superadmin-actions";

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

const SuperAdminDashboard = async () => {
    await connectDB();
    const pendingOrgs = await Organization.find({ status: "PENDING" }).populate("owner");
    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <Card>
                <CardHeader>
                    <CardTitle>Pending Clinic Approvals</CardTitle>
                    <CardDescription>Review and approve or reject new clinic registrations.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {pendingOrgs.length > 0 ? (
                            pendingOrgs.map((org) => (
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
                                        <ActionForm orgId={org._id.toString()} clerkUserId={org.owner.clerkUserId.toString()} status="ACTIVE" variant="default">Approve</ActionForm>
                                        <ActionForm orgId={org._id.toString()} clerkUserId={org.owner.clerkUserId.toString()} status="REJECTED" variant="destructive">Reject</ActionForm>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-muted-foreground py-8">No pending approvals.</p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default SuperAdminDashboard;