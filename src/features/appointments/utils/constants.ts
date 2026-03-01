/**
 * Constants for appointment and prescription formatting
 */

export const MEDICINE_TIMING_LABELS = {
  beforeBreakfast: 'Before breakfast',
  afterBreakfast: 'After breakfast',
  beforeLunch: 'Before lunch',
  afterLunch: 'After lunch',
  beforeDinner: 'Before dinner',
  afterDinner: 'After dinner',
} as const;

export type MedicineTimingKey = keyof typeof MEDICINE_TIMING_LABELS;

export const PDF_CONSTANTS = {
  PAGE_WIDTH: 794,
  PAGE_HEIGHT: 1123,
  PADDING: '30px 40px',
  PRIMARY_COLOR: '#2c5282',
  SECONDARY_COLOR: '#dee2e6',
  LIGHT_BG: '#f8f9fa',
  DARK_TEXT: '#1a1a1a',
  LIGHT_TEXT: '#6c757d',
} as const;

export const APPOINTMENT_STATUS = {
  COMPLETED: 'completed',
  PENDING: 'pending',
  CANCELLED: 'cancelled',
} as const;

export const PDF_DOCUMENT_TYPE = {
  OPD: 'opd',
  INVOICE: 'invoice',
} as const;

export const DEFAULT_VALUES = {
  SPECIALTY: 'General',
  PROTOCOL: 'As per protocol',
  NOT_AVAILABLE: 'N/A',
  CONSULTATION_FEE_LABEL: 'Consultation Fee',
  DISCOUNT_LABEL: 'Discount',
  SUBTOTAL_LABEL: 'Sub Total',
  TOTAL_LABEL: 'TOTAL AMOUNT',
} as const;

export const PDF_MESSAGES = {
  OPD_GENERATED: 'This is a digitally generated prescription. For any queries, please contact the clinic.',
  INVOICE_GENERATED: 'Thank you for your visit. This is a computer-generated invoice and does not require a physical signature.',
} as const;
