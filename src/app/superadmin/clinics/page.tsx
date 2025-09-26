// app/superadmin/clinics/page.tsx

import connectDB from "@/lib/mongodb";
import Organization from "@/models/Organization";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { updateOrganizationStatus } from "@/actions/superadmin-actions";

const ToggleStatusForm = ({ orgId, currentStatus }: { 
    orgId: string, 
    currentStatus: "ACTIVE" | "DISABLED"
}) => {
  const newStatus = currentStatus === "ACTIVE" ? "DISABLED" : "ACTIVE";
  return (
    <form action={async () => {
      "use server";
      await updateOrganizationStatus(orgId, newStatus);
    }}>
      <Button type="submit" variant={newStatus === "ACTIVE" ? "default" : "destructive"}>
        {newStatus === "ACTIVE" ? "Enable" : "Disable"}
      </Button>
    </form>
  );
};

const ManageClinicsPage = async () => {
  await connectDB();
  const allOrgs = await Organization.find({ status: { $ne: "PENDING" } })
    .populate("owner")
    .sort({ createdAt: -1 });

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <Card>
        <CardHeader>
          <CardTitle>Manage All Clinics</CardTitle>
          <CardDescription>View and manage all active, disabled, or rejected clinics on the platform.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {allOrgs.map((org) => (
              <div key={org._id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-md gap-4">
                <div>
                  <p className="font-bold text-lg">{org.name}</p>
                   <p className="text-sm text-muted-foreground">
                      Owner: {org.owner.firstName} {org.owner.lastName}
                    </p>
                </div>
                <div className="flex items-center gap-4 self-end sm:self-center">
                   <Badge variant={org.status === 'ACTIVE' ? 'default' : 'destructive'}>{org.status}</Badge>
                   {org.status !== 'REJECTED' && (
                     <ToggleStatusForm orgId={org._id.toString()} currentStatus={org.status as "ACTIVE" | "DISABLED"} />
                   )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageClinicsPage;