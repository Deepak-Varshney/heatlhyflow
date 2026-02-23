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

type PatientItem = {
  _id: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  createdAt: string;
};

type RecentPatientsCardProps = {
  patients: PatientItem[];
  className?: string;
};

const DEFAULT_LIMIT = 5;

export default function RecentPatientsCard({
  patients,
  className
}: RecentPatientsCardProps) {
  const [expanded, setExpanded] = useState(false);
  const visibleCount = expanded ? DEFAULT_LIMIT * 2 : DEFAULT_LIMIT;
  const visiblePatients = patients.slice(0, visibleCount);
  const canExpand = patients.length > DEFAULT_LIMIT;

  return (
    <Card className={cn('xl:col-span-3', className)}>
      <CardHeader>
        <CardTitle>Recent Patients</CardTitle>
        <CardDescription>Newest records in the selected range</CardDescription>
      </CardHeader>
      <CardContent className='space-y-3'>
        {visiblePatients.length === 0 ? (
          <p className='text-sm text-muted-foreground'>No patients found.</p>
        ) : (
          visiblePatients.map((patient) => (
            <div key={patient._id} className='flex items-center justify-between gap-3'>
              <div>
                <p className='text-sm font-medium'>
                  {patient.firstName} {patient.lastName}
                </p>
                <p className='text-xs text-muted-foreground'>
                  {patient.phoneNumber}
                </p>
              </div>
              <Badge variant='secondary'>
                {new Date(patient.createdAt).toLocaleDateString()}
              </Badge>
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
