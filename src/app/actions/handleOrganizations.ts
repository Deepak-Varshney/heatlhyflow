'use server';

import { currentUser } from '@clerk/nextjs/server';
import connectDB from '../../lib/mongodb';
import Organization from '../../models/Organization';
import User from '../../models/User';
import { setCurrentOrganizationId, getCurrentOrganizationId } from '../../lib/organization-utils';
import { isSuperAdmin, getUserAccessibleOrganizations } from '../../lib/superadmin-helpers';

export async function getAllOrganizations() {
  const user = await currentUser();
  if (!user) throw new Error('Not authenticated');

  await connectDB();
  return getUserAccessibleOrganizations(user.id);
}

export async function getUserOrganizationFromMongoDB() {
  const user = await currentUser();
  if (!user) return null;

  await connectDB();
  const userDoc = await User.findOne({ clerkUserId: user.id });
  if (userDoc?.organization) {
    const org = await Organization.findById(userDoc.organization).lean() as any;
    if (org && org.isActive) {
      return {
        id: org._id.toString(),
        name: org.name,
        slug: org.slug,
      };
    }
  }

  return null;
}

export async function createOrganization(data: {
  name: string;
  slug?: string;
  description?: string;
  address?: string;
  contactEmail?: string;
  contactPhone?: string;
  type?: "CLINIC" | "HOSPITAL" | "PRIVATE_PRACTICE" | "NURSING_HOME";
}) {
  const user = await currentUser();
  if (!user) throw new Error('Not authenticated');
  const role = user.publicMetadata?.role as string;
  if (role !== 'ADMIN' && role !== 'SUPERADMIN' && role !== 'DEVIL') {
    throw new Error('Unauthorized: Admin access required');
  }

  await connectDB();

  const slug = (data.slug || data.name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  const existing = await Organization.findOne({ slug });
  if (existing) {
    throw new Error('Organization with this slug already exists');
  }

  const org = await Organization.create({
    name: data.name,
    slug,
    description: data.description || '',
    address: data.address || '',
    contactEmail: data.contactEmail || '',
    contactPhone: data.contactPhone || '',
    type: data.type || 'CLINIC',
    isActive: true,
  });

  return {
    id: org._id.toString(),
    name: org.name,
    slug: org.slug,
    description: org.description,
    address: org.address,
    contactEmail: org.contactEmail,
    contactPhone: org.contactPhone,
    isActive: org.isActive,
  };
}

export async function updateOrganization(orgId: string, data: {
  name?: string;
  slug?: string;
  description?: string;
  address?: string;
  contactEmail?: string;
  contactPhone?: string;
  isActive?: boolean;
}) {
  const user = await currentUser();
  if (!user) throw new Error('Not authenticated');
  const role = user.publicMetadata?.role as string;
  if (role !== 'ADMIN' && role !== 'SUPERADMIN' && role !== 'DEVIL') {
    throw new Error('Unauthorized: Admin access required');
  }

  await connectDB();

  if (data.slug) {
    const existing = await Organization.findOne({ slug: data.slug, _id: { $ne: orgId } });
    if (existing) {
      throw new Error('Organization with this slug already exists');
    }
  }

  const org = await Organization.findByIdAndUpdate(
    orgId,
    { ...data, updatedAt: new Date() },
    { new: true, runValidators: true }
  );

  if (!org) {
    throw new Error('Organization not found');
  }

  return {
    id: org._id.toString(),
    name: org.name,
    slug: org.slug,
    description: org.description,
    address: org.address,
    contactEmail: org.contactEmail,
    contactPhone: org.contactPhone,
    isActive: org.isActive,
  };
}

export async function switchOrganization(organizationId: string) {
  const user = await currentUser();
  if (!user) throw new Error('Not authenticated');

  await connectDB();
  const org = await Organization.findById(organizationId);
  if (!org || !org.isActive) {
    throw new Error('Organization not found or inactive');
  }

  await setCurrentOrganizationId(organizationId);

  return {
    id: org._id.toString(),
    name: org.name,
    slug: org.slug,
  };
}

export async function getUserDefaultOrganization() {
  await connectDB();

  const org = await Organization.findOne({ isActive: true }).sort({ createdAt: 1 });
  if (!org) {
    const defaultOrg = await Organization.create({
      name: 'Default Organization',
      slug: 'default',
      description: 'Default organization',
      isActive: true,
    });

    return {
      id: defaultOrg._id.toString(),
      name: defaultOrg.name,
      slug: defaultOrg.slug,
    };
  }

  return {
    id: org._id.toString(),
    name: org.name,
    slug: org.slug,
  };
}

export async function getCurrentOrganizationFromCookie() {
  const orgId = await getCurrentOrganizationId();
  if (!orgId) return null;

  await connectDB();
  const org = await Organization.findById(orgId).lean() as any;
  if (!org) return null;

  return {
    id: org._id.toString(),
    name: org.name,
    slug: org.slug,
  };
}
