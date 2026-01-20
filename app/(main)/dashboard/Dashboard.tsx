'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import CarCard from '@/components/CarCard/CarCard';
import { Button } from '@/components/Button/Button';
import { getMyUsedCarList, getWishlistCount, getMyUsedCarDetail } from '@/utils/auth';
import { Car, Heart, Eye, FileText } from 'lucide-react';
import { UsedCarListingStatus } from '@/lib/data';
import InspectionReportModal from '@/app/(main)/profile/my-vehicles/Component/InspectionReportModal';


const queryOptions = {
  retry: false,
  refetchInterval: false as const,
  refetchOnWindowFocus: false,
  refetchOnMount: 'always' as const,
};

export default function Dashboard() {
  const [selectedCarId, setSelectedCarId] = useState<number | null>(null);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [selectedCarData, setSelectedCarData] = useState<any>(null);

  const { data: myListingsResponse, isLoading: isLoadingListings, error: listingsError } = useQuery({
    queryKey: ['GET_MY_USED_CAR_LIST', 1, 50],
    queryFn: async () => {
      const response = await getMyUsedCarList(1, 50);
      return response?.code === 200 ? response.data : null;
    },
    ...queryOptions,
  });

  const { data: wishlistCountResponse, isLoading: isLoadingWishlistCount } = useQuery({
    queryKey: ['GET_WISHLIST_COUNT'],
    queryFn: async () => {
      try {
        const response = await getWishlistCount();
        return response?.code === 200 ? response.data : null;
      } catch {
        return null;
      }
    },
    ...queryOptions,
  });

  const favoritesCount = useMemo(() => {
    if (!wishlistCountResponse) return 0;
    const response = wishlistCountResponse as any;
    const count = response?.count ?? response?.total ?? response;
    return Number(count) || 0;
  }, [wishlistCountResponse]);

  const myListings = useMemo(() => {
    if (!myListingsResponse) return [];
    if (Array.isArray(myListingsResponse)) return myListingsResponse;
    const response = myListingsResponse as any;
    return response?.items ?? response?.data ?? response?.results ?? [];
  }, [myListingsResponse]);

  const totalViews = useMemo(
    () => myListings.reduce((sum: number, car: any) => sum + (car.views || 0), 0),
    [myListings]
  );

  const handleOpenReport = async (carId: number) => {
    setSelectedCarId(carId);
    setIsReportOpen(true);

    // Fetch the full car detail data
    try {
      const response = await getMyUsedCarDetail(String(carId));
      if (response?.code === 200) {
        setSelectedCarData(response.data);
      }
    } catch (error) {
      console.error("Error fetching car details:", error);
    }
  };

  const handleCloseReport = () => {
    setIsReportOpen(false);
    setSelectedCarId(null);
    setSelectedCarData(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
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

      <div className="mb-6 border-b border-gray-200">
        <div className="flex items-center space-x-2 pb-4 px-4 text-primary-600 font-medium">
          <Car className="w-5 h-5" />
          <span>My Listings ({myListings.length})</span>
        </div>
      </div>

      {isLoadingListings ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="h-72 animate-pulse rounded-xl border border-gray-100 bg-white shadow-sm">
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
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Error loading listings</h3>
          <p className="text-gray-600 mb-6">
            {listingsError instanceof Error ? listingsError.message : 'Unable to load your listings. Please try again later.'}
          </p>
          <Button href="/sellCar/addCar">Add Your First Car</Button>
        </div>
      ) : myListings.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {myListings.map((car: any) => {
            const pendingBids = car.bids?.filter((b: any) => b.status === 'pending').length || 0;
            return (
              <div key={car.id} className="space-y-2">
                <div className="relative border border-gray-200 rounded-xl">
                  <CarCard
                    car={car}
                    showActions={false}
                    showStatusBadge={true}
                  />
                  {pendingBids > 0 && (
                    <Link href={`/sell/manage-bids/${car.id}`}>
                      <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-8 h-8 flex items-center justify-center shadow-lg cursor-pointer hover:bg-red-600 transition-colors z-50">
                        {pendingBids}
                      </div>

                    </Link>
                  )}
                </div>
                {(car.status >= UsedCarListingStatus.APPROVED_BY_ADMIN) && (
                  <Button
                    variant='secondary'
                    className='w-full'
                    onClick={() => handleOpenReport(car.id)}
                  >
                    <FileText className='w-4 h-4 mr-2' />
                    View Inspection Report
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16">
          <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No listings yet</h3>
          <p className="text-gray-600 mb-6">Start selling your car today and reach thousands of buyers</p>
          <Button href="/sellCar/addCar">Add Your First Car</Button>
        </div>
      )}

      <InspectionReportModal
        isOpen={isReportOpen}
        carId={selectedCarId}
        carData={selectedCarData}
        onClose={handleCloseReport}
      />
    </div>
  );
}

