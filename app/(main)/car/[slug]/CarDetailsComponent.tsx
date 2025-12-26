'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import type React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CarData, DetailOptionData, FeatureListItem } from '@/lib/carData';
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
  Check,
  CircleCheck,
  CircleX,
} from 'lucide-react';
import { Button } from '@/components/Button/Button';
import FeaturedImage from '@/components/FeaturedImage/FeaturedImage';
import ImagePreviewModal from './ImagePreviewModal';
import { fetchDetails } from '@/lib/auth';

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
  final_price?: number | null;
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
};

const placeholderImage =
  'https://via.placeholder.com/1024x576.png?text=Car+image+coming+soon';

const mapApiDetailToCarData = (data: ApiDetail): CarData => {
  const primaryImage =
    data.images?.find((group) => group.images?.length)?.images?.[0]?.imageUrl ||
    placeholderImage;

  const detailOptions =
    data.images
      ?.map((group) => ({
        label: group.typeName || 'Images',
        images: (group.images || []).map((img) => img.imageUrl).filter(Boolean),
      }))
      .filter((opt) => opt.images.length > 0) || [];

  const name = `${data.displayName}${data.variantName ? ` ${data.variantName}` : ''}`.trim();
  const final_price = typeof data.final_price === 'number' ? data.final_price : null;
  const price =
    final_price !== null
      ? `₹${final_price.toLocaleString('en-IN')}/-`
      : '₹0/-';

  return {
    id: String(data.id),
    slug: data.slug,
    name,
    year: data.registrationYear ?? new Date().getFullYear(),
    price,
    final_price,
    image: primaryImage,
    detailOptions,
    fuelType: data.fuelType || '—',
    transmission: data.transmissionType || '—',
    kmsDriven: data.kmDriven ? `${data.kmDriven.toLocaleString()} km` : '—',
    location: data.rtoCode || '—',
    owner: data.ownerType ? `Owner Type ${data.ownerType}` : '—',
    registrationYear: data.registrationYear ? String(data.registrationYear) : '—',
    registrationNumber: data.registrationNumber,
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
        name: f.displayName || f.name,
        value: f.featureValue === null || typeof f.featureValue === 'undefined' ? null : f.featureValue,
        key: f.name || f.displayName || String(f.id),
      })) || [],
    badgeType: 'assured',
    isWishlisted: data.isWishlisted ?? false,
  };
};

