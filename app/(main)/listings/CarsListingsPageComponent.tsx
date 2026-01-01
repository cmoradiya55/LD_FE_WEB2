'use client';

import { useState, useMemo } from 'react';
import FilterSidebar, { FilterState } from './FilterSidebar';
import { Filter } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getListingApi } from '@/utils/auth';
import { buildQueryStringFromFilters } from './utils';
import { CarData } from '@/lib/carData';
import CarsListings from './CarsListings';
import { getStorageItem } from '@/lib/storage';

// type ApiImage = {
//   id: number;
//   imageSubtype?: number;
//   imageUrl: string;
//   title?: string;
// };

// type ApiImageGroup = {
//   type: number;
//   typeName: string;
//   images: ApiImage[];
// };

// type ApiFeature = {
//   id: number;
//   name: string;
//   displayName: string;
//   valueType: number;
//   featureValue: string | number | boolean | null;
// };

// type ApiListing = {
//   id: number;
//   slug?: string;
//   displayName: string;
//   variantName?: string;
//   registrationYear?: number;
//   kmDriven?: number | null;
//   registrationNumber?: string;
//   ownerType?: number;
//   rtoCode?: string;
//   final_price?: number | null;
//   transmissionType?: string;
//   fuelType?: string;
//   displacementCc?: number;
//   powerBhp?: number;
//   torqueNm?: number;
//   seatingCapacity?: number;
//   mileageKmpl?: number;
//   numberOfGears?: number;
//   fuelTankCapacityLiters?: number | null;
//   features?: ApiFeature[];
//   images?: ApiImageGroup[];
// };

const placeholderImage =
  'https://via.placeholder.com/640x360.png?text=Listing+image+coming+soon';


const initialFilters: FilterState = {
  cityId: null,
  isCityIncluded: null,
  status: '',
  sortBy: '',
  minPrice: '',
  maxPrice: '',
  brand: '',
  model: '',
  fuelType: [],
  transmissionType: [],
  minModelYear: '',
  maxModelYear: '',
  location: '',
  ownershipType: [],
  safetyRating: '',
  minKms: '',
  maxKms: '',
  bodyType: [],
  seats: [],
};

export default function CarsListingsPageComponent() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  // Get user data from localStorage to include in query key for proper cache invalidation
  const user = JSON.parse(getStorageItem('user') || '{}');
  const city = getStorageItem('city');
  const userCityData = useMemo(() => ({
    cityId: city || null,
    isCityIncluded: user?.isCityIncluded ?? null,
  }), [city, user?.isCityIncluded]);

  const queryString = buildQueryStringFromFilters(filters);

  const { data: listingsResponse, isLoading, error } = useQuery({
    queryKey: ['GET_CAR_LISTINGS_DATA', queryString, userCityData.cityId, userCityData.isCityIncluded],
    queryFn: async () => {
        try {
            const response = await getListingApi(queryString);
            if (response.code === 200) {
                return response.data;
            }
            return [];
        } catch (error) {
            console.error("Error fetching listings data:", error);
            throw error;
        }
    },
    retry: false,
    refetchInterval: false,
    refetchOnWindowFocus: false,
    refetchOnMount: 'always',
    enabled: true,
  });


  const errorMessage = error instanceof Error ? error.message : error ? String(error) : null;

  return (
    <div className="max-w-7xl mx-auto px-6 pt-6 py-2">
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

      <div className="flex gap-6">
        {/* Filter Sidebar */}
        <FilterSidebar
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          filters={filters}
          onFilterChange={setFilters}
        />

        {/* Main Content */}
        <main className="flex-1 min-w-0 rounded-lg">
          <CarsListings listings={listingsResponse} loading={isLoading} error={errorMessage}/>
        </main>
      </div>
    </div>
  );
}

