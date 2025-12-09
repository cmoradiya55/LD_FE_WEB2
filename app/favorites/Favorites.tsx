'use client';

import { Heart } from 'lucide-react';
import CarCard from '@/components/CarCard/CarCard';
import { Button } from '@/components/Button/Button';
import { CarData, sampleCars } from '@/lib/carData';
import { useFavorites } from '@/components/providers/FavoritesProvider';

export default function Favorites() {
  const { favoriteIds } = useFavorites();
  const myFavorites: CarData[] = sampleCars.filter((car) => favoriteIds.has(car.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Saved Cars</h1>
        <p className="text-gray-600">
          Your favorite cars are saved here for easy access
        </p>
      </div>

      {/* Content */}
      {myFavorites.length > 0 ? (
        <>
          <div className="mb-4 text-sm text-gray-600">
            {myFavorites.length} {myFavorites.length === 1 ? 'car' : 'cars'} saved
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {myFavorites.map((car: CarData) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-16">
          <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No saved cars yet
          </h3>
          <p className="text-gray-600 mb-6">
            Browse cars and click the heart icon to save your favorites
          </p>
          <Button href="/">Browse Cars</Button>
        </div>
      )}
    </div>
  );
}

