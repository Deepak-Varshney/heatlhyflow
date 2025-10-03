import AppointmentBooking from '@/components/appointment-form';
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import AppointmentListingPage from '@/features/appointments/components/appointment-listing';
import { searchParamsCache } from '@/lib/searchparams';
import { IPatient } from '@/models/Patient';
import { IUser } from '@/models/User';
import { getAllDoctors } from '@/utilties/doctors';
import { getAllPatients } from '@/utilties/patients';
import { SearchParams } from 'nuqs/server';
import { Suspense } from 'react';

export const metadata = {
    title: 'Dashboard: Patients'
};

type pageProps = {
    searchParams: Promise<SearchParams>;
};


export default async function Page(props: pageProps) {
    const searchParams = await props.searchParams;
    // Allow nested RSCs to access the search params (in a type-safe way)
    searchParamsCache.parse(searchParams);

    const patients: IPatient[] = await getAllPatients()
    const doctors: IUser[] = await getAllDoctors()

    return (
        <PageContainer scrollable={false}>
            <div className='flex flex-1 flex-col space-y-4'>
                <div className='flex items-start justify-between'>
                    <Heading
                        title='Appointments'
                        description='Manage appointments'
                    />
                    <AppointmentBooking
                        patients={patients}
                        doctors={doctors}
                    />
                </div>
                <Separator />
                <Suspense
                    // key={key}
                    fallback={
                        <DataTableSkeleton columnCount={5} rowCount={8} filterCount={2} />
                    }
                >
                    <AppointmentListingPage />
                </Suspense>
            </div>
        </PageContainer>
    );
}
