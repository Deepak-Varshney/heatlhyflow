'use client';
import { AlertModal } from '@/components/modal/alert-modal';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import type { IPatient } from '@/types/patient';
import { IconEdit, IconDotsVertical, IconTrash, IconCalendar } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { deletePatient } from '@/app/actions/patient-actions';
import { EditPatientDialog } from '@/components/edit-patient-dialog';
import { PatientViewModal } from './patient-view-modal';
import dynamic from 'next/dynamic';
import { getAllDoctors } from '@/app/actions/doctor-actions';

const AppointmentBooking = dynamic(() => import('@/components/appointment-form'), {
  ssr: false,
});

interface CellActionProps {
  data: IPatient;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [bookAppointmentOpen, setBookAppointmentOpen] = useState(false);
  const [doctors, setDoctors] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (bookAppointmentOpen) {
      getAllDoctors().then(setDoctors).catch(() => {
        toast.error('Failed to load doctors');
      });
    }
  }, [bookAppointmentOpen]);

  const onConfirm = async () => {
    setLoading(true);
    const result = await deletePatient(data._id);
    if (result.success) {
      toast.success('Patient deleted successfully.');
      router.refresh();
      setOpen(false);
    } else {
      toast.error(result.error || 'Failed to delete patient.');
    }
    setLoading(false);
  };

  const handleAppointmentSuccess = () => {
    setBookAppointmentOpen(false);
    toast.success('Appointment booked successfully!');
    router.refresh();
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
      />
      <PatientViewModal
        patientId={data._id}
        open={viewOpen}
        onOpenChange={setViewOpen}
      />
      <EditPatientDialog patient={data} open={editOpen} onOpenChange={setEditOpen} />
      
      {bookAppointmentOpen && (
        <AppointmentBooking
          patients={[data]}
          doctors={doctors}
          defaultPatientId={data._id}
          onSuccess={handleAppointmentSuccess}
          open={bookAppointmentOpen}
          onOpenChange={setBookAppointmentOpen}
        />
      )}

      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='h-8 w-8 p-0'>
            <span className='sr-only'>Open menu</span>
            <IconDotsVertical className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <DropdownMenuItem onClick={() => setViewOpen(true)}>
            <IconEdit className='mr-2 h-4 w-4' /> View
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setEditOpen(true)}>
            <IconEdit className='mr-2 h-4 w-4' /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setBookAppointmentOpen(true)}>
            <IconCalendar className='mr-2 h-4 w-4' /> Book Appointment
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <IconTrash className='mr-2 h-4 w-4' /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
