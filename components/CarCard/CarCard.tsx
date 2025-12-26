'use client';

import { Heart, MapPin, Gauge, Fuel, BadgeCheck, CarFront, CircleUserRound } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { addWishlist, removeWishlist } from '@/lib/auth';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';
import { OwnerType, FuelType, TransmissionType } from '@/lib/carData';

interface CarCardProps {
  car: any;
  showActions?: boolean;
}

const placeholderImage =
  'https://via.placeholder.com/640x360.png?text=Car+image+coming+soon';

const formatPrice = (value: number | string | undefined | null) => {
  const numeric =
    typeof value === 'number'
      ? value
      : typeof value === 'string'
        ? Number(value.replace(/[^\d.]/g, '')) || null
        : null;

  if (numeric && Number.isFinite(numeric)) {
    return numeric.toLocaleString('en-IN');
  }

  if (typeof value === 'string' && value.trim().length) {
    return value.trim();
  }

  return '—';
};

const formatKm = (value: number | string | undefined | null) => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return `${value.toLocaleString()} km`;
  }
  if (typeof value === 'string' && value.trim().length) {
    return value.trim();
  }
  return '—';
};

const getOwnerLabelFromEnum = (
  ownerType: number | string | undefined | null,
  fallback?: string,
): string => {
  if (ownerType == null || ownerType === '') {
    return fallback ?? '—';
  }

  const numeric = typeof ownerType === 'number' ? ownerType : Number(ownerType);

  const labels: Record<number, string> = {
    [OwnerType.FIRST]: 'First owner',
    [OwnerType.SECOND]: 'Second owner',
    [OwnerType.THIRD]: 'Third owner',
    [OwnerType.FOURTH]: 'Fourth owner',
  };

  if (Number.isFinite(numeric) && labels[numeric]) {
    return labels[numeric];
  }

  return fallback ?? '—';
};

const getFuelLabelFromEnum = (
  fuel: number | string | undefined | null,
  fallback?: string,
): string => {
  if (fuel == null || fuel === '') {
    return fallback ?? '—';
  }
  const numeric = typeof fuel === 'number' ? fuel : Number(fuel);
  const labels: Record<number, string> = {
    [FuelType.PETROL]: 'Petrol',
    [FuelType.DIESEL]: 'Diesel',
    [FuelType.CNG]: 'CNG',
    [FuelType.ELECTRIC]: 'Electric',
    [FuelType.HYBRID]: 'Hybrid',
  };
  if (Number.isFinite(numeric) && labels[numeric]) {
    return labels[numeric];
  }
  return String(fuel);
};

const getTransmissionLabelFromEnum = (
  transmission: number | string | undefined | null,
  fallback?: string,
): string => {
  if (transmission == null || transmission === '') {
    return fallback ?? '—';
  }
  const numeric = typeof transmission === 'number' ? transmission : Number(transmission);
  const labels: Record<number, string> = {
    [TransmissionType.MANUAL]: 'Manual',
    [TransmissionType.AUTOMATIC]: 'Automatic',
  };
  if (Number.isFinite(numeric) && labels[numeric]) {
    return labels[numeric];
  }
  return String(transmission);
};

