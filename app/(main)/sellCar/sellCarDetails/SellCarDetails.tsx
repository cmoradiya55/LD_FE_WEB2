'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ChevronLeft,
  CheckCircle2,
  MapPin,
  Calendar,
  Gauge,
  User,
  Camera,
  Image as ImageIcon,
  Car,
  CarFront,
  Sparkles,
  BadgeIndianRupee,
  X,
} from 'lucide-react';
import { brandOptions, ownershipLabels, OwnershipType, kilometerDrivenLabels, KilometerDriven } from '../addCar/data';
import { Button } from '@/components/Button/Button';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { getCarBrands, getCarModelByYearAndBrandId, postCreateSellCar } from '@/utils/auth';
import { getStorageItem } from '@/lib/storage';

interface CarDetails {
  brand: string;
  year: string;
  model: string;
  variant: string;
  variantName?: string;
  ownership: string;
  kilometerDriven: string;
  location: string;
  price: string;
  photos: string;
  fuelType?: string;
  transmissionType?: string;
}

interface StoredData {
  selectionLabels?: { brand?: string; model?: string; location?: string };
  locationData?: { formatted?: string; city?: string; pincode?: string };
  photoPreviews?: string[];
  photoKeys?: string[];
  fuelType?: string;
  transmissionType?: string;
  registrationNumber?: string;
  registrationNumberFormatted?: string;
  selections?: { price?: string };
}

