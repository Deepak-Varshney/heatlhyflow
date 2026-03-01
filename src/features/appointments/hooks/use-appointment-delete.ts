/**
 * Custom hook for appointment deletion functionality
 */

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { deleteAppointment } from '@/app/actions/appointment-actions';

export interface UseAppointmentDeleteOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const useAppointmentDelete = (options?: UseAppointmentDeleteOptions) => {
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirmDelete = async (appointmentId: string): Promise<void> => {
    setLoading(true);

    try {
      const result = await deleteAppointment(appointmentId);

      if (result.success) {
        toast.success('Appointment deleted successfully.');
        setDeleteOpen(false);
        router.refresh();
        options?.onSuccess?.();
      } else {
        const errorMessage = result.error || 'Failed to delete appointment.';
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred while deleting the appointment.';

      console.error('Appointment deletion failed:', error);
      options?.onError?.(
        error instanceof Error ? error : new Error(errorMessage)
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    deleteOpen,
    setDeleteOpen,
    loading,
    handleConfirmDelete,
  };
};
