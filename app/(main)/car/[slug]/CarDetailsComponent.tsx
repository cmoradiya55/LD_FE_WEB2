'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import type React from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Heart,
  Share2,
  Gauge,
  Fuel,
  MapPin,
  AlertCircle,
  Users,
  Factory,
  Settings2,
  Cog,
  UserRound,
  Shield,
  CalendarDays,
  ChevronDown,
  CircleCheck,
  CircleX,
} from 'lucide-react';
import { Button } from '@/components/Button/Button';
import FeaturedImage from '@/components/FeaturedImage/FeaturedImage';
import ImagePreviewModal from './ImagePreviewModal';
import { getDetailApi, postAddToWishlist, delRemoveFromWishlist } from '@/utils/auth';
import { OwnerType } from '@/lib/data';

type ApiFeature = {
  id: number;
  name: string;
  displayName: string;
  valueType: number;
  featureValue: string | number | boolean | null;
};

type ApiImage = {
  id: number;
  imageSubtype: number;
  imageUrl: string;
  title: string;
};

type ApiImageGroup = {
  type: number;
  typeName: string;
  images: ApiImage[];
};

type ApiDetail = {
  id: number;
  slug?: string;
  displayName: string;
  variantName?: string;
  registrationYear?: number;
  kmDriven?: number | null;
  registrationNumber?: string;
  ownerType?: number;
  rtoCode?: string;
  final_price?: string | number | null;
  transmissionType?: string;
  fuelType?: string;
  displacementCc?: number;
  powerBhp?: number;
  torqueNm?: number;
  seatingCapacity?: number;
  mileageKmpl?: number;
  numberOfGears?: number;
  fuelTankCapacityLiters?: number | null;
  features?: ApiFeature[];
  images?: ApiImageGroup[];
  isWishlisted?: boolean;
  badgeType?: 'assured' | 'private';
};

const getOwnerTypeLabel = (ownerType: number): string => {
  const labels: Record<number, string> = {
    [OwnerType.FIRST]: '1st Owner',
    [OwnerType.SECOND]: '2nd Owner',
    [OwnerType.THIRD]: '3rd Owner',
    [OwnerType.FOURTH]: '4th Owner',
  };
  return labels[ownerType] || `Owner Type ${ownerType}`;
};

const formatPrice = (price: number | null): string => {
  return price !== null ? `₹${price.toLocaleString('en-IN')}/-` : 'Price not available';
};

type CarData = {
  id: string;
  slug?: string;
  name: string;
  year: number;
  price: string;
  final_price: number | null;
  image: string;
  detailOptions: {
    label: string;
    images: string[];
  }[];
  fuelType: string;
  transmission: string;
  kmsDriven: string;
  location: string;
  owner: string;
  registrationYear: string;
  registrationNumber?: string;
  insurance: string;
  seats: string;
  rto: string;
  engineDisplacement: string;
  yearOfManufacture: string;
  mileageKmpl?: number;
  displacementCc?: number;
  powerBhp?: number;
  torqueNm?: number;
  numberOfGears?: number;
  seatingCapacity?: number;
  fuelTankCapacityLiters?: number | null;
  featureList: {
    name: string;
    value: string | number | boolean | null;
    key: string;
  }[];
  badgeType: 'assured' | 'private';
  isWishlisted: boolean;
};

