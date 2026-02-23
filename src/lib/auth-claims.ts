import { auth } from '@clerk/nextjs/server';

export type SessionPublicMetadata = {
  organizationId?: string;
  organizationStatus?: string;
  role?: string;
  phone?: string;
  address?: string;
};

export function getPublicMetadataFromClaims(
  sessionClaims: unknown
): SessionPublicMetadata {
  const publicMetadata = (sessionClaims as any)?.publicMetadata || {};

  return {
    organizationId: publicMetadata.organizationId as string | undefined,
    organizationStatus: publicMetadata.organizationStatus as string | undefined,
    role: publicMetadata.role as string | undefined,
    phone: publicMetadata.phone as string | undefined,
    address: publicMetadata.address as string | undefined,
  };
}

export async function getSessionPublicMetadata(): Promise<SessionPublicMetadata> {
  const { sessionClaims } = await auth();
  return getPublicMetadataFromClaims(sessionClaims);
}

export async function getSessionRole(): Promise<string | undefined> {
  const { role } = await getSessionPublicMetadata();
  return role;
}

export async function getSessionOrganizationId(): Promise<string | undefined> {
  const { organizationId } = await getSessionPublicMetadata();
  return organizationId;
}
