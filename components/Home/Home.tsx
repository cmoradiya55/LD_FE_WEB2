'use client';

import { useState } from 'react';
import CarCard from '@/components/CarCard/CarCard';
import { Button } from '@/components/Button/Button';
import { sampleCars } from '@/lib/carData';
import { cities, brands, fuelTypes } from '@/lib/carData';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import Hero from '@/components/Hero/Hero';

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

  // Helper function to parse price string (e.g., "₹5.57 lakh" -> 557000)
  const parsePrice = (priceStr: string): number => {
    const cleaned = priceStr.replace(/[₹,\s]/g, '').toLowerCase();
    const lakhMatch = cleaned.match(/([\d.]+)\s*lakh/);
    if (lakhMatch) {
      return parseFloat(lakhMatch[1]) * 100000;
    }
    const croreMatch = cleaned.match(/([\d.]+)\s*crore/);
    if (croreMatch) {
      return parseFloat(croreMatch[1]) * 10000000;
    }
    return parseFloat(cleaned) || 0;
  };

  const filteredCars = sampleCars.filter((car) => {
    const matchesSearch =
      car.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCity = !filters.city || car.location.toLowerCase().includes(filters.city.toLowerCase());
    const matchesBrand = !filters.brand || car.name.toLowerCase().includes(filters.brand.toLowerCase());
    const matchesFuel = !filters.fuelType || car.fuelType === filters.fuelType;
    const carPrice = parsePrice(car.price);
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
    <div className="max-w-7xl mx-auto pb-6 space-y-6">
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

      {/* Results Count */}
      <div className="text-sm text-gray-600">
        Showing {filteredCars.length} {filteredCars.length === 1 ? 'car' : 'cars'}
      </div>

      {/* Car Grid */}
      {filteredCars.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      ) : (
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