const CarCard = ({ car, showActions = true }: CarCardProps) => {
  const [isFavorite, setIsFavorite] = useState(car.isWishlisted ?? false);
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    setIsFavorite(car.isWishlisted ?? false);
  }, [car.isWishlisted]);

  const handleCardClick = () => {
    router.push(`/car/${car.slug ?? car.id}`);
  };

  const addFavorite = async (id: string | number | undefined) => {
    if (!id) {
      toast.error('Car ID is missing');
      return;
    }
    
    const listingId = typeof id === 'number' ? id : Number(id);
    
    if (!Number.isFinite(listingId) || listingId <= 0) {
      toast.error('Invalid car ID');
      return;
    }
    
    const payload = {
      listing_id: listingId,
    };
    
    try {
      const response = await addWishlist(payload);
      if (response?.code === 200) {
        setIsFavorite(true);
        // Invalidate wishlist queries to refresh counts
        queryClient.invalidateQueries({ queryKey: ['GET_WISHLIST_COUNT'] });
        queryClient.invalidateQueries({ queryKey: ['GET_WISHLIST'] });
        // Invalidate listings to refresh wishlist state
        queryClient.invalidateQueries({ queryKey: ['GET_CAR_LISTINGS'] });
      } else {
        toast.error(response?.message || 'Failed to add to favorites');
      }
    } catch (error) {
      console.error('Error adding to favorites:', error);
      toast.error('Something went wrong. Please try again.');
    }
  }

  const removeFavorite = async (id: string | number | undefined) => {
    if (!id) {
      toast.error('Car ID is missing');
      return;
    }
    
    const listingId = typeof id === 'number' ? id : Number(id);
    
    if (!Number.isFinite(listingId) || listingId <= 0) {
      toast.error('Invalid car ID');
      return;
    }
    
    const payload = {
      listing_id: listingId,
    };
    
    try {
      const response = await removeWishlist(payload);
      if (response?.code === 200) {
        setIsFavorite(false);
        // Invalidate wishlist queries to refresh counts
        queryClient.invalidateQueries({ queryKey: ['GET_WISHLIST_COUNT'] });
        queryClient.invalidateQueries({ queryKey: ['GET_WISHLIST'] });
        // Invalidate listings to refresh wishlist state
        queryClient.invalidateQueries({ queryKey: ['GET_CAR_LISTINGS'] });
      } else {
        toast.error(response?.message || 'Failed to remove from favorites');
      }
    } catch (error) {
      console.error('Error removing from favorites:', error);
      toast.error('Something went wrong. Please try again.');
    }
  }

  const title =
    car.displayName ??
    car.name ??
    car.title ??
    'Car';

  const year = car.registrationYear ?? car.year;

  const formattedPrice = formatPrice(car.final_price ?? car.price);
  const price = (formattedPrice && formattedPrice !== '—' && formattedPrice.trim() !== '') 
    ? formattedPrice 
    : '0';

  const ownerLabel = getOwnerLabelFromEnum(
    car.ownerType ?? car.owner_type,
    car.owner,
  );

  const fuel = getFuelLabelFromEnum(car.fuelType ?? car.fuel, '—');

  const transmission = getTransmissionLabelFromEnum(
    car.transmissionType ?? car.transmission,
    '—',
  );

  const kms = formatKm(car.kmDriven ?? car.kmsDriven);

  const location =
    car.rto ??
    car.location ??
    (car.areaName && car.cityName
      ? `${car.areaName}, ${car.cityName}`
      : car.cityName ?? car.areaName ?? '—');

  const imageSrc =
    car.image ||
    car.images?.[0]?.url ||
    placeholderImage;

  return (
    <div
      onClick={handleCardClick}
      className="group relative cursor-pointer overflow-hidden rounded-xl bg-white transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10"
    >
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/0 via-purple-500/0 to-pink-500/0 p-[1px] transition-all duration-300 group-hover:from-blue-500/20 group-hover:via-purple-500/20 group-hover:to-pink-500/20">
        <div className="h-full w-full rounded-xl bg-white"></div>
      </div>

      <div className="relative">
        <div className="relative">
          <div className="h-36 sm:h-44 md:h-48 w-full overflow-hidden relative bg-[radial-gradient(circle_at_center,_#ffffff,_#f7f7fb,_#e5e7eb)] dark:bg-[radial-gradient(circle_at_center,_#f5f7fa,_#e5e7eb,_#d1d5db)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.9),_rgba(226,232,240,0.45),_rgba(148,163,184,0.35))] opacity-95 pointer-events-none"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/15 via-transparent to-transparent z-10 pointer-events-none"></div>
            <div className="relative h-full w-full z-20 flex items-center justify-center">
              <Image
                src={imageSrc}
                alt={title}
                fill
                className="object-contain transition-transform duration-500 drop-shadow-[0_10px_25px_rgba(0,0,0,0.25)] scale-[0.85]"
              />
            </div>

            {showActions && (
              <button
                onClick={async (e) => {
                  e.stopPropagation();
                  // Use listingId (numeric) if available, otherwise try to parse car.id
                  const carId = (car as any)?.listingId ?? car.id;
                  if (!carId) {
                    toast.error('Car ID is missing');
                    return;
                  }
                  if (isFavorite) {
                    await removeFavorite(carId);
                  } else {
                    await addFavorite(carId);
                  }
                }}
                className="absolute top-2 right-2 sm:top-3 sm:right-3 z-20 flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/95 backdrop-blur-sm shadow-lg transition-all duration-200 hover:bg-white hover:scale-110 active:scale-95"
                aria-label="Add to favorites"
              >
                <Heart
                  className={`h-3 w-3 sm:h-3.5 sm:w-3.5 transition-all duration-200 ${isFavorite
                    ? 'fill-red-500 text-red-500'
                    : 'text-gray-600 hover:text-red-500'
                    }`}
                />
              </button>
            )}

            <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-20 rounded-full bg-white/95 backdrop-blur-sm px-2 py-1 sm:px-2.5 sm:py-1 text-[10px] sm:text-xs font-bold text-gray-900 shadow-lg">
              {year ?? ''}
            </div>

          </div>

          <div className="absolute bottom-0 left-0 z-30">
            <div className='relative'>
              <Image
                src="/CarListCurve.svg"
                alt="CarListCurve"
                width={180}
                height={180} />
            </div>
            <div className='absolute bottom-0 left-1 flex items-center gap-1 text-[12px] sm:text-xs font-medium text-gray-700 p-1'>
              <>
                <BadgeCheck className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-blue-600 font-bold transition-colors" />
                <span>LINK DRIVE Assured</span>
              </>
            </div>
          </div>

        </div>

        <div className="p-3 sm:p-4 space-y-2 z-200">

          <div>
            <div className="flex items-start gap-0.5 sm:gap-1">
              <h3 className="text-sm sm:text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1 flex-1">
                {title}
              </h3>
              <span className='text-xs text-gray-500'>
                {car.variantName ?? ''}
              </span>
            </div>
            <div className="text-sm sm:text-base font-bold text-blue-600 whitespace-nowrap text-right">
              ₹{price}/-
            </div>
          </div>

          <div className="grid grid-cols-3 gap-1.5 sm:gap-2 pt-1.5 sm:pt-2 border-t border-gray-100">
            <div className="flex flex-col items-center justify-center gap-0.5 sm:gap-1 p-1.5 sm:p-2 rounded-lg bg-gray-100 group-hover:bg-blue-100 transition-colors duration-300">
              <CircleUserRound className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gray-600 group-hover:text-blue-600 transition-colors" />
              <span className="text-[10px] sm:text-xs font-medium text-gray-700 text-center leading-tight">
                {ownerLabel ?? ''}
              </span>
            </div>
            <div className="flex flex-col items-center justify-center gap-0.5 sm:gap-1 p-1.5 sm:p-2 rounded-lg bg-gray-100 group-hover:bg-blue-100 transition-colors duration-300">
              <Fuel className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gray-600 group-hover:text-blue-600 transition-colors" />
              <span className="text-[10px] sm:text-xs font-medium text-gray-700 text-center leading-tight">
                {fuel ?? ''}
              </span>
            </div>
            <div className="flex flex-col items-center justify-center gap-0.5 sm:gap-1 p-1.5 sm:p-2 rounded-lg bg-gray-100 group-hover:bg-blue-100 transition-colors">
              <CarFront className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gray-600 group-hover:text-blue-600 transition-colors" />
              <span className="text-[10px] sm:text-xs font-medium text-gray-700 text-center leading-tight">
                {transmission ?? ''}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1.5 sm:pt-2">
            <div className="inline-flex items-center gap-1 sm:gap-1.5 rounded-full bg-gray-100 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-xs font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
              <Gauge className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
              <span>{kms}</span>
            </div>
          </div>

        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="inline-flex items-center gap-1 w-full sm:gap-1.5 bg-gray-100 px-2 py-0.5 sm:px-2.5 sm:py-2.5 text-[10px] sm:text-[13px] font-medium text-gray-600">
            <MapPin className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-gray-600 font-bold group-hover:text-blue-600 transition-colors" />
            <span>{location}</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CarCard;
