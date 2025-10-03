import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBytes(
  bytes: number,
  opts: {
    decimals?: number;
    sizeType?: 'accurate' | 'normal';
  } = {}
) {
  const { decimals = 0, sizeType = 'normal' } = opts;

  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const accurateSizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB'];
  if (bytes === 0) return '0 Byte';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
    sizeType === 'accurate'
      ? (accurateSizes[i] ?? 'Bytest')
      : (sizes[i] ?? 'Bytes')
  }`;
}

/**
 * Parses a stringified JSON sort parameter into a MongoDB sort object.
 * @param sort - A string like '[{"id":"createdAt","desc":true}]'
 * @returns A MongoDB sort object, e.g., { createdAt: -1 }
 */
export function parseSortParameter(sort?: string): Record<string, 1 | -1> {
  if (!sort) {
    return { createdAt: -1 }; // Default sort
  }
  try {
    const sortArray = JSON.parse(sort);
    if (Array.isArray(sortArray) && sortArray.length > 0) {
      return sortArray.reduce((acc, item) => {
        if (item.id && typeof item.desc === 'boolean') {
          acc[item.id] = item.desc ? -1 : 1;
        }
        return acc;
      }, {} as Record<string, 1 | -1>);
    }
  } catch {
    // Ignore invalid JSON
  }
  return { createdAt: -1 };
}
