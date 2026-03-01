import connectDB from "@/lib/mongodb";
import Organization from "@/models/Organization";
import { ManageClinicsPageContent } from "./clinics-content";

interface IOrganization {
  _id: string;
  name: string;
  owner: {
    firstName: string;
    lastName: string;
    clerkUserId: string;
  };
  status: 'ACTIVE' | 'DISABLED' | 'REJECTED';
  createdAt: string;
  email?: string;
  phone?: string;
  members: Array<{
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    specialty?: string;
  }>;
}

const ManageClinicsPage = async () => {
  await connectDB();
  const allOrgs = await Organization.find({ status: { $ne: "PENDING" } })
    .populate("owner")
    .populate("members")
    .sort({ createdAt: -1 });

  const serializedOrgs: IOrganization[] = allOrgs.map(org => ({
    _id: org._id.toString(),
    name: org.name,
    owner: {
      firstName: org.owner.firstName,
      lastName: org.owner.lastName,
      clerkUserId: org.owner.clerkUserId,
    },
    status: org.status,
    createdAt: org.createdAt.toISOString(),
    email: org.email,
    phone: org.phone,
    members: (org.members || []).map((member: any) => ({
      _id: member._id.toString(),
      firstName: member.firstName,
      lastName: member.lastName,
      email: member.email,
      role: member.role,
      specialty: member.specialty,
    })),
  }));

  return <ManageClinicsPageContent allOrgs={serializedOrgs} />;
};

export default ManageClinicsPage;