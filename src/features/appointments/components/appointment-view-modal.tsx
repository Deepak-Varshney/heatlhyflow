'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { getAppointmentDetails } from '@/app/actions/appointment-actions';

interface AppointmentViewModalProps {
  appointmentId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type AppointmentDetails = {
  _id: string;
  startTime: string;
  endTime: string;
  status: string;
  reason?: string;
  notes?: string;
  totalAmount?: number;
  patient?: { _id?: string; firstName?: string; lastName?: string };
  doctor?: { firstName?: string; lastName?: string };
};

export function AppointmentViewModal({
  appointmentId,
  open,
  onOpenChange
}: AppointmentViewModalProps) {
  const router = useRouter();
  const [appointment, setAppointment] = useState<AppointmentDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    const loadAppointment = async () => {
      setIsLoading(true);
      const data = await getAppointmentDetails(appointmentId);
      setAppointment(data as AppointmentDetails | null);
      setIsLoading(false);
    };
    loadAppointment();
  }, [appointmentId, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-3xl'>
        <DialogHeader>
          <DialogTitle>Appointment Details</DialogTitle>
          <DialogDescription>Review schedule, patient, and status.</DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className='py-10 text-center text-sm text-muted-foreground'>Loading appointment...</div>
        ) : !appointment ? (
          <div className='py-10 text-center text-sm text-muted-foreground'>Appointment not found.</div>
        ) : (
          <>
            <div className='space-y-4'>
              <div className='flex flex-wrap items-center justify-between gap-3'>
                <div>
                  <p className='text-sm text-muted-foreground'>Patient</p>
                  <p className='text-xl font-semibold'>
                    {appointment.patient?.firstName} {appointment.patient?.lastName}
                  </p>
                </div>
                <div className='flex gap-2'>
                  <Button 
                    variant='default' 
                    onClick={() => router.push(`/dashboard/appointments/${appointmentId}/consult`)}
                  >
                    Start Treatment
                  </Button>
                  <Button variant='outline' onClick={() => onOpenChange(false)}>Close</Button>
                </div>
              </div>

            <div className='grid gap-4 md:grid-cols-2'>
              <Card>
                <CardHeader>
                  <CardTitle>Schedule</CardTitle>
                </CardHeader>
                <CardContent className='space-y-2 text-sm'>
                  <div className='flex items-center justify-between'>
                    <span className='text-muted-foreground'>Doctor</span>
                    <span>
                      Dr. {appointment.doctor?.firstName} {appointment.doctor?.lastName}
                    </span>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='text-muted-foreground'>Date</span>
                    <span>{format(new Date(appointment.startTime), 'PPP')}</span>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='text-muted-foreground'>Time</span>
                    <span>
                      {format(new Date(appointment.startTime), 'p')} - {format(new Date(appointment.endTime), 'p')}
                    </span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Status</CardTitle>
                </CardHeader>
                <CardContent className='space-y-2 text-sm'>
                  <div className='flex items-center justify-between'>
                    <span className='text-muted-foreground'>Status</span>
                    <Badge variant='secondary'>{appointment.status}</Badge>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='text-muted-foreground'>Total Amount</span>
                    <span>{appointment.totalAmount ? `INR ${appointment.totalAmount}` : 'N/A'}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {(appointment.reason || appointment.notes) && (
              <Card>
                <CardHeader>
                  <CardTitle>Notes</CardTitle>
                </CardHeader>
                <CardContent className='space-y-3 text-sm'>
                  {appointment.reason && (
                    <div>
                      <p className='text-muted-foreground'>Reason</p>
                      <p>{appointment.reason}</p>
                    </div>
                  )}
                  {appointment.notes && (
                    <div>
                      <p className='text-muted-foreground'>Notes</p>
                      <p>{appointment.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
