'use client';

import { FilterState } from './FilterSidebar';
import { getStorageItem } from '@/lib/storage';

/**
 * Converts a FilterState object into a URL query string.
 * Only keys with a non-empty value are included.
 * Also includes cityId and isCityIncluded from localStorage user data.
 */
export const buildQueryStringFromFilters = (filters: FilterState): string => {
  const params: string[] = [];

  Object.entries(filters).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    // Handle arrays by joining non-empty entries
    if (Array.isArray(value)) {
      const cleaned = value.filter(v => v !== undefined && v !== null && String(v).trim() !== '');
      if (cleaned.length === 0) return;
      const paramKey =
        key === 'brand'
          ? 'brandId'
          : key === 'model'
          ? 'modelId'
          : key;
      params.push(`${encodeURIComponent(paramKey)}=${encodeURIComponent(cleaned.join(','))}`);
      return;
    }

    // Include non-empty strings and numbers (including "0")
    const stringValue = String(value);
    if (stringValue.trim() === '') return;

    const paramKey =
      key === 'brand'
        ? 'brandId'
        : key === 'model'
        ? 'modelId'
        : key;
    params.push(`${encodeURIComponent(paramKey)}=${encodeURIComponent(stringValue)}`);
  });

  // Add cityId and isCityIncluded from localStorage user data
  // If cityId is provided, isCityIncluded is required by the API
  const user = JSON.parse(getStorageItem('user') || '{}');
  if (user) {
    if (user.cityId) {
      params.push(`cityId=${encodeURIComponent(user.cityId)}`);
      // Default to true if isCityIncluded is not set
      const isCityIncluded = user.isCityIncluded !== undefined && user.isCityIncluded !== null 
        ? user.isCityIncluded 
        : true;
      params.push(`isCityIncluded=${encodeURIComponent(String(isCityIncluded))}`);
    }
  }

  return params.join('&');
};


