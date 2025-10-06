// "use client";

// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Printer } from "lucide-react";
// import { PrintablePrescription } from "./printable-prescription";

// export function PrintPreviewDialog({ isOpen, onClose, appointment }: { isOpen: boolean, onClose: () => void, appointment: any }) {
//   const handlePrint = () => {
//     // Dialog ke content ko print karne ke liye
//     const printContents = document.getElementById('printable-area')?.innerHTML;
//     const originalContents = document.body.innerHTML;
//     if (printContents) {
//       document.body.innerHTML = printContents;
//       window.print();
//       document.body.innerHTML = originalContents;
//       window.location.reload(); // Page ko original state mein wapas laane ke liye
//     }
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="max-w-4xl">
//         <DialogHeader>
//           <DialogTitle>Consultation Report Preview</DialogTitle>
//         </DialogHeader>
//         <div id="printable-area" className="my-4 h-[600px] overflow-auto">
//           <PrintablePrescription appointment={appointment} />
//         </div>
//         <DialogFooter>
//           <Button variant="outline" onClick={onClose}>Close</Button>
//           <Button onClick={handlePrint}><Printer className="mr-2 h-4 w-4" /> Print</Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }

'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { PrintablePrescription } from "./printable-prescription";

export function PrintPreviewDialog({ isOpen, onClose, appointment }: { isOpen: boolean, onClose: () => void, appointment: any }) {
  const handlePrint = () => {
    // Dialog ke content ko print karne ke liye
    const printContents = document.getElementById('printable-area')?.innerHTML;
    const originalContents = document.body.innerHTML;
    if (printContents) {
      document.body.innerHTML = printContents;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload(); // Page ko original state mein wapas laane ke liye
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* 1. Maximize Dialog width/height */}
      <DialogContent className="max-w-4xl h-[95vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Consultation Report Preview</DialogTitle>
        </DialogHeader>
        
        {/* 2. Make the printable-area responsive */}
        {/*
          - flex-grow: allows the div to take up all available vertical space.
          - overflow-y-auto: adds scrollbar only when needed.
          - my-2: Reduced margin slightly for more space.
        */}
        <div 
          id="printable-area" 
          className="flex-grow overflow-y-auto my-2"
        >
          <PrintablePrescription appointment={appointment} />
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
          <Button onClick={handlePrint}><Printer className="mr-2 h-4 w-4" /> Print</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}