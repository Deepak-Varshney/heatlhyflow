'use client';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Product } from '@/constants/data';
import { Column, ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { format } from 'date-fns';


export const columns: ColumnDef<any>[] = [
 
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
