// import { notFound } from 'next/navigation';
// import { getAppointmentDetails } from '../../../../actions/appointment-actions';
// import ConsultationClientPage from '../consultation-clinic';
// import FormCardSkeleton from '@/components/form-card-skeleton';
// import PageContainer from '@/components/layout/page-container';
// import { Suspense } from 'react';

// export const metadata = {
//   title: 'Dashboard : Appointment View',
// };

// type PageProps = {
//   params: {
//     appointmentId: string;
//   };
// };

// export default async function Page({ params }: PageProps) {
//   const appointment = await getAppointmentDetails(params.appointmentId);

//   if (!appointment) {
//     notFound();
//   }

//   return (
//     <PageContainer scrollable>
//       <div className="flex-1 space-y-4">
//         <Suspense fallback={<FormCardSkeleton />}>
//           <ConsultationClientPage initialAppointment={appointment} />
//         </Suspense>
//       </div>
//     </PageContainer>
//   );
// }


import { notFound } from 'next/navigation';
import { getAppointmentDetails } from '../../../../actions/appointment-actions';
import ConsultationClientPage from '../consultation-clinic';
import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';

export const metadata = {
  title: 'Dashboard : Appointment View',
};

// ✅ Correct PageProps type — no Promise!
type PageProps = {
  params: {
    appointmentId: string;
  };
};

// ✅ Use the correct type
export default async function Page({ params }: PageProps) {
  const appointment = await getAppointmentDetails(params.appointmentId);

  if (!appointment) {
    notFound();
  }

  return (
    <PageContainer scrollable>
      <div className="flex-1 space-y-4">
        <Suspense fallback={<FormCardSkeleton />}>
          <ConsultationClientPage initialAppointment={appointment} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
