'use client';

import { useState } from 'react';
import CarCard from '@/components/CarCard';
import { dummyCars, cities, brands, fuelTypes } from '@/lib/dummyData';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';

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

  const filteredCars = dummyCars.filter((car) => {
    if (car.status !== 'live') return false;
    
    const matchesSearch = 
      car.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.variant.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCity = !filters.city || car.city === filters.city;
    const matchesBrand = !filters.brand || car.brand === filters.brand;
    const matchesFuel = !filters.fuelType || car.fuelType === filters.fuelType;
    const matchesMinPrice = !filters.minPrice || car.price >= parseInt(filters.minPrice);
    const matchesMaxPrice = !filters.maxPrice || car.price <= parseInt(filters.maxPrice);
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Hero Section */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Find Your Perfect Car
        </h1>
        <p className="text-gray-600">
          Browse verified used cars from trusted sellers
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by brand, model, or variant..."
            className="input-field pl-12 pr-4"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filter Toggle Button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="mt-3 w-full sm:w-auto btn-secondary flex items-center justify-center space-x-2"
        >
          <SlidersHorizontal className="w-5 h-5" />
          <span>Filters</span>
          {activeFiltersCount > 0 && (
            <span className="bg-primary-600 text-white text-xs px-2 py-0.5 rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="mb-6 card animate-slide-up">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              Filters
            </h3>
            {activeFiltersCount > 0 && (
              <button
                onClick={clearFilters}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                Clear All
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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
      <div className="mb-4 text-sm text-gray-600">
        Showing {filteredCars.length} {filteredCars.length === 1 ? 'car' : 'cars'}
      </div>

      {/* Car Grid */}
      {filteredCars.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
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
            <button onClick={clearFilters} className="btn-primary">
              Clear Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}

