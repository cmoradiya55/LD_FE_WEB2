'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Search, ChevronLeft, CheckCircle2 } from 'lucide-react';
import {
  sellFlowSteps,
  StepId,
  ownershipOptions,
  locationOptions,
  dummyInventory,
  BrandOption,
  kilometerDrivenOptions,
} from './data';
import { useRouter } from 'next/navigation';
import PhotosUpload from '@/app/(main)/sellCar/PhotosUpload/PhotosUpload';
import {
  getCarBrands,
  getCarModelByYearAndBrandId,
  getCarVariantsByYearAndModel,
  getCitySuggestions,
  getYearRangeById,
  postImageUpload,
} from '@/utils/auth';
import { Button } from '@/components/Button/Button';
import { getStorageItem, setStorageItem } from '@/lib/storage';

type SelectionState = Partial<Record<StepId, string>>;
type SelectionLabelState = Partial<Record<StepId, string>>;

interface StepOption {
  value: string;
  label: string;
  subLabel?: string;
  logo?: string;
  fuelType?: string;
  transmissionType?: string;
}

const searchableSteps: StepId[] = ['brand', 'model', 'location'];

const AddCardComponent: React.FC = () => {
  const [currentStepId, setCurrentStepId] = useState<StepId>('brand');
  const [searchTerm, setSearchTerm] = useState('');
  const [selections, setSelections] = useState<SelectionState>({});
  const [selectionLabels, setSelectionLabels] = useState<SelectionLabelState>({});
  const [priceInput, setPriceInput] = useState('');
  const [locationInput, setLocationInput] = useState('');
  const [uploadedPhotosCount, setUploadedPhotosCount] = useState(0);
  const [uploadedPhotoPreviews, setUploadedPhotoPreviews] = useState<string[]>([]);
  const [uploadedPhotoFiles, setUploadedPhotoFiles] = useState<File[]>([]);
  const [options, setOptions] = useState<StepOption[]>([]);
  const [variantFuelFilter, setVariantFuelFilter] = useState<string | null>(null);
  const [variantTransmissionFilter, setVariantTransmissionFilter] = useState<string | null>(null);
  const [locationSuggestions, setLocationSuggestions] = useState<any[]>([]);
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [locationData, setLocationData] = useState<{ formatted?: string; city?: string; pincode?: string } | null>(null);
  const [locationPage, setLocationPage] = useState(1);
  const [hasMoreLocations, setHasMoreLocations] = useState(false);
  const [selectedVariantMeta, setSelectedVariantMeta] = useState<{ fuelType?: string; transmissionType?: string } | null>(null);
  const router = useRouter();

  // Ensure registration number is present before allowing user to be on this page
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const raw = getStorageItem('sellCarDetails');
      const stored = raw ? JSON.parse(raw) : null;
      const registrationNumber = stored?.registrationNumber;

      if (!registrationNumber) {
        router.replace('/sellCar/registrationNumber');
      }
    } catch (error) {
      console.error('Unable to read registration number from localStorage', error);
      router.replace('/sellCar/registrationNumber');
    }
  }, [router]);

  useEffect(() => {
    const { price, location } = selections || {};

    setSearchTerm('');

    if (currentStepId === 'location' && location) {
      setLocationInput(location);
    }
    if (currentStepId === 'price' && price) {
      setPriceInput(price.replace(/[₹,\s]/g, ''));
    }

    if (currentStepId !== 'variant') {
      setVariantFuelFilter(null);
      setVariantTransmissionFilter(null);
    }
  }, [currentStepId, selections]);


  const currentStepIndex = sellFlowSteps.findIndex((step) => step.id === currentStepId);
  const currentStepMeta = sellFlowSteps[currentStepIndex];

  const isStepEnabled = (stepId: StepId): boolean => {
    const targetIndex = sellFlowSteps.findIndex((step) => step.id === stepId);
    if (targetIndex === 0) return true;
    const requiredSteps = sellFlowSteps.slice(0, targetIndex);
    return requiredSteps.every((step) => Boolean(selections[step.id]));
  };

  const getBlockingMessage = (stepId: StepId): string | null => {
    switch (stepId) {
      case 'year':
        return selections.brand ? null : 'Select a brand first to unlock the available years.';
      case 'model':
        if (!selections.brand) return 'Pick a brand to view available models.';
        if (!selections.year) return 'Choose a year to continue.';
        return null;
      case 'variant':
        if (!selections.brand || !selections.year) return 'Pick brand and year to proceed.';
        if (!selections.model) return 'Select a model to see its variants.';
        return null;
      default:
        return null;
    }
  };

  const getOptionsForStep = async (stepId: StepId): Promise<StepOption[]> => {
    switch (stepId) {
      case 'brand':
        {
          const brands = await getCarBrands();
          const brandData = Array.isArray(brands?.data)
            ? brands.data
            : Array.isArray(brands)
              ? brands
              : [];

          return brandData.map((brand: any) => ({
            value: brand.id,
            label: brand.displayName,
            logo: brand.logo,
          }));
        }
      case 'year': {
        if (!selections.brand) return [];
        const years = await getYearRangeById(selections.brand);
        const yearData = Array.isArray(years?.data)
          ? years.data
          : Array.isArray(years)
            ? years
            : [];

        return yearData.map((year: any) => ({
          value: String(typeof year === 'number' || typeof year === 'string' ? year : year?.year ?? ''),
          label: String(typeof year === 'number' || typeof year === 'string' ? year : year?.year ?? ''),
        }));
      }
      case 'model': {
        if (!selections.brand || !selections.year) return [];
        const models = await getCarModelByYearAndBrandId(selections.brand, selections.year);
        const modelData = Array.isArray(models?.data)
          ? models.data
          : Array.isArray(models)
            ? models
            : [];

        return modelData.map((model: any) => ({
          value: String(model.id ?? model.name ?? model.displayName ?? ''),
          label: String(model.displayName ?? model.name ?? ''),
        }));
      }
      case 'variant': {
        if (!selections.year || !selections.model) return [];
        const variantsResponse = await getCarVariantsByYearAndModel(
          selections.year,
          selections.model
        );

        const variantGroups = Array.isArray(variantsResponse?.data)
          ? variantsResponse.data
          : Array.isArray(variantsResponse)
            ? variantsResponse
            : [];

        // Flatten fuel-type groups into a single list of variants
        const flatVariants: any[] = [];
        variantGroups.forEach((group: any) => {
          const fuelType = group?.fuelType;
          (group?.variants ?? []).forEach((variant: any) => {
            flatVariants.push({ ...variant, fuelType });
          });
        });

        return flatVariants.map((variant: any) => ({
          value: String(variant.id ?? variant.name ?? variant.displayName ?? ''),
          label: String(variant.displayName ?? variant.name ?? ''),
          subLabel: variant.transmissionType ?? variant.transmission ?? '',
          fuelType: variant.fuelType ?? variant.fuel_type ?? '',
          transmissionType: variant.transmissionType ?? variant.transmission ?? '',
        }));
      }
      case 'ownership':
        return ownershipOptions.map((option) => ({ value: String(option.id), label: option.label }));
      case 'kilometerDriven':
        return kilometerDrivenOptions.map((option) => ({ value: String(option.id), label: option.label }));
      case 'location':
        return locationOptions.map((option: string) => ({ value: option, label: option }));
      case 'price':
        return []; // No options, manual input only
      case 'photos':
        return []; // Custom component handles this step
      default:
        return [];
    }
  };

  // Load options whenever the step or its dependencies change
  useEffect(() => {
    let isCancelled = false;

    const loadOptions = async () => {
      const fetched = await getOptionsForStep(currentStepId);
      if (!isCancelled) {
        setOptions(fetched);
      }
    };

    loadOptions();

    return () => {
      isCancelled = true;
    };
  }, [currentStepId, selections.brand, selections.year, selections.model]);

  const showSearch =
    searchableSteps.includes(currentStepId) &&
    currentStepId !== 'location' &&
    options.length > 6;

  const filteredOptions = useMemo(() => {
    if (!showSearch || !searchTerm.trim()) return options;

    return options.filter((option) =>
      option.label.toLowerCase().includes(searchTerm.trim().toLowerCase())
    );
  }, [options, searchTerm, showSearch]);

  const blockingMessage = getBlockingMessage(currentStepId);

  const handleOptionSelect = (value: string, label: string) => {
    console.log('value', value, 'label', label);
    setSelections((prev) => {
      const updated: SelectionState = { ...prev, [currentStepId]: value };
      sellFlowSteps.slice(currentStepIndex + 1).forEach((step) => {
        delete updated[step.id];
      });
      return updated;
    });

    // When selecting a variant, also capture its fuel/transmission metadata
    if (currentStepId === 'variant') {
      const option = filteredOptions.find((o) => o.value === value) as StepOption | undefined;
      setSelectedVariantMeta(
        option
          ? {
            fuelType: option.fuelType,
            transmissionType: option.transmissionType,
          }
          : null
      );
    }

    setSelectionLabels((prev) => {
      const updated: SelectionLabelState = { ...prev, [currentStepId]: label };
      sellFlowSteps.slice(currentStepIndex + 1).forEach((step) => {
        delete updated[step.id];
      });
      return updated;
    });

    const nextStep = sellFlowSteps[currentStepIndex + 1];
    if (nextStep) {
      setCurrentStepId(nextStep.id);
    }
    console.log("nextStep", nextStep);
  };

  const formatPrice = (value: string): string => {
    const numericValue = value.replace(/[₹,\s]/g, '');
    if (!numericValue) return '';
    const num = parseInt(numericValue, 10);
    if (isNaN(num)) return '';
    return `₹${num.toLocaleString('en-IN')}`;
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[₹,\s]/g, '');
    if (value === '' || /^\d+$/.test(value)) {
      setPriceInput(value);
    }
  };

  const handlePriceSubmit = () => {
    if (priceInput && parseInt(priceInput, 10) > 0) {
      const formattedPrice = formatPrice(priceInput);
      setSelections((prev) => {
        const updated: SelectionState = { ...prev, price: formattedPrice };
        sellFlowSteps.slice(currentStepIndex + 1).forEach((step) => {
          delete updated[step.id];
        });
        return updated;
      });

      setSelectionLabels((prev) => {
        const updated: SelectionLabelState = { ...prev, price: formattedPrice };
        sellFlowSteps.slice(currentStepIndex + 1).forEach((step) => {
          delete updated[step.id];
        });
        return updated;
      });

      const nextStep = sellFlowSteps[currentStepIndex + 1];
      if (nextStep) {
        setCurrentStepId(nextStep.id);
      }
    }
  };

  const handleLocationSubmit = () => {
    const value = locationInput.trim();
    if (!value) return;

    setSelections((prev) => {
      const updated: SelectionState = { ...prev, location: value };
      sellFlowSteps.slice(currentStepIndex + 1).forEach((step) => {
        delete updated[step.id];
      });
      return updated;
    });

    setSelectionLabels((prev) => {
      const updated: SelectionLabelState = { ...prev, location: value };
      sellFlowSteps.slice(currentStepIndex + 1).forEach((step) => {
        delete updated[step.id];
      });
      return updated;
    });

    const nextStep = sellFlowSteps[currentStepIndex + 1];
    if (nextStep) {
      setCurrentStepId(nextStep.id);
    }
  };

  const filteredCars = useMemo(() => {
    return dummyInventory.filter((car) => {
      if (selections.brand && car.brand !== selections.brand) return false;
      if (selections.year && car.year !== selections.year) return false;
      if (selections.model && car.model !== selections.model) return false;
      if (selections.variant && car.variant !== selections.variant) return false;
      if (selections.ownership && car.ownership !== selections.ownership) return false;
      if (selections.kilometerDriven && car.kilometerDriven !== selections.kilometerDriven) return false;
      if (selections.location && car.location !== selections.location) return false;
      if (selections.price && car.priceRange !== selections.price) return false;
      return true;
    });
  }, [selections]);

  const selectionCount = Object.values(selections).filter(Boolean).length;

  const resetFilters = () => {
    setSelections({});
    setSelectionLabels({});
    setCurrentStepId('brand');
    setUploadedPhotosCount(0);
    setUploadedPhotoPreviews([]);
  };

  useEffect(() => {
    setUploadedPhotosCount(uploadedPhotoPreviews.length);
  }, [uploadedPhotoPreviews]);

  // Debounced effect to fetch location suggestions
  useEffect(() => {
    if (currentStepId !== 'location') {
      setLocationSuggestions([]);
      setShowSuggestions(false);
      setLocationPage(1);
      setHasMoreLocations(false);
      return;
    }

    const query = locationInput.trim();
    // Require at least 3 characters before showing suggestions
    if (!query || query.length < 3) {
      setLocationSuggestions([]);
      setShowSuggestions(false);
      setLocationPage(1);
      setHasMoreLocations(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsLoadingLocations(true);
      try {
        const limit = 20;
        const response = await getCitySuggestions(query, 1, limit);
        const items = Array.isArray(response?.data) ? response.data : [];

        setLocationSuggestions(items);
        setShowSuggestions(items.length > 0);
        setLocationPage(1);
        setHasMoreLocations(items.length === limit);
      } catch (error) {
        console.error('Error fetching location suggestions:', error);
        setLocationSuggestions([]);
        setShowSuggestions(false);
        setLocationPage(1);
        setHasMoreLocations(false);
      } finally {
        setIsLoadingLocations(false);
      }
    }, 300); // 300ms debounce

    return () => {
      clearTimeout(timeoutId);
    };
  }, [locationInput, currentStepId]);

  const loadMoreLocations = async () => {
    const query = locationInput.trim();
    if (!query || query.length < 3) return;
    if (isLoadingLocations || !hasMoreLocations) return;

    setIsLoadingLocations(true);
    try {
      const limit = 20;
      const nextPage = locationPage + 1;
      const response = await getCitySuggestions(query, nextPage, limit);
      const items = Array.isArray(response?.data) ? response.data : [];
      console.log("responseeeeeeee", items);

      setLocationSuggestions((prev) => [...prev, ...items]);
      setHasMoreLocations(items.length === limit);
      setLocationPage(nextPage);
    } catch (error) {
      console.error('Error loading more location suggestions:', error);
      setHasMoreLocations(false);
    } finally {
      setIsLoadingLocations(false);
    }
  };

  const handleLocationScroll = (container: HTMLDivElement | null) => {
    if (!container) return;
    const { scrollTop, clientHeight, scrollHeight } = container;
    const threshold = 40; // px from bottom to trigger load
    if (scrollTop + clientHeight >= scrollHeight - threshold) {
      loadMoreLocations();
    }
  };

  const handleLocationSuggestionSelect = (suggestion: any) => {
    const formattedLocation = suggestion.formatted || locationInput;
    setLocationInput(formattedLocation);
    setShowSuggestions(false);

    const stepIndex = sellFlowSteps.findIndex((step) => step.id === currentStepId);

    // Create display label with city and pincode for header
    const displayLabel = suggestion.city && suggestion.pincode
      ? `${suggestion.city}, ${suggestion.pincode}`
      : suggestion.city || suggestion.pincode || formattedLocation;

    // Store full location data
    setLocationData({
      formatted: suggestion.formatted || formattedLocation,
      city: suggestion.city || '',
      pincode: suggestion.pincode || '',
    });

    setSelections((prev) => {
      const updated: SelectionState = { ...prev, location: String(suggestion.pincode_id || suggestion.city_id || formattedLocation) };
      sellFlowSteps.slice(stepIndex + 1).forEach((step) => {
        delete updated[step.id];
      });
      return updated;
    });

    setSelectionLabels((prev) => {
      const updated: SelectionLabelState = {
        ...prev,
        location: displayLabel,
      };
      sellFlowSteps.slice(stepIndex + 1).forEach((step) => {
        delete updated[step.id];
      });
      return updated;
    });

    const nextStep = sellFlowSteps[stepIndex + 1];
    if (nextStep) {
      setCurrentStepId(nextStep.id);
    }
  };

  const isAllStepsCompleted = () => {
    console.log('selections', selections);
    console.log('uploadedPhotosCount', uploadedPhotosCount);
    console.log('selections.photos', selections.photos);
    console.log('uploadedPhotoPreviews', uploadedPhotoPreviews);
    const allStepsHaveSelections = sellFlowSteps.every((step) => Boolean(selections[step.id]));
    if (selections.photos === 'upload-now') {
      return allStepsHaveSelections && uploadedPhotosCount >= 1;
    }
    return allStepsHaveSelections;
  };

  const handleViewDetails = async () => {
    const fileUploadRes = await postImageUpload(uploadedPhotoFiles);
    const uploadedFileKeys = fileUploadRes.data.map((file: any) => file.key);
    const uploadedFileUrls = fileUploadRes.data.map((file: any) => file.keyWithBaseUrl);
    
    if (!isAllStepsCompleted()) return;

    if (typeof window !== 'undefined') {
      let storedPayload: any = null;
      const raw = getStorageItem('sellCarDetails');
      if (raw) {
        try {
          storedPayload = JSON.parse(raw);
        } catch (error) {
          console.error('Unable to parse stored sell car payload before navigation', error);
        }
      }

      const payload = {
        ...(storedPayload || {}),
        ...selections,
        selectionLabels: selectionLabels,
        locationData: locationData,
        variantName: selectionLabels.variant,
        fuelType: selectedVariantMeta?.fuelType,
        transmissionType: selectedVariantMeta?.transmissionType,
        photoPreviews: uploadedFileUrls,
        photoKeys: uploadedFileKeys,
      };
      setStorageItem('sellCarDetails', JSON.stringify(payload));
    }

    const params = new URLSearchParams();
    Object.entries(selections).forEach(([key, value]) => {
      if (value) {
        params.append(key, value);
      }
    });
    // Also send human-readable variant name for display on details page
    if (selectionLabels.variant) {
      params.append('variantName', selectionLabels.variant);
    }
    router.push(`/sellCar/sellCarDetails?${params.toString()}`);
  };

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-screen flex flex-col py-2 space-y-2">

      {/* Header */}
      <header className="flex flex-wrap items-center gap-1.5 text-slate-600 flex-shrink-0">

        {/* Step Header */}
        <div className="flex flex-wrap gap-1.5">
          {/* Back Button */}
          <Button
            onClick={() => router.back()}
            variant="secondary"
            className="flex items-center px-1.5 py-1 rounded-full border text-base md:text-lg lg:text-xs font-medium hover:text-primary-600 transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5 md:w-4 md:h-4" />
          </Button>

          {/* Step Sub-Options */}
          {sellFlowSteps.map((step) => {
            const isActive = step.id === currentStepId;
            const isCompleted = Boolean(selections[step.id]);
            const enabled = isStepEnabled(step.id);

            return (
              <button
                key={step.id}
                type="button"
                onClick={() => enabled && setCurrentStepId(step.id)}
                disabled={!enabled}
                className={`group relative flex flex-col rounded-xl border px-2 py-1 md:px-3 md:py-1.5 text-left transition ${isActive
                  ? 'border-primary-300 bg-white shadow-md text-primary-700'
                  : isCompleted
                    ? 'border-primary-200 bg-primary-50 text-primary-700'
                    : 'border-slate-200 bg-slate-50 text-slate-500'
                  } ${!enabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <span className="text-base md:text-lg lg:text-xs font-semibold">
                  {selectionLabels[step.id] ?? step.label}
                </span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Step Content */}
      <div className="rounded-2xl bg-gradient-to-b from-white via-white to-slate-50 shadow-[0_30px_80px_-50px_rgba(15,23,42,0.6)] border border-slate-100 p-3 sm:p-4 md:p-5 flex flex-col flex-1 min-h-0 space-y-3">
        <div className="space-y-0.5 flex-shrink-0">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-lg font-semibold text-slate-900">{currentStepMeta.label}</h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-xs text-slate-500">{currentStepMeta.description}</p>
        </div>

        {/* Search */}
        {showSearch && (
          <label className="relative block flex-shrink-0">
            <span className="absolute inset-y-0 left-3 md:left-4 flex items-center text-slate-400">
              <Search className="w-4 h-4 md:w-5 md:h-5" />
            </span>
            <input
              type="text"
              placeholder={`Search ${currentStepMeta.label.toLowerCase()}`}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2 md:py-2.5 pl-10 md:pl-12 pr-3 md:pr-4 text-base md:text-lg lg:text-xs placeholder:text-gray-500 focus:border-primary-400 focus:bg-white focus:ring-2 focus:ring-primary-dark transition-all"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </label>
        )}

        {/* Blocking Message */}
        {blockingMessage ? (
          <div className="mt-2 rounded-xl border border-dashed border-primary-200 bg-primary-50/40 p-3 md:p-4 text-center text-base md:text-lg lg:text-xs text-primary-700 flex-shrink-0 max-h-32 overflow-y-auto custom-scrollbar">
            {blockingMessage}
          </div>
        ) : currentStepId === 'price' ? (
          <div className="mt-2 flex-1 flex flex-col items-center">
            <div className="w-full max-w-lg mt-2">
              {/* Simple Price Input */}
              <div className="relative">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary-50 mb-4">
                    <span className="text-3xl md:text-4xl font-bold text-primary-600">₹</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl lg:text-xl font-bold text-slate-900 mb-2">What's your asking price?</h2>
                  <p className="text-lg md:text-xl lg:text-sm text-slate-500">Enter the amount you want to sell for</p>
                </div>

                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-400/20 to-primary-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative bg-white rounded-2xl border-2 border-slate-200 focus-within:border-primary-500 focus-within:shadow-lg transition-all duration-200">
                    <div className="flex items-center px-6 md:px-8 py-3 md:py-4">
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="0"
                        value={priceInput ? formatPrice(priceInput) : ''}
                        onChange={handlePriceChange}
                        className="flex-1 text-3xl md:text-4xl lg:text-xl font-bold text-slate-900 bg-transparent border-0 outline-none placeholder:text-slate-300"
                        autoFocus
                      />
                    </div>
                  </div>
                </div>

                {priceInput && parseInt(priceInput, 10) > 0 && (
                  <div className="mt-6 text-center">
                    <button
                      type="button"
                      onClick={handlePriceSubmit}
                      style={{
                        background: `linear-gradient(to right, var(--color-gradient-from), var(--color-gradient-to))`
                      }}
                      className="inline-flex items-center gap-2 px-8 md:px-10 py-3 md:py-3.5 rounded-xl text-white font-semibold text-lg md:text-xl lg:text-sm shadow-md hover:shadow-lg hover:scale-105 active:scale-100 transition-all duration-200"
                    >
                      Continue with {formatPrice(priceInput)} /-
                    </button>
                  </div>
                )}

                {selections.price && (
                  <div className="mt-4 text-center">
                    <p className="text-base md:text-lg lg:text-xs text-slate-500">
                      Current: <span className="font-semibold text-primary-600">{selections.price}</span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : currentStepId === 'location' ? (
          <div className="flex-1 flex flex-col items-center">
            <div className="w-full max-w-lg relative">
              <div className="text-center mb-6">
                <h2 className="text-2xl md:text-3xl lg:text-lg font-bold text-slate-900 mb-1 mt-2">
                  Where is your car located?
                </h2>
                <p className="text-base md:text-lg lg:text-xs text-slate-500">
                  Start typing your city name, pincode or area name to set the car location.
                </p>
              </div>

              <div className="relative">
                <label className="relative block">
                  <span className="absolute inset-y-0 left-4 flex items-center text-slate-400">
                    <Search className="w-5 h-5" />
                  </span>
                  <input
                    type="text"
                    placeholder="Search or type your city (e.g. Rajkot)"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 py-3 pl-11 pr-4 text-[13px] placeholder:text-gray-500 text-slate-900 focus:border-primary-400 focus:bg-white focus:ring-2 focus:ring-primary-dark transition-all"
                    value={locationInput}
                    onChange={(event) => {
                      setLocationInput(event.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => {
                      if (locationSuggestions.length > 0) {
                        setShowSuggestions(true);
                      }
                    }}
                    onBlur={() => {
                      // Delay hiding suggestions to allow click events
                      setTimeout(() => setShowSuggestions(false), 200);
                    }}
                    autoFocus
                  />
                </label>

                {/* Suggestions Dropdown */}
                {showSuggestions && locationInput.trim().length >= 3 && (
                  <div
                    className="absolute z-50 w-full mt-2 bg-white rounded-2xl border border-slate-200 shadow-lg max-h-80 overflow-y-auto custom-scrollbar"
                    onScroll={(e) => handleLocationScroll(e.currentTarget)}
                  >
                    {isLoadingLocations && locationSuggestions.length === 0 ? (
                      <div className="p-4 text-center text-sm text-slate-500">
                        Loading suggestions...
                      </div>
                    ) : locationSuggestions.length > 0 ? (
                      <div className="py-2">
                        {locationSuggestions.map((suggestion, index) => (
                          <button
                            key={`${suggestion.pincode_id}-${index}`}
                            type="button"
                            onClick={() => handleLocationSuggestionSelect(suggestion)}
                            className="w-full text-left px-4 py-3 hover:bg-primary-50 transition-colors border-b border-slate-100 last:border-b-0"
                          >
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-2">
                                {suggestion.area_name && (
                                  <p className="text-sm font-semibold text-slate-900">
                                    {suggestion.area_name}
                                  </p>
                                )}
                                {suggestion.pincode && (
                                  <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                                    {suggestion.pincode}
                                  </span>
                                )}
                              </div>
                              {suggestion.city && (
                                <p className="text-xs text-slate-600">
                                  {suggestion.city}
                                </p>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-sm text-slate-500">
                        No locations found. Try a different search term.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : currentStepId === 'photos' ? (
          <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
            <PhotosUpload
              setUploadedPhotoFiles={setUploadedPhotoFiles}
              onSelectionChange={(value) => {
                setSelections((prev) => {
                  const updated: SelectionState = { ...prev, photos: value };
                  sellFlowSteps.slice(currentStepIndex + 1).forEach((step) => {
                    delete updated[step.id];
                  });
                  // Reset photo count if switching away from upload-now
                  if (value !== 'upload-now') {
                    setUploadedPhotosCount(0);
                    setUploadedPhotoPreviews([]);
                  }
                  return updated;
                });

                setSelectionLabels((prev) => {
                  const updated: SelectionLabelState = { ...prev, photos: value };
                  sellFlowSteps.slice(currentStepIndex + 1).forEach((step) => {
                    delete updated[step.id];
                  });
                  return updated;
                });
              }}
              onPhotosUploaded={(count) => {
                setUploadedPhotosCount(count);
              }}
              onPhotosChange={(photos) => {
                setUploadedPhotoPreviews(photos);
              }}
            />
          </div>
        ) : (
          <div className="mt-2 flex-1 overflow-y-auto pr-1 custom-scrollbar">
            {currentStepId === 'variant' ? (
              <div className="space-y-3">
                {/* Fuel Type Filter */}
                <div className="space-y-1">
                  <p className="text-xs font-medium text-slate-500">Fuel type</p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setVariantFuelFilter(null)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${variantFuelFilter === null
                        ? 'bg-primary-600 text-white border-primary-600'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-primary-300 hover:text-primary-700'
                        }`}
                    >
                      All
                    </button>
                    {Array.from(
                      new Set(
                        filteredOptions
                          .map((o) => (o as StepOption).fuelType)
                          .filter((x): x is string => Boolean(x && x.trim()))
                      )
                    ).map((fuel) => (
                      <button
                        key={fuel}
                        type="button"
                        onClick={() => setVariantFuelFilter(fuel)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${variantFuelFilter === fuel
                          ? 'bg-primary-50 text-primary-700 border-primary-400'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-primary-300 hover:text-primary-700'
                          }`}
                      >
                        {fuel}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Transmission Filter */}
                <div className="space-y-1">
                  <p className="text-xs font-medium text-slate-500">Transmission</p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setVariantTransmissionFilter(null)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${variantTransmissionFilter === null
                        ? 'bg-primary-600 text-white border-primary-600'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-primary-300 hover:text-primary-700'
                        }`}
                    >
                      All
                    </button>
                    {Array.from(
                      new Set(
                        filteredOptions
                          .map((o) => (o as StepOption).transmissionType)
                          .filter((x): x is string => Boolean(x && x.trim()))
                      )
                    ).map((trans) => (
                      <button
                        key={trans}
                        type="button"
                        onClick={() => setVariantTransmissionFilter(trans)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${variantTransmissionFilter === trans
                          ? 'bg-primary-50 text-primary-700 border-primary-400'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-primary-300 hover:text-primary-700'
                          }`}
                      >
                        {trans}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Variant Cards */}
                <div className="space-y-2">
                  {filteredOptions
                    .filter((option) => {
                      const opt = option as StepOption;
                      if (variantFuelFilter && opt.fuelType !== variantFuelFilter) return false;
                      if (variantTransmissionFilter && opt.transmissionType !== variantTransmissionFilter) return false;
                      return true;
                    })
                    .map((option) => {
                      const isSelected = selections[currentStepId] === option.value;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => handleOptionSelect(option.value, option.label)}
                          className={`w-full flex items-center justify-between gap-3 rounded-2xl border bg-white/90 px-3 py-2 md:px-4 md:py-3 transition hover:-translate-y-0.5 hover:border-primary-300 hover:shadow-[0_18px_40px_-30px_rgba(59,130,246,0.8)] ${isSelected
                            ? 'border-primary-500 bg-primary-50 shadow-[0_22px_55px_-35px_rgba(59,130,246,0.7)]'
                            : 'border-slate-200'
                            }`}
                        >
                          <div className="flex flex-col items-start text-left">
                            <p className="text-sm md:text-base lg:text-xs font-semibold text-slate-900">
                              {option.label}
                            </p>
                            <div className="mt-1 flex flex-wrap gap-1.5">
                              {(option as StepOption).fuelType && (
                                <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-700">
                                  {(option as StepOption).fuelType}
                                </span>
                              )}
                              {(option as StepOption).transmissionType && (
                                <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-700">
                                  {(option as StepOption).transmissionType}
                                </span>
                              )}
                            </div>
                          </div>

                          {isSelected && (
                            <div className="flex items-center">
                              <CheckCircle2 className="w-4 h-4 text-primary-500" />
                            </div>
                          )}
                        </button>
                      );
                    })}

                  {/* No Options */}
                  {filteredOptions.filter((option) => {
                    const opt = option as StepOption;
                    if (variantFuelFilter && opt.fuelType !== variantFuelFilter) return false;
                    if (variantTransmissionFilter && opt.transmissionType !== variantTransmissionFilter) return false;
                    return true;
                  }).length === 0 && (
                      <div className="rounded-xl border border-slate-200 bg-white p-4 text-center text-sm lg:text-[10px] text-slate-500">
                        No variants match these fuel and transmission filters.
                      </div>
                    )}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
                {filteredOptions.map((option) => {
                  const isSelected = selections[currentStepId] === option.value;
                  const isBrandStep = currentStepId === 'brand';
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleOptionSelect(option.value, option.label)}
                      className={`group relative mt-1 rounded-xl border bg-white/80 p-2 transition hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-[0_15px_35px_-25px_rgba(59,130,246,0.8)] ${isBrandStep ? 'flex flex-col items-center text-center gap-2' : 'flex flex-col items-center text-center gap-2'
                        } ${isSelected
                          ? 'border-primary-400 shadow-[0_20px_60px_-35px_rgba(59,130,246,0.7)]'
                          : 'border-slate-100'
                        }`}
                    >
                      {option.logo && (
                        <div
                          className={`flex items-center justify-center rounded-lg border border-slate-100 bg-white/70 ${isBrandStep ? 'h-12 w-12 md:h-14 md:w-14' : 'h-10 w-10 md:h-12 md:w-12'
                            }`}
                        >
                          <img
                            src={option.logo}
                            alt={option.value}
                            className={`${isBrandStep ? 'max-h-10 md:max-h-12' : 'max-h-8 md:max-h-10'} object-contain`}
                          />
                        </div>
                      )}

                      <div className="flex flex-col items-center text-center">
                        <p className="text-base md:text-lg lg:text-xs font-semibold text-slate-800">{option.label}</p>
                      </div>

                      {isSelected && (
                        <span className="absolute inset-x-4 -bottom-2 rounded-full bg-primary-50 text-primary-600 text-[9px] font-semibold shadow-lg -leading-[4.5rem]">
                          Selected
                        </span>
                      )}
                    </button>
                  );
                })}

                {/* No Options */}
                {filteredOptions.length === 0 && (
                  <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-slate-200 bg-white p-4 text-center text-sm lg:text-[10px] text-slate-500">
                    No options match your search.
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Next Up / Complete */}
        {isAllStepsCompleted() ? (
          <div className="flex flex-col gap-3 rounded-xl border-2 border-emerald-200 bg-gradient-to-r from-emerald-50 via-green-50 to-white p-4 flex-shrink-0">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-base lg:text-xs font-semibold text-emerald-900 mb-1">All steps completed!</p>
                <p className="text-sm lg:text-[10px] text-emerald-700">
                  You've successfully filled in all the required information. Review your car details and submit your listing.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={resetFilters}
                className="rounded-xl border border-emerald-300 px-4 py-2 text-sm lg:text-[10px] font-semibold text-emerald-700 hover:bg-emerald-100 transition duration-200"
              >
                Reset All
              </button>
              <button
                type="button"
                onClick={handleViewDetails}
                style={{
                  background: `linear-gradient(to right, var(--color-gradient-from), var(--color-gradient-to))`
                }}
                className="flex-1 rounded-xl text-white font-semibold text-sm lg:text-[10px] px-6 py-2 shadow-md hover:shadow-lg transition-all duration-200"
              >
                View Details →
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-primary-100 bg-gradient-to-r from-primary-50 via-blue-50 to-white p-2.5 flex-shrink-0">
            <div className="flex-1">
              <p className="text-sm lg:text-[10px] font-semibold text-primary-700">Next up</p>
              <p className="text-sm lg:text-[10px] text-slate-600">
                {currentStepIndex + 1 < sellFlowSteps.length
                  ? `Once you finish ${currentStepMeta.label.toLowerCase()}, we will move to ${sellFlowSteps[currentStepIndex + 1].label
                  }.`
                  : 'You are on the final step. Get ready to submit!'}
              </p>
            </div>

            {/* Reset Filters */}
            {selectionCount > 0 && (
              <button
                type="button"
                onClick={resetFilters}
                className="rounded-xl border border-primary-300 px-4 py-1.5 text-sm lg:text-[10px] font-semibold text-primary-600 hover:bg-primary-600 hover:text-white transition duration-400"
              >
                Reset filters
              </button>
            )}
          </div>
        )}
      </div>

    </section>
  );
};

export default AddCardComponent;