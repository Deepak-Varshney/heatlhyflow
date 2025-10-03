'use client';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action'; // We will create this component
import { IPatient } from '@/models/Patient';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';

export const columns: ColumnDef<IPatient>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'firstName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Full Name" />
    ),
    cell: ({ row }) => {
      const patient = row.original;
      return <div>{`${patient.firstName} ${patient.lastName}`}</div>;
    },
    // We enable filtering on a virtual 'name' field in the server action
    meta: {
      label: 'Patient Name',
      placeholder: 'Search name...',
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
    header: 'Phone Number',
    meta: {
      label: 'Patient Name',
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

