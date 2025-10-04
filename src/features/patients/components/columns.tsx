'use client';
import { Column, ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action'; // We will create this component
import { IPatient } from '@/models/Patient';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';

export const columns: ColumnDef<IPatient>[] = [
  {
    id: 'name',
    accessorKey: 'firstName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Full Name" />
    ),
    cell: ({ row }) => {
      const patient = row.original;
      return <div>{`${patient.firstName} ${patient.lastName}`}</div>;
    },
    meta: {
      label: 'Patient Name',
      placeholder: 'Global Search...',
      variant: 'text',
    },
    enableColumnFilter: true,
  },

  {
    id: 'address',
    accessorKey: 'address',
    header: ({ column }: { column: Column<IPatient, unknown> }) => (
      <DataTableColumnHeader column={column} title="Address" />
    ),
    cell: ({ cell }) => (
      <div className="line-clamp-2 text-muted-foreground">
        {cell.getValue<string>()}
      </div>
    ),
    meta: {
      label: 'Address',
      placeholder: 'Search Address',
      variant: 'text',
    },
    enableColumnFilter: true,
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
  {
    accessorKey: 'phoneNumber',
    id:'phone',
    header: 'Phone Number',
    cell: ({ cell }) => (
      <div className="line-clamp-2 text-muted-foreground">
        {cell.getValue<string>()}
      </div>
    ),
    meta: {
      label: 'Phone Number',
      placeholder: 'Search number...',
      variant: 'text',
    },
    enableColumnFilter: true,
  },
  {
    accessorKey: 'dateOfBirth',
    header: 'Date of Birth',
    cell: ({ cell }) => {
      const date = cell.getValue<string>();
      return <span>{new Date(date).toLocaleDateString()}</span>;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];

