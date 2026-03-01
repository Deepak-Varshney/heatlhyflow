'use client';

import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

type AppointmentPrintData = {
  _id: string;
  startTime: string;
  endTime: string;
  status: string;
  patient?: {
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
    phoneNumber?: string;
    email?: string;
    address?: string;
  };
  doctor?: {
    _id?: string;
    firstName?: string;
    lastName?: string;
    specialty?: string;
    watermarkImageUrl?: string;
  };
  prescription?: {
    chiefComplaint?: string;
    diagnosis?: string;
    notes?: string;
    medicines?: Array<{
      name?: string;
      dosage?: string;
      timings?: Record<string, boolean>;
    }>;
    tests?: Array<{
      name?: string;
      notes?: string;
      price?: number;
    }>;
  };
  treatments?: Array<{ name: string; price: number }>;
  doctorFee?: number;
  discount?: number;
  totalAmount?: number;
  discountType?: 'amount' | 'percentage';
  discountValue?: number;
};

function formatTimings(timings?: Record<string, boolean>) {
  if (!timings) return 'N/A';
  const labels: Array<[string, string]> = [
    ['beforeBreakfast', 'Before breakfast'],
    ['afterBreakfast', 'After breakfast'],
    ['beforeLunch', 'Before lunch'],
    ['afterLunch', 'After lunch'],
    ['beforeDinner', 'Before dinner'],
    ['afterDinner', 'After dinner'],
  ];
  const selected = labels
    .filter(([key]) => timings[key])
    .map(([, label]) => label);
  return selected.length ? selected.join(', ') : 'N/A';
}

