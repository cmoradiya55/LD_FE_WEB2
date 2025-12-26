'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import CarCard from '@/components/CarCard/CarCard';
import { Button } from '@/components/Button/Button';
import { ListingCar, CarData } from '@/lib/carData';
import { fetchMyUsedCarList, fetchMyUsedCarDetails, getWishlistCount, logout as logoutApi } from '@/lib/auth';
import { getUser } from '@/lib/storage';
import { useAuth } from '@/components/providers/AuthProvider';
import { generateUUID } from '@/lib/uuid';
import {
  User,
  Car,
  Heart,
  Plus,
  Eye,
  IndianRupee,
  Edit,
  LogOut,
} from 'lucide-react';

const formatPriceToString = (price: number): string => {
  if (price >= 10000000) {
    return `${(price / 10000000).toFixed(2)} crore`;
  } else if (price >= 100000) {
    return `${(price / 100000).toFixed(2)} lakh`;
  } else {
    return `${price.toLocaleString('en-IN')}`;
  }
};

const convertListingCarToCarData = (listingCar: ListingCar): CarData => {
  return {
    ...listingCar,
    ownerType: (listingCar as any)?.ownerType ?? (listingCar as any)?.owner_type,
    price: formatPriceToString(listingCar.price),
    views: listingCar.views?.toString(),
  };
};

