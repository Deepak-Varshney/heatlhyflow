import { notFound } from 'next/navigation';
import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import { getPatientById } from '@/actions/patient-actions';
import UserDetailPage from '@/components/user-details';
import { getUserById } from '@/actions/superadmin-actions';

export const metadata = {
  title: 'SUPERADMIN : User View',
};
type PageProps = { params: Promise<{ userId: string }> };
export default async function Page(props: PageProps) {
  const params = await props.params;
  const user = await getUserById(params.userId);

  if (!user) {
    notFound();
  }

  return (
    <PageContainer scrollable>
      <div className="flex-1 space-y-4">
        <Suspense fallback={<FormCardSkeleton />}>
          <UserDetailPage user={user} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
