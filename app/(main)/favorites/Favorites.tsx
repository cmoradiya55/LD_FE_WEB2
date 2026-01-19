'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Heart, Search, Trash2 } from 'lucide-react';
import CarCard from '@/components/CarCard/CarCard';
import { Button } from '@/components/Button/Button';
import { getWishlist, getWishlistCount, clearWishlist, delRemoveFromWishlist, postAddToWishlist } from '@/utils/auth';
import { toast } from 'react-toastify';

const formatPrice = (value: number | string | undefined | null) => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return `${value.toLocaleString('en-IN')}`;
  }
  if (typeof value === 'string' && value.trim().length) {
    return value;
  }
  return '—';
};

const formatKm = (value: number | string | undefined | null) => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return `${value.toLocaleString()} km`;
  }
  if (typeof value === 'string' && value.trim().length) {
    return value;
  }
  return '—';
};

const extractWishlistItems = (payload: any): any[] => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.results)) return payload.results;
  return [];
};

const mapWishlistItem = (item: any) => {
  const listing = item?.listing ?? item;

  return {
    id: String(listing?.id ?? item?.id ?? crypto.randomUUID?.() ?? Date.now()),
    slug: listing?.slug ?? listing?.id,
    name: listing?.name ?? listing?.displayName ?? listing?.title ?? 'Saved car',
    displayName: listing?.displayName ?? listing?.name ?? 'Saved car',
    year: listing?.year ?? listing?.manufacturingYear ?? new Date().getFullYear(),
    price: formatPrice(listing?.price ?? listing?.expected_price ?? listing?.amount),
    image:
      listing?.image ||
      listing?.images?.[0]?.url ||
      listing?.photos?.[0]?.url ||
      undefined,
    ownerType: listing?.ownerType ?? listing?.owner_type ?? listing?.owner ?? '',
    fuelType: listing?.fuelType ?? listing?.fuel_type ?? listing?.fuel ?? '',
    transmissionType:
      listing?.transmissionType ??
      listing?.transmission_type ??
      listing?.transmission ??
      '',
    kmDriven: formatKm(listing?.kmDriven ?? listing?.km_driven ?? listing?.kmsDriven),
    rto: listing?.rto ?? listing?.location ?? listing?.city ?? '',
    isWishlisted: true,
  };
};

const Favorites = () => {

  const { data: wishlistResponse, isLoading: wishlistLoading, refetch: refetchWishlist } = useQuery({
    queryKey: ['GET_WISHLIST', 1, 50],
    queryFn: async () => {
      const response = await getWishlist(1, 50);
      if (response?.code === 200) {
        return response.data;
      }
      toast.error(response?.message || 'Unable to load your favorites right now.');
    },
    retry: false,
    refetchInterval: false,
    refetchOnWindowFocus: false,
    refetchOnMount: 'always',
    enabled: true,
  });

  const { data: wishlistCountResponse, isLoading: countLoading, refetch: refetchCount } = useQuery({
    queryKey: ['GET_WISHLIST_COUNT'],
    queryFn: async () => {
      const response = await getWishlistCount();
      if (response?.code === 200) {
        return response.data;
      }
      toast.error(response?.message || 'Unable to load your favorites count right now.');
    },
    retry: false,
    refetchInterval: false,
    refetchOnWindowFocus: false,
    enabled: true,
  });

  const handleClearWishlist = async () => {
    const response = await clearWishlist();
    if (response?.code === 200) {
      toast.success('Wishlist cleared successfully');
      refetchWishlist();
      refetchCount();
    } else {
      toast.error(response?.message || 'Failed to clear wishlist');
    }
  };

  const handleRemoveFromWishlist = async (listingId: number) => {
    const response = await delRemoveFromWishlist({ listing_id: listingId });
    if (response?.code === 200) {
      toast.success('Removed from favorites');
      refetchWishlist();
      refetchCount();
    } else {
      toast.error(response?.message || 'Failed to remove from wishlist');
    }
  };

  const favorites = useMemo(() => {
    if (!wishlistResponse) return [];
    const items = extractWishlistItems(wishlistResponse);
    return items.map(mapWishlistItem);
  }, [wishlistResponse]);

  const wishlistCount = useMemo(() => {
    if (wishlistCountResponse == null) {
      return favorites.length;
    }
    const countValue =
      (wishlistCountResponse as any)?.count ??
      (wishlistCountResponse as any)?.total ??
      wishlistCountResponse;
    return Number(countValue) || favorites.length;
  }, [favorites.length, wishlistCountResponse]);

  const loading = wishlistLoading || countLoading;

  const stats = useMemo(
    () => ({
      total: wishlistCount || favorites.length,
      premiumCount: favorites.filter((car) => Number(String(car.price).replace(/\D/g, '')) > 6000000)
        .length,
    }),
    [favorites, wishlistCount],
  );

  const isEmpty = !loading && favorites.length === 0;

  const handleFavoriteClick = (e: React.MouseEvent, carId: string | number) => {
    e.stopPropagation();
    const listingId = Number(carId);
    if (isNaN(listingId)) {
      toast.error('Invalid listing ID');
      return;
    }
    handleRemoveFromWishlist(listingId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-50 via-white to-pink-50 border border-blue-100/60">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.2),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(236,72,153,0.25),transparent_35%),radial-gradient(circle_at_80%_80%,rgba(59,130,246,0.1),transparent_25%)]" />
        <div className="relative px-6 sm:px-10 py-8 sm:py-12 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-100 shadow-sm">
              <Heart className="h-4 w-4 fill-red-500 text-red-500" />
              Saved with LINK DRIVE
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Your curated garage, ready to revisit
            </h1>
            <p className="text-gray-600 text-base sm:text-lg">
              Keep an eye on the cars you love. Compare specs, revisit details, or jump back in to book a test drive when you are ready.
            </p>
          </div>
          <div className="flex flex-col sm:items-end gap-3">
            <div className="rounded-xl bg-white/90 ring-1 ring-gray-200 shadow-md px-4 py-3 text-right min-w-[120px]">
              <div className="text-2xl font-bold text-gray-900">
                {loading ? '—' : stats.total}
              </div>
              <div className="text-sm text-gray-500">cars saved</div>
            </div>
            <Button href="/listings" variant="secondary" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Browse more cars
            </Button>
          </div>
        </div>
      </div>

      {/* List / Empty state */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Handpicked cars you plan to revisit</p>
            <h2 className="text-xl font-semibold text-gray-900">
              Favorites ({loading ? '…' : favorites.length})
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-blue-700 font-medium ring-1 ring-blue-100 text-sm">
              Premium picks: {loading ? '…' : stats.premiumCount}
            </span>
            {!loading && !isEmpty && (
              <Button
                variant="secondary"
                onClick={handleClearWishlist}
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Clear wishlist
              </Button>
            )}
          </div>
        </div>

        {loading && (
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
        )}

        {!loading && isEmpty && (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              <Heart className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">No saved cars yet</h3>
            <p className="text-gray-600 mb-4">
              Tap the heart icon on a car to save it here for quick access.
            </p>
            <Button href="/listings">Discover cars</Button>
          </div>
        )}

        {!loading && !isEmpty && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((car) => (
              <CarCard 
                key={car.id} 
                car={car} 
                showFavorite={true}
                isFavorite={car.isWishlisted}
                onFavoriteClick={(e) => handleFavoriteClick(e, car.id)}
              />
            ))}
          </div>
        )}


      </div>
    </div>
  );
};

export default Favorites;