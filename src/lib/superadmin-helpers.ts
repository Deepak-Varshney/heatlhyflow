import Organization from '@/models/Organization';
import User from '@/models/User';

type OrganizationSummary = {
  id: string;
  name: string;
  slug?: string;
  isActive?: boolean;
  status?: string;
};

export function isSuperAdmin(role?: string): boolean {
  return role === 'SUPERADMIN' || role === 'DEVIL';
}

export async function getUserAccessibleOrganizations(
  clerkUserId: string
): Promise<OrganizationSummary[]> {
  const user = await User.findOne({ clerkUserId }).lean();
  if (!user) return [];

  const orgs = isSuperAdmin(user.role)
    ? await Organization.find({}).lean()
    : await Organization.find({
        $or: [
          ...(user.organization ? [{ _id: user.organization }] : []),
          { members: user._id },
        ],
      }).lean();

  return orgs.map((org: any) => ({
    id: org._id.toString(),
    name: org.name,
    slug: org.slug,
    isActive: typeof org.isActive === 'boolean' ? org.isActive : org.status === 'ACTIVE',
    status: org.status,
  }));
}
