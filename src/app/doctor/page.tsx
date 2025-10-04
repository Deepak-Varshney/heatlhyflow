import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function Page() {
    const { userId, sessionClaims } = await auth();
    const role = (sessionClaims as any)?.publicMetadata?.role as string;
    if (!userId) {
        return redirect('/auth/sign-in');
    } else {
        redirect('/doctor/dashboard');
    }
}
