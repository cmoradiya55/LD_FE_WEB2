'use client';

import { useMemo } from 'react';
import CarCard from '@/components/CarCard/CarCard';

const CarsListings = ({
  listings,
  loading,
  error,
  onCarClick,
  onFavoriteClick,
  wishlistedIds,
  originalListings
}: {
  listings: any[];
  loading: boolean;
  error: string | null;
  onCarClick?: (carId: string | number) => void;
  onFavoriteClick?: (e: React.MouseEvent, carId: string | number) => void;
  wishlistedIds?: Set<number>;
  originalListings?: any[];
}) => {

  const content = useMemo(() => {
    if (loading) {
      return (
        <div className="text-center py-12 text-gray-600">Loading your listings…</div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-12 text-red-600">
          {error}
        </div>
      );
    }

    if (listings.length === 0) {
      return (
        <div className="text-center py-12 text-gray-600">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Cars Listings yet in your city.
          </h3>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {listings.map((car) => {
              const originalListing = originalListings?.find((item) => {
                const mappedId = item.slug ?? String(item.id);
                return mappedId === String(car.id) || String(item.id) === String(car.id);
              });

              const listingId = originalListing?.id;
              const isFavorite = listingId ? wishlistedIds?.has(listingId) : false;

              return (
                <div key={car.id} className="relative border border-gray-200 rounded-xl">
                  <CarCard
                    car={car}
                    showActions={true}
                    showFavorite={true}
                    isFavorite={isFavorite}
                    onClick={onCarClick}
                    onFavoriteClick={onFavoriteClick}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }, [error, listings, loading]);

  return (
    <div>
      {content}
    </div>
  );
};

export default CarsListings;

