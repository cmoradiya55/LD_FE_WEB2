'use client';

import React, { useEffect, useState } from 'react';
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
  X,
  Sparkles,
  BadgeIndianRupee,
} from 'lucide-react';
import { brandOptions, ownershipLabels, OwnershipType, kilometerDrivenLabels, KilometerDriven } from '../addCar/data';
import { Button } from '@/components/Button/Button';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { fetchSellCarBrands, fetchSellCarModelsWithYear, CreateSellCar } from '@/lib/auth';

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

const SellCarDetails: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [carDetails, setCarDetails] = useState<CarDetails | null>(null);
  const [brandLogo, setBrandLogo] = useState<string>('');
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [activePanel, setActivePanel] = useState<'steps' | 'details'>('steps');
  const [displayLabels, setDisplayLabels] = useState<{
    brand?: string;
    model?: string;
    location?: string;
  }>({});
  const [locationData, setLocationData] = useState<{
    formatted?: string;
    city?: string;
    pincode?: string;
  } | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

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

    // Check sessionStorage for labels first
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('sellCarDetails');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          // Check if we have selectionLabels stored
          if (parsed.selectionLabels) {
            setDisplayLabels({
              brand: parsed.selectionLabels.brand,
              model: parsed.selectionLabels.model,
              location: parsed.selectionLabels.location,
            });
          }
        } catch (e) {
          console.error('Error parsing stored data', e);
        }
      }
    }

    setCarDetails(details);
  }, [searchParams]);

  // Fetch brand names from API using useQuery
  const { data: brandsResponse } = useQuery({
    queryKey: ['FETCH_SELL_CAR_BRANDS'],
    queryFn: async () => {
      try {
        const response = await fetchSellCarBrands();
        return response;
      } catch (error) {
        console.error('Error fetching brands', error);
        throw error;
      }
    },
    retry: false,
    refetchInterval: false,
    refetchOnWindowFocus: false,
    enabled: !!(carDetails?.brand && !displayLabels.brand),
  });

  // Fetch model names from API using useQuery
  const { data: modelsResponse } = useQuery({
    queryKey: ['FETCH_SELL_CAR_MODELS_WITH_YEAR', carDetails?.brand, carDetails?.year],
    queryFn: async () => {
      if (!carDetails?.brand || !carDetails?.year) return null;
      try {
        const response = await fetchSellCarModelsWithYear(carDetails.brand, carDetails.year);
        return response;
      } catch (error) {
        console.error('Error fetching models', error);
        throw error;
      }
    },
    retry: false,
    refetchInterval: false,
    refetchOnWindowFocus: false,
    enabled: !!(carDetails?.brand && carDetails?.year && carDetails?.model && !displayLabels.model),
  });

  // Process brands response and update display labels
  useEffect(() => {
    if (!brandsResponse || !carDetails?.brand || displayLabels.brand) return;

    const brands = Array.isArray(brandsResponse?.data) ? brandsResponse.data : Array.isArray(brandsResponse) ? brandsResponse : [];
    const brand = brands.find((b: any) => String(b.id) === String(carDetails.brand));
    if (brand) {
      setDisplayLabels(prev => ({ ...prev, brand: brand.displayName || brand.name }));
      // Also set logo
      const brandOption = brandOptions.find((b) => b.name === (brand.displayName || brand.name));
      if (brandOption) {
        setBrandLogo(brandOption.logo);
      } else if (brand.logo) {
        setBrandLogo(brand.logo);
      }
    }
  }, [brandsResponse, carDetails?.brand, displayLabels.brand]);

  // Process models response and update display labels
  useEffect(() => {
    if (!modelsResponse || !carDetails?.model || displayLabels.model) return;

    const models = Array.isArray(modelsResponse?.data) ? modelsResponse.data : Array.isArray(modelsResponse) ? modelsResponse : [];
    const model = models.find((m: any) => String(m.id ?? m.name ?? m.displayName ?? '') === String(carDetails.model));
    if (model) {
      setDisplayLabels(prev => ({ ...prev, model: model.displayName || model.name }));
    }
  }, [modelsResponse, carDetails?.model, displayLabels.model]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const payload = sessionStorage.getItem('sellCarDetails');
    if (!payload) return;
    try {
      const parsed = JSON.parse(payload);
      if (Array.isArray(parsed?.photoPreviews)) {
        setPhotoPreviews(parsed.photoPreviews);
      }
      // Get labels from sessionStorage
      if (parsed?.selectionLabels) {
        setDisplayLabels({
          brand: parsed.selectionLabels.brand,
          model: parsed.selectionLabels.model,
          location: parsed.selectionLabels.location,
        });
      }
      // Get location data from sessionStorage
      if (parsed?.locationData) {
        setLocationData(parsed.locationData);
      }
      // Fuel / transmission from AddCar page (no need to refetch variants)
      if (parsed?.fuelType || parsed?.transmissionType) {
        setCarDetails((prev) =>
          prev
            ? {
              ...prev,
              fuelType: parsed.fuelType || prev.fuelType,
              transmissionType: parsed.transmissionType || prev.transmissionType,
            }
            : prev
        );
      }
    } catch (error) {
      console.error('Unable to parse stored sell car payload', error);
    }
  }, []);

  if (!carDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-base lg:text-xs text-slate-600">Loading car details...</p>
        </div>
      </div>
    );
  }

  const detailItems = [
    {
      id: 'brand',
      label: 'Brand',
      value: displayLabels.brand || carDetails.brand,
      icon: brandLogo ? (
        <img src={brandLogo} alt={displayLabels.brand || carDetails.brand} className="w-6 h-6 object-contain" />
      ) : null,
    },
    {
      id: 'year',
      label: 'Year',
      value: carDetails.year,
      icon: <Calendar className="w-5 h-5" />,
    },
    {
      id: 'model',
      label: 'Model',
      value: displayLabels.model || carDetails.model,
      icon: <Car className="w-5 h-5" />,
    },
    {
      id: 'variant',
      label: 'Variant',
      value: carDetails.variantName || carDetails.variant,
      icon: <CarFront className="w-5 h-5" />,
    },
    {
      id: 'fuelType',
      label: 'Fuel Type',
      value: carDetails.fuelType || 'Not provided',
      icon: <Car className="w-5 h-5" />,
    },
    {
      id: 'transmissionType',
      label: 'Transmission',
      value: carDetails.transmissionType || 'Not provided',
      icon: <Gauge className="w-5 h-5" />,
    },
    {
      id: 'ownership',
      label: 'Ownership',
      value: carDetails.ownership,
      icon: <User className="w-5 h-5" />,
    },
    {
      id: 'kilometerDriven',
      label: 'Kilometer Driven',
      value: carDetails.kilometerDriven,
      icon: <Gauge className="w-5 h-5" />,
    },
    {
      id: 'location',
      label: 'Location',
      value: displayLabels.location || carDetails.location,
      icon: <MapPin className="w-5 h-5" />,
    },
    {
      id: 'price',
      label: 'Price',
      value: carDetails.price,
      icon: <BadgeIndianRupee className="w-5 h-5" />,
    },
    {
      id: 'photos',
      label: 'Photos',
      value:
        carDetails.photos === 'upload-now'
          ? 'Upload Myself'
          : carDetails.photos === 'need-help'
            ? 'Need Photography Support'
            : carDetails.photos,
      icon: carDetails.photos === 'upload-now' ? <ImageIcon className="w-5 h-5" /> : <Camera className="w-5 h-5" />,
    },
  ];

  const handleSubmitListing = async () => {
    if (hasSubmitted) return;
    if (!carDetails) return;

    try {
      let storedPayload: any = null;

      if (typeof window !== 'undefined') {
        const raw = sessionStorage.getItem('sellCarDetails');
        if (raw) {
          try {
            storedPayload = JSON.parse(raw);
          } catch (error) {
            console.error('Unable to parse stored sell car payload for submission', error);
          }
        }
      }

      // Registration number (prefer formatted with dashes)
      const registrationNumber: string =
        storedPayload?.registrationNumberFormatted ||
        storedPayload?.registrationNumber ||
        '';

      // Photos (currently we only have preview URLs; backend integration for uploads can replace these)
      const photos: string[] = Array.isArray(storedPayload?.photoPreviews)
        ? storedPayload.photoPreviews
        : [];

      // Price: parse numeric value from formatted price string
      const rawPrice =
        storedPayload?.selections?.price ||
        carDetails.price ||
        '';

      const expectedPrice = rawPrice
        ? parseInt(String(rawPrice).replace(/[₹,\s]/g, ''), 10)
        : undefined;

      // Build payload matching backend expectation
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

      const response = await CreateSellCar(payload);
      console.log('CreateSellCar response', response);

      // Basic success check: adjust according to your API shape if needed
      if (response && (response.success === true || response.status === 'success' || response.code === 200)) {
        setHasSubmitted(true);
        setShowSuccessModal(true);
      } else {
        console.error('CreateSellCar did not return a clear success flag', response);
      }
    } catch (error) {
      console.error('Error submitting sell car listing', error);
    }
  };

  const hasUserPhotos = carDetails.photos === 'upload-now' && photoPreviews.length > 0;
  const heroImage = hasUserPhotos
    ? photoPreviews[0]
    : '/CoverdCar.jpg';

  const steps = [
    {
      title: 'Car Details shared',
      description: 'We have received the information you submitted.',
      status: 'done',
    },
    {
      title: 'Your Car Details will be reviewed',
      description: 'Experts verify the information and call you back.',
      status: 'done',
    },
    {
      title: 'Inspection Pending',
      description: 'Our experts will inspect your car and call you back.',
      status: 'current',
    },
    {
      title: 'Listing made live',
      description: 'We publish the ad once everything checks out.',
      status: 'pending',
    },
    {
      title: 'Connect with top buyers',
      description: 'Verified buyers reach out directly to close the deal.',
      status: 'pending',
    },
  ];

  const stepStyles = {
    done: {
      circle: 'border-primary-300 bg-primary-50 text-primary-600',
      title: 'text-primary-600',
      description: 'text-primary-700',
      connector: 'bg-primary-300',
    },
    current: {
      circle: 'border-emerald-400 bg-emerald-50 text-emerald-600',
      title: 'text-emerald-600',
      description: 'text-emerald-400',
      connector: 'bg-emerald-400',
    },
    pending: {
      circle: 'border-slate-200 bg-white text-slate-400',
      title: 'text-slate-900',
      description: 'text-slate-500',
      connector: 'bg-slate-200',
    },
  } as const;

  const infoGrid = [
    { label: 'Registration Year', value: carDetails.year || 'Not provided' },
    { label: 'Brand & Model', value: `${displayLabels.brand || carDetails.brand} ${displayLabels.model || carDetails.model}`.trim() || 'Not provided' },
    { label: 'Variant', value: carDetails.variantName || carDetails.variant || 'Not provided' },
    { label: 'Fuel Type', value: carDetails.fuelType || 'Not provided' },
    { label: 'Transmission', value: carDetails.transmissionType || 'Not provided' },
    { label: 'Kms Driven', value: carDetails.kilometerDriven ? (kilometerDrivenLabels[Number(carDetails.kilometerDriven) as KilometerDriven] || carDetails.kilometerDriven) : 'Not provided' },
    { label: 'Ownership', value: carDetails.ownership ? (ownershipLabels[Number(carDetails.ownership) as OwnershipType] || carDetails.ownership) : 'Not provided' },
    { label: 'Price Expectation', value: carDetails.price || 'Not provided' },
    { label: 'Photos preference', value: detailItems.find((item) => item.id === 'photos')?.value || 'Not provided' },
    { label: 'Location', value: locationData?.formatted || displayLabels.location || 'Not provided' },
  ];

  return (
    <div className="min-h-screen bg-[#f3f4f6] px-3 py-10 text-slate-900">
      <div className="max-w-3xl mx-auto space-y-6">
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
            <button
              className="absolute right-5 top-5 rounded-full bg-white/20 p-2 text-white hover:bg-white/30"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
            <Sparkles className="mx-auto mb-4 h-10 w-10 text-white" />
            <h2 className="text-4xl lg:text-2xl font-semibold">Sit Back & Relax!</h2>
            <p className="text-base lg:text-xs text-white/90">
              Verified buyers will connect you soon{' '}
              <button className="underline underline-offset-2 font-semibold">View Details</button>
            </p>
          </div>

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
                      <p className="text-base lg:text-xs font-medium text-slate-500">
                        {carDetails.year || 'Year TBD'}
                      </p>
                      <h3 className="text-2xl lg:text-base font-semibold">
                        {displayLabels.brand || carDetails.brand} {displayLabels.model || carDetails.model} {carDetails.variantName || carDetails.variant}
                      </h3>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4 text-base lg:text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1.5">
                      <Gauge className="h-4 w-4" />
                      {carDetails.kilometerDriven ? (kilometerDrivenLabels[Number(carDetails.kilometerDriven) as KilometerDriven] || carDetails.kilometerDriven) : 'Mileage pending'}
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
                        : displayLabels.location || 'Location'}
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

            {/* Boost Premium Ad Plan */}
            {/* <div className="rounded-[28px] border border-[#ffe9dd] bg-[#fff9f5] p-5 shadow-inner">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-[#ff6a3d]">Boost Premium Ad Plan</p>
                  <p className="text-xs text-slate-500">30 days top ad slot + 60 days regular ad slot</p>
                </div>
                <button className="inline-flex items-center gap-1 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#ff6a3d] shadow-sm">
                  Upgrade to Premium @ ₹1,000
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {[
                  { title: 'Genuine buyers only', detail: 'No spam, only high intent buyers.' },
                  { title: 'Better ad visibility', detail: 'Your ad stays on top with more leads.' },
                  { title: 'Fastest way of sales', detail: 'Sell your car in just 15-20 days.' },
                ].map((perk) => (
                  <div key={perk.title} className="rounded-2xl border border-white/60 bg-white/60 p-4 text-sm text-slate-600">
                    <p className="font-semibold text-slate-900">{perk.title}</p>
                    <p>{perk.detail}</p>
                  </div>
                ))}
              </div>
            </div> */}

            {/* Next Steps / Car Details */}
            <div className="rounded-[32px] border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-4 text-base lg:text-xs font-semibold">
                <button
                  onClick={() => setActivePanel('steps')}
                  className={`rounded-full px-4 py-1 transition ${activePanel === 'steps' ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-500'
                    }`}
                >
                  Next Steps
                </button>
                <button
                  onClick={() => setActivePanel('details')}
                  className={`rounded-full px-4 py-1 transition ${activePanel === 'details' ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-500'
                    }`}
                >
                  Details
                </button>
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
                  disabled={hasSubmitted}
                >
                  Submit listing
                </Button>
              )}
            </div>

          </div>
        </section>

        {/* Success Modal */}
        {showSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="bg-white rounded-3xl shadow-xl max-w-sm w-full mx-4 px-6 py-7 text-center border border-slate-100">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
                <CheckCircle2 className="h-7 w-7 text-emerald-500" />
              </div>
              <h2 className="text-base sm:text-lg font-semibold text-slate-900 mb-1">
                Request submitted
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mb-6">
                Our inspection officer will contact you soon to verify your car and complete the listing.
              </p>
              <Button
                variant="primary"
                onClick={() => {
                  setShowSuccessModal(false);
                  router.push('/my-listings');
                }}
                className="w-full rounded-xl text-sm font-semibold"
              >
                Go to My Listings
              </Button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default SellCarDetails;

