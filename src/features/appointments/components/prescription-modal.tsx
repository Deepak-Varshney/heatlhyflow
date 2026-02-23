'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PrescriptionForm } from '@/components/prescription-form';

interface PrescriptionModalProps {
  appointmentId: string;
  patientId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaveSuccess: () => void;
}

export function PrescriptionModal({
  appointmentId,
  patientId,
  open,
  onOpenChange,
  onSaveSuccess,
}: PrescriptionModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='w-[78vw] max-w-none max-h-[92vh] overflow-y-auto p-6'>
        <DialogHeader>
          <DialogTitle>Create Prescription & Treatment Plan</DialogTitle>
          <DialogDescription>
            Document patient complaint, diagnosis, prescribe medicines/tests, and finalize charges.
          </DialogDescription>
        </DialogHeader>

        <PrescriptionForm
          appointmentId={appointmentId}
          patientId={patientId}
          onSaveSuccess={() => {
            onSaveSuccess();
            onOpenChange(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
