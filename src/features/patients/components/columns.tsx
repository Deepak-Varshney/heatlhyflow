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
      placeholder: 'Search...',
      variant: 'text',
    },
    enableColumnFilter: true,
  },

  {
    accessorKey: 'RecentTreatment',
    header: "Recent Treatment"
  },
  {
    accessorKey: 'phoneNumber',
    id: 'phone',
    header: 'Phone Number',
    cell: ({ cell }) => (
      <div className="line-clamp-2 text-muted-foreground">
        {cell.getValue<string>()}
      </div>
    ),
  },
  {
    header: "Prescription"
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
    )
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
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

