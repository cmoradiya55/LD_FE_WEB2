"use client";
import React from 'react';
import Image from 'next/image';
import {
  Car,
  Fuel,
  Gauge,
  MapPin,
  CalendarDays,
  Heart,
  BadgeCheck,
  UserRoundCheck,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  Ban,
  UserRound,
  FileText,
} from 'lucide-react';
import { UsedCarListingStatus, OwnerType } from '@/lib/data';

interface StatusBadgeConfig {
  bg: string;
  text: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

// Status badge configuration helper
const getStatusBadgeConfig = (status: number | string | undefined): StatusBadgeConfig | null => {
  if (!status) return null;
  const statusNum = typeof status === 'string' ? parseInt(status, 10) : status;

  switch (statusNum) {
    case UsedCarListingStatus.PENDING:
      return { bg: 'bg-gray-500', text: 'text-white', icon: Clock, label: 'Pending' };
    case UsedCarListingStatus.INSPECTOR_ASSIGNED:
      return { bg: 'bg-blue-500', text: 'text-white', icon: UserRound, label: 'Inspector Assigned' };
    case UsedCarListingStatus.INSPECTION_STARTED:
      return { bg: 'bg-yellow-500', text: 'text-white', icon: Clock, label: 'Inspection Started' };
    case UsedCarListingStatus.INSPECTION_COMPLETED:
      return { bg: 'bg-emerald-500', text: 'text-white', icon: CheckCircle2, label: 'Inspection Completed' };
    case UsedCarListingStatus.DETAILS_UPDATED_BY_STAFF:
      return { bg: 'bg-purple-500', text: 'text-white', icon: FileText, label: 'Details Updated' };
    case UsedCarListingStatus.APPROVED_BY_MANAGER:
      return { bg: 'bg-indigo-500', text: 'text-white', icon: BadgeCheck, label: 'Approved by Manager' };
    case UsedCarListingStatus.APPROVED_BY_ADMIN:
      return { bg: 'bg-primary-500', text: 'text-white', icon: CheckCircle2, label: 'Approved by Admin' };
    case UsedCarListingStatus.LISTED:
      return { bg: 'bg-green-500', text: 'text-white', icon: CheckCircle2, label: 'Listed' };
    case UsedCarListingStatus.SOLD:
      return { bg: 'bg-purple-600', text: 'text-white', icon: CheckCircle2, label: 'Sold' };
    case UsedCarListingStatus.REJECTED_BY_MANAGER:
      return { bg: 'bg-red-500', text: 'text-white', icon: XCircle, label: 'Rejected by Manager' };
    case UsedCarListingStatus.REJECTED_BY_ADMIN:
      return { bg: 'bg-red-500', text: 'text-white', icon: XCircle, label: 'Rejected by Admin' };
    case UsedCarListingStatus.REJECTED_BY_CUSTOMER:
      return { bg: 'bg-red-500', text: 'text-white', icon: XCircle, label: 'Rejected by Customer' };
    case UsedCarListingStatus.EXPIRED:
      return { bg: 'bg-orange-500', text: 'text-white', icon: AlertCircle, label: 'Expired' };
    case UsedCarListingStatus.CANCELLED:
      return { bg: 'bg-gray-500', text: 'text-white', icon: Ban, label: 'Cancelled' };
    default:
      return { bg: 'bg-gray-500', text: 'text-white', icon: Clock, label: 'Unknown' };
  }
};

interface CarCardProps {
  car: any;
  onClick?: (carId: string | number) => void;
  showActions?: boolean;
  showFavorite?: boolean;
  isFavorite?: boolean;
  onFavoriteClick?: (e: React.MouseEvent, carId: string | number) => void;
  showStatusBadge?: boolean;
  statusBadgeText?: string;
  className?: string;
}

const CarCard: React.FC<CarCardProps> = ({
  car,
  onClick,
  showActions = false,
  showFavorite = false,
  isFavorite = false,
  onFavoriteClick,
  showStatusBadge = false,
  statusBadgeText,
  className = "",
}) => {
  const shouldShowFavorite = showFavorite || showActions;

  const title = car.name || car.displayName || 'Car';
  const year = car.year ?? car.registrationYear ?? '';

  const kmsDriven =
    car.kmsDriven ??
    (typeof car.kmDriven === 'number'
      ? `${car.kmDriven.toLocaleString('en-IN')} km`
      : '');

  const transmission = car.transmission ?? car.transmissionType ?? '';

  const getOwnerTypeLabel = (ownerType: number): string => {
    const labels: Record<number, string> = {
      [OwnerType.FIRST]: '1st Owner',
      [OwnerType.SECOND]: '2nd Owner',
      [OwnerType.THIRD]: '3rd Owner',
      [OwnerType.FOURTH]: '4th Owner',
      [OwnerType.FIFTH]: '5th Owner',
    };
    return labels[ownerType] || `Owner Type ${ownerType}`;
  };

  const owner =
    car.owner ??
    (typeof car.ownerType === 'number'
      ? getOwnerTypeLabel(car.ownerType)
      : '');

  const location =
    car.location ??
    [car.areaName, car.cityName].filter(Boolean).join(', ');

  const statusConfig = getStatusBadgeConfig(car.status);
  const statusLabel = statusBadgeText ?? car.statusLabel ?? statusConfig?.label ?? '';

  const customerExpectedValue =
    car.customerExpectedPrice ??
    (typeof car.price === 'number' && car.price > 0
      ? `₹${car.price.toLocaleString('en-IN')}/-`
      : '');

  const handleClick = () => onClick?.(car.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFavoriteClick?.(e, car.id);
  };

  const getCarPrice = (car: any): string => {
    console.log("getCarPrice", car);
    let priceValue = null;
    if (car.linkDrivePrice) {
      console.log("linkDrivePrice", car.linkDrivePrice);
      priceValue = `₹${Number(car.linkDrivePrice).toLocaleString('en-IN')}/-`;
    } else if (car.managerSuggestedPrice) {
      console.log("managerSuggestedPrice", car.managerSuggestedPrice);
      priceValue = `₹${Number(car.managerSuggestedPrice).toLocaleString('en-IN')}/-`;
    } else if (car.final_price) {
      console.log('final_price', car.final_price);
      priceValue = `₹${Number(car.final_price).toLocaleString('en-IN')}/-`;
    } else if (car.price) {
      console.log('price', car.price);
      priceValue = `₹${Number(car.price).toLocaleString('en-IN')}/-`;
    } else {
      return 'Price Not Available';
    }
    console.log("price value", priceValue);

    return priceValue;
  }

  return (
    <div
      onClick={handleClick}
      className={`group relative cursor-pointer overflow-hidden rounded-xl bg-white transition-all duration-300 ${className}`}
    >
      {/* Content Container */}
      <div className="relative">
        {/* Car Image */}
        <div className="relative">
          <div className="h-36 sm:h-44 md:h-48 w-full overflow-hidden relative bg-[radial-gradient(circle_at_center,_#ffffff,_#f7f7fb,_#e5e7eb)] dark:bg-[radial-gradient(circle_at_center,_#f5f7fa,_#e5e7eb,_#d1d5db)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.9),_rgba(226,232,240,0.45),_rgba(148,163,184,0.35))] opacity-95 pointer-events-none"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/15 via-transparent to-transparent z-10 pointer-events-none"></div>
            <div className="relative h-full w-full z-20 flex items-center justify-center">
              <Image
                src={car.image}
                alt={title}
                fill
                className="object-contain transition-transform duration-500 drop-shadow-[0_10px_25px_rgba(0,0,0,0.25)] scale-[0.85]"
              />
            </div>

            {/* Favorite Button */}
            {shouldShowFavorite && (
              <button
                onClick={handleFavoriteClick}
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

            {/* Year Badge */}
            <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-20 rounded-full bg-white/95 backdrop-blur-sm px-2 py-1 sm:px-2.5 sm:py-1 text-[10px] sm:text-xs font-bold text-gray-900 shadow-lg">
              {year}
            </div>

            {/* Status Badge */}
            {showStatusBadge && statusLabel && (() => {
              const config = statusConfig || { bg: 'bg-gray-500', text: 'text-white', icon: Clock, label: statusLabel };
              const Icon = config.icon;
              return (
                <div className={`absolute ${shouldShowFavorite ? 'top-10 sm:top-12' : 'top-2 sm:top-3'} right-2 sm:right-3 z-20`}>
                  <div className={`flex items-center gap-1.5 ${config.bg} ${config.text} px-2 py-1 rounded-full shadow-lg`}>
                    <Icon className="h-3 w-3" />
                    <span className="text-[11px] font-semibold">{statusLabel}</span>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Badge - Assured or Private Seller */}
          {car.badgeType === 'assured' && (
            <div className="absolute bottom-0 left-0 z-30">
              <div className="relative">
                <Image
                  src="/CarListCurve.svg"
                  alt="CarListCurve"
                  width={180}
                  height={100}
                />
              </div>
              <div className="absolute bottom-0 left-1 flex items-center gap-1 text-[12px] sm:text-xs font-medium text-gray-700 p-1">
                <BadgeCheck className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-primary-600 font-bold transition-colors" />
                <span>LINK DRIVE Assured</span>
              </div>
            </div>
          )}

        </div>

        {/* Car Details */}
        <div className="p-3 sm:p-4 space-y-2 z-200">
          {/* Car Name and Price */}
          <div>
            <div className="flex items-start justify-between gap-1.5 sm:gap-2">
              <h3 className="text-sm sm:text-base font-bold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-1 flex-1">
                {title}
              </h3>
              <div className="text-sm sm:text-base font-bold text-primary-600 whitespace-nowrap">
                {getCarPrice(car)}
              </div>
            </div>
            {/* Price Details */}
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {customerExpectedValue && (
                <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-primary-50 border border-primary-200">
                  <span className="text-[10px] sm:text-xs font-medium text-primary-700">
                    Customer Expected: {customerExpectedValue}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Specs Grid */}
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2 pt-1.5 sm:pt-2 border-t border-gray-100">
            {[
              { icon: Gauge, label: kmsDriven },
              { icon: Fuel, label: car.fuelType },
              { icon: Car, label: transmission },
            ].map(({ icon: Icon, label }, index) => (
              <div key={index} className="flex flex-col items-center gap-0.5 sm:gap-1 p-1.5 sm:p-2 rounded-lg bg-gray-100 group-hover:bg-primary-100 transition-colors duration-300">
                <Icon className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gray-600 group-hover:text-primary-600 transition-colors" />
                <span className="text-[10px] sm:text-xs font-medium text-gray-700 text-center leading-tight">
                  {label}
                </span>
              </div>
            ))}
          </div>

          {/* Owner Badge */}
          <div className="flex items-center justify-between pt-1.5 sm:pt-2">
            <div className="inline-flex items-center gap-1 sm:gap-1.5 rounded-full bg-gray-100 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-xs font-medium text-gray-700 group-hover:text-primary-600 transition-colors">
              <CalendarDays className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
              <span>{owner}</span>
            </div>
          </div>
        </div>

        {/* Location Badge */}
        {location && (
          <div className="flex items-center justify-between pt-1">
            <div className="inline-flex items-center gap-1 w-full sm:gap-1.5 bg-gray-100 px-2 py-0.5 sm:px-2.5 sm:py-2.5 text-[10px] sm:text-[13px] font-medium text-gray-600 rounded-b-lg group-hover:text-primary-600 transition-colors">
              <MapPin className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-gray-600 font-bold group-hover:text-primary-600 transition-colors" />
              <span className="line-clamp-1">{location}</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default CarCard;
