// // app/superadmin/dashboard/page.tsx

// import connectDB from "@/lib/mongodb";
// import Organization from "@/models/Organization";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { updateOrganizationStatus } from "@/actions/superadmin-actions";
// import User from "@/models/User";

// const ActionForm = ({ orgId, status, children, variant, clerkUserId }: {
//     orgId: string,
//     status: "ACTIVE" | "REJECTED",
//     children: React.ReactNode,
//     variant: "default" | "destructive",
//     clerkUserId: string
// }) => {
//     return (
//         <form action={async () => {
//             "use server";
//             await updateOrganizationStatus(orgId, status, clerkUserId);
//         }}>
//             <Button type="submit" variant={variant}>{children}</Button>
//         </form>
//     );
// };

// const SuperAdminDashboard = async () => {
//     await connectDB();
//     const pendingOrgs = await Organization.find({ status: "PENDING" }).populate("owner");
//     const pendingUsers = await User.find({ status: "PENDING" });
//     return (
//         <div className="p-4 sm:p-6 lg:p-8">
//             <Card>
//                 <CardHeader>
//                     <CardTitle>Pending Clinic Approvals</CardTitle>
//                     <CardDescription>Review and approve or reject new clinic registrations.</CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                     <div className="space-y-4">
//                         {pendingOrgs.length > 0 ? (
//                             pendingOrgs.map((org) => (
//                                 <div key={org._id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-md gap-4">
//                                     <div>
//                                         <p className="font-bold text-lg">{org.name}</p>
//                                         <p className="text-sm text-muted-foreground">
//                                             Owner: {org.owner.firstName} {org.owner.lastName} ({org.owner.email}) 
//                                         </p>
//                                         <p className="text-sm text-muted-foreground">
//                                             Role: {org.owner.role}
//                                         </p>
//                                         <p className="text-xs text-muted-foreground">
//                                             Request Date: {new Date(org.createdAt).toLocaleDateString()}
//                                         </p>
//                                     </div>
//                                     <div className="flex gap-2 self-end sm:self-center">
//                                         <ActionForm orgId={org._id.toString()} clerkUserId={org.owner.clerkUserId.toString()} status="ACTIVE" variant="default">Approve</ActionForm>
//                                         <ActionForm orgId={org._id.toString()} clerkUserId={org.owner.clerkUserId.toString()} status="REJECTED" variant="destructive">Reject</ActionForm>
//                                     </div>
//                                 </div>
//                             ))
//                         ) : (
//                             <p className="text-center text-muted-foreground py-8">No pending approvals.</p>
//                         )}
//                     </div>
//                 </CardContent>
//             </Card>
//         </div>
//     );
// };

// export default SuperAdminDashboard;

// app/superadmin/dashboard/page.tsx

import connectDB from "@/lib/mongodb";
import Organization from "@/models/Organization";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { updateOrganizationStatus, manageUserVerification } from "@/actions/superadmin-actions"; // Assuming updateUserStatus action exists
import User from "@/models/User";

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
    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-8">
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