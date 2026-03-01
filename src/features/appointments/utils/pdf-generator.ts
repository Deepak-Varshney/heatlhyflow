/**
 * PDF generation utilities
 */

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {
  IFRAME_STYLES,
  IFRAME_RENDER_DELAY,
  HTML2CANVAS_CONFIG,
  JSPDF_CONFIG,
  getPdfStylesWithWatermark,
} from './pdf-styles';

/**
 * Generates a PDF from HTML content using an iframe
 * @param htmlContent The HTML body content
 * @param watermarkUrl Optional URL for watermark image
 * @returns Generated jsPDF instance
 */
export const generatePdfFromHtml = async (
  htmlContent: string,
  watermarkUrl?: string
): Promise<jsPDF> => {
  // Create and setup iframe for isolated rendering
  const iframe = document.createElement('iframe');
  iframe.style.cssText = IFRAME_STYLES;
  document.body.appendChild(iframe);

  try {
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDoc) {
      throw new Error('Could not access iframe document');
    }

    // Write HTML with professional medical document styling
    const styles = getPdfStylesWithWatermark(watermarkUrl);
    const watermarkHtml = watermarkUrl ? '<div class="watermark"></div>' : '';

    iframeDoc.open();
    iframeDoc.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <style>${styles}</style>
      </head>
      <body>
        ${watermarkHtml}
        <div class="content">${htmlContent}</div>
      </body>
      </html>
    `);
    iframeDoc.close();

    // Wait for rendering to complete
    await new Promise((resolve) => setTimeout(resolve, IFRAME_RENDER_DELAY));

    // Convert iframe to canvas
    const canvas = await html2canvas(iframeDoc.body, HTML2CANVAS_CONFIG);

    // Create PDF from canvas
    const pdf = new jsPDF(JSPDF_CONFIG);
    const imgData = canvas.toDataURL('image/png');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

    return pdf;
  } finally {
    // Cleanup
    document.body.removeChild(iframe);
  }
};

/**
 * Downloads a PDF file
 * @param pdf jsPDF instance to download
 * @param filename Name of the file to save
 */
export const downloadPdf = (pdf: jsPDF, filename: string): void => {
  pdf.save(filename);
};

/**
 * Generates a filename with timestamp
 * @param prefix Prefix for the filename
 * @param firstName First name (optional)
 * @param lastName Last name (optional)
 * @returns Formatted filename with date
 */
export const generatePdfFilename = (
  prefix: string,
  firstName?: string,
  lastName?: string
): string => {
  const date = new Date().toISOString().split('T')[0];
  const name =
    firstName || lastName
      ? `_${firstName || ''}_${lastName || ''}`.trim()
      : '';
  return `${prefix}${name}_${date}.pdf`;
};
