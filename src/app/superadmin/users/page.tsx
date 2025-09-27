// app/superadmin/users/page.tsx

import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { approveUserVerification } from "@/actions/superadmin-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const ApprovalForm = ({ userId }: { userId: string }) => {
  return (
    <form action={async () => {
      "use server";
      await approveUserVerification(userId);
    }}>
      <Button type="submit">Approve User</Button>
    </form>
  );
};

const ManageUsersPage = async () => {
  await connectDB();
  const pendingUsers = await User.find({ verificationStatus: "PENDING" });

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <Card>
        <CardHeader>
          <CardTitle>User Verification Requests</CardTitle>
          <CardDescription>Review and approve new doctors and receptionists.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pendingUsers.length > 0 ? (
              pendingUsers.map((user) => (
                <div key={user._id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-md gap-4">
                  <div>
                    <p className="font-bold text-lg">{user.firstName} {user.lastName}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <Badge variant="secondary" className="mt-2">Role: {user.role}</Badge>
                  </div>
                  <div className="self-end sm:self-center">
                    <ApprovalForm userId={user._id.toString()} />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">No pending user verifications.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageUsersPage;