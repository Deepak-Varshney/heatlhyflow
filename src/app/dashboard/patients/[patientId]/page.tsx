import PageContainer from '@/components/layout/page-container';
import PatientDetailsClientPage from '@/components/patient-details';
import { getPatientById } from '@/actions/patient-actions';
import { notFound } from 'next/navigation';

export default async function PatientDetailsPage({
  params,
}: {
  params: Promise<{ patientId: string }>;
}) {
  const { patientId } = await params;
  const patient = await getPatientById(patientId);

  if (!patient) {
    notFound();
  }

  return (
    <PageContainer>
      <PatientDetailsClientPage patient={patient} />
    </PageContainer>
  );
}
