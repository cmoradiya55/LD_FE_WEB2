'use client';

import { useState } from 'react';
import type React from 'react';
import FilterSidebar, { FilterState } from './FilterSidebar';
import { Filter } from 'lucide-react';

const initialFilters: FilterState = {
  status: '',
  minPrice: '',
  maxPrice: '',
  brand: '',
  model: '',
  fuelType: '',
  transmission: '',
  minYear: '',
  maxYear: '',
  location: '',
  owner: '',
  minKms: '',
  maxKms: '',
  bodyType: '',
};

export default function MyListingsLayout({ children }: { children: React.ReactNode }) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  return (
    <div className="max-w-7xl mx-auto py-2">
      {/* Mobile Filter Toggle Button */}
      <div className="lg:hidden mb-3">
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Filter className="w-5 h-5" />
          <span>Filters</span>
        </button>
      </div>

      <div className="flex gap-2">
        {/* Filter Sidebar */}
        <FilterSidebar
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          filters={filters}
          onFilterChange={setFilters}
        />

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}

