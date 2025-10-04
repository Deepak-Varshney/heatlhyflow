import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function Dashboard() {
  const { userId, sessionClaims } = await auth();
  const role = (sessionClaims as any)?.publicMetadata?.role as string;
  if (!userId) {
    return redirect('/auth/sign-in');
  } else if (role === 'SUPERADMIN') {
    redirect('/superadmin/dashboard');
  } else {
    redirect('/dashboard/overview');
  }
}
