'use client';

import { useState, useTransition } from 'react';
import { inviteOrganizationMember } from '@/actions/organization-actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

export default function InviteMemberForm() {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'DOCTOR' | 'RECEPTIONIST' | 'ADMIN'>('DOCTOR');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      const result = await inviteOrganizationMember({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        role,
      });

      if (!result.success) {
        setError(result.error || 'Failed to send invitation.');
        return;
      }

      setSuccess('Invitation sent successfully.');
      setFirstName('');
      setLastName('');
      setEmail('');
      setRole('DOCTOR');
    });
  };

  return (
    <form onSubmit={handleSubmit} className='grid gap-4 lg:grid-cols-4'>
      <div>
        <label className='text-xs font-medium text-muted-foreground'>First name</label>
        <Input value={firstName} onChange={(event) => setFirstName(event.target.value)} required />
      </div>
      <div>
        <label className='text-xs font-medium text-muted-foreground'>Last name</label>
        <Input value={lastName} onChange={(event) => setLastName(event.target.value)} required />
      </div>
      <div>
        <label className='text-xs font-medium text-muted-foreground'>Email</label>
        <Input type='email' value={email} onChange={(event) => setEmail(event.target.value)} required />
      </div>
      <div>
        <label className='text-xs font-medium text-muted-foreground'>Role</label>
        <Select value={role} onValueChange={(value) => setRole(value as typeof role)}>
          <SelectTrigger>
            <SelectValue placeholder='Select role' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='DOCTOR'>Doctor</SelectItem>
            <SelectItem value='RECEPTIONIST'>Receptionist</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className='lg:col-span-4 flex flex-wrap items-center gap-3'>
        <Button type='submit' disabled={pending}>
          {pending ? 'Sending...' : 'Send Invite'}
        </Button>
        {error && <p className='text-sm text-rose-600'>{error}</p>}
        {success && <p className='text-sm text-emerald-600'>{success}</p>}
      </div>
    </form>
  );
}
