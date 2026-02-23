import { cookies } from 'next/headers';

const ORGANIZATION_COOKIE_NAME = 'current_organization_id';
const ORGANIZATION_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

export async function setCurrentOrganizationId(organizationId: string) {
    const cookieStore = await cookies();
    cookieStore.set(ORGANIZATION_COOKIE_NAME, organizationId, {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: ORGANIZATION_COOKIE_MAX_AGE,
    });
}

export async function getCurrentOrganizationId(): Promise<string | null> {
    const cookieStore = await cookies();
    return cookieStore.get(ORGANIZATION_COOKIE_NAME)?.value ?? null;
}
