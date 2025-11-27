'use client';

import Link from 'next/link';
import { Car } from '@/lib/dummyData';
import { Heart, MapPin, Gauge, Calendar, Fuel, Settings } from 'lucide-react';
import { useState } from 'react';

interface CarCardProps {
  car: Car;
  showActions?: boolean;
}

export default function CarCard({ car, showActions = true }: CarCardProps) {
  const [isFavorite, setIsFavorite] = useState(car.isFavorite || false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsFavorite(!isFavorite);
  };

  const getStatusBadge = () => {
    switch (car.status) {
      case 'pending':
        return <span className="badge-pending">Pending Review</span>;
      case 'live':
        return <span className="badge-live">Live</span>;
      case 'sold':
        return <span className="badge-sold">Sold</span>;
      default:
        return null;
    }
  };

  return (
    <Link href={`/car/${car.id}`}>
      <div className="card group cursor-pointer animate-slide-up">
        {/* Image */}
        <div className="relative w-full h-48 mb-3 rounded-lg overflow-hidden bg-gray-200">
          <img
            src={car.images[0]}
            alt={`${car.brand} ${car.model}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Status Badge */}
          <div className="absolute top-3 left-3">
            {getStatusBadge()}
          </div>

          {/* Verified Badge */}
          {car.inspectionStatus === 'approved' && (
            <div className="absolute top-3 right-3">
              <span className="badge-verified">✓ Verified</span>
            </div>
          )}

          {/* Favorite Button */}
          {showActions && (
            <button
              onClick={toggleFavorite}
              className="absolute bottom-3 right-3 bg-white p-2 rounded-full shadow-md hover:scale-110 transition-transform"
            >
              <Heart
                className={`w-5 h-5 ${
                  isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
                }`}
              />
            </button>
          )}
        </div>

        {/* Content */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">
            {car.brand} {car.model}
          </h3>
          <p className="text-sm text-gray-600 mb-3">{car.variant}</p>

          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="flex items-center text-xs text-gray-600">
              <Calendar className="w-4 h-4 mr-1" />
              {car.year}
            </div>
            <div className="flex items-center text-xs text-gray-600">
              <Gauge className="w-4 h-4 mr-1" />
              {car.kmDriven.toLocaleString()} km
            </div>
            <div className="flex items-center text-xs text-gray-600">
              <Fuel className="w-4 h-4 mr-1" />
              {car.fuelType}
            </div>
            <div className="flex items-center text-xs text-gray-600">
              <Settings className="w-4 h-4 mr-1" />
              {car.transmission}
            </div>
          </div>

          <div className="flex items-center text-sm text-gray-600 mb-3">
            <MapPin className="w-4 h-4 mr-1" />
            {car.city}
          </div>

          <div className="flex justify-between items-center pt-3 border-t border-gray-200">
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {formatPrice(car.price)}
              </p>
            </div>
            {car.views && (
              <p className="text-xs text-gray-500">{car.views} views</p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

