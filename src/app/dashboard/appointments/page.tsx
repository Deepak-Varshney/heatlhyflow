import { Suspense } from 'react';
import PageContainer from '@/components/layout/page-container';
import AppointmentListingPage from '@/features/appointments/components/appointment-listing';
import AppointmentBooking from '@/components/appointment-form';
import { getAllPatients } from '@/utilties/patients';
import { getAllDoctors } from '@/app/actions/doctor-actions';
import { searchParamsCache } from '@/lib/searchparams';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';

type PageProps = {
  searchParams: Promise<Record<string, string | string[]>>;
};

export default async function AppointmentsPage(props: PageProps) {
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);
  const patients = await getAllPatients();
  const doctors = await getAllDoctors();

  return (
    <PageContainer>
      <div className='flex flex-1 flex-col gap-6'>
        <div className='flex flex-wrap items-center justify-between gap-4'>
          <div>
            <h1 className='text-2xl font-semibold tracking-tight'>Appointments</h1>
            <p className='text-sm text-muted-foreground'>
              Schedule visits, review upcoming slots, and track appointment status.
            </p>
          </div>
          <AppointmentBooking patients={patients} doctors={doctors} />
        </div>

        <div className='rounded-xl border border-border/60 bg-background p-2'>
          <Suspense
            fallback={
              <DataTableSkeleton columnCount={5} rowCount={8} filterCount={2} />
            }
          >
            <AppointmentListingPage />
          </Suspense>
        </div>
      </div>
    </PageContainer>
  );
}
