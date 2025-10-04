// 'use client';
// import { PrintablePrescription } from '@/app/doctor/appointments/printable-prescription';
// import { AlertModal } from '@/components/modal/alert-modal';
// import { Button } from '@/components/ui/button';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuTrigger
// } from '@/components/ui/dropdown-menu';
// import { Product } from '@/constants/data';
// import { IAppointment } from '@/models/Appointment';
// import { IconEdit, IconDotsVertical, IconTrash, IconPrinter } from '@tabler/icons-react';
// import { useRouter } from 'next/navigation';
// import { useState } from 'react';

// interface CellActionProps {
//   data: IAppointment|any;
// }

// export const CellAction: React.FC<CellActionProps> = ({ data }) => {
//   const [loading] = useState(false);
//   const [open, setOpen] = useState(false);
//   const router = useRouter();

//   const onConfirm = async () => {};

//   return (
//     <>
//       <AlertModal
//         isOpen={open}
//         onClose={() => setOpen(false)}
//         onConfirm={onConfirm}
//         loading={loading}
//       />
//       <PrintablePrescription
//       appointment={data}
//       />
//       <DropdownMenu modal={false}>
//         <DropdownMenuTrigger asChild>
//           <Button variant='ghost' className='h-8 w-8 p-0'>
//             <span className='sr-only'>Open menu</span>
//             <IconDotsVertical className='h-4 w-4' />
//           </Button>
//         </DropdownMenuTrigger>
//         <DropdownMenuContent align='end'>
//           <DropdownMenuLabel>Actions</DropdownMenuLabel>

//           <DropdownMenuItem
//             onClick={() => router.push(`/doctor/appointments/${data._id}`)}
//           >
//             <IconEdit className='mr-2 h-4 w-4' /> view
//           </DropdownMenuItem>
//           <DropdownMenuItem
//             onClick={() => router.push(`/doctor/appointments/${data._id}`)}
//           >
//             <IconPrinter className='mr-2 h-4 w-4' /> Print
//           </DropdownMenuItem>
//           <DropdownMenuItem onClick={() => setOpen(true)}>
//             <IconTrash className='mr-2 h-4 w-4' /> Delete
//           </DropdownMenuItem>
//         </DropdownMenuContent>
//       </DropdownMenu>
//     </>
//   );
// };


'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

import { IconEdit, IconDotsVertical, IconTrash, IconPrinter } from '@tabler/icons-react';
import { PrintablePrescription } from '@/app/doctor/appointments/printable-prescription';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

interface CellActionProps {
  data: any; // Or IAppointment
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [printModalOpen, setPrintModalOpen] = useState(false);
  const router = useRouter();

  const handlePrint = () => {
    // Optional: Delay to allow modal content to fully render
    setTimeout(() => {
      window.print();
    }, 100);
  };

  return (
    <>
      {/* Print Modal */}
      <Dialog open={printModalOpen} onOpenChange={setPrintModalOpen}>
        <DialogContent className="max-w-4xl w-full print:block">
          <DialogHeader className="print:hidden">
            <DialogTitle>Prescription Preview</DialogTitle>
          </DialogHeader>

          <div className="max-h-[70vh] overflow-auto print:overflow-visible print:h-auto">
            <PrintablePrescription appointment={data} />
          </div>

          <DialogFooter className="print:hidden">
            <Button variant="secondary" onClick={() => setPrintModalOpen(false)}>
              Close
            </Button>
            <Button onClick={handlePrint}>
              <IconPrinter className="mr-2 h-4 w-4" />
              Print
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dropdown Menu */}
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <IconDotsVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <DropdownMenuItem onClick={() => router.push(`/doctor/appointments/${data?._id}`)}>
            <IconEdit className="mr-2 h-4 w-4" />
            View
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => setPrintModalOpen(true)}>
            <IconPrinter className="mr-2 h-4 w-4" />
            Print
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => {/* handle delete */}}>
            <IconTrash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
