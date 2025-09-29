import { Metadata } from 'next';
import SignInViewPage from '@/features/auth/components/sign-in-view';

export const metadata: Metadata = {
  title: 'Sign In | HealthyFlow',
  description: 'Securely access your HealthyFlow account.'
};


export default async function Page() {
  return <SignInViewPage />;
}
