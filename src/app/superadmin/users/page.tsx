// // app/superadmin/users/page.tsx

// import connectDB from "@/lib/mongodb";
// import User from "@/models/User";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { manageUserVerification } from "@/actions/superadmin-actions";
// import { getAllUsers } from "../components/utils";

// const ApprovalForm = ({ userId, status }: { userId: string, status: string }) => {
//   return (
//     <form action={async () => {
//       "use server";
//       await manageUserVerification(userId, status);
//     }}>
//       <Button type="submit">Approve User</Button>
//     </form>
//   );
// };

// const ManageUsersPage = async () => {
//   await connectDB();
//   const allUsers = await getAllUsers();

//   return (
//     <div className="p-4 sm:p-6 lg:p-8">
//       <Card>
//         <CardHeader>
//           <CardTitle>User Verification Requests</CardTitle>
//           <CardDescription>Review and approve new doctors and receptionists.</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-4">
//             {allUsers.length > 0 ? (
//               allUsers.map((user) => (
//                 <div key={user._id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-md gap-4">
//                   <div>
//                     <p className="font-bold text-lg">{user.firstName} {user.lastName}</p>
//                     <p className="text-sm text-muted-foreground">{user.email}</p>
//                     <Badge variant="secondary" className="mt-2">Role: {user.role}</Badge>
//                   </div>
//                   <div className="self-end sm:self-center">
//                     <ApprovalForm status="VERFIDED" userId={user._id.toString()} />
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

import PageContainer from '@/components/layout/page-container';
import PatientRegistrationDialog from '@/components/PatientRegistration';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { searchParamsCache, serialize } from '@/lib/searchparams';
import { IconPlus } from '@tabler/icons-react';
import { SearchParams } from 'nuqs/server';
import { Suspense } from 'react';
import PatientListingPage from './user-listing-page';

export const metadata = {
  title: 'Dashboard: Patients'
};

type pageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Page(props: pageProps) {
  const searchParams = await props.searchParams;
  // Allow nested RSCs to access the search params (in a type-safe way)
  searchParamsCache.parse(searchParams);

  // This key is used for invoke suspense if any of the search params changed (used for filters).
  // const key = serialize({ ...searchParams });

  return (
    <PageContainer scrollable={false}>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading
            title='Users'
            description='Manage users'
          />
          <PatientRegistrationDialog />

        </div>
        <Separator />
        <Suspense
          // key={key}
          fallback={
            <DataTableSkeleton columnCount={5} rowCount={8} filterCount={2} />
          }
        >
          <PatientListingPage />
        </Suspense>
      </div>
    </PageContainer>
  );
}
