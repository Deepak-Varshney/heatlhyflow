'use client';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Product } from '@/constants/data';
import { Column, ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { format } from 'date-fns';


export const columns: ColumnDef<any>[] = [
  {
    header: 'Full Name',
    cell: ({ row }) => <div>{row.original.firstName} {row.original.lastName}</div>

  },
  {
    header: 'DOB',
    cell: ({ row }) => <div>{format(new Date(row.original.dateOfBirth), "dd/MM/yyyy")}</div>
  },
  {
    accessorKey: 'phoneNumber',
    header: "Phone"
  },
  {
    accessorKey: 'address',
    header: "Address"
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