const CarDetailsComponent: React.FC = () => {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const slug = params?.slug;
  const [car, setCar] = useState<CarData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isFavorite, setIsFavorite] = useState(false);

  // Initialize isFavorite from car.isWishlisted when car data is loaded
  useEffect(() => {
    if (car?.isWishlisted !== undefined) {
      setIsFavorite(car.isWishlisted);
    }
  }, [car?.isWishlisted]);

  useEffect(() => {
    if (!slug) return;

    const loadCar = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetchDetails(slug);
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
    };

    loadCar();
  }, [slug]);

  // Organize images by category
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

  // Flatten all images across categories for linear navigation
  const allImages = useMemo(() => {
    if (!car) return [];
    return [car.image, ...car.detailOptions.flatMap((option: DetailOptionData) => option.images)];
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

  // Feature section state (global toggle + per-category accordions)
  const [showAllFeatures, setShowAllFeatures] = useState(false);
  const allFeatures = useMemo<FeatureListItem[]>(() => car?.featureList ?? [], [car]);
  const summaryFeatures = useMemo(() => allFeatures.slice(0, 8), [allFeatures]);

  // Specifications section state (simple show more / per-section accordions)
  const [showAllSpecs, setShowAllSpecs] = useState(false);
  const [openSpecSections, setOpenSpecSections] = useState<Record<string, boolean>>({
    engine: true,
    fuel: true,
    suspension: true,
    dimensions: true,
  });

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
    const summaryValues = [
      car.engineDisplacement,
      car.powerBhp,
      car.transmission,
      car.numberOfGears,
      car.mileageKmpl,
      car.fuelType,
      car.torqueNm,
    ];
    const detailValues = [car.seatingCapacity, car.fuelTankCapacityLiters];
    return summaryValues.some((v) => v !== undefined && v !== null && v !== '—') ||
      detailValues.some((v) => v !== undefined && v !== null);
  }, [car]);

  const hasFeatureData = allFeatures.length > 0;

  const renderFeatureValue = (value: FeatureListItem['value']): React.ReactNode => {
    if (typeof value === 'boolean') {
      const Icon = value ? CircleCheck : CircleX;
      const colorClass = value ? 'text-emerald-500' : 'text-red-500';
      return <Icon className={`w-4 h-4 ${colorClass}`} aria-label={value ? 'Yes' : 'No'} />;
    }
    if (value === null || value === '' || typeof value === 'undefined') {
      return 'Included';
    }
    return value;
  };

  const handleToggleSpecSection = (key: string) => {
    setOpenSpecSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Refs for thumbnail buttons so we can keep the active one centered
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Touch swipe refs for mobile image navigation
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

  // Keep selected thumbnail centered in the strip
  useEffect(() => {
    if (!showImageModal) return;
    const el = thumbnailRefs.current[modalSlideIndex];
    if (el && el.scrollIntoView) {
      el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [modalSlideIndex, showImageModal]);

  // Keyboard navigation for image modal
  useEffect(() => {
    if (!showImageModal) return undefined;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeImageModal();
      } else if (e.key === 'ArrowRight') {
        nextImage();
      } else if (e.key === 'ArrowLeft') {
        previousImage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showImageModal, closeImageModal, nextImage, previousImage]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-600">Loading car details…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Something went wrong</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button variant="outline" onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Car not found</h2>
        <Button href="/">Back to Browse</Button>
      </div>
    );
  }

  // Helper function to parse price string (e.g., "₹5.57 lakh" -> 557000)
  const parsePrice = (priceStr: string): number => {
    const cleaned = priceStr.replace(/[₹,\s]/g, '').toLowerCase();
    const lakhMatch = cleaned.match(/([\d.]+)\s*lakh/);
    if (lakhMatch) {
      return parseFloat(lakhMatch[1]) * 100000;
    }
    const croreMatch = cleaned.match(/([\d.]+)\s*crore/);
    if (croreMatch) {
      return parseFloat(croreMatch[1]) * 10000000;
    }
    return parseFloat(cleaned) || 0;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  // const carPrice = parsePrice(car.final_price);

  const currentSlide = slides[modalSlideIndex] ?? slides[0];
  const currentCategoryIndex = currentSlide?.categoryIndex ?? 0;
  const currentImage = currentSlide?.image ?? car.image;

  const openImageModal = (index: number) => {
    const clickedImage = allImages[index];
    const slideIndex = slides.findIndex((slide) => slide.image === clickedImage);

    setModalSlideIndex(slideIndex === -1 ? 0 : slideIndex);
    setShowImageModal(true);
  };

  const handleCategoryChange = (categoryIndex: number) => {
    const indexForCategory = slides.findIndex((slide) => slide.categoryIndex === categoryIndex);
    setModalSlideIndex(indexForCategory === -1 ? 0 : indexForCategory);
  };

  const handleThumbnailClick = (index: number) => {
    setModalSlideIndex(index);
  };

  // Touch handlers for swipe navigation on small screens
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches && e.touches.length > 0) {
      touchStartX.current = e.touches[0].clientX;
      touchEndX.current = null;
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches && e.touches.length > 0) {
      touchEndX.current = e.touches[0].clientX;
    }
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const deltaX = touchStartX.current - touchEndX.current;
    const swipeThreshold = 40; // px

    if (Math.abs(deltaX) > swipeThreshold) {
      if (deltaX > 0) {
        // swipe left -> next image
        nextImage();
      } else {
        // swipe right -> previous image
        previousImage();
      }
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  const carOverviewDetails = [
    { label: 'Registration Year', value: car.registrationYear, icon: CalendarDays },
    { label: 'Registration No.', value: car.registrationNumber ?? '—', icon: Shield },
    { label: 'Fuel Type', value: car.fuelType, icon: Fuel },
    { label: 'Seats', value: car.seats, icon: Users },
    { label: 'Kms Driven', value: car.kmsDriven, icon: Gauge },
    { label: 'RTO', value: car.rto, icon: MapPin },
    { label: 'Ownership', value: car.owner, icon: UserRound },
    { label: 'Engine Displacement', value: car.engineDisplacement, icon: Cog },
    { label: 'Transmission', value: car.transmission, icon: Settings2 },
    { label: 'Year of Manufacture', value: car.yearOfManufacture, icon: Factory }
  ];

  const handleImageClick = () => {
    openImageModal(0);
  }

  return (
    <div className="car-details-page space-y-3 sm:space-y-4">

      {/* Main Content */}
      <section className="pb-4 sm:pb-6 py-6 md:pb-8">
        <div className="mx-auto px-3 sm:px-5 lg:px-6">
          <div className="max-w-7xl mx-auto">

            {/* Back Button */}
            <Button
              variant="outline"
              onClick={() => router.back()}
            >
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
                  onImageClick={handleImageClick}
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
                        <div>
                          <p className="text-gray-400 text-[11px] uppercase tracking-wide">Engine</p>
                          <p className="mt-0.5 font-semibold text-gray-900">{specSummary.engine}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-[11px] uppercase tracking-wide">Power</p>
                          <p className="mt-0.5 font-semibold text-gray-900">{specSummary.power}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-[11px] uppercase tracking-wide">Transmission</p>
                          <p className="mt-0.5 font-semibold text-gray-900">{specSummary.transmission}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-[11px] uppercase tracking-wide">Drive Type</p>
                          <p className="mt-0.5 font-semibold text-gray-900">{specSummary.driveType}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-[11px] uppercase tracking-wide">Mileage</p>
                          <p className="mt-0.5 font-semibold text-gray-900">{specSummary.mileage}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-[11px] uppercase tracking-wide">Fuel</p>
                          <p className="mt-0.5 font-semibold text-gray-900">{specSummary.fuel}</p>
                        </div>
                      </div>

                      {/* View all / Collapse toggle */}
                      <button
                        type="button"
                        className="mt-3 inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-primary-600 hover:text-primary-700"
                        onClick={() => setShowAllSpecs((prev) => !prev)}
                      >
                        {showAllSpecs ? 'Hide detailed specs' : 'View detailed specs'}
                        <ChevronDown
                          className={`w-3.5 h-3.5 transition-transform ${showAllSpecs ? 'rotate-180' : ''}`}
                        />
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
                            <div
                              key={section.key}
                              className="border-t border-gray-100 pt-2 first:border-t-0 first:pt-0"
                            >
                              <button
                                type="button"
                                className="flex w-full items-center justify-between py-2 text-left"
                                onClick={() => handleToggleSpecSection(section.key)}
                              >
                                <p className="text-gray-900 font-semibold">{section.title}</p>
                                <ChevronDown
                                  className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? '-rotate-90' : ''
                                    }`}
                                />
                              </button>

                              {isOpen && (
                                <div className="pb-2 space-y-1.5">
                                  {section.rows.map((row) => (
                                    <div
                                      key={row.label}
                                      className="flex items-center justify-between gap-4"
                                    >
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
                              <div className="flex items-start gap-2">
                                {/* <Check className="w-4 h-4 text-emerald-500 shrink-0" /> */}
                                <p className="text-[11px] uppercase tracking-wide text-gray-500 font-semibold">
                                  {feature.name}
                                </p>
                              </div>
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
                        <ChevronDown
                          className={`w-3.5 h-3.5 transition-transform ${showAllFeatures ? 'rotate-180' : ''}`}
                        />
                      </button>
                    </div>

                    {/* Full feature list from API */}
                    {showAllFeatures && (
                      <div className="px-4 sm:px-5 py-3 text-sm">
                        {allFeatures.length ? (
                          <div className="divide-y divide-gray-100">
                            {allFeatures.map((feature) => (
                              <div
                                key={feature.key}
                                className="flex items-start justify-between gap-3 py-2"
                              >
                                <div className="flex items-start gap-2">
                                  <span className="font-medium text-gray-900">{feature.name}</span>
                                </div>
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
                          <p className="text-[11px] uppercase tracking-wide text-gray-500 font-semibold">{car.year}</p>
                          <h3 className="text-lg font-semibold text-gray-900 leading-tight">{car.name}</h3>
                        </div>
                        <button
                          className={`p-1.5 rounded-full border transition-colors ${isFavorite || car.isWishlisted ? 'text-red-600 bg-red-50 border-red-200' : 'text-gray-500 hover:text-red-500 hover:bg-red-100 hover:border-red-200'}`}
                          aria-label="Save listing"
                          aria-pressed={isFavorite || car.isWishlisted}
                          onClick={() => {
                            if (isFavorite) {
                              setIsFavorite(false);
                            } else {
                              setIsFavorite(true);
                            }
                          }}
                        >
                          <Heart className="w-4 h-4" fill={isFavorite || car.isWishlisted ? 'currentColor' : 'none'} />
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
                        <div className="text-2xl font-bold text-gray-900">{car.price}</div>
                        {/* <div className="mt-1.5 text-xs">
                          {car.newCarPrice && (
                            <span className="text-gray-500">New Car Price {car.newCarPrice}</span>
                          )}
                        </div> */}
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