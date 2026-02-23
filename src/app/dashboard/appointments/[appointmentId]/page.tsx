import PageContainer from '@/components/layout/page-container';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getAppointmentDetails } from '@/actions/appointment-actions';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';

export default async function AppointmentDetailsPage({
  params,
}: {
  params: Promise<{ appointmentId: string }>;
}) {
  const { appointmentId } = await params;
  const appointment = await getAppointmentDetails(appointmentId);

  if (!appointment) {
    notFound();
  }

  const start = new Date(appointment.startTime);
  const end = new Date(appointment.endTime);

  return (
    <PageContainer>
      <div className='flex flex-1 flex-col gap-6'>
        <div>
          <h1 className='text-2xl font-semibold tracking-tight'>Appointment Details</h1>
          <p className='text-sm text-muted-foreground'>Review visit details and clinical notes.</p>
        </div>

        <div className='grid gap-4 lg:grid-cols-3'>
          <Card className='lg:col-span-2'>
            <CardHeader>
              <CardTitle>Visit Summary</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div>
                <p className='text-xs uppercase tracking-wide text-muted-foreground'>Patient</p>
                <p className='text-lg font-semibold'>
                  {appointment.patient?.firstName} {appointment.patient?.lastName}
                </p>
              </div>
              <div>
                <p className='text-xs uppercase tracking-wide text-muted-foreground'>Doctor</p>
                <p className='text-lg font-semibold'>
                  Dr. {appointment.doctor?.firstName} {appointment.doctor?.lastName}
                </p>
              </div>
              <div>
                <p className='text-xs uppercase tracking-wide text-muted-foreground'>Schedule</p>
                <p className='text-sm font-medium'>
                  {format(start, 'PPP')} · {format(start, 'p')} - {format(end, 'p')}
                </p>
              </div>
              <div>
                <p className='text-xs uppercase tracking-wide text-muted-foreground'>Status</p>
                <Badge variant='secondary'>{appointment.status}</Badge>
              </div>
              {appointment.reason && (
                <div>
                  <p className='text-xs uppercase tracking-wide text-muted-foreground'>Reason</p>
                  <p className='text-sm'>{appointment.reason}</p>
                </div>
              )}
              {appointment.notes && (
                <div>
                  <p className='text-xs uppercase tracking-wide text-muted-foreground'>Notes</p>
                  <p className='text-sm'>{appointment.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Prescription</CardTitle>
            </CardHeader>
            <CardContent className='space-y-3 text-sm'>
              {appointment.prescription ? (
                <>
                  <p className='text-muted-foreground'>Diagnosis</p>
                  <p className='font-medium'>{appointment.prescription.diagnosis || 'N/A'}</p>
                  <p className='text-muted-foreground'>Chief Complaint</p>
                  <p className='font-medium'>{appointment.prescription.chiefComplaint || 'N/A'}</p>
                </>
              ) : (
                <p className='text-muted-foreground'>No prescription added yet.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