const mapApiDetailToCarData = (data: ApiDetail): CarData => {
  const primaryImage =
    data.images?.find((group) => group.images?.length)?.images?.[0]?.imageUrl || '';

  const detailOptions =
    data.images
      ?.map((group) => ({
        label: group.typeName || '',
        images: (group.images || []).map((img) => img.imageUrl).filter(Boolean),
      }))
      .filter((opt) => opt.images.length > 0 && opt.label) || [];

  const name = `${data.displayName}${data.variantName ? ` ${data.variantName}` : ''}`.trim();
  let final_price: number | null = null;
  if (data.final_price != null) {
    if (typeof data.final_price === 'number') {
      final_price = data.final_price;
    } else if (typeof data.final_price === 'string') {
      const parsed = parseFloat(data.final_price);
      final_price = isFinite(parsed) ? parsed : null;
    }
  }
  const price = formatPrice(final_price);

  return {
    id: String(data.id),
    slug: data.slug,
    name,
    year: data.registrationYear ?? 0,
    price,
    final_price,
    image: primaryImage,
    detailOptions,
    fuelType: data.fuelType || '—',
    transmission: data.transmissionType || '—',
    kmsDriven: data.kmDriven ? `${data.kmDriven.toLocaleString()} km` : '—',
    location: data.rtoCode || '—',
    owner: data.ownerType ? getOwnerTypeLabel(data.ownerType) : '—',
    registrationYear: data.registrationYear ? String(data.registrationYear) : '—',
    registrationNumber: data.registrationNumber || undefined,
    insurance: '—',
    seats: data.seatingCapacity ? `${data.seatingCapacity} Seats` : '—',
    rto: data.rtoCode || '—',
    engineDisplacement: data.displacementCc ? `${data.displacementCc} cc` : '—',
    yearOfManufacture: data.registrationYear ? String(data.registrationYear) : '—',
    mileageKmpl: data.mileageKmpl ?? undefined,
    displacementCc: data.displacementCc ?? undefined,
    powerBhp: data.powerBhp ?? undefined,
    torqueNm: data.torqueNm ?? undefined,
    numberOfGears: data.numberOfGears ?? undefined,
    seatingCapacity: data.seatingCapacity ?? undefined,
    fuelTankCapacityLiters: data.fuelTankCapacityLiters ?? null,
    featureList:
      data.features?.map((f) => ({
        name: f.displayName || f.name || '',
        value: f.featureValue === null || typeof f.featureValue === 'undefined' ? null : f.featureValue,
        key: f.name || f.displayName || String(f.id),
      })) || [],
    badgeType: data.badgeType || 'assured',
    isWishlisted: data.isWishlisted ?? false,
  };
};

