
'use client';

import { useRouter } from 'next/navigation';
import {
  IconEdit,
  IconDotsVertical,
  IconTrash,
  IconDownload,
} from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AlertModal } from '@/components/modal/alert-modal';
import {
  useAppointmentPrint,
  useAppointmentDelete,
} from '../hooks';
import { APPOINTMENT_STATUS } from '../utils';

interface CellActionProps {
  data: {
    _id: string;
    status?: string;
  };
}


/**
 * Action dropdown component for appointment row
 * Provides edit, view, print, and delete actions
 */
export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();

  // Custom hooks for managing appointment actions
  const { handlePrint, isGeneratingPDF } = useAppointmentPrint();
  const { deleteOpen, setDeleteOpen, loading, handleConfirmDelete } =
    useAppointmentDelete();

  // Check if appointment is completed (only then show print options)
  const isCompleted =
    String(data?.status || '')
      .toLowerCase() === APPOINTMENT_STATUS.COMPLETED;

  // Handle delete confirmation
  const onDeleteConfirm = async () => {
    await handleConfirmDelete(data._id);
  };

  return (
    <>
      <AlertModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={onDeleteConfirm}
        loading={loading}
      />

      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <IconDotsVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          {/* View Details */}
          <DropdownMenuItem
            onClick={() =>
              router.push(`/dashboard/appointments/${data._id}/consult`)
            }
          >
            <IconEdit className="mr-2 h-4 w-4" />
            View
          </DropdownMenuItem>

          {/* Edit Prescription */}
          <DropdownMenuItem
            onClick={() =>
              router.push(
                `/dashboard/appointments/${data._id}/consult?editPrescription=1`
              )
            }
          >
            <IconEdit className="mr-2 h-4 w-4" />
            Edit Prescription
          </DropdownMenuItem>

          {/* Print Options (only for completed appointments) */}
          {isCompleted && (
            <>
              <DropdownMenuItem
                onClick={() => handlePrint(data._id, 'opd')}
                disabled={isGeneratingPDF}
              >
                <IconDownload className="mr-2 h-4 w-4" />
                {isGeneratingPDF ? 'Generating...' : 'Download OPD Card'}
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => handlePrint(data._id, 'invoice')}
                disabled={isGeneratingPDF}
              >
                <IconDownload className="mr-2 h-4 w-4" />
                {isGeneratingPDF ? 'Generating...' : 'Download Invoice'}
              </DropdownMenuItem>
            </>
          )}

          {/* Delete */}
          <DropdownMenuItem onClick={() => setDeleteOpen(true)}>
            <IconTrash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