async function generatePDF(title: string, body: string, watermarkUrl?: string) {
  console.log('🖼️  Watermark URL:', watermarkUrl);
  console.log('📄 Building PDF for:', title);

  // Create an iframe to isolate from parent CSS
  const iframe = document.createElement('iframe');
  iframe.style.cssText = 'position: absolute; left: -9999px; width: 794px; height: 1123px; border: none;';
  document.body.appendChild(iframe);

  const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
  if (!iframeDoc) throw new Error('Could not access iframe document');

  // Write clean HTML with professional medical document styling
  iframeDoc.open();
  iframeDoc.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          width: 794px;
          min-height: 1123px;
          padding: 30px 40px;
          background-color: #ffffff;
          font-family: 'Times New Roman', Times, serif;
          color: #1a1a1a;
          position: relative;
          line-height: 1.5;
        }
        .watermark {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 400px;
          height: 400px;
          background-image: url('${watermarkUrl || ''}');
          background-position: center;
          background-size: contain;
          background-repeat: no-repeat;
          opacity: 0.08;
          pointer-events: none;
          z-index: 0;
        }
        .content { position: relative; z-index: 1; }
        .doc-header {
          border-bottom: 3px solid #2c5282;
          padding-bottom: 15px;
          margin-bottom: 20px;
        }
        .doc-title {
          font-size: 24px;
          font-weight: bold;
          color: #2c5282;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 5px;
        }
        .doc-subtitle {
          font-size: 11px;
          color: #666666;
          font-style: italic;
        }
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px 20px;
          padding: 15px;
          background-color: #f8f9fa;
          border: 1px solid #dee2e6;
          border-radius: 4px;
          margin-bottom: 20px;
          font-size: 13px;
        }
        .info-label {
          font-weight: 600;
          color: #495057;
        }
        .info-value {
          color: #212529;
        }
        .section {
          margin-bottom: 20px;
          page-break-inside: avoid;
        }
        .section-title {
          font-size: 15px;
          font-weight: bold;
          color: #2c5282;
          border-bottom: 2px solid #e9ecef;
          padding-bottom: 5px;
          margin-bottom: 10px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .section-content {
          padding: 10px;
          font-size: 13px;
          line-height: 1.6;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 8px;
          font-size: 12px;
        }
        th {
          background-color: #2c5282;
          color: #ffffff;
          padding: 10px 8px;
          text-align: left;
          font-weight: 600;
          border: 1px solid #2c5282;
        }
        td {
          border: 1px solid #dee2e6;
          padding: 8px;
          background-color: #ffffff;
        }
        tr:nth-child(even) td {
          background-color: #f8f9fa;
        }
        td.right { text-align: right; }
        td.center { text-align: center; }
        .total-row {
          font-weight: bold;
          background-color: #e9ecef !important;
          font-size: 13px;
        }
        .signature-section {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #dee2e6;
        }
        .signature-box {
          display: inline-block;
          text-align: center;
          min-width: 200px;
          float: right;
        }
        .signature-line {
          border-top: 2px solid #000000;
          margin-top: 50px;
          padding-top: 5px;
          font-size: 12px;
          font-weight: 600;
        }
        .doctor-reg {
          font-size: 11px;
          color: #666666;
          margin-top: 3px;
        }
        .footer {
          position: absolute;
          bottom: 30px;
          left: 40px;
          right: 40px;
          text-align: center;
          font-size: 10px;
          color: #6c757d;
          border-top: 1px solid #dee2e6;
          padding-top: 10px;
        }
        .rx-symbol {
          font-size: 28px;
          font-weight: bold;
          color: #2c5282;
          margin-right: 10px;
          vertical-align: middle;
        }
        .prescription-header {
          display: flex;
          align-items: center;
          margin-bottom: 15px;
        }
      </style>
    </head>
    <body>
      ${watermarkUrl ? '<div class="watermark"></div>' : ''}
      <div class="content">${body}</div>
    </body>
    </html>
  `);
  iframeDoc.close();

  // Wait for rendering
  await new Promise(resolve => setTimeout(resolve, 300));

  // Generate canvas from iframe body
  const canvas = await html2canvas(iframeDoc.body, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff',
    logging: false,
    windowWidth: 794,
    windowHeight: 1123
  });

  // Remove iframe
  document.body.removeChild(iframe);

  // Create PDF
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const imgData = canvas.toDataURL('image/png');
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  
  pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
  
  return pdf;
}


export function PrintActions({ appointment }: { appointment: AppointmentPrintData }) {
  const [isGenerating, setIsGenerating] = useState(false);

  if (String(appointment.status || '').toLowerCase() !== 'completed') {
    return null;
  }

  const handlePrintOpd = async () => {
    setIsGenerating(true);
    try {
    const patientName = `${appointment.patient?.firstName || ''} ${appointment.patient?.lastName || ''}`.trim();
    const doctorName = `Dr. ${appointment.doctor?.firstName || ''} ${appointment.doctor?.lastName || ''}`.trim();
    const watermarkUrl = appointment.doctor?.watermarkImageUrl;

    console.log('📋 Print OPD Card');
    console.log('🎨 Watermark URL from appointment.doctor:', watermarkUrl);
    console.log('👨‍⚕️ Full doctor object:', appointment.doctor);

    const medicinesHtml = (appointment.prescription?.medicines || [])
      .map((med, idx) => `
        <tr>
          <td class="center">${idx + 1}</td>
          <td><strong>${med.name || 'N/A'}</strong></td>
          <td>${med.dosage || 'N/A'}</td>
          <td>${formatTimings(med.timings)}</td>
        </tr>
      `)
      .join('');

    const testsTableHtml = (appointment.prescription?.tests || [])
      .map((test, idx) => `
        <tr>
          <td class="center">${idx + 1}</td>
          <td><strong>${test.name || 'N/A'}</strong></td>
          <td>${test.notes || 'As per protocol'}</td>
        </tr>
      `)
      .join('');

    const visitDate = new Date(appointment.startTime);
    const formattedDate = visitDate.toLocaleDateString('en-IN', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
    const formattedTime = visitDate.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });

    const body = `
      <div class="doc-header">
        <div class="doc-title"><span class="rx-symbol">℞</span> Medical Prescription</div>
        <div class="doc-subtitle">Out Patient Department (OPD) Card</div>
      </div>

      <div class="info-grid">
        <div><span class="info-label">Patient Name:</span> ${patientName || 'N/A'}</div>
        <div><span class="info-label">Doctor:</span> ${doctorName || 'N/A'}</div>
        <div><span class="info-label">Phone:</span> ${appointment.patient?.phoneNumber || 'N/A'}</div>
        <div><span class="info-label">Specialty:</span> ${appointment.doctor?.specialty || 'General'}</div>
        <div><span class="info-label">Date:</span> ${formattedDate}</div>
        <div><span class="info-label">Time:</span> ${formattedTime}</div>
        <div><span class="info-label">Email:</span> ${appointment.patient?.email || 'N/A'}</div>
        <div><span class="info-label">Appointment ID:</span> ${String(appointment._id).slice(-8)}</div>
      </div>

      <div class="section">
        <div class="section-title">Chief Complaint</div>
        <div class="section-content">${appointment.prescription?.chiefComplaint || 'Not specified'}</div>
      </div>

      <div class="section">
        <div class="section-title">Diagnosis</div>
        <div class="section-content"><strong>${appointment.prescription?.diagnosis || 'Pending diagnosis'}</strong></div>
      </div>

      <div class="section">
        <div class="section-title">Prescribed Medications</div>
        <table>
          <thead>
            <tr>
              <th style="width: 40px;">#</th>
              <th style="width: 200px;">Medicine Name</th>
              <th style="width: 100px;">Dosage</th>
              <th>Timing & Instructions</th>
            </tr>
          </thead>
          <tbody>
            ${medicinesHtml || '<tr><td colspan="4" style="text-align: center; color: #6c757d;">No medicines prescribed</td></tr>'}
          </tbody>
        </table>
      </div>

      ${(appointment.prescription?.tests || []).length > 0 ? `
      <div class="section">
        <div class="section-title">Recommended Tests</div>
        <table>
          <thead>
            <tr>
              <th style="width: 40px;">#</th>
              <th style="width: 250px;">Test Name</th>
              <th>Instructions</th>
            </tr>
          </thead>
          <tbody>
            ${testsTableHtml}
          </tbody>
        </table>
      </div>
      ` : ''}

      ${appointment.prescription?.notes ? `
      <div class="section">
        <div class="section-title">Additional Notes</div>
        <div class="section-content">${appointment.prescription.notes}</div>
      </div>
      ` : ''}

      <div class="signature-section">
        <div class="signature-box">
          <div class="signature-line">${doctorName}</div>
          <div class="doctor-reg">${appointment.doctor?.specialty || 'Medical Practitioner'}</div>
          <div class="doctor-reg">Registration No: ${String(appointment.doctor?._id || '').slice(-10).toUpperCase()}</div>
        </div>
      </div>

      <div class="footer">
        This is a digitally generated prescription. For any queries, please contact the clinic.
      </div>
    `;

    const pdf = await generatePDF('OPD Card', body, watermarkUrl);
    pdf.save(`OPD_Card_${appointment.patient?.firstName}_${appointment.patient?.lastName}_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrintInvoice = async () => {
    setIsGenerating(true);
    try {
    const patientName = `${appointment.patient?.firstName || ''} ${appointment.patient?.lastName || ''}`.trim();
    const doctorName = `Dr. ${appointment.doctor?.firstName || ''} ${appointment.doctor?.lastName || ''}`.trim();
    const watermarkUrl = appointment.doctor?.watermarkImageUrl;

    console.log('📄 Print Invoice');
    console.log('🎨 Watermark URL from appointment.doctor:', watermarkUrl);
    console.log('👨‍⚕️ Full doctor object:', appointment.doctor);

    const treatmentsHtml = (appointment.treatments || [])
      .map((item, idx) => `
        <tr>
          <td>${idx + 1}</td>
          <td>${item.name}</td>
          <td class="right">₹${item.price.toFixed(2)}</td>
        </tr>
      `)
      .join('');

    const testsHtml = (appointment.prescription?.tests || [])
      .map((test, idx) => `
        <tr>
          <td>${idx + 1}</td>
          <td>${test.name || 'N/A'}</td>
          <td class="right">₹${(test.price || 0).toFixed(2)}</td>
        </tr>
      `)
      .join('');

    const discountLabel = appointment.discountType === 'percentage'
      ? `Discount (${appointment.discountValue || 0}%)`
      : 'Discount';

    const visitDate = new Date(appointment.startTime);
    const formattedDate = visitDate.toLocaleDateString('en-IN', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
    const formattedTime = visitDate.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });

    const subtotal = (appointment.treatments || []).reduce((sum, t) => sum + (t.price || 0), 0) +
                     (appointment.prescription?.tests || []).reduce((sum, t) => sum + (t.price || 0), 0) +
                     (appointment.doctorFee || 0);

    const body = `
      <div class="doc-header">
        <div class="doc-title">Medical Invoice</div>
        <div class="doc-subtitle">Payment Receipt & Billing Details</div>
      </div>

      <div class="info-grid">
        <div><span class="info-label">Patient Name:</span> ${patientName || 'N/A'}</div>
        <div><span class="info-label">Doctor:</span> ${doctorName || 'N/A'}</div>
        <div><span class="info-label">Phone:</span> ${appointment.patient?.phoneNumber || 'N/A'}</div>
        <div><span class="info-label">Status:</span> <span style="text-transform: capitalize;">${appointment.status}</span></div>
        <div><span class="info-label">Date:</span> ${formattedDate}</div>
        <div><span class="info-label">Time:</span> ${formattedTime}</div>
        <div><span class="info-label">Email:</span> ${appointment.patient?.email || 'N/A'}</div>
        <div><span class="info-label">Invoice ID:</span> INV-${String(appointment._id).slice(-8).toUpperCase()}</div>
      </div>

      ${(appointment.treatments || []).length > 0 ? `
      <div class="section">
        <div class="section-title">Treatments & Procedures</div>
        <table>
          <thead>
            <tr>
              <th style="width: 40px;">#</th>
              <th>Description</th>
              <th class="right" style="width: 120px;">Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            ${treatmentsHtml}
          </tbody>
        </table>
      </div>
      ` : ''}

      ${(appointment.prescription?.tests || []).length > 0 ? `
      <div class="section">
        <div class="section-title">Diagnostic Tests</div>
        <table>
          <thead>
            <tr>
              <th style="width: 40px;">#</th>
              <th>Test Name</th>
              <th class="right" style="width: 120px;">Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            ${testsHtml}
          </tbody>
        </table>
      </div>
      ` : ''}

      <div class="section">
        <div class="section-title">Payment Summary</div>
        <table>
          <tbody>
            <tr>
              <td><strong>Consultation Fee</strong></td>
              <td class="right">₹${(appointment.doctorFee || 0).toFixed(2)}</td>
            </tr>
            ${subtotal > (appointment.doctorFee || 0) ? `
            <tr>
              <td><strong>Sub Total</strong></td>
              <td class="right">₹${subtotal.toFixed(2)}</td>
            </tr>
            ` : ''}
            ${(appointment.discount || 0) > 0 ? `
            <tr>
              <td><strong>${discountLabel}</strong></td>
              <td class="right" style="color: #dc3545;">-₹${(appointment.discount || 0).toFixed(2)}</td>
            </tr>
            ` : ''}
            <tr class="total-row">
              <td><strong>TOTAL AMOUNT</strong></td>
              <td class="right"><strong>₹${(appointment.totalAmount || 0).toFixed(2)}</strong></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="signature-section">
        <div class="signature-box">
          <div class="signature-line">Authorized Signatory</div>
          <div class="doctor-reg">${doctorName}</div>
        </div>
      </div>

      <div class="footer">
        Thank you for your visit. This is a computer-generated invoice and does not require a physical signature.
      </div>
    `;

    const pdf = await generatePDF('Invoice', body, watermarkUrl);
    pdf.save(`Invoice_${appointment.patient?.firstName}_${appointment.patient?.lastName}_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" onClick={handlePrintOpd} disabled={isGenerating}>
        <Download className="mr-2 h-4 w-4" /> 
        {isGenerating ? 'Generating...' : 'Download OPD Card'}
      </Button>
      <Button variant="outline" onClick={handlePrintInvoice} disabled={isGenerating}>
        <Download className="mr-2 h-4 w-4" /> 
        {isGenerating ? 'Generating...' : 'Download Invoice'}
      </Button>
    </div>
  );
}
