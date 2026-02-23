import PageContainer from '@/components/layout/page-container';
import OverviewSkeleton from '@/components/dashboard/overview-skeleton';

export default function OverviewLoading() {
  return (
    <PageContainer>
      <OverviewSkeleton />
    </PageContainer>
  );
}