const SellCarDetails: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [carDetails, setCarDetails] = useState<CarDetails | null>(null);
  const [brandLogo, setBrandLogo] = useState<string>('');
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [activePanel, setActivePanel] = useState<'steps' | 'details'>('steps');
  const [displayLabels, setDisplayLabels] = useState<{ brand?: string; model?: string; location?: string }>({});
  const [locationData, setLocationData] = useState<{ formatted?: string; city?: string; pincode?: string } | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper to get stored data from localStorage
  const getStoredData = (): StoredData | null => {
    if (typeof window === 'undefined') return null;
    try {
      const stored = getStorageItem('sellCarDetails');
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      console.error('Error parsing stored data', e);
      return null;
    }
  };

  // Initialize car details from URL params
  useEffect(() => {
    const details: CarDetails = {
      brand: searchParams.get('brand') || '',
      year: searchParams.get('year') || '',
      model: searchParams.get('model') || '',
      variant: searchParams.get('variant') || '',
      variantName: searchParams.get('variantName') || '',
      ownership: searchParams.get('ownership') || '',
      kilometerDriven: searchParams.get('kilometerDriven') || '',
      location: searchParams.get('location') || '',
      price: searchParams.get('price') || '',
      photos: searchParams.get('photos') || '',
    };
    setCarDetails(details);
  }, [searchParams]);

  // Load data from localStorage once
  useEffect(() => {
    const stored = getStoredData();
    if (!stored) return;

    if (stored.selectionLabels) {
      setDisplayLabels({
        brand: stored.selectionLabels.brand,
        model: stored.selectionLabels.model,
        location: stored.selectionLabels.location,
      });
    }

    if (stored.locationData) {
      setLocationData(stored.locationData);
    }

    if (Array.isArray(stored.photoPreviews)) {
      setPhotoPreviews(stored.photoPreviews);
    }

    if (stored.fuelType || stored.transmissionType) {
      setCarDetails((prev) =>
        prev
          ? {
              ...prev,
              fuelType: stored.fuelType || prev.fuelType,
              transmissionType: stored.transmissionType || prev.transmissionType,
            }
          : prev
      );
    }
  }, []);

  // Fetch brands if needed
  const { data: brandsResponse } = useQuery({
    queryKey: ['FETCH_SELL_CAR_BRANDS'],
    queryFn: () => getCarBrands(),
    retry: false,
    refetchInterval: false,
    refetchOnWindowFocus: false,
    enabled: !!(carDetails?.brand && !displayLabels.brand),
  });

  // Fetch models if needed
  const { data: modelsResponse } = useQuery({
    queryKey: ['FETCH_SELL_CAR_MODELS_WITH_YEAR', carDetails?.brand, carDetails?.year],
    queryFn: () => getCarModelByYearAndBrandId(carDetails!.brand, carDetails!.year),
    retry: false,
    refetchInterval: false,
    refetchOnWindowFocus: false,
    enabled: !!(carDetails?.brand && carDetails?.year && carDetails?.model && !displayLabels.model),
  });

  // Process brands response
  useEffect(() => {
    if (!brandsResponse || !carDetails?.brand || displayLabels.brand) return;

    const brands = Array.isArray(brandsResponse?.data) ? brandsResponse.data : Array.isArray(brandsResponse) ? brandsResponse : [];
    const brand = brands.find((b: any) => String(b.id) === String(carDetails.brand));
    if (brand) {
      setDisplayLabels((prev) => ({ ...prev, brand: brand.displayName || brand.name }));
      const brandOption = brandOptions.find((b) => b.name === (brand.displayName || brand.name));
      setBrandLogo(brandOption?.logo || brand.logo || '');
    }
  }, [brandsResponse, carDetails?.brand, displayLabels.brand]);

  // Process models response
  useEffect(() => {
    if (!modelsResponse || !carDetails?.model || displayLabels.model) return;

    const models = Array.isArray(modelsResponse?.data) ? modelsResponse.data : Array.isArray(modelsResponse) ? modelsResponse : [];
    const model = models.find((m: any) => String(m.id ?? m.name ?? m.displayName ?? '') === String(carDetails.model));
    if (model) {
      setDisplayLabels((prev) => ({ ...prev, model: model.displayName || model.name }));
    }
  }, [modelsResponse, carDetails?.model, displayLabels.model]);

  // Helper functions
  const getDisplayValue = (key: 'brand' | 'model' | 'location', fallback: string) => displayLabels[key] || fallback;
  const getKilometerLabel = (value: string) => value ? (kilometerDrivenLabels[Number(value) as KilometerDriven] || value) : 'Not provided';
  const getOwnershipLabel = (value: string) => value ? (ownershipLabels[Number(value) as OwnershipType] || value) : 'Not provided';
  const getPhotoLabel = (value: string) => value === 'upload-now' ? 'Upload Myself' : value === 'need-help' ? 'Need Photography Support' : value;

  // Memoized computed values - must be before any conditional returns
  const hasUserPhotos = useMemo(() => carDetails?.photos === 'upload-now' && photoPreviews.length > 0, [carDetails?.photos, photoPreviews.length]);
  const heroImage = useMemo(() => (hasUserPhotos ? photoPreviews[0] : '/CoverdCar.jpg'), [hasUserPhotos, photoPreviews]);

  const detailItems = useMemo(() => {
    if (!carDetails) return [];
    return [
      {
        id: 'brand',
        label: 'Brand',
        value: getDisplayValue('brand', carDetails.brand),
        icon: brandLogo ? <img src={brandLogo} alt={getDisplayValue('brand', carDetails.brand)} className="w-6 h-6 object-contain" /> : null,
      },
      { id: 'year', label: 'Year', value: carDetails.year, icon: <Calendar className="w-5 h-5" /> },
      { id: 'model', label: 'Model', value: getDisplayValue('model', carDetails.model), icon: <Car className="w-5 h-5" /> },
      { id: 'variant', label: 'Variant', value: carDetails.variantName || carDetails.variant, icon: <CarFront className="w-5 h-5" /> },
      { id: 'fuelType', label: 'Fuel Type', value: carDetails.fuelType || 'Not provided', icon: <Car className="w-5 h-5" /> },
      { id: 'transmissionType', label: 'Transmission', value: carDetails.transmissionType || 'Not provided', icon: <Gauge className="w-5 h-5" /> },
      { id: 'ownership', label: 'Ownership', value: carDetails.ownership, icon: <User className="w-5 h-5" /> },
      { id: 'kilometerDriven', label: 'Kilometer Driven', value: carDetails.kilometerDriven, icon: <Gauge className="w-5 h-5" /> },
      { id: 'location', label: 'Location', value: getDisplayValue('location', carDetails.location), icon: <MapPin className="w-5 h-5" /> },
      { id: 'price', label: 'Price', value: carDetails.price, icon: <BadgeIndianRupee className="w-5 h-5" /> },
      {
        id: 'photos',
        label: 'Photos',
        value: getPhotoLabel(carDetails.photos),
        icon: carDetails.photos === 'upload-now' ? <ImageIcon className="w-5 h-5" /> : <Camera className="w-5 h-5" />,
      },
    ];
  }, [carDetails, displayLabels, brandLogo, getDisplayValue, getPhotoLabel]);

  const steps = useMemo(() => [
    { title: 'Car Details shared', description: 'We have received the information you submitted.', status: 'done' as const },
    { title: 'Your Car Details will be reviewed', description: 'Experts verify the information and call you back.', status: 'done' as const },
    { title: 'Inspection Pending', description: 'Our experts will inspect your car and call you back.', status: 'current' as const },
    { title: 'Listing made live', description: 'We publish the ad once everything checks out.', status: 'pending' as const },
    { title: 'Connect with top buyers', description: 'Verified buyers reach out directly to close the deal.', status: 'pending' as const },
  ], []);

  const stepStyles = {
    done: { circle: 'border-primary-300 bg-primary-50 text-primary-600', title: 'text-primary-600', description: 'text-primary-700', connector: 'bg-primary-300' },
    current: { circle: 'border-emerald-400 bg-emerald-50 text-emerald-600', title: 'text-emerald-600', description: 'text-emerald-400', connector: 'bg-emerald-400' },
    pending: { circle: 'border-slate-200 bg-white text-slate-400', title: 'text-slate-900', description: 'text-slate-500', connector: 'bg-slate-200' },
  } as const;

  const infoGrid = useMemo(() => {
    if (!carDetails) return [];
    return [
      { label: 'Registration Year', value: carDetails.year || 'Not provided' },
      { label: 'Brand & Model', value: `${getDisplayValue('brand', carDetails.brand)} ${getDisplayValue('model', carDetails.model)}`.trim() || 'Not provided' },
      { label: 'Variant', value: carDetails.variantName || carDetails.variant || 'Not provided' },
      { label: 'Fuel Type', value: carDetails.fuelType || 'Not provided' },
      { label: 'Transmission', value: carDetails.transmissionType || 'Not provided' },
      { label: 'Kms Driven', value: getKilometerLabel(carDetails.kilometerDriven) },
      { label: 'Ownership', value: getOwnershipLabel(carDetails.ownership) },
      { label: 'Price Expectation', value: carDetails.price || 'Not provided' },
      { label: 'Photos preference', value: detailItems.find((item) => item.id === 'photos')?.value || 'Not provided' },
      { label: 'Location', value: locationData?.formatted || getDisplayValue('location', carDetails.location) || 'Not provided' },
    ];
  }, [carDetails, displayLabels, locationData, detailItems]);

  const handleSubmitListing = async () => {
    if (hasSubmitted || !carDetails || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const stored = getStoredData();
      const registrationNumber = stored?.registrationNumberFormatted || stored?.registrationNumber || '';
      const photos = Array.isArray(stored?.photoKeys) ? stored.photoKeys : [];
      const rawPrice = stored?.selections?.price || carDetails.price || '';
      const expectedPrice = rawPrice ? parseInt(String(rawPrice).replace(/[₹,\s]/g, ''), 10) : undefined;

      const payload = {
        registrationNumber,
        brandId: carDetails.brand ? Number(carDetails.brand) : undefined,
        year: carDetails.year ? Number(carDetails.year) : undefined,
        modelId: carDetails.model ? Number(carDetails.model) : undefined,
        variantId: carDetails.variant ? Number(carDetails.variant) : undefined,
        ownerType: carDetails.ownership ? Number(carDetails.ownership) : undefined,
        odometerReading: carDetails.kilometerDriven ? Number(carDetails.kilometerDriven) : undefined,
        pincodeId: carDetails.location ? Number(carDetails.location) : undefined,
        expectedPrice,
        photos,
      };

      const response = await postCreateSellCar(payload);
      
      // Check if API call was successful (response.code === 201)
      if (response && response.code === 201) {
        setHasSubmitted(true);
        setShowSuccessModal(true);
      } else {
        console.error('postCreateSellCar did not return success code 201', response);
        alert('Failed to submit listing. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting sell car listing', error);
      alert('An error occurred while submitting. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!carDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-base lg:text-xs text-slate-600">Loading car details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6] px-3 py-10 text-slate-900">
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <header className="flex items-center">
          <Button
            onClick={() => router.back()}
            variant="secondary"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </Button>
        </header>

        <section className="rounded-[36px] bg-white shadow-xl overflow-hidden">
          {/* Hero Section */}
          <div className="relative bg-gradient-primary px-8 py-10 text-center text-white">
            <Sparkles className="mx-auto mb-4 h-10 w-10 text-white" />
            <h2 className="text-4xl lg:text-2xl font-semibold">Sit Back & Relax!</h2>
            <p className="text-base lg:text-xs text-white/90">
              Verified buyers will connect you soon{' '}
              <button onClick={() => setActivePanel('details')} className="underline underline-offset-2 font-semibold">View Details</button>
            </p>
          </div>

          {/* Sell Car Details */}
          <div className="space-y-6 px-6 py-8 sm:px-8">
            {/* Hero Card */}
            <div className="rounded-[28px] border border-slate-100 bg-white shadow-sm p-4 sm:p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
                <div className="overflow-hidden rounded-2xl bg-slate-100 shadow-inner sm:w-52">
                  <Image
                    src={heroImage}
                    alt={`${carDetails.brand} ${carDetails.model}`}
                    className="h-40 w-full object-cover"
                    width={100}
                    height={100}
                  />
                </div>
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    {brandLogo && (
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-100 bg-white shadow-sm">
                        <img src={brandLogo} alt={carDetails.brand} className="h-9 w-9 object-contain" />
                      </div>
                    )}
                    <div>
                      <p className="text-base lg:text-xs font-medium text-slate-500">{carDetails.year || 'Year TBD'}</p>
                      <h3 className="text-2xl lg:text-base font-semibold">
                        {getDisplayValue('brand', carDetails.brand)} {getDisplayValue('model', carDetails.model)} {carDetails.variantName || carDetails.variant}
                      </h3>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4 text-base lg:text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1.5">
                      <Gauge className="h-4 w-4" />
                      {getKilometerLabel(carDetails.kilometerDriven) || 'Mileage pending'}
                    </span>
                    {carDetails.fuelType && (
                      <span className="inline-flex items-center gap-1.5">
                        <Car className="h-4 w-4" />
                        {carDetails.fuelType}
                      </span>
                    )}
                    {carDetails.transmissionType && (
                      <span className="inline-flex items-center gap-1.5">
                        <Gauge className="h-4 w-4" />
                        {carDetails.transmissionType}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" />
                      {locationData?.city && locationData?.pincode
                        ? `${locationData.city}, ${locationData.pincode}`
                        : getDisplayValue('location', carDetails.location) || 'Location'}
                    </span>
                    <span className="inline-flex items-center gap-1.5 font-semibold text-primary-500">
                      <BadgeIndianRupee className="h-4 w-4" />
                      {carDetails.price || 'Expected price'}
                    </span>
                  </div>
                  <p className="rounded-2xl bg-slate-50 px-4 py-2 text-base lg:text-xs text-slate-600">
                    Your shared car information is under review
                  </p>
                </div>
              </div>
            </div>

            {/* Next Steps / Car Details */}
            <div className="rounded-[32px] border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-4 text-base lg:text-xs font-semibold">
                {(['steps', 'details'] as const).map((panel) => (
                  <button
                    key={panel}
                    onClick={() => setActivePanel(panel)}
                    className={`rounded-full px-4 py-1 transition ${
                      activePanel === panel ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-500'
                    }`}
                  >
                    {panel === 'steps' ? 'Next Steps' : 'Details'}
                  </button>
                ))}
              </div>
              {activePanel === 'steps' ? (
                <div className="mt-6 space-y-6">
                  {steps.map((step, index) => {
                    const style = stepStyles[step.status as keyof typeof stepStyles];
                    return (
                      <div key={step.title} className="flex items-start gap-4">
                        <div className="flex flex-col items-center">
                          <span className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${style.circle}`}>
                            {step.status === 'done' ? (
                              <CheckCircle2 className="h-4 w-4" />
                            ) : step.status === 'current' ? (
                              <Sparkles className="h-4 w-4" />
                            ) : (
                              <span className="text-xs font-semibold">{index + 1}</span>
                            )}
                          </span>
                          {index !== steps.length - 1 && <span className={`mt-2 h-12 w-[3px] ${style.connector}`} />}
                        </div>
                        <div>
                          <p className={`text-base lg:text-xs font-semibold ${style.title}`}>{step.title}</p>
                          <p className={`text-base lg:text-xs ${style.description}`}>{step.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {infoGrid.map((info) => (
                    <div key={info.label} className="rounded-2xl border border-slate-100 bg-slate-50/80 p-2">
                      <p className="text-sm lg:text-[10px] text-slate-400">{info.label}</p>
                      <p className="text-base lg:text-xs font-semibold text-slate-900">{info.value}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Uploaded Photos */}
            {hasUserPhotos && (
              <div className="rounded-[32px] border border-slate-100 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xl lg:text-base font-semibold text-slate-900">Uploaded Photos</p>
                    <p className="text-base lg:text-xs text-slate-500">Best shots help you sell faster</p>
                  </div>
                  <span className="text-base lg:text-xs text-slate-500">{photoPreviews.length}/20</span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {photoPreviews.map((src, index) => (
                    <div key={src} className="overflow-hidden rounded-2xl border border-slate-100">
                      <img src={src} alt={`Car photo ${index + 1}`} className="h-32 w-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button
                variant="secondary"
                onClick={() => router.push('/sellCar/addCar')}
                className="rounded-full border border-slate-200 bg-white px-6 py-3 text-base lg:text-xs font-semibold text-slate-600 shadow-sm"
              >
                Edit details
              </Button>
              {!hasSubmitted && (
                <Button
                  variant="primary"
                  onClick={handleSubmitListing}
                  disabled={isSubmitting || hasSubmitted}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit listing'}
                </Button>
              )}
            </div>

          </div>
        </section>

        {/* Success Modal */}
        {showSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-300">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 overflow-hidden border border-slate-200 transform transition-all duration-300 scale-100">
              {/* Close Button */}
              <button
                onClick={() => router.push('/')}
                className="absolute right-4 top-4 z-10 rounded-full p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all duration-200"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Gradient Header */}
              <div className="bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 px-8 pt-10 pb-6 text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                  <div className="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
                </div>
                <div className="relative">
                  <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm shadow-lg">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white animate-pulse">
                      <CheckCircle2 className="h-10 w-10 text-emerald-600" />
                    </div>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 drop-shadow-lg">
                    Success!
                  </h2>
                  <p className="text-emerald-50 text-sm sm:text-base">
                    Your listing has been submitted
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="px-8 py-6 text-center">
                <p className="text-base sm:text-lg text-slate-700 mb-6 leading-relaxed">
                  Our inspection officer will contact you soon to verify your car and complete the listing.
                </p>
                
                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="primary"
                    onClick={() => {
                      setShowSuccessModal(false);
                      router.push('/listings');
                    }}
                    className="flex-1 rounded-xl text-sm font-semibold py-3 shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    View My Listings
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => router.push('/')}
                    className="flex-1 rounded-xl text-sm font-semibold py-3 border border-slate-200 hover:bg-slate-50 transition-all duration-200"
                  >
                    Go to Home
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
        
      </div>

    </div>
  );
};

export default SellCarDetails;

