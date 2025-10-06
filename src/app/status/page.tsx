import { auth } from "@clerk/nextjs/server";
import { getMongoUser } from "@/lib/CheckUser";
import connectDB from "@/lib/mongodb";
import Organization from "@/models/Organization";
import { redirect } from "next/navigation";

export default async function StatusPage() {
  await connectDB();

  const { userId } = await auth();
  const mongoUser = await getMongoUser(); // Gets user from MongoDB based on Clerk ID

  const org = await Organization.findOne({ owner: mongoUser._id }); // or however you're linking orgs

  const userStatus = mongoUser.verificationStatus;
  const orgStatus = org?.status;

  const blockedReasons = [];

  if (userStatus !== "VERIFIED") {
    blockedReasons.push({
      label: "Your account",
      status: userStatus,
    });
  }

  if (orgStatus !== "ACTIVE") {
    blockedReasons.push({
      label: "Your organization",
      status: orgStatus,
    });
  }
  if (userStatus === "VERIFIED" && orgStatus === "ACTIVE") {
    return redirect('/');
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-6">
        <h1 className="text-2xl font-bold">Access Restricted</h1>
        <p className="text-muted-foreground">
          You currently do not have access to the platform due to the following reasons:
        </p>

        <ul className="space-y-2">
          {blockedReasons.map((item, index) => (
            <li
              key={index}
              className="bg-muted text-sm p-3 rounded-md border flex justify-between items-center"
            >
              <span>{item.label}</span>
              <span className="capitalize font-medium">{item.status}</span>
            </li>
          ))}
        </ul>

        <p className="text-xs text-muted-foreground">
          If you believe this is a mistake, please contact support.
        </p>
      </div>
    </div>
  );
}
