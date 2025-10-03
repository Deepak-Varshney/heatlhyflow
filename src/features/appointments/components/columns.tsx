'use client';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Product } from '@/constants/data';
import { Column, ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { IAppointment } from '@/models/Appointment';
import { format } from 'date-fns';
import { CheckCircle2, Text, XCircle } from 'lucide-react';
import Image from 'next/image';

export const columns: ColumnDef<IAppointment | any>[] = [
  {
    accessorKey:'patient',
    header: 'Patient',
    cell: ({ row }) => <div>{row.original.patientDetails.firstName} {row.original.patientDetails.lastName}</div>
    , meta: {
      label: 'Name',
      placeholder: 'Search name...',
      variant: 'text',
      icon: Text
    },
    enableColumnFilter: true
  },
  {
    header: 'Slot',
    cell: ({ row }) => <div>{format(new Date(row.original.startTime), "p")} - {format(new Date(row.original.endTime), "p")}</div>
  },
  {
    header: 'Doctor',
    cell: ({ row }) => <div>{row.original.doctorDetails.firstName} {row.original.doctorDetails.lastName}</div>
  },
  {
    id: 'status',
    header: 'Status',
    cell: ({ row }) => <Badge variant={row.original.status === 'scheduled' ? 'default' : 'destructive'}>{row.original.status}</Badge>
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
