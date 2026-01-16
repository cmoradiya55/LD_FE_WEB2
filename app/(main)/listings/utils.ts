'use client';

import { FilterState } from './FilterSidebar';

export const buildQueryStringFromFilters = (filters: FilterState, cityId?: string | null): string => {
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

  if (cityId) {
    params.push(`cityId=${encodeURIComponent(cityId)}`);
    params.push(`isCityIncluded=true`);
  }

  return params.join('&');
};


