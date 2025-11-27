'use client';

import { Car, Plus } from 'lucide-react';
import CarCard from '@/components/CarCard';
import { myListings } from '@/lib/dummyData';
import Link from 'next/link';

export default function MyListingsPage() {
  const pendingListings = myListings.filter((car) => car.status === 'pending');
  const liveListings = myListings.filter((car) => car.status === 'live');
  const soldListings = myListings.filter((car) => car.status === 'sold');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Listings</h1>
          <p className="text-gray-600">Manage your car listings and track bids</p>
        </div>
        <Link href="/sell/add-car" className="mt-4 sm:mt-0">
          <button className="btn-primary flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Add New Car</span>
          </button>
        </Link>
      </div>

      {/* Content */}
      {myListings.length > 0 ? (
        <div className="space-y-8">
          {/* Live Listings */}
          {liveListings.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Live ({liveListings.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {liveListings.map((car) => (
                  <div key={car.id} className="relative">
                    <CarCard car={car} showActions={false} />
                    {car.bids && car.bids.length > 0 && (
                      <Link href={`/sell/manage-bids/${car.id}`}>
                        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-8 h-8 flex items-center justify-center shadow-lg cursor-pointer hover:bg-red-600 transition-colors z-10">
                          {car.bids.filter((b) => b.status === 'pending').length}
                        </div>
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pending Listings */}
          {pendingListings.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                Pending Review ({pendingListings.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {pendingListings.map((car) => (
                  <div key={car.id}>
                    <CarCard car={car} showActions={false} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sold Listings */}
          {soldListings.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-2 h-2 bg-gray-500 rounded-full mr-2"></span>
                Sold ({soldListings.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {soldListings.map((car) => (
                  <div key={car.id} className="opacity-75">
                    <CarCard car={car} showActions={false} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-16">
          <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No listings yet
          </h3>
          <p className="text-gray-600 mb-6">
            Start selling your car today and reach thousands of buyers
          </p>
          <Link href="/sell/add-car" className="btn-primary">
            Add Your First Car
          </Link>
        </div>
      )}
    </div>
  );
}

