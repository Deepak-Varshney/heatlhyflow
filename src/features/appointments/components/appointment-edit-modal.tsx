'use client';

import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { updateAppointment } from '@/app/actions/appointment-actions';
import { useRouter } from 'next/navigation';

interface AppointmentEditModalProps {
  appointmentId: string;
  currentStatus?: string;
  currentReason?: string;
  currentNotes?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AppointmentEditModal({
  appointmentId,
  currentStatus,
  currentReason,
  currentNotes,
  open,
  onOpenChange
}: AppointmentEditModalProps) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus || 'scheduled');
  const [reason, setReason] = useState(currentReason || '');
  const [notes, setNotes] = useState(currentNotes || '');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setStatus(currentStatus || 'scheduled');
    setReason(currentReason || '');
    setNotes(currentNotes || '');
  }, [open, currentStatus, currentReason, currentNotes]);

  const handleSave = async () => {
    setIsSaving(true);
    const result = await updateAppointment(appointmentId, {
      status: status as any,
      reason,
      notes,
    });
    if (result.success) {
      toast.success('Appointment updated.');
      onOpenChange(false);
      router.refresh();
    } else {
      toast.error(result.error || 'Unable to update appointment.');
    }
    setIsSaving(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-lg'>
        <DialogHeader>
          <DialogTitle>Edit Appointment</DialogTitle>
          <DialogDescription>Update status or notes for this visit.</DialogDescription>
        </DialogHeader>

        <div className='space-y-4'>
          <div>
            <p className='text-sm font-medium'>Status</p>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className='mt-2'>
                <SelectValue placeholder='Select status' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='scheduled'>Scheduled</SelectItem>
                <SelectItem value='completed'>Completed</SelectItem>
                <SelectItem value='cancelled'>Cancelled</SelectItem>
                <SelectItem value='no-show'>No Show</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <p className='text-sm font-medium'>Reason</p>
            <Textarea
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              className='mt-2'
              placeholder='Add a reason (optional)'
            />
          </div>
          <div>
            <p className='text-sm font-medium'>Notes</p>
            <Textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              className='mt-2'
              placeholder='Add internal notes (optional)'
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
