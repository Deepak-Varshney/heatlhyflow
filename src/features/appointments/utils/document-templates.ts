/**
 * HTML template generators for medical documents
 */

import {
  formatFullName,
  formatMedicineTimings,
  formatDateToIndian,
  formatTimeToIndian,
  formatCurrency,
  getLastCharacters,
  calculateTotal,
} from './formatters';
import { DEFAULT_VALUES, PDF_MESSAGES } from './constants';

interface Medicine {
  name?: string;
  dosage?: string;
  timings?: Record<string, boolean>;
}

interface Test {
  name?: string;
  instructions?: string;
  price?: number;
}

interface Prescription {
  medicines?: Medicine[];
  tests?: Test[];
  chiefComplaint?: string;
  diagnosis?: string;
  notes?: string;
}

interface Treatment {
  name: string;
  price?: number;
}

interface Patient {
  _id?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  email?: string;
}

interface Doctor {
  _id?: string;
  firstName?: string;
  lastName?: string;
  specialty?: string;
  watermarkImageUrl?: string;
}

interface OPDDocument {
  patient?: Patient;
  doctor?: Doctor;
  prescription?: Prescription;
  startTime: Date | string;
  _id?: string;
}

interface InvoiceDocument {
  patient?: Patient;
  doctor?: Doctor;
  prescription?: Prescription;
  treatments?: Treatment[];
  startTime: Date | string;
  status?: string;
  doctorFee?: number;
  discount?: number;
  discountType?: string;
  discountValue?: number;
  totalAmount?: number;
  _id?: string;
}

/**
 * Generates medicine rows HTML for OPD table
 */
const generateMedicineRows = (medicines: Medicine[] = []): string => {
  if (medicines.length === 0) {
    return '<tr><td colspan="4" style="text-align: center; color: #6c757d;">No medicines prescribed</td></tr>';
  }

  return medicines
    .map(
      (med, idx) => `
    <tr>
      <td class="center">${idx + 1}</td>
      <td><strong>${med.name || DEFAULT_VALUES.NOT_AVAILABLE}</strong></td>
      <td>${med.dosage || DEFAULT_VALUES.NOT_AVAILABLE}</td>
      <td>${formatMedicineTimings(med.timings as any)}</td>
    </tr>
  `
    )
    .join('');
};

/**
 * Generates test rows HTML for OPD table
 */
const generateTestRows = (tests: Test[] = []): string => {
  return tests
    .map(
      (test, idx) => `
    <tr>
      <td class="center">${idx + 1}</td>
      <td><strong>${test.name || DEFAULT_VALUES.NOT_AVAILABLE}</strong></td>
      <td>${test.instructions || DEFAULT_VALUES.PROTOCOL}</td>
    </tr>
  `
    )
    .join('');
};

/**
 * Generates treatment rows HTML for invoice table
 */
const generateTreatmentRows = (treatments: Treatment[] = []): string => {
  return treatments
    .map(
      (treatment, idx) => `
    <tr>
      <td class="center">${idx + 1}</td>
      <td><strong>${treatment.name}</strong></td>
      <td class="right">${formatCurrency(treatment.price)}</td>
    </tr>
  `
    )
    .join('');
};

/**
 * Generates invoice test rows HTML
 */
const generateInvoiceTestRows = (tests: Test[] = []): string => {
  return tests
    .map(
      (test, idx) => `
    <tr>
      <td class="center">${idx + 1}</td>
      <td><strong>${test.name || DEFAULT_VALUES.NOT_AVAILABLE}</strong></td>
      <td class="right">${formatCurrency(test.price)}</td>
    </tr>
  `
    )
    .join('');
};

/**
 * Generates OPD Card HTML template
 */
