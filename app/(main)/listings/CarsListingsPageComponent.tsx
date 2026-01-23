'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import FilterSidebar, { FilterState } from './FilterSidebar';
import { Filter } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getListingApi, postAddToWishlist, delRemoveFromWishlist } from '@/utils/auth';
import { buildQueryStringFromFilters } from './utils';
import CarsListings from './CarsListings';
import { getStorageItem } from '@/lib/storage';
import { OwnerType } from '@/lib/data';
import { useCity } from '@/components/providers/CityProvider';

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

const getOwnerTypeLabel = (ownerType: number): string => {
  const labels: Record<number, string> = {
    [OwnerType.FIRST]: '1st Owner',
    [OwnerType.SECOND]: '2nd Owner',
    [OwnerType.THIRD]: '3rd Owner',
    [OwnerType.FOURTH]: '4th Owner',
    [OwnerType.FIFTH]: '5th Owner',
  };
  return labels[ownerType] || `Owner Type ${ownerType}`;
};

const mapApiListingToCarData = (item: ApiListing): any => {
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
  
  const final_price = 
    typeof item.final_price === 'number' && item.final_price > 0
      ? item.final_price
      : typeof item.price === 'number' && item.price > 0
      ? item.price
      : null;
  
  const customerExpectedPrice = 
    typeof item.customerExpectedPrice === 'number' && item.customerExpectedPrice > 0
      ? item.customerExpectedPrice
      : typeof item.customer_expected_price === 'number' && item.customer_expected_price > 0
      ? item.customer_expected_price
      : null;
  
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
    owner: item.ownerType ? getOwnerTypeLabel(item.ownerType) : '—',
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
  } as any;
};


const USED_CAR_MIN_YEAR_FILTER = 2010;
const USED_CAR_MAX_YEAR_FILTER = new Date().getFullYear() - 1;

export const yearStops = Array.from(
    { length: USED_CAR_MAX_YEAR_FILTER - USED_CAR_MIN_YEAR_FILTER + 1 },
    (_, idx) => USED_CAR_MIN_YEAR_FILTER + idx
);

export const budgetStops = [0, 50000, 100000, 200000, 300000, 400000, 500000, 600000, 700000, 800000, 1000000, 1200000, 1500000, 2000000, 2500000];

export const kmsStops = [0, 10000, 20000, 30000, 40000, 50000, 75000, 100000, 150000, 200000, 1250000, 150000, 200000, 500000, 10000000];


const initialFilters: FilterState = {
  cityId: null,
  isCityIncluded: null,
  status: '',
  sortBy: '',
  minPrice: budgetStops[0],
  maxPrice: budgetStops[budgetStops.length - 1],
  brand: '',
  model: '',
  fuelType: [],
  transmissionType: [],
  minModelYear: yearStops[0],
  maxModelYear: yearStops[yearStops.length - 1],
  location: '',
  ownershipType: [],
  safetyRating: '',
  minKms: kmsStops[0],
  maxKms: kmsStops[kmsStops.length - 1],
  bodyType: [],
  seats: [],
};

export default function CarsListingsPageComponent() {
  const router = useRouter();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [debouncedQueryString, setDebouncedQueryString] = useState('');
  const [isDebouncing, setIsDebouncing] = useState(false);

  const user = JSON.parse(getStorageItem('user') || '{}');
  const { cityId } = useCity();
  const userCityData = useMemo(() => ({
    cityId: cityId || null,
    isCityIncluded: user?.isCityIncluded ?? null,
  }), [cityId, user?.isCityIncluded]);

  const queryString = buildQueryStringFromFilters(filters, cityId);

  React.useEffect(() => {
    setIsDebouncing(true);
    const timeoutId = setTimeout(() => {
      setDebouncedQueryString(queryString);
      setIsDebouncing(false);
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [queryString]);

  const { data: listingsResponse, isLoading, error, refetch: refetchListingsData } = useQuery({
    queryKey: ['GET_CAR_LISTINGS_DATA', debouncedQueryString],
    queryFn: async () => {
        try {
            const response = await getListingApi(debouncedQueryString);
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
    refetchOnMount: false,
    enabled: !!debouncedQueryString,
    gcTime: 0,
    staleTime: 0,
  });


  const errorMessage = error instanceof Error ? error.message : error ? String(error) : null;

  const mappedListings: any[] = useMemo(() => {
    if (!listingsResponse || !Array.isArray(listingsResponse)) {
      return [];
    }
    return listingsResponse.map(mapApiListingToCarData);
  }, [listingsResponse]);

  const wishlistedIds = useMemo(() => {
    if (!listingsResponse || !Array.isArray(listingsResponse)) {
      return new Set<number>();
    }
    const wishlistedSet = new Set<number>();
    listingsResponse.forEach((item) => {
      if (item.isWishlisted && item.id) {
        wishlistedSet.add(item.id);
      }
    });
    return wishlistedSet;
  }, [listingsResponse]);

  const handleCarClick = (carId: string | number) => {
    const car = mappedListings.find((c) => c.id === String(carId) || c.id === carId);
    if (car?.slug) {
      router.push(`/car/${car.slug}`);
    } else if (car?.id) {
      router.push(`/car/${car.id}`);
    }
  };

  const handleFavoriteClick = async (e: React.MouseEvent, carId: string | number) => {
    e.stopPropagation();
    
    const originalListing = listingsResponse?.find((item: any) => {
      const mappedId = item.slug ?? String(item.id);
      return mappedId === String(carId) || String(item.id) === String(carId);
    });

    if (!originalListing?.id) return;

    try {
      if (originalListing.isWishlisted) {
        await delRemoveFromWishlist({ listing_id: originalListing.id });
      } else {
        await postAddToWishlist({ listing_id: originalListing.id });
      }
      await refetchListingsData();
    } catch (error) {
      console.error('Error updating wishlist:', error);
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
            loading={isLoading || isDebouncing} 
            error={errorMessage}
            onCarClick={handleCarClick}
            onFavoriteClick={handleFavoriteClick}
            wishlistedIds={wishlistedIds}
            originalListings={listingsResponse}
          />
        </main>
      </div>
    </div>
  );
}

