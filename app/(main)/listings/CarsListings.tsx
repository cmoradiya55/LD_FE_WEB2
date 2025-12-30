'use client';

import { Car, Plus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import CarCard from '@/components/CarCard/CarCard';
import { Button } from '@/components/Button/Button';
import { CarData } from '@/lib/carData';

type ApiListing = {
  id: number;
  image?: string;
  slug?: string;
  displayName: string;
  variantName?: string;
  kmDriven?: number | null;
  fuelType?: string;
  transmissionType?: string;
  price?: number | null;
  rto?: string | null;
};

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

    if (!listings.length) {
      return (
        <div className="text-center py-12">
          <Car className="w-16 h-16 text-gray-400 mx-auto mb-3" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No listings yet
          </h3>
          <p className="text-gray-600 mb-5">
            Start selling your car today and reach thousands of buyers
          </p>
          <Button href="/sellCar/registrationNumber">Add Your First Car</Button>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            My Cars ({listings.length})
          </h2>
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <div>
          {/* <h1 className="text-3xl font-bold text-gray-900 mb-1">My Listings</h1> */}
          {/* <p className="text-gray-600 text-sm">Manage your car listings and track bids</p> */}
        </div>
        <Button
          href=""
          className="mt-3 sm:mt-0 flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Car</span>
        </Button>
      </div>

      {content}
    </div>
  );
};

export default CarsListings;