export const useCarDetails = (carId: string | null) => {
  return useQuery({
    queryKey: ['GET_MY_USED_CAR_DETAILS', carId],
    queryFn: async () => {
      if (!carId) return null;
      try {
        const response = await fetchMyUsedCarDetails(carId);
        if (response?.code === 200) {
          return response.data;
        }
        return null;
      } catch (error) {
        console.error("Error fetching car details:", error);
        throw error;
      }
    },
    retry: false,
    refetchInterval: false,
    refetchOnWindowFocus: false,
    enabled: !!carId,
  });
};

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'seller' | 'buyer'>('seller');
  const [profile, setProfile] = useState<any | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const { logout } = useAuth();

  // Get profile data from localStorage
  useEffect(() => {
    const userData = getUser();
    setProfile(userData);
    setIsLoadingProfile(false);

    // Listen for storage changes to update profile when it's changed
    const handleStorageChange = () => {
      const updatedUser = getUser();
      setProfile(updatedUser);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('userDataUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userDataUpdated', handleStorageChange);
    };
  }, []);

  const { data: myListingsResponse, isLoading: isLoadingListings, error: listingsError } = useQuery({
    queryKey: ['GET_MY_USED_CAR_LIST', 1, 50],
    queryFn: async () => {
      try {
        const response = await fetchMyUsedCarList(1, 50);
        if (response?.code === 200) {
          return response.data;
        }
        return null;
      } catch (error) {
        console.error("Error fetching my used car listings:", error);
        throw error;
      }
    },
    retry: false,
    refetchInterval: false,
    refetchOnWindowFocus: false,
    refetchOnMount: 'always',
    enabled: true,
  });

  const { data: wishlistCountResponse, isLoading: isLoadingWishlistCount } = useQuery({
    queryKey: ['GET_WISHLIST_COUNT'],
    queryFn: async () => {
      try {
        const response = await getWishlistCount();
        if (response?.code === 200) {
          return response.data;
        }
        return null;
      } catch (error) {
        console.error("Error fetching wishlist count:", error);
        return null;
      }
    },
    retry: false,
    refetchInterval: false,
    refetchOnWindowFocus: false,
    refetchOnMount: 'always',
    enabled: true,
  });

  const { refetch: logoutRefetch } = useQuery({
    queryKey: ['LOGOUT'],
    queryFn: async () => {
      const deviceId = profile?.deviceId || profile?.device_id || generateUUID();
      const payload = {
        deviceId: String(deviceId),
        deviceType: 3,
      };
      const res = await logoutApi(payload);
      return res;
    },
    enabled: false,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const handleLogout = async () => {
    try {
      const { data } = await logoutRefetch();
      logout();
    } catch (error) {
      console.error('Logout API error:', error);
      logout();
    }
  };

  const displayName = useMemo(() => {
    return profile?.fullName || profile?.full_name || profile?.name || 'Guest User';
  }, [profile]);

  const displayEmail = useMemo(() => {
    return profile?.email || 'Not provided';
  }, [profile]);

  const displayPhone = useMemo(() => {
    const phoneNumber = profile?.mobileNo?.toString() || profile?.mobile || profile?.phone || profile?.mobile_no;
    const countryCode = profile?.countryCode || profile?.country_code || '91';

    if (phoneNumber) {
      const formattedCode = countryCode.toString().startsWith('+')
        ? countryCode.toString()
        : `+${countryCode}`;
      return `${formattedCode} ${phoneNumber.toString()}`;
    }

    return 'Not provided';
  }, [profile]);

  const favoritesCount = useMemo(() => {
    if (wishlistCountResponse == null) {
      return 0;
    }
    const countValue =
      (wishlistCountResponse as any)?.count ??
      (wishlistCountResponse as any)?.total ??
      wishlistCountResponse;
    return Number(countValue) || 0;
  }, [wishlistCountResponse]);

  const myListings = useMemo(() => {
    if (!myListingsResponse) return [];
    if (Array.isArray(myListingsResponse)) return myListingsResponse;
    if (Array.isArray(myListingsResponse?.items)) return myListingsResponse.items;
    if (Array.isArray(myListingsResponse?.data)) return myListingsResponse.data;
    if (Array.isArray(myListingsResponse?.results)) return myListingsResponse.results;
    return [];
  }, [myListingsResponse]);

  const totalViews = myListings.reduce((sum: number, car: any) => sum + (car.views || 0), 0);
  const activeBids = myListings.reduce(
    (sum: number, car: any) => sum + (car.bids?.filter((b: any) => b.status === 'pending').length || 0),
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
              <h1 className="text-2xl font-bold text-gray-900">
                {isLoadingProfile ? 'Loading...' : displayName}
              </h1>
              <p className="text-gray-600">
                {isLoadingProfile ? 'Loading...' : displayEmail}
              </p>
              <p className="text-sm text-gray-500">
                {isLoadingProfile ? 'Loading...' : displayPhone}
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              className="flex items-center space-x-2"
              href="/profile/settings/edit"
            >
              <Edit className="w-5 h-5" />
              <span>Edit Profile</span>
            </Button>
            <Button
              variant="ghost"
              className="flex items-center space-x-2 text-red-600 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Sell */}
        <Link href="/sellCar/addCar">
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

        {/* Total Views */}
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

        {/* Active Bids */}
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

        {/* Favorites */}
        <Link href="/favorites">
          <div className="card hover:shadow-lg cursor-pointer group">
            <div className="flex items-center space-x-4">
              <div className="bg-pink-100 p-3 rounded-lg group-hover:bg-pink-200 transition-colors">
                <Heart className="w-6 h-6 text-pink-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Favorites</p>
                <p className="text-lg font-bold text-gray-900">
                  {isLoadingWishlistCount ? '...' : favoritesCount}
                </p>
              </div>
            </div>
          </div>
        </Link>

      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-4 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('seller')}
          className={`pb-4 px-4 font-medium transition-colors relative ${activeTab === 'seller'
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

        {/* <button
          onClick={() => setActiveTab('buyer')}
          className={`pb-4 px-4 font-medium transition-colors relative ${activeTab === 'buyer'
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
        </button> */}
      </div>

      {/* Tab Content */}
      {activeTab === 'seller' ? (
        <div>
          {isLoadingListings ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={idx}
                  className="h-72 animate-pulse rounded-xl border border-gray-100 bg-white shadow-sm"
                >
                  <div className="h-40 bg-gray-100 rounded-t-xl" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                    <div className="h-3 bg-gray-100 rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : listingsError ? (
            <div className="text-center py-16">
              <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Error loading listings
              </h3>
              <p className="text-gray-600 mb-6">
                {listingsError instanceof Error ? listingsError.message : 'Unable to load your listings. Please try again later.'}
              </p>
              <Button href="/sellCar/addCar">Add Your First Car</Button>
            </div>
          ) : myListings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {myListings.map((car: any) => {
                const carData = convertListingCarToCarData(car);
                return (
                  <div key={car.id} className="relative">
                    <CarCard car={carData} showActions={false} />
                    {car.bids && car.bids.length > 0 && (
                      <Link href={`/sell/manage-bids/${car.id}`}>
                        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-8 h-8 flex items-center justify-center shadow-lg cursor-pointer hover:bg-red-600 transition-colors">
                          {car.bids.filter((b: any) => b.status === 'pending').length}
                        </div>
                      </Link>
                    )}
                  </div>
                );
              })}
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
              <Button href="/sellCar/addCar">Add Your First Car</Button>
            </div>
          )}
        </div>
      ) : (
        <div>
          {/* {myFavorites.length > 0 ? (
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
          )} */}
        </div>
      )}
    </div>
  );
}