export const generateOPDTemplate = (data: OPDDocument): string => {
  const patientName = formatFullName(data.patient?.firstName, data.patient?.lastName);
  const doctorName = formatFullName(data.doctor?.firstName, data.doctor?.lastName, 'Dr.');

  const formattedDate = formatDateToIndian(data.startTime);
  const formattedTime = formatTimeToIndian(data.startTime);

  const medicines = data.prescription?.medicines || [];
  const tests = data.prescription?.tests || [];
  const hasTests = tests.length > 0;

  return `
    <div class="doc-header">
      <div class="doc-title"><span class="rx-symbol">℞</span> Medical Prescription</div>
      <div class="doc-subtitle">Out Patient Department (OPD) Card</div>
    </div>

    <div class="info-grid">
      <div><span class="info-label">Patient Name:</span> ${patientName}</div>
      <div><span class="info-label">Doctor:</span> ${doctorName}</div>
      <div><span class="info-label">Phone:</span> ${data.patient?.phoneNumber || DEFAULT_VALUES.NOT_AVAILABLE}</div>
      <div><span class="info-label">Specialty:</span> ${data.doctor?.specialty || DEFAULT_VALUES.SPECIALTY}</div>
      <div><span class="info-label">Date:</span> ${formattedDate}</div>
      <div><span class="info-label">Time:</span> ${formattedTime}</div>
      <div><span class="info-label">Email:</span> ${data.patient?.email || DEFAULT_VALUES.NOT_AVAILABLE}</div>
      <div><span class="info-label">Appointment ID:</span> ${getLastCharacters(String(data._id))}</div>
    </div>

    <div class="section">
      <div class="section-title">Chief Complaint</div>
      <div class="section-content">${data.prescription?.chiefComplaint || 'Not specified'}</div>
    </div>

    <div class="section">
      <div class="section-title">Diagnosis</div>
      <div class="section-content"><strong>${data.prescription?.diagnosis || 'Pending diagnosis'}</strong></div>
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
          ${generateMedicineRows(medicines)}
        </tbody>
      </table>
    </div>

    ${hasTests ? `
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
          ${generateTestRows(tests)}
        </tbody>
      </table>
    </div>
    ` : ''}

    ${data.prescription?.notes ? `
    <div class="section">
      <div class="section-title">Additional Notes</div>
      <div class="section-content">${data.prescription.notes}</div>
    </div>
    ` : ''}

    <div class="signature-section">
      <div class="signature-box">
        <div class="signature-line">${doctorName}</div>
        <div class="doctor-reg">${data.doctor?.specialty || 'Medical Practitioner'}</div>
        <div class="doctor-reg">Registration No: ${getLastCharacters(String(data.doctor?._id), 10)}</div>
      </div>
    </div>

    <div class="footer">
      ${PDF_MESSAGES.OPD_GENERATED}
    </div>
  `;
};

/**
 * Generates Medical Invoice HTML template
 */
export const generateInvoiceTemplate = (data: InvoiceDocument): string => {
  const patientName = formatFullName(data.patient?.firstName, data.patient?.lastName);
  const doctorName = formatFullName(data.doctor?.firstName, data.doctor?.lastName, 'Dr.');

  const formattedDate = formatDateToIndian(data.startTime);
  const formattedTime = formatTimeToIndian(data.startTime);

  const treatments = data.treatments || [];
  const tests = data.prescription?.tests || [];
  const hasTests = tests.length > 0;
  const hasTreatments = treatments.length > 0;

  const treatmentsTotal = calculateTotal(treatments);
  const testsTotal = calculateTotal(tests);
  const doctorFee = data.doctorFee || 0;
  const subtotal = treatmentsTotal + testsTotal + doctorFee;

  const discountLabel =
    data.discountType === 'percentage'
      ? `Discount (${data.discountValue || 0}%)`
      : DEFAULT_VALUES.DISCOUNT_LABEL;

  return `
    <div class="doc-header">
      <div class="doc-title">Medical Invoice</div>
      <div class="doc-subtitle">Payment Receipt & Billing Details</div>
    </div>

    <div class="info-grid">
      <div><span class="info-label">Patient Name:</span> ${patientName}</div>
      <div><span class="info-label">Doctor:</span> ${doctorName}</div>
      <div><span class="info-label">Phone:</span> ${data.patient?.phoneNumber || DEFAULT_VALUES.NOT_AVAILABLE}</div>
      <div><span class="info-label">Status:</span> <span style="text-transform: capitalize;">${data.status || DEFAULT_VALUES.NOT_AVAILABLE}</span></div>
      <div><span class="info-label">Date:</span> ${formattedDate}</div>
      <div><span class="info-label">Time:</span> ${formattedTime}</div>
      <div><span class="info-label">Email:</span> ${data.patient?.email || DEFAULT_VALUES.NOT_AVAILABLE}</div>
      <div><span class="info-label">Invoice ID:</span> INV-${getLastCharacters(String(data._id))}</div>
    </div>

    ${hasTreatments ? `
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
          ${generateTreatmentRows(treatments)}
        </tbody>
      </table>
    </div>
    ` : ''}

    ${hasTests ? `
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
          ${generateInvoiceTestRows(tests)}
        </tbody>
      </table>
    </div>
    ` : ''}

    <div class="section">
      <div class="section-title">Payment Summary</div>
      <table>
        <tbody>
          <tr>
            <td><strong>${DEFAULT_VALUES.CONSULTATION_FEE_LABEL}</strong></td>
            <td class="right">${formatCurrency(doctorFee)}</td>
          </tr>
          ${subtotal > doctorFee ? `
          <tr>
            <td><strong>${DEFAULT_VALUES.SUBTOTAL_LABEL}</strong></td>
            <td class="right">${formatCurrency(subtotal)}</td>
          </tr>
          ` : ''}
          ${(data.discount || 0) > 0 ? `
          <tr>
            <td><strong>${discountLabel}</strong></td>
            <td class="right" style="color: #dc3545;">-${formatCurrency(data.discount)}</td>
          </tr>
          ` : ''}
          <tr class="total-row">
            <td><strong>${DEFAULT_VALUES.TOTAL_LABEL}</strong></td>
            <td class="right"><strong>${formatCurrency(data.totalAmount)}</strong></td>
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
      ${PDF_MESSAGES.INVOICE_GENERATED}
    </div>
  `;
};
