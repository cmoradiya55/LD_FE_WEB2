'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import FilterSidebar, { FilterState } from './FilterSidebar';
import { Filter } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getListingApi } from '@/utils/auth';
import { buildQueryStringFromFilters } from './utils';
import { CarData } from '@/lib/carData';
import CarsListings from './CarsListings';
import { getStorageItem } from '@/lib/storage';
import { useCity } from '@/components/providers/CityProvider';

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

type ApiImage = {
  id: number;
  imageSubtype?: number;
  imageUrl: string;
  title?: string;
};

type ApiImageGroup = {
  type: number;
  typeName: string;
  images: ApiImage[];
};

type ApiFeature = {
  id: number;
  name: string;
  displayName: string;
  valueType: number;
  featureValue: string | number | boolean | null;
};

type ApiListing = {
  id: number;
  slug?: string;
  image?: string; // Direct image field from API
  displayName: string;
  variantName?: string;
  registrationYear?: number;
  kmDriven?: number | null;
  registrationNumber?: string;
  ownerType?: number;
  rtoCode?: string;
  final_price?: number | null;
  price?: number; // Price field from API
  customerExpectedPrice?: number | null; // Customer expected price
  customer_expected_price?: number | null; // Alternative field name
  transmissionType?: string;
  fuelType?: string;
  displacementCc?: number;
  powerBhp?: number;
  torqueNm?: number;
  seatingCapacity?: number;
  mileageKmpl?: number;
  numberOfGears?: number;
  fuelTankCapacityLiters?: number | null;
  features?: ApiFeature[];
  images?: ApiImageGroup[];
  areaName?: string;
  cityName?: string;
  isWishlisted?: boolean;
};

const mapApiListingToCarData = (item: ApiListing): CarData => {
  // Priority: Use direct image field, then check images array, then placeholder
  const primaryImage =
    item.image ||
    item.images?.find((group) => group.images?.length)?.images?.[0]?.imageUrl ||
    placeholderImage;

  const detailOptions =
    item.images
      ?.map((group) => ({
        label: group.typeName || 'Images',
        images: (group.images || []).map((img) => img.imageUrl).filter(Boolean),
      }))
      .filter((opt) => opt.images.length > 0) || [];

  const name = `${item.displayName}${item.variantName ? ` ${item.variantName}` : ''}`.trim();
  const year = item.registrationYear ?? new Date().getFullYear();
  
  // Resolve final_price (priority: final_price > price)
  const final_price = 
    typeof item.final_price === 'number' && item.final_price > 0
      ? item.final_price
      : typeof item.price === 'number' && item.price > 0
      ? item.price
      : null;
  
  // Resolve customerExpectedPrice
  const customerExpectedPrice = 
    typeof item.customerExpectedPrice === 'number' && item.customerExpectedPrice > 0
      ? item.customerExpectedPrice
      : typeof item.customer_expected_price === 'number' && item.customer_expected_price > 0
      ? item.customer_expected_price
      : null;
  
  // Format price as string for CarData interface
  // Use final_price if available, otherwise use price
  const priceString = final_price !== null
      ? `₹${final_price.toLocaleString('en-IN')}/-`
      : '';

  const areaCityLocation =
    item.areaName && item.cityName
      ? `${item.areaName}, ${item.cityName}`
      : item.cityName ?? item.areaName ?? '';

  return {
    id: item.slug ?? String(item.id),
    slug: item.slug,
    name,
    year,
    price: priceString, // Formatted price string
    final_price,
    customerExpectedPrice: customerExpectedPrice 
      ? `₹${customerExpectedPrice.toLocaleString('en-IN')}/-` 
      : undefined,
    image: primaryImage,
    detailOptions,
    fuelType: item.fuelType || '—',
    transmission: item.transmissionType || '—',
    kmsDriven: item.kmDriven ? `${item.kmDriven.toLocaleString()} km` : '—',
    location: areaCityLocation || item.rtoCode || '—',
    owner: item.ownerType ? `Owner Type ${item.ownerType}` : '—',
    registrationYear: item.registrationYear ? String(item.registrationYear) : String(year),
    registrationNumber: item.registrationNumber,
    insurance: '—',
    seats: item.seatingCapacity ? `${item.seatingCapacity} Seats` : '—',
    rto: item.rtoCode || areaCityLocation || '—',
    engineDisplacement: item.displacementCc ? `${item.displacementCc} cc` : '—',
    yearOfManufacture: item.registrationYear ? String(item.registrationYear) : String(year),
    mileageKmpl: item.mileageKmpl ?? undefined,
    displacementCc: item.displacementCc ?? undefined,
    powerBhp: item.powerBhp ?? undefined,
    torqueNm: item.torqueNm ?? undefined,
    numberOfGears: item.numberOfGears ?? undefined,
    seatingCapacity: item.seatingCapacity ?? undefined,
    fuelTankCapacityLiters: item.fuelTankCapacityLiters ?? null,
    featureList:
      item.features?.map((f) => ({
        name: f.displayName || f.name,
        value: f.featureValue === null || typeof f.featureValue === 'undefined' ? null : f.featureValue,
        key: f.name || f.displayName || String(f.id),
      })) || [],
    badgeType: 'assured',
  } as CarData;
};

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
  const router = useRouter();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  // Get user data from localStorage to include in query key for proper cache invalidation
  const user = JSON.parse(getStorageItem('user') || '{}');
  const { cityId } = useCity();
  const userCityData = useMemo(() => ({
    cityId: cityId || null,
    isCityIncluded: user?.isCityIncluded ?? null,
  }), [cityId, user?.isCityIncluded]);

  const queryString = buildQueryStringFromFilters(filters, cityId);

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

  // Map API listings to CarData format
  const mappedListings: CarData[] = useMemo(() => {
    if (!listingsResponse || !Array.isArray(listingsResponse)) {
      return [];
    }
    return listingsResponse.map(mapApiListingToCarData);
  }, [listingsResponse]);

  // Handle car card click - navigate to detail page
  const handleCarClick = (carId: string | number) => {
    const car = mappedListings.find((c) => c.id === String(carId) || c.id === carId);
    if (car?.slug) {
      router.push(`/car/${car.slug}`);
    } else if (car?.id) {
      // Fallback to ID if slug is not available
      router.push(`/car/${car.id}`);
    }
  };

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
          <CarsListings 
            listings={mappedListings} 
            loading={isLoading} 
            error={errorMessage}
            onCarClick={handleCarClick}
          />
        </main>
      </div>
    </div>
  );
}

