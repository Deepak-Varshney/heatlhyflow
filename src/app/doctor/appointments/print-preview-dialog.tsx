'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { PrintablePrescription } from "./printable-prescription";
import { PrintableConsultationForm } from "./printable-consultation-form";
import { PrintableBill } from "./printable-bill";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type PrintType = 'consultation' | 'bill' | 'prescription';

export function PrintPreviewDialog({ 
  isOpen, 
  onClose, 
  appointment,
  initialPrintType = 'consultation' 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  appointment: any;
  initialPrintType?: PrintType;
}) {
  const [printType, setPrintType] = useState<PrintType>(initialPrintType);

  // Update print type when initialPrintType changes
  useEffect(() => {
    if (isOpen) {
      setPrintType(initialPrintType);
    }
  }, [initialPrintType, isOpen]);

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

  const renderPrintContent = () => {
    switch (printType) {
      case 'consultation':
        return <PrintableConsultationForm appointment={appointment} />;
      case 'bill':
        return <PrintableBill appointment={appointment} />;
      case 'prescription':
        return <PrintablePrescription appointment={appointment} />;
      default:
        return <PrintableConsultationForm appointment={appointment} />;
    }
  };

  const getDialogTitle = () => {
    switch (printType) {
      case 'consultation':
        return 'Consultation Form Preview';
      case 'bill':
        return 'Bill / Invoice Preview';
      case 'prescription':
        return 'Prescription Preview';
      default:
        return 'Print Preview';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl h-[95vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{getDialogTitle()}</DialogTitle>
          <div className="flex items-center gap-2 mt-2">
            <label className="text-sm font-medium">Print Type:</label>
            <Select value={printType} onValueChange={(value) => setPrintType(value as PrintType)}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="consultation">Consultation Form</SelectItem>
                <SelectItem value="bill">Bill / Invoice</SelectItem>
                <SelectItem value="prescription">Prescription</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </DialogHeader>
        
        <div 
          id="printable-area" 
          className="flex-grow overflow-y-auto my-2"
        >
          {renderPrintContent()}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
          <Button onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" /> Print {printType === 'consultation' ? 'Consultation' : printType === 'bill' ? 'Bill' : 'Prescription'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}