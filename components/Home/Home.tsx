'use client';

import { useState, useMemo } from 'react';
import CarCard from '@/components/CarCard/CarCard';
import { Button } from '@/components/Button/Button';
import { CarData } from '@/lib/carData';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import Hero from '@/components/Hero/Hero';
import { useQuery } from '@tanstack/react-query';
import { fetchListings } from '@/lib/auth';
import { getUser } from '@/lib/storage';

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
  displayName: string;
  variantName?: string;
  image?: string | null;
  areaName?: string;
  cityName?: string;
  registrationYear?: number;
  kmDriven?: number | null;
  registrationNumber?: string;
  ownerType?: number;
  rtoCode?: string;
  final_price?: number | null;
  price?: number | null;
  isWishlisted?: boolean;
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
};

const placeholderImage =
  'https://via.placeholder.com/640x360.png?text=Car+image+coming+soon';

const mapApiListingToCarData = (item: ApiListing): CarData => {
  // Extract primary image from images array
  const primaryImage =
    (item.image ??
      item.images?.find((group) => group.images?.length)?.images?.[0]?.imageUrl) ||
    placeholderImage;

  // Map images to detailOptions format
  const detailOptions =
    item.images
      ?.map((group) => ({
        label: group.typeName || 'Images',
        images: (group.images || []).map((img) => img.imageUrl).filter(Boolean),
      }))
      .filter((opt) => opt.images.length > 0) || [];

  const name = `${item.displayName}${item.variantName ? ` ${item.variantName}` : ''}`.trim();
  const year = item.registrationYear ?? new Date().getFullYear();
  const resolvedPrice =
    typeof item.final_price === 'number'
      ? item.final_price
      : typeof item.price === 'number'
        ? item.price
        : null;

  const final_price = resolvedPrice;
  const price =
    resolvedPrice !== null
      ? `${resolvedPrice.toLocaleString('en-IN')}`
      : '0';

  const areaCityLocation =
    item.areaName && item.cityName
      ? `${item.areaName}, ${item.cityName}`
      : item.cityName ?? item.areaName ?? '';

  const base: CarData = {
    id: item.slug ?? String(item.id),
    slug: item.slug,
    name,
    year,
    price,
    final_price,
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
  };

  const enriched: any = {
    ...base,
    displayName: item.displayName,
    variantName: item.variantName,
    ownerType: item.ownerType,
    areaName: item.areaName,
    cityName: item.cityName,
    kmDriven: item.kmDriven ?? undefined,
    final_price,
    price: price,
    fuelType: item.fuelType,
    transmissionType: item.transmissionType,
    listingId: item.id,
    isWishlisted: item.isWishlisted ?? base.isWishlisted ?? false,
  };

  return enriched as CarData;
};

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    city: '',
    brand: '',
    fuelType: '',
    minPrice: '',
    maxPrice: '',
    maxYear: '',
  });

  const user = getUser();
  const userCityData = useMemo(() => ({
    cityId: user?.cityId || null,
    isCityIncluded: user?.isCityIncluded ?? null,
  }), [user?.cityId, user?.isCityIncluded]);

  const queryParams = useMemo(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.append('search', searchQuery);
    if (filters.city) params.append('rto', filters.city);
    if (filters.brand) params.append('brand', filters.brand);
    if (filters.fuelType) params.append('fuelType', filters.fuelType);
    if (filters.minPrice) params.append('minPrice', filters.minPrice);
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
    if (filters.maxYear) params.append('maxYear', filters.maxYear);
    
    if (userCityData.cityId) {
      params.append('cityId', String(userCityData.cityId));
      const isCityIncluded = userCityData.isCityIncluded !== null && userCityData.isCityIncluded !== undefined 
        ? userCityData.isCityIncluded 
        : true;
      params.append('isCityIncluded', String(isCityIncluded));
    }
    
    return params.toString();
  }, [searchQuery, filters, userCityData.cityId, userCityData.isCityIncluded]);

  const { data: listingsResponse, isLoading, error } = useQuery({
    queryKey: ['GET_CAR_LISTINGS', queryParams, userCityData.cityId, userCityData.isCityIncluded],
    queryFn: async () => {
      try {
        const response = await fetchListings(queryParams);
        if (response.code === 200) {
          return response.data;
        }
        return [];
      } catch (error) {
        console.error("Error fetching car listings:", error);
        throw error;
      }
    },
    retry: false,
    refetchInterval: false,
    refetchOnWindowFocus: false,
    enabled: true,
  });

  const cars: CarData[] = useMemo(() => {
    if (!listingsResponse || !Array.isArray(listingsResponse)) {
      return [];
    }
    return listingsResponse.map(mapApiListingToCarData);
  }, [listingsResponse]);

  const { cities, brands, fuelTypes } = useMemo(() => {
    const uniqueCities = Array.from(new Set(cars.map(car => car.rto).filter(Boolean))).sort();
    const uniqueBrands = Array.from(new Set(cars.map(car => car.name.split(' ')[0]).filter(Boolean))).sort();
    const uniqueFuelTypes = Array.from(new Set(cars.map(car => car.fuelType).filter(Boolean))).sort();
    return {
      cities: uniqueCities,
      brands: uniqueBrands,
      fuelTypes: uniqueFuelTypes,
    };
  }, [cars]);

  const filteredCars = cars.filter((car) => {
    const matchesSearch =
      car.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCity = !filters.city || car.location.toLowerCase().includes(filters.city.toLowerCase());
    const matchesBrand = !filters.brand || car.name.toLowerCase().includes(filters.brand.toLowerCase());
    const matchesFuel = !filters.fuelType || car.fuelType === filters.fuelType;
    const carPrice = car.final_price ?? 0;
    const matchesMinPrice = !filters.minPrice || carPrice >= parseInt(filters.minPrice);
    const matchesMaxPrice = !filters.maxPrice || carPrice <= parseInt(filters.maxPrice);
    const matchesYear = !filters.maxYear || car.year <= parseInt(filters.maxYear);

    return matchesSearch && matchesCity && matchesBrand && matchesFuel &&
      matchesMinPrice && matchesMaxPrice && matchesYear;
  });

  const clearFilters = () => {
    setFilters({
      city: '',
      brand: '',
      fuelType: '',
      minPrice: '',
      maxPrice: '',
      maxYear: '',
    });
  };

  const activeFiltersCount = Object.values(filters).filter(v => v !== '').length;

  return (
    <div className="max-w-7xl mx-auto pb-6 px-6 pt-2 space-y-6">
      {/* Hero Section */}
      <Hero />

      {/* Search Bar */}
      <div className="card bg-white/95 space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by brand, model, or variant..."
            className="input-field pl-12 pr-4 bg-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-gray-500 mr-2">Quick tags:</span>
          {['SUV', 'Sedan', 'Under ₹10L', 'Automatic', 'Low KM'].map((tag) => (
            <button
              key={tag}
              className="px-4 py-1.5 rounded-full bg-primary-50 text-primary-600 font-medium hover:bg-primary-100 transition-colors"
              onClick={() => setSearchQuery(tag)}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Filter Toggle Button */}
        <Button
          onClick={() => setShowFilters(!showFilters)}
          className="w-full sm:w-auto flex items-center justify-center space-x-2 mt-2"
        >
          <SlidersHorizontal className="w-5 h-5" />
          <span>Filters</span>
          {activeFiltersCount > 0 && (
            <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </Button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="mb-4 card animate-slide-up bg-white/90">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              Filters
            </h3>
            {activeFiltersCount > 0 && (
              <button
                onClick={clearFilters}
                className="text-sm text-primary-600 hover:text-primary-700 font-semibold"
              >
                Clear All
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <select
                className="input-field"
                value={filters.city}
                onChange={(e) => setFilters({ ...filters, city: e.target.value })}
              >
                <option value="">All Cities</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brand
              </label>
              <select
                className="input-field"
                value={filters.brand}
                onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
              >
                <option value="">All Brands</option>
                {brands.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fuel Type
              </label>
              <select
                className="input-field"
                value={filters.fuelType}
                onChange={(e) => setFilters({ ...filters, fuelType: e.target.value })}
              >
                <option value="">All Fuel Types</option>
                {fuelTypes.map((fuel) => (
                  <option key={fuel} value={fuel}>
                    {fuel}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Min Price (₹)
              </label>
              <input
                type="number"
                className="input-field"
                placeholder="e.g., 500000"
                value={filters.minPrice}
                onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Price (₹)
              </label>
              <input
                type="number"
                className="input-field"
                placeholder="e.g., 2000000"
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Year (up to)
              </label>
              <input
                type="number"
                className="input-field"
                placeholder="e.g., 2023"
                value={filters.maxYear}
                onChange={(e) => setFilters({ ...filters, maxYear: e.target.value })}
              />
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12 text-gray-600">
          Loading cars...
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="text-center py-12 text-red-600">
          {error instanceof Error ? error.message : 'Failed to load cars. Please try again later.'}
        </div>
      )}

      {/* Results Count */}
      {!isLoading && !error && (
        <div className="text-sm text-gray-600">
          Showing {filteredCars.length} {filteredCars.length === 1 ? 'car' : 'cars'}
        </div>
      )}

      {/* Car Grid */}
      {!isLoading && !error && filteredCars.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      )}

      {/* No Results */}
      {!isLoading && !error && filteredCars.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No cars found
          </h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your filters or search query
          </p>
          {activeFiltersCount > 0 && (
            <Button onClick={clearFilters}>Clear Filters</Button>
          )}
        </div>
      )}
    </div>
  );
}

