'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

type AppointmentItem = {
  _id: string;
  startTime: string;
  patient?: { firstName?: string; lastName?: string };
  doctor?: { firstName?: string; lastName?: string };
};

type RecentAppointmentsCardProps = {
  appointments: AppointmentItem[];
  className?: string;
};

const DEFAULT_LIMIT = 5;

export default function RecentAppointmentsCard({
  appointments,
  className
}: RecentAppointmentsCardProps) {
  const [expanded, setExpanded] = useState(false);
  const visibleCount = expanded ? DEFAULT_LIMIT * 2 : DEFAULT_LIMIT;
  const visibleAppointments = appointments.slice(0, visibleCount);
  const canExpand = appointments.length > DEFAULT_LIMIT;

  return (
    <Card className={cn('xl:col-span-4', className)}>
      <CardHeader>
        <CardTitle>Recent Appointments</CardTitle>
        <CardDescription>Latest visits in the selected range</CardDescription>
      </CardHeader>
      <CardContent className='space-y-3'>
        {visibleAppointments.length === 0 ? (
          <p className='text-sm text-muted-foreground'>No appointments found.</p>
        ) : (
          visibleAppointments.map((appt) => (
            <div
              key={appt._id}
              className='flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border/60 px-3 py-2'
            >
              <div>
                <p className='text-sm font-medium'>
                  {appt.patient?.firstName} {appt.patient?.lastName}
                </p>
                <p className='text-xs text-muted-foreground'>
                  Dr. {appt.doctor?.firstName} {appt.doctor?.lastName}
                </p>
              </div>
              <Badge variant='outline'>
                {new Date(appt.startTime).toLocaleString()}
              </Badge>
              <Link href={`/dashboard/appointments/${appt._id}/consult`}>
                <Button
                  variant='default'
                  className='cursor-pointer active:bg-primary/70'
                  size="sm"
                >
                  Start Treatment
                </Button>
              </Link>
            </div>
          ))
        )}

        {canExpand && !expanded && (
          <div className='flex justify-end'>
            <Button variant='ghost' size='sm' onClick={() => setExpanded(true)}>
              View more
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