const CarDetailsComponent: React.FC = () => {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const slug = params?.slug;
  const [car, setCar] = useState<CarData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (car?.isWishlisted !== undefined) {
      setIsFavorite(car.isWishlisted);
    }
  }, [car?.isWishlisted]);

  const loadCarDetails = useCallback(async () => {
    if (!slug) return;
    try {
      setLoading(true);
      setError(null);
      const res = await getDetailApi(slug);
      const data: ApiDetail | undefined = res?.data;
      if (data) {
        setCar(mapApiDetailToCarData({ ...data, slug }));
      } else {
        setError('Car not found.');
      }
    } catch (err) {
      setError('Unable to load car details right now.');
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    loadCarDetails();
  }, [loadCarDetails]);

  const handleFavoriteClick = async () => {
    if (!car?.id) return;

    try {
      if (car.isWishlisted) {
        await delRemoveFromWishlist({ listing_id: Number(car.id) });
      } else {
        await postAddToWishlist({ listing_id: Number(car.id) });
      }
      await loadCarDetails();
    } catch (error) {
      console.error('Error updating wishlist:', error);
    }
  };

  const categories = useMemo(() => {
    if (!car) return [];
    const withPrimary =
      car.detailOptions.length && car.detailOptions[0].images.includes(car.image)
        ? car.detailOptions
        : [
          {
            label: 'Photos',
            images: [car.image, ...car.detailOptions.flatMap((opt) => opt.images)],
          },
        ];
    return withPrimary.filter((cat) => cat.images.length > 0);
  }, [car]);


  const slides = useMemo(
    () =>
      categories.flatMap((category, categoryIndex) =>
        (category.images || []).map((image) => ({
          categoryIndex,
          image,
        })),
      ),
    [categories],
  );

  const [showImageModal, setShowImageModal] = useState(false);
  const [modalSlideIndex, setModalSlideIndex] = useState(0);
  const [showAllFeatures, setShowAllFeatures] = useState(false);
  const [showAllSpecs, setShowAllSpecs] = useState(false);
  const [openSpecSections, setOpenSpecSections] = useState<Record<string, boolean>>({
    engine: true,
    fuel: true,
    suspension: true,
    dimensions: true,
  });

  type FeatureListItem = typeof car extends { featureList: (infer F)[] } ? F : any;
  const allFeatures = useMemo<FeatureListItem[]>(() => car?.featureList ?? [], [car]);
  const summaryFeatures = useMemo(() => allFeatures.slice(0, 8), [allFeatures]);

  const specSummary = useMemo(
    () => ({
      engine: car?.engineDisplacement || '—',
      power: car?.powerBhp ? `${car.powerBhp} bhp` : '—',
      transmission: car?.transmission || '—',
      driveType: car?.numberOfGears ? `${car.numberOfGears}-speed` : '—',
      mileage: car?.mileageKmpl ? `${car.mileageKmpl} kmpl` : '—',
      fuel: car?.fuelType || '—',
      torque: car?.torqueNm ? `${car.torqueNm} Nm` : '—',
    }),
    [car],
  );

  const hasSpecData = useMemo(() => {
    if (!car) return false;
    return !!(
      car.engineDisplacement ||
      car.powerBhp ||
      car.transmission ||
      car.numberOfGears ||
      car.mileageKmpl ||
      car.fuelType ||
      car.torqueNm ||
      car.seatingCapacity ||
      car.fuelTankCapacityLiters
    );
  }, [car]);

  const hasFeatureData = allFeatures.length > 0;

  const carOverviewDetails = useMemo(
    () => {
      if (!car) return [];
      return [
        { label: 'Registration Year', value: car.registrationYear, icon: CalendarDays },
        { label: 'Registration No.', value: car.registrationNumber ?? '—', icon: Shield },
        { label: 'Fuel Type', value: car.fuelType, icon: Fuel },
        { label: 'Seats', value: car.seats, icon: Users },
        { label: 'Kms Driven', value: car.kmsDriven, icon: Gauge },
        { label: 'RTO', value: car.rto, icon: MapPin },
        { label: 'Ownership', value: car.owner, icon: UserRound },
        { label: 'Engine Displacement', value: car.engineDisplacement, icon: Cog },
        { label: 'Transmission', value: car.transmission, icon: Settings2 },
        { label: 'Year of Manufacture', value: car.yearOfManufacture, icon: Factory },
      ];
    },
    [car],
  );

  const renderFeatureValue = useCallback((value: FeatureListItem['value']): React.ReactNode => {
    if (typeof value === 'boolean') {
      const Icon = value ? CircleCheck : CircleX;
      return <Icon className={`w-4 h-4 ${value ? 'text-emerald-500' : 'text-red-500'}`} aria-label={value ? 'Yes' : 'No'} />;
    }
    if (value === null || value === '' || typeof value === 'undefined') {
      return 'Included';
    }
    return value;
  }, []);

  const handleToggleSpecSection = useCallback((key: string) => {
    setOpenSpecSections((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const closeImageModal = useCallback(() => {
    setShowImageModal(false);
  }, []);

  const nextImage = useCallback(() => {
    if (!slides.length) return;
    setModalSlideIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const previousImage = useCallback(() => {
    if (!slides.length) return;
    setModalSlideIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (!showImageModal) return;
    const el = thumbnailRefs.current[modalSlideIndex];
    el?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [modalSlideIndex, showImageModal]);

  useEffect(() => {
    if (!showImageModal) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeImageModal();
      else if (e.key === 'ArrowRight') nextImage();
      else if (e.key === 'ArrowLeft') previousImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showImageModal, closeImageModal, nextImage, previousImage]);

  const openImageModal = useCallback(() => {
    setModalSlideIndex(0);
    setShowImageModal(true);
  }, []);

  const handleCategoryChange = useCallback((categoryIndex: number) => {
    const indexForCategory = slides.findIndex((slide) => slide.categoryIndex === categoryIndex);
    setModalSlideIndex(indexForCategory === -1 ? 0 : indexForCategory);
  }, [slides]);

  const handleThumbnailClick = useCallback((index: number) => {
    setModalSlideIndex(index);
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches?.[0]) {
      touchStartX.current = e.touches[0].clientX;
      touchEndX.current = null;
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches?.[0]) {
      touchEndX.current = e.touches[0].clientX;
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const deltaX = touchStartX.current - touchEndX.current;
    const swipeThreshold = 40;

    if (Math.abs(deltaX) > swipeThreshold) {
      deltaX > 0 ? nextImage() : previousImage();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  }, [nextImage, previousImage]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-600">Loading car details…</p>
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          {error ? 'Something went wrong' : 'Car not found'}
        </h2>
        {error && <p className="text-gray-600 mb-4">{error}</p>}
        <Button variant="outline" onClick={() => router.back()}>
          {error ? 'Go Back' : 'Back to Browse'}
        </Button>
      </div>
    );
  }

  const currentSlide = slides[modalSlideIndex] ?? slides[0];
  const currentCategoryIndex = currentSlide?.categoryIndex ?? 0;
  const currentImage = currentSlide?.image ?? car?.image ?? '';

  return (
    <div className="car-details-page">

      {/* Main Content */}
      <section className="pb-4 sm:pb-6 py-6 md:pb-8">
        <div className="mx-auto px-3 sm:px-5 lg:px-6">
          <div className="max-w-7xl mx-auto">
            
            {/* Back Button */}
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="font-medium tracking-tight">Back</span>
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 md:gap-6 lg:gap-6">

              {/* Main Content */}
              <article className="lg:col-span-7 space-y-6">

                {/* Featured Image */}
                <FeaturedImage
                  src={car.image}
                  alt={car.name}
                  detailOptions={car.detailOptions}
                  onImageClick={openImageModal}
                />

                {/* Car Overview */}
                <div className="rounded-2xl border bg-white/60 backdrop-blur-sm shadow-sm">
                  <div className="px-4 py-3 sm:px-5 sm:py-4 border-b flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Key Specs</p>
                      <h3 className="text-lg font-bold text-gray-900 mt-0.5">Car Overview</h3>
                    </div>
                    <div className="hidden sm:flex items-center gap-1.5 text-xs text-blue-600 font-semibold">
                      <AlertCircle className="w-3.5 h-3.5" />
                      Verified Listing
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px">
                    {carOverviewDetails.map((item) => (
                      <div
                        key={item.label}
                        className="flex items-center gap-3 px-4 py-4 sm:px-5 sm:py-5 border-t border-gray-100 first:border-t-0 sm:first:border-t-0 bg-white"
                      >
                        <span className="h-11 w-11 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shadow-[0_0_0_1px_rgba(59,130,246,0.08)]">
                          <item.icon className="w-4.5 h-4.5" />
                        </span>
                        <div>
                          <p className="text-[11px] uppercase tracking-wide text-gray-500 font-semibold">{item.label}</p>
                          <p className="text-sm font-semibold text-gray-900">{item.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Specifications */}
                {hasSpecData && (
                  <div className="rounded-2xl border bg-white shadow-sm">
                    <div className="px-4 py-3 sm:px-5 sm:py-4 border-b">
                      <h3 className="text-lg font-semibold text-gray-900">Specifications</h3>
                    </div>

                    {/* Top summary specs (very simple grid) */}
                    <div className="px-4 sm:px-5 pt-4 pb-3 border-b border-gray-100">
                      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 text-xs sm:text-base">
                        {[
                          { label: 'Engine', value: specSummary.engine },
                          { label: 'Power', value: specSummary.power },
                          { label: 'Transmission', value: specSummary.transmission },
                          { label: 'Drive Type', value: specSummary.driveType },
                          { label: 'Mileage', value: specSummary.mileage },
                          { label: 'Fuel', value: specSummary.fuel },
                        ].map(({ label, value }) => (
                          <div key={label}>
                            <p className="text-gray-400 text-[11px] uppercase tracking-wide">{label}</p>
                            <p className="mt-0.5 font-semibold text-gray-900">{value}</p>
                          </div>
                        ))}
                      </div>

                      {/* View all / Collapse toggle */}
                      <button
                        type="button"
                        className="mt-3 inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-primary-600 hover:text-primary-700"
                        onClick={() => setShowAllSpecs((prev) => !prev)}
                      >
                        {showAllSpecs ? 'Hide detailed specs' : 'View detailed specs'}
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showAllSpecs ? 'rotate-180' : ''}`} />
                      </button>
                    </div>

                    {/* Detailed spec list with simple accordions */}
                    {showAllSpecs && (
                      <div className="px-4 sm:px-5 py-3 space-y-2 text-xs sm:text-sm">
                        {[
                          {
                            key: 'engine',
                            title: 'Engine & Performance',
                            rows: [
                              { label: 'Displacement', value: specSummary.engine },
                              { label: 'Power', value: specSummary.power },
                              { label: 'Torque', value: specSummary.torque },
                              { label: 'Fuel Type', value: specSummary.fuel },
                              { label: 'Mileage', value: specSummary.mileage },
                            ],
                          },
                          {
                            key: 'transmission',
                            title: 'Transmission',
                            rows: [
                              { label: 'Transmission Type', value: specSummary.transmission },
                              { label: 'No. of Gears', value: car.numberOfGears ? `${car.numberOfGears}` : '—' },
                            ],
                          },
                          {
                            key: 'dimensions',
                            title: 'Capacity',
                            rows: [
                              { label: 'Seating', value: car.seatingCapacity ? `${car.seatingCapacity} seats` : '—' },
                              { label: 'Fuel Tank', value: car.fuelTankCapacityLiters ? `${car.fuelTankCapacityLiters} L` : '—' },
                            ],
                          },
                        ].map((section) => {
                          const isOpen = openSpecSections[section.key] ?? true;
                          return (
                            <div key={section.key} className="border-t border-gray-100 pt-2 first:border-t-0 first:pt-0">
                              <button
                                type="button"
                                className="flex w-full items-center justify-between py-2 text-left"
                                onClick={() => handleToggleSpecSection(section.key)}
                              >
                                <p className="text-gray-900 font-semibold">{section.title}</p>
                                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? '-rotate-90' : ''}`} />
                              </button>
                              {isOpen && (
                                <div className="pb-2 space-y-1.5">
                                  {section.rows.map((row) => (
                                    <div key={row.label} className="flex items-center justify-between gap-4">
                                      <p className="text-gray-500">{row.label}</p>
                                      <p className="font-semibold text-gray-900 text-right">{row.value}</p>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* Car Features */}
                {hasFeatureData && (
                  <div className="rounded-2xl border bg-white shadow-sm">
                    <div className="px-4 py-3 sm:px-5 sm:py-4 border-b">
                      <h3 className="text-lg font-semibold text-gray-900">Features</h3>
                    </div>

                    {/* Highlighted feature cards */}
                    <div className="px-4 sm:px-5 pt-4 pb-3 border-b border-gray-100">
                      {summaryFeatures.length ? (
                        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
                          {summaryFeatures.map((feature) => (
                            <div
                              key={feature.key}
                              className="flex items-start justify-between gap-3 rounded-xl border border-gray-100 bg-gray-50 px-3 py-2.5"
                            >
                              <p className="text-[11px] uppercase tracking-wide text-gray-500 font-semibold">
                                {feature.name}
                              </p>
                              <p className="text-sm font-semibold text-gray-900">
                                {renderFeatureValue(feature.value)}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">Features coming soon</p>
                      )}

                      {/* View all / Collapse toggle */}
                      <button
                        type="button"
                        className="mt-3 inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-primary-600 hover:text-primary-700"
                        onClick={() => setShowAllFeatures((prev) => !prev)}
                      >
                        {showAllFeatures ? 'Hide full list' : 'View all features'}
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showAllFeatures ? 'rotate-180' : ''}`} />
                      </button>
                    </div>

                    {/* Full feature list from API */}
                    {showAllFeatures && (
                      <div className="px-4 sm:px-5 py-3 text-sm">
                        {allFeatures.length ? (
                          <div className="divide-y divide-gray-100">
                            {allFeatures.map((feature) => (
                              <div key={feature.key} className="flex items-start justify-between gap-3 py-2">
                                <span className="font-medium text-gray-900">{feature.name}</span>
                                <span className="text-gray-700">{renderFeatureValue(feature.value)}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500">Features not available</p>
                        )}
                      </div>
                    )}
                  </div>
                )}

              </article>

              {/* Sidebar */}
              <aside className="lg:col-span-5">
                <div className="lg:sticky lg:top-20 space-y-4 sm:space-y-5 md:space-y-6">
                  <div className="rounded-2xl border shadow-lg bg-white">
                    <div className="p-4 sm:p-5 border-b">
                      <div className="flex items-start justify-between gap-2.5">
                        <div>
                          {car.year > 0 && (
                            <p className="text-[11px] uppercase tracking-wide text-gray-500 font-semibold">{car.year}</p>
                          )}
                          <h3 className="text-lg font-semibold text-gray-900 leading-tight">{car.name}</h3>
                        </div>
                        <button
                          className={`p-1.5 rounded-full border transition-colors ${isFavorite || car.isWishlisted ? 'text-red-600 bg-red-50 border-red-200' : 'text-gray-500 hover:text-red-500 hover:bg-red-100 hover:border-red-200'}`}
                          aria-label="Save listing"
                          aria-pressed={isFavorite || car.isWishlisted}
                          onClick={handleFavoriteClick}
                        >
                          <Heart className="w-4 h-4" fill={(isFavorite || car.isWishlisted) ? 'currentColor' : 'none'} />
                        </button>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-gray-600">
                        <span>{car.kmsDriven}</span>
                        <span className="text-gray-300">•</span>
                        <span>{car.fuelType}</span>
                        <span className="text-gray-300">•</span>
                        <span>{car.transmission}</span>
                        <span className="text-gray-300">•</span>
                        <span>{car.owner}</span>
                      </div>

                      <div className="mt-4">
                        <div className="text-2xl font-bold text-gray-900">
                          {formatPrice(car.final_price)}
                        </div>
                      </div>
                    </div>

                    <div className="p-4 sm:p-5 border-b space-y-3">
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-sm font-medium leading-tight">{car.location}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between px-4 sm:px-5 py-3 text-xs text-gray-600">
                      <button className="flex items-center gap-1.5 font-medium hover:text-blue-500 transition-colors">
                        <Share2 className="w-3.5 h-3.5" />
                        Share
                      </button>
                    </div>
                  </div>

                </div>
              </aside>

            </div>

          </div>
        </div>
      </section>

      {/* Image Preview Modal */}
      <ImagePreviewModal
        isOpen={showImageModal}
        carName={car.name}
        categories={categories}
        slides={slides}
        currentCategoryIndex={currentCategoryIndex}
        currentImage={currentImage}
        modalSlideIndex={modalSlideIndex}
        thumbnailRefs={thumbnailRefs}
        onClose={closeImageModal}
        onNext={nextImage}
        onPrevious={previousImage}
        onCategoryChange={handleCategoryChange}
        onThumbnailClick={handleThumbnailClick}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />

    </div>
  );
}

export default CarDetailsComponent;