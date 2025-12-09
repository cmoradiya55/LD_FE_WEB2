'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import type React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { sampleCars, featureCategories, specSections } from '@/lib/carData';
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
} from 'lucide-react';
import { CarData, DetailOptionData } from '@/lib/carData';
import { Button } from '@/components/Button/Button';
import FeaturedImage from '@/components/FeaturedImage/FeaturedImage';
import { useFavorites } from '@/components/providers/FavoritesProvider';
import ImagePreviewModal from './ImagePreviewModal';

const CarDetailsComponent: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const car = sampleCars.find((c: CarData) => c.id === params.slug);

  const { isFavorite, toggleFavorite } = useFavorites();

  // Organize images by category
  const categories = useMemo(() => {
    if (!car) return [];
    const exteriorOption = car.detailOptions.find(opt => opt.label === 'Exterior');
    const categories = [
      {
        label: 'Exterior',
        images: [car.image, ...(exteriorOption?.images || [])]
      },
      ...car.detailOptions
        .filter(opt => opt.label !== 'Exterior')
        .map(opt => ({
          label: opt.label,
          images: opt.images || [],
        })),
    ];
    return categories.filter(cat => cat.images.length > 0);
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
  const [openFeatureCategories, setOpenFeatureCategories] = useState<Record<string, boolean>>({
    comfort: true,
  });

  const allFeatures = useMemo(
    () => featureCategories.flatMap((category) => category.features),
    [],
  );

  const summaryFeatures = useMemo(() => allFeatures.slice(0, 8), [allFeatures]);

  const handleToggleCategory = (key: string) => {
    setOpenFeatureCategories((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

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
      engine: car?.engineDisplacement || '998 cc',
      power: '118.35 bhp',
      transmission: car?.transmission || 'Automatic',
      driveType: 'FWD',
      mileage: '18.15 kmpl',
      fuel: car?.fuelType || 'Petrol',
    }),
    [car],
  );

  const handleToggleSpecSection = (key: string) => {
    setOpenSpecSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

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

  const carPrice = parsePrice(car.price);

  const currentSlide = slides[modalSlideIndex] ?? slides[0];
  const currentCategoryIndex = currentSlide?.categoryIndex ?? 0;
  const currentImage = currentSlide?.image ?? car.image;

  // Refs for thumbnail buttons so we can keep the active one centered
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Touch swipe refs for mobile image navigation
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Keep selected thumbnail centered in the strip
  useEffect(() => {
    if (!showImageModal) return;
    const el = thumbnailRefs.current[modalSlideIndex];
    if (el && el.scrollIntoView) {
      el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [modalSlideIndex, showImageModal]);

  const openImageModal = (index: number) => {
    const clickedImage = allImages[index];
    const slideIndex = slides.findIndex((slide) => slide.image === clickedImage);

    setModalSlideIndex(slideIndex === -1 ? 0 : slideIndex);
    setShowImageModal(true);
  };

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

  const carOverviewDetails = [
    { label: 'Registration Year', value: car.registrationYear, icon: CalendarDays },
    { label: 'Insurance', value: car.insurance, icon: Shield },
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
      <section className="pb-4 sm:pb-6 md:pb-8">
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

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 md:gap-8 lg:gap-10">
              {/* Main Content */}
              <article className="lg:col-span-7 space-y-6">

                {/* Featured Image */}
                <div onClick={handleImageClick}>
                  <FeaturedImage
                    src={car.image}
                    alt={car.name}
                    detailOptions={car.detailOptions}
                  />
                </div>

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
                      {specSections.map((section) => {
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
                                className={`w-4 h-4 text-gray-400 transition-transform ${
                                  isOpen ? '-rotate-90' : ''
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

                {/* Car Features */}
                <div className="rounded-2xl border bg-white shadow-sm">
                  <div className="px-4 py-3 sm:px-5 sm:py-4 border-b">
                    <h3 className="text-lg font-semibold text-gray-900">Features</h3>
                  </div>

                  {/* Simple feature chips */}
                  <div className="px-4 sm:px-5 pt-4 pb-3 border-b border-gray-100">
                    <div className="flex flex-wrap gap-2">
                      {summaryFeatures.map((feature) => (
                        <span
                          key={feature}
                          className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-2.5 py-1 text-[11px] sm:text-xs text-gray-800"
                        >
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span>{feature}</span>
                        </span>
                      ))}
                    </div>

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

                  {/* Full feature list grouped by category with accordions */}
                  {showAllFeatures && (
                    <div className="px-4 sm:px-5 py-3 space-y-2 text-xs sm:text-sm">
                      {featureCategories.map((category: { key: string; title: string; features: string[] }) => {
                        const isOpen = openFeatureCategories[category.key] ?? true;
                        return (
                          <div
                            key={category.key}
                            className="border-t border-gray-100 pt-2 first:border-t-0 first:pt-0"
                          >
                            <button
                              type="button"
                              className="flex w-full items-center justify-between py-2 text-left"
                              onClick={() => handleToggleCategory(category.key)}
                            >
                              <p className="text-gray-900 font-semibold">{category.title}</p>
                              <ChevronDown
                                className={`w-4 h-4 text-gray-400 transition-transform ${
                                  isOpen ? '-rotate-90' : ''
                                }`}
                              />
                            </button>

                            {isOpen && (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pb-2">
                                {category.features.map((feature: string) => (
                                  <div
                                    key={feature}
                                    className="flex items-center gap-2 text-gray-800"
                                  >
                                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                                    <span>{feature}</span>
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

              </article>

              {/* Sidebar */}
              <aside className="lg:col-span-5">
                <div className="lg:sticky lg:top-[140px] space-y-4 sm:space-y-5 md:space-y-6">
                  <div className="rounded-2xl border shadow-lg bg-white">
                    <div className="p-4 sm:p-5 border-b">
                      <div className="flex items-start justify-between gap-2.5">
                        <div>
                          <p className="text-[11px] uppercase tracking-wide text-gray-500 font-semibold">{car.year}</p>
                          <h3 className="text-lg font-semibold text-gray-900 leading-tight">{car.name}</h3>
                        </div>
                        <button
                          className={`p-1.5 rounded-full border transition-colors ${isFavorite(car.id) ? 'text-red-600 bg-red-50 border-red-200' : 'text-gray-500 hover:text-red-500 hover:bg-red-100 hover:border-red-200'}`}
                          aria-label="Save listing"
                          aria-pressed={isFavorite(car.id)}
                          onClick={() => toggleFavorite(car.id)}
                        >
                          <Heart className="w-4 h-4" fill={isFavorite(car.id) ? 'currentColor' : 'none'} />
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
                        <div className="mt-1.5 text-xs">
                          {car.newCarPrice && (
                            <span className="text-gray-500">New Car Price {car.newCarPrice}</span>
                          )}
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