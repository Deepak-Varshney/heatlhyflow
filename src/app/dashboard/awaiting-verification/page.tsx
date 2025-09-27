// app/awaiting-verification/page.tsx

import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { getMongoUser } from "@/lib/CheckUser";

const AwaitingVerificationPage = async () => {
  const mongoUser = await getMongoUser();

  // If for some reason there's no user, or they are already verified,
  // or they haven't chosen a role, send them away.
  if (!mongoUser || mongoUser.verificationStatus !== "PENDING" || mongoUser.role === "UNASSIGNED") {
    redirect("/dashboard");
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-lg max-h-lg">
        <CardHeader className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-yellow-500" />
          <CardTitle className="mt-4">Verification Pending</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground mb-2">
            Thank you for completing your profile.
          </p>
          {mongoUser.role === 'DOCTOR' && (
             <p className="text-muted-foreground">
                Your doctor profile has been submitted and is currently under review by an administrator.
             </p>
          )}
           {mongoUser.role === 'RECEPTIONIST' && (
             <p className="text-muted-foreground">
                Your request to join as a receptionist is awaiting approval from an administrator.
             </p>
          )}
          <div className="mt-6">
            <p>Your current status is:</p>
            <Badge variant="destructive" className="mt-2 text-lg">
              {mongoUser.verificationStatus}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-8">
            You will be notified once your account is approved. You may now log out.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AwaitingVerificationPage;