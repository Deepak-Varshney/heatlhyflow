import { Suspense } from 'react';
import PageContainer from '@/components/layout/page-container';
import PatientRegistrationDialog from '@/components/PatientRegistration';
import PatientListingPage from '@/features/patients/components/patient-listing';
import { searchParamsCache } from '@/lib/searchparams';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';

type PageProps = {
  searchParams: Promise<Record<string, string | string[]>>;
};

export default async function PatientsPage(props: PageProps) {
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  return (
    <PageContainer>
      <div className='flex flex-1 flex-col gap-6'>
        <div className='flex flex-wrap items-center justify-between gap-4'>
          <div>
            <h1 className='text-2xl font-semibold tracking-tight'>Patients</h1>
            <p className='text-sm text-muted-foreground'>
              Search, register, and manage patient records for your clinic.
            </p>
          </div>
          <PatientRegistrationDialog />
        </div>

        <div className='rounded-xl border border-border/60 bg-background p-2'>
          <Suspense
            fallback={
              <DataTableSkeleton columnCount={6} rowCount={8} filterCount={2} />
            }
          >
            <PatientListingPage />
          </Suspense>
        </div>
      </div>
    </PageContainer>
  );
}
