/**
 * Formatting utilities for appointments and prescriptions
 */

import {
  MEDICINE_TIMING_LABELS,
  MedicineTimingKey,
  DEFAULT_VALUES,
} from './constants';

/**
 * Formats medicine timings into a readable string
 * @param timings Object with boolean flags for each timing
 * @returns Comma-separated string of selected timings or NOT_AVAILABLE
 */
export const formatMedicineTimings = (
  timings?: Record<MedicineTimingKey, boolean>
): string => {
  if (!timings) return DEFAULT_VALUES.NOT_AVAILABLE;

  const selected = (Object.entries(MEDICINE_TIMING_LABELS) as Array<[MedicineTimingKey, string]>)
    .filter(([key]) => timings[key])
    .map(([, label]) => label);

  return selected.length > 0 ? selected.join(', ') : DEFAULT_VALUES.NOT_AVAILABLE;
};

/**
 * Formats a date to Indian locale format (DD MMM YYYY)
 */
export const formatDateToIndian = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

/**
 * Formats a time to Indian locale format (HH:MM AM/PM)
 */
export const formatTimeToIndian = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

/**
 * Formats a full name from first and last name
 */
export const formatFullName = (
  firstName?: string,
  lastName?: string,
  prefix = ''
): string => {
  const parts = [prefix, firstName || '', lastName || '']
    .filter(Boolean)
    .join(' ')
    .trim();
  return parts || DEFAULT_VALUES.NOT_AVAILABLE;
};

/**
 * Formats currency to Indian Rupees
 */
export const formatCurrency = (amount: number = 0): string => {
  return `₹${amount.toFixed(2)}`;
};

/**
 * Extracts last N characters from a string, uppercased
 */
export const getLastCharacters = (
  value: string | undefined,
  length: number = 8
): string => {
  if (!value) return '';
  return String(value).slice(-length).toUpperCase();
};

/**
 * Calculates total from multiple items
 */
export const calculateTotal = (
  items: Array<{ price?: number }> = []
): number => {
  return items.reduce((sum, item) => sum + (item.price || 0), 0);
};
