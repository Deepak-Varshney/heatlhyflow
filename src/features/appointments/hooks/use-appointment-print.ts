/**
 * Custom hook for appointment printing functionality
 */

import { useState } from 'react';
import { toast } from 'sonner';
import { getAppointmentDetails } from '@/app/actions/appointment-actions';
import { downloadPdf, generateInvoiceTemplate, generateOPDTemplate, generatePdfFilename, generatePdfFromHtml, PDF_DOCUMENT_TYPE } from '../utils';

export interface UseAppointmentPrintOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const useAppointmentPrint = (options?: UseAppointmentPrintOptions) => {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const handlePrint = async (
    appointmentId: string,
    type: 'opd' | 'invoice'
  ): Promise<void> => {
    setIsGeneratingPDF(true);

    try {
      // Fetch appointment details
      const appointment = await getAppointmentDetails(appointmentId);
      if (!appointment) {
        toast.error('Unable to load appointment details.');
        return;
      }

      // Generate appropriate document template
      const htmlContent =
        type === PDF_DOCUMENT_TYPE.OPD
          ? generateOPDTemplate(appointment)
          : generateInvoiceTemplate(appointment);

      // Generate PDF
      const watermarkUrl = appointment.doctor?.watermarkImageUrl;
      const pdf = await generatePdfFromHtml(htmlContent, watermarkUrl);

      // Create filename and download
      const filename = generatePdfFilename(
        type === PDF_DOCUMENT_TYPE.OPD ? 'OPD_Card' : 'Invoice',
        appointment.patient?.firstName,
        appointment.patient?.lastName
      );

      downloadPdf(pdf, filename);
      toast.success(
        `${type === PDF_DOCUMENT_TYPE.OPD ? 'OPD Card' : 'Invoice'} downloaded successfully!`
      );

      options?.onSuccess?.();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to generate PDF. Please try again.';

      console.error('PDF generation failed:', error);
      toast.error(errorMessage);
      options?.onError?.(
        error instanceof Error
          ? error
          : new Error('Unknown error during PDF generation')
      );
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return {
    handlePrint,
    isGeneratingPDF,
  };
};
