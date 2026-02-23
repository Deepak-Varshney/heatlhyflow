'use client';

import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { getPatientById } from '@/app/actions/patient-actions';

interface PatientViewModalProps {
  patientId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type PatientAppointment = {
  _id: string;
  startTime: string;
  status: string;
  doctor?: {
    firstName?: string;
    lastName?: string;
  };
};

type PatientDetails = {
  _id: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  bp?: string;
  weight?: number;
  appointments: PatientAppointment[];
};

export function PatientViewModal({ patientId, open, onOpenChange }: PatientViewModalProps) {
  const [patient, setPatient] = useState<PatientDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    const loadPatient = async () => {
      setIsLoading(true);
      const data = await getPatientById(patientId);
      setPatient(data as PatientDetails | null);
      setIsLoading(false);
    };
    loadPatient();
  }, [open, patientId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Patient Details</DialogTitle>
          <DialogDescription>Review profile and recent appointments.</DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className='py-12 text-center text-sm text-muted-foreground'>Loading patient details...</div>
        ) : !patient ? (
          <div className='py-12 text-center text-sm text-muted-foreground'>Patient not found.</div>
        ) : (
          <div className='space-y-6'>
            <div className='flex flex-wrap items-center justify-between gap-3'>
              <div>
                <p className='text-sm text-muted-foreground'>Patient</p>
                <h3 className='text-2xl font-semibold'>
                  {patient.firstName} {patient.lastName}
                </h3>
              </div>
              <Button variant='outline' onClick={() => onOpenChange(false)}>Close</Button>
            </div>

            <div className='grid gap-4 md:grid-cols-2'>
              <Card>
                <CardHeader>
                  <CardTitle>Contact</CardTitle>
                </CardHeader>
                <CardContent className='space-y-2 text-sm'>
                  <div className='flex items-center justify-between'>
                    <span className='text-muted-foreground'>Email</span>
                    <span>{patient.email || 'N/A'}</span>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='text-muted-foreground'>Phone</span>
                    <span>{patient.phoneNumber || 'N/A'}</span>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='text-muted-foreground'>Address</span>
                    <span className='text-right'>{patient.address || 'N/A'}</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Vitals</CardTitle>
                </CardHeader>
                <CardContent className='space-y-2 text-sm'>
                  <div className='flex items-center justify-between'>
                    <span className='text-muted-foreground'>Date of Birth</span>
                    <span>
                      {patient.dateOfBirth ? format(new Date(patient.dateOfBirth), 'PPP') : 'N/A'}
                    </span>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='text-muted-foreground'>Blood Pressure</span>
                    <span>{patient.bp || 'N/A'}</span>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='text-muted-foreground'>Weight</span>
                    <span>{patient.weight ? `${patient.weight} kg` : 'N/A'}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Doctor</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {patient.appointments?.length ? (
                      patient.appointments.slice(0, 5).map((appt) => (
                        <TableRow key={appt._id}>
                          <TableCell>{format(new Date(appt.startTime), 'PPP p')}</TableCell>
                          <TableCell>
                            Dr. {appt.doctor?.firstName} {appt.doctor?.lastName}
                          </TableCell>
                          <TableCell>
                            <Badge variant='secondary'>{appt.status}</Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} className='text-center text-sm text-muted-foreground'>
                          No appointments found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
