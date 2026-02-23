
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IconEdit, IconDotsVertical, IconTrash } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AlertModal } from '@/components/modal/alert-modal';
import { toast } from 'sonner';
import { deleteAppointment } from '@/app/actions/appointment-actions';
import { AppointmentViewModal } from './appointment-view-modal';
import { AppointmentEditModal } from './appointment-edit-modal';

interface CellActionProps {
  data: any; // Or IAppointment
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const onConfirmDelete = async () => {
    setLoading(true);
    const result = await deleteAppointment(data?._id);
    if (result.success) {
      toast.success('Appointment deleted successfully.');
      router.refresh();
      setDeleteOpen(false);
    } else {
      toast.error(result.error || 'Failed to delete appointment.');
    }
    setLoading(false);
  };

  return (
    <>
      <AlertModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={onConfirmDelete}
        loading={loading}
      />
      <AppointmentViewModal
        appointmentId={data?._id}
        open={viewOpen}
        onOpenChange={setViewOpen}
      />
      <AppointmentEditModal
        appointmentId={data?._id}
        currentStatus={data?.status}
        currentReason={data?.reason}
        currentNotes={data?.notes}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
      {/* Dropdown Menu */}
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <IconDotsVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <DropdownMenuItem onClick={() => setViewOpen(true)}>
            <IconEdit className="mr-2 h-4 w-4" />
            View
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setEditOpen(true)}>
            <IconEdit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setDeleteOpen(true)}>
            <IconTrash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
