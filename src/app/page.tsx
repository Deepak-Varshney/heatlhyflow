import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function Page() {
  const { userId, sessionClaims } = await auth();
  const role = (sessionClaims as any)?.publicMetadata?.role as string;
  
  if (!userId) {
    return redirect('/auth/sign-in');
  } else if (role === 'SUPERADMIN') {
    redirect('/superadmin/dashboard');
  } else if (role === 'DOCTOR') {
    redirect('/doctor/dashboard');
  } else if (role === 'RECEPTIONIST') {
    redirect('/receptionist/dashboard');
  }
}
