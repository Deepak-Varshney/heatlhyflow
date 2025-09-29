import { Metadata } from 'next';
import SignUpViewPage from '@/features/auth/components/sign-up-view';

export const metadata: Metadata = {
  title: 'Create Account | HealthyFlow',
  description: 'Start your journey to better health management with HealthyFlow.'
};

export default async function Page() {
  return <SignUpViewPage/>;
}
