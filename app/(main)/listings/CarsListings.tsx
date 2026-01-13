'use client';

import { useMemo } from 'react';
import CarCard from '@/components/CarCard/CarCard';
import { CarData } from '@/lib/carData';
import Image from 'next/image';

const placeholderImage =
  'https://via.placeholder.com/640x360.png?text=Listing+image+coming+soon';


const CarsListings = ({ listings, loading, error }: { listings: CarData[], loading: boolean, error: string | null }) => {
 
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

    if(listings.length === 0) {
      return (
        <div className="text-center py-12 text-gray-600">
          {/* <Image src={placeholderImage} alt="No Cars Listings" width={100} height={100} /> */}
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
            {listings.map((car) => (
              <div key={car.id} className="relative">
                <CarCard car={car} showActions={true} />
              </div>
            ))}
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

