'use client';

import { useState } from 'react';
import Link from 'next/link';
import CarCard from '@/components/CarCard/CarCard';
import { Button } from '@/components/Button/Button';
import { currentUser, myListings, sampleCars } from '@/lib/carData';
import { useFavorites } from '@/components/providers/FavoritesProvider';
import {
  User,
  Car,
  Heart,
  Plus,
  TrendingUp,
  Eye,
  IndianRupee,
  Edit,
  LogOut,
} from 'lucide-react';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'seller' | 'buyer'>('seller');
  const { favoriteIds } = useFavorites();
  const myFavorites = sampleCars.filter((car) => favoriteIds.has(car.id));

  const totalViews = myListings.reduce((sum, car) => sum + (car.views || 0), 0);
  const activeBids = myListings.reduce(
    (sum, car) => sum + (car.bids?.filter((b) => b.status === 'pending').length || 0),
    0
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Profile Header */}
      <div className="card mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
          <div className="flex items-center space-x-4 mb-4 sm:mb-0">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{currentUser.name}</h1>
              <p className="text-gray-600">{currentUser.email}</p>
              <p className="text-sm text-gray-500">{currentUser.phone}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="ghost" className="flex items-center space-x-2">
              <Edit className="w-5 h-5" />
              <span>Edit Profile</span>
            </Button>
            <Button
              variant="ghost"
              className="flex items-center space-x-2 text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Link href="/sell/add-car">
          <div className="card hover:shadow-lg cursor-pointer group">
            <div className="flex items-center space-x-4">
              <div className="bg-primary-100 p-3 rounded-lg group-hover:bg-primary-200 transition-colors">
                <Plus className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Sell</p>
                <p className="text-lg font-bold text-gray-900">Add Car</p>
              </div>
            </div>
          </div>
        </Link>

        <div className="card">
          <div className="flex items-center space-x-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <Eye className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Views</p>
              <p className="text-lg font-bold text-gray-900">{totalViews}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <IndianRupee className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Bids</p>
              <p className="text-lg font-bold text-gray-900">{activeBids}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Heart className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Favorites</p>
              <p className="text-lg font-bold text-gray-900">{myFavorites.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-4 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('seller')}
          className={`pb-4 px-4 font-medium transition-colors relative ${
            activeTab === 'seller'
              ? 'text-primary-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center space-x-2">
            <Car className="w-5 h-5" />
            <span>My Listings ({myListings.length})</span>
          </div>
          {activeTab === 'seller' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('buyer')}
          className={`pb-4 px-4 font-medium transition-colors relative ${
            activeTab === 'buyer'
              ? 'text-primary-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center space-x-2">
            <Heart className="w-5 h-5" />
            <span>Saved Cars ({myFavorites.length})</span>
          </div>
          {activeTab === 'buyer' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600" />
          )}
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'seller' ? (
        <div>
          {myListings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {myListings.map((car) => (
                <div key={car.id} className="relative">
                  <CarCard car={car} showActions={false} />
                  {car.bids && car.bids.length > 0 && (
                    <Link href={`/sell/manage-bids/${car.id}`}>
                      <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-8 h-8 flex items-center justify-center shadow-lg cursor-pointer hover:bg-red-600 transition-colors">
                        {car.bids.filter((b) => b.status === 'pending').length}
                      </div>
                    </Link>
                  )}
                </div>
              ))}
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
              <Button href="/sell/add-car">Add Your First Car</Button>
            </div>
          )}
        </div>
      ) : (
        <div>
          {myFavorites.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {myFavorites.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No saved cars yet
              </h3>
              <p className="text-gray-600 mb-6">
                Browse cars and save your favorites to view them later
              </p>
              <Button href="/">Browse Cars</Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

