// import { notFound } from 'next/navigation';
// import { getPatientById } from '@/actions/patient-actions';
// import PatientDetailsClientPage from '@/components/patient-details';

// export default async function PatientPage({ params }: { params: { id: string } }) {
//     // 1. Server par patient ka data fetch karein
//     const patient = await getPatientById(params.id);

//     // 2. Agar patient nahi milta hai, to 404 page dikhayein
//     if (!patient) {
//         notFound();
//     }

//     // 3. Fetched data ko Client Component mein pass karein
//     return <PatientDetailsClientPage patient={patient} />;
// }



import { notFound } from 'next/navigation';
import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import { getPatientById } from '@/actions/patient-actions';
import PatientDetailsClientPage from '@/components/patient-details';

export const metadata = {
    title: 'Dashboard : Patient View',
};
type PageProps = { params: Promise<{ Id: string }> };
export default async function Page(props: PageProps) {
    const params = await props.params;
    const patient = await getPatientById(params.Id);

    if (!patient) {
        notFound();
    }

    return (
        <PageContainer scrollable>
            <div className="flex-1 space-y-4">
                <Suspense fallback={<FormCardSkeleton />}>
                    <PatientDetailsClientPage patient={patient} />
                </Suspense>
            </div>
        </PageContainer>
    );
}
