import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function Dashboard() {
  const { userId, sessionClaims } = await auth();
  const role = (sessionClaims as any)?.publicMetadata?.role as string;
  if (!userId) {
    return redirect('/auth/sign-in');
  } else if (role === 'SUPERADMIN' || role === 'DEVIL') {
    redirect('/superadmin/dashboard');
  } else if (role === 'DOCTOR') {
    redirect('/dashboard/overview');
  } else if (role === 'RECEPTIONIST') {
    redirect('/dashboard/overview');
  } else if (role === 'UNASSIGNED' || !role) {
    redirect('/onboarding');
  } else {
    redirect('/dashboard/overview');
  }
}
