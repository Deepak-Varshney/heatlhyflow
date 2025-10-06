// // app/superadmin/users/page.tsx

// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { manageUserVerification } from "@/actions/superadmin-actions";
// import { getAllUsers } from "../components/utils";

// const ApprovalForm = ({ userId, status, btnText, variant}: { userId: string, status: string, btnText: string, variant?: any }) => {
//   return (
//     <form action={async () => {
//       "use server";
//       await manageUserVerification(userId, status);
//     }}>
//       <Button variant={variant} type="submit">{btnText}</Button>
//     </form>
//   )
// };
// const ManageUsersPage = async () => {
//   const allUsers = await getAllUsers();
//   return (
//     <div className="p-4 sm:p-6 lg:p-8">
//       <Card>
//         <CardHeader>
//           <CardTitle>User Verification Requests</CardTitle>
//           <CardDescription>Review and approve new doctors and receptionists.</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-4 max-h-[400px] overflow-x-none overflow-y-auto">
//             {allUsers.length > 0 ? (
//               allUsers.map((user) => (
//                 <div key={user._id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-md gap-4">
//                   <div>
//                     <p className="font-bold text-lg">{user.firstName} {user.lastName}</p>
//                     <p className="text-sm text-muted-foreground">{user.email}</p>
//                     <Badge variant="secondary" className="mt-2">Role: {user.role}</Badge>
//                   </div>
//                   <div className="self-end sm:self-center">
//                     {user.verificationStatus !== 'VERIFIED' && <ApprovalForm status="VERIFIED" btnText="Approve User" userId={user._id.toString()} />
//                     }
//                   </div>
//                   <div className="self-end sm:self-center">
//                     {user.verificationStatus !== 'PENDING' && <ApprovalForm status="PENDING" btnText="Mark Pending" variant="destructivesecondary" userId={user._id.toString()} />
//                     }
//                   </div>
//                   <div className="self-end sm:self-center">
//                     {user.verificationStatus !== 'REJECTED' && <ApprovalForm status="REJECTED" btnText="Reject User" variant="destructive" userId={user._id.toString()} />
//                     }
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <p className="text-center text-muted-foreground py-8">No pending user verifications.</p>
//             )}
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default ManageUsersPage;

// // import PageContainer from '@/components/layout/page-container';
// // import PatientRegistrationDialog from '@/components/PatientRegistration';
// // import { Heading } from '@/components/ui/heading';
// // import { Separator } from '@/components/ui/separator';
// // import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
// // import { searchParamsCache, serialize } from '@/lib/searchparams';
// // import { IconPlus } from '@tabler/icons-react';
// // import { SearchParams } from 'nuqs/server';
// // import { Suspense } from 'react';
// // import PatientListingPage from './user-listing-page';

// // export const metadata = {
// //   title: 'Dashboard: Patients'
// // };

// // type pageProps = {
// //   searchParams: Promise<SearchParams>;
// // };

// // export default async function Page(props: pageProps) {
// //   const searchParams = await props.searchParams;
// //   // Allow nested RSCs to access the search params (in a type-safe way)
// //   searchParamsCache.parse(searchParams);

// //   // This key is used for invoke suspense if any of the search params changed (used for filters).
// //   // const key = serialize({ ...searchParams });

// //   return (
// //     <PageContainer scrollable={false}>
// //       <div className='flex flex-1 flex-col space-y-4'>
// //         <div className='flex items-start justify-between'>
// //           <Heading
// //             title='Users'
// //             description='Manage users'
// //           />
// //           <PatientRegistrationDialog />

// //         </div>
// //         <Separator />
// //         <Suspense
// //           // key={key}
// //           fallback={
// //             <DataTableSkeleton columnCount={5} rowCount={8} filterCount={2} />
// //           }
// //         >
// //           <PatientListingPage />
// //         </Suspense>
// //       </div>
// //     </PageContainer>
// //   );
// // }

// app/superadmin/users/page.tsx

import connectDB from "@/lib/mongodb";
import User from "@/models/User"; // Assuming this model path
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { manageUserVerification } from "@/actions/superadmin-actions";

// Component to toggle a user's status between ACTIVE and DISABLED
const ToggleUserStatusForm = ({ userId, currentStatus }: {
    userId: string,
    currentStatus: "ACTIVE" | "DISABLED" | "REJECTED"
}) => {
    // Only toggle between ACTIVE and DISABLED. REJECTED is a final state (for this form).
    if (currentStatus === "REJECTED") {
        return null; // Don't show the button if rejected
    }

    const newStatus = currentStatus === "ACTIVE" ? "DISABLED" : "ACTIVE";
    
    // Determine button text and variant based on the action being performed (which is newStatus)
    const buttonText = newStatus === "ACTIVE" ? "Enable Account" : "Disable Account";
    const buttonVariant = newStatus === "ACTIVE" ? "default" : "destructive";

    return (
        <form action={async () => {
            "use server";
            // NOTE: This server action is assumed to exist in "@/actions/superadmin-actions"
            await manageUserVerification(userId, newStatus);
        }}>
            <Button type="submit" variant={buttonVariant} size="sm">
                {buttonText}
            </Button>
        </form>
    );
};

const ManageUsersPage = async () => {
    await connectDB();
    // Fetch all users except those still pending initial review
    const allUsers = await User.find({ status: { $ne: "PENDING" } })
        .sort({ createdAt: -1 })
        // Mongoose doesn't support complex projection types well in find, 
        // using 'any' here, but ideally should use a strict Mongoose type.
        .lean(); 

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <Card>
                <CardHeader>
                    <CardTitle>Manage All Users</CardTitle>
                    <CardDescription>View and manage the status of all user accounts on the platform.</CardDescription>
                </CardHeader>
                <CardContent className="overflow-scroll h-[500px]">
                    <div className="space-y-4">
                        {allUsers.length > 0 ? (
                            allUsers.map((user: any) => (
                                <div key={user._id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-md gap-4">
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-lg truncate">{user.firstName} {user.lastName}</p>
                                        <p className="text-sm text-muted-foreground truncate">
                                            Email: {user.email}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Role: {user.role} | Joined: {new Date(user.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-4 self-end sm:self-center shrink-0">
                                        <Badge 
                                            variant={
                                                user.status === 'ACTIVE' ? 'default' : 
                                                user.status === 'DISABLED' ? 'secondary' : 
                                                'destructive' // REJECTED
                                            }
                                            className="min-w-[80px] justify-center"
                                        >
                                            {user.status}
                                        </Badge>
                                        {/* Show the toggle button only if the status is not REJECTED */}
                                        <ToggleUserStatusForm 
                                            userId={user._id.toString()} 
                                            currentStatus={user.status as "ACTIVE" | "DISABLED" | "REJECTED"} 
                                        />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-muted-foreground py-8">No approved users found.</p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ManageUsersPage;
