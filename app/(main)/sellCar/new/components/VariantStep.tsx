'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { ChevronRight, Loader2 } from 'lucide-react';
import { getCarVariantsByYearAndModel } from '@/utils/auth';

export interface CarDetails {
  brand?: string;
  year?: string;
  model?: string;
  variant?: string;
  variantLabel?: string;
  ownership?: string;
  kilometerDriven?: string;
  location?: string;
  price?: string;
  photos?: string;
  fuelType?: string;
  transmissionType?: string;
}

interface VariantStepProps {
  carDetails: CarDetails;
  updateCarDetails: (updates: Partial<CarDetails>) => void;
  onNext: () => void;
  onPrev: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

interface VariantOption {
  id: string;
  displayName?: string;
  name?: string;
  fuelType?: string;
  transmissionType?: string;
}

const VariantStep: React.FC<VariantStepProps> = ({
  carDetails,
  updateCarDetails,
  onNext,
  onPrev,
}) => {
  const [variants, setVariants] = useState<VariantOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [fuelFilter, setFuelFilter] = useState<string | null>(null);
  const [transmissionFilter, setTransmissionFilter] = useState<string | null>(null);

  useEffect(() => {
    if (!carDetails.year || !carDetails.model) {
      onPrev();
      return;
    }

    const fetchVariants = async () => {
      try {
        const response = await getCarVariantsByYearAndModel(carDetails.year!, carDetails.model!);
        const variantGroups = Array.isArray(response?.data) ? response.data : Array.isArray(response) ? response : [];
        
        // Flatten fuel-type groups into a single list
        const flatVariants: VariantOption[] = [];
        variantGroups.forEach((group: any) => {
          const fuelType = group?.fuelType;
          (group?.variants ?? []).forEach((variant: any) => {
            flatVariants.push({
              ...variant,
              fuelType,
            });
          });
        });
        
        setVariants(flatVariants);
      } catch (error) {
        console.error('Error fetching variants:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVariants();
  }, [carDetails.year, carDetails.model, onPrev]);

  const availableFuelTypes = useMemo(() => {
    return Array.from(new Set(variants.map(v => v.fuelType).filter(Boolean)));
  }, [variants]);

  const availableTransmissions = useMemo(() => {
    return Array.from(new Set(variants.map(v => v.transmissionType).filter(Boolean)));
  }, [variants]);

  const filteredVariants = useMemo(() => {
    return variants.filter((variant) => {
      if (fuelFilter && variant.fuelType !== fuelFilter) return false;
      if (transmissionFilter && variant.transmissionType !== transmissionFilter) return false;
      return true;
    });
  }, [variants, fuelFilter, transmissionFilter]);

  const handleSelectVariant = (variant: VariantOption) => {
    updateCarDetails({
      variant: String(variant.id),
      variantLabel: variant.displayName || variant.name || '',
      fuelType: variant.fuelType,
      transmissionType: variant.transmissionType,
    });
    onNext();
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-12 text-center">
          <Loader2 className="w-12 h-12 text-primary-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading variants...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6 sm:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
            Select Car Variant
          </h1>
          <p className="text-slate-600 text-base sm:text-lg">
            Choose the specific variant or trim of your car
          </p>
        </div>

        {/* Filters */}
        {(availableFuelTypes.length > 0 || availableTransmissions.length > 0) && (
          <div className="mb-6 space-y-4">
            {availableFuelTypes.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-2">Fuel Type</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setFuelFilter(null)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold border transition ${
                      fuelFilter === null
                        ? 'bg-primary-600 text-white border-primary-600'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-primary-300'
                    }`}
                  >
                    All
                  </button>
                  {availableFuelTypes.map((fuel) => (
                    <button
                      key={fuel}
                      onClick={() => setFuelFilter(fuel || null)}
                      className={`px-4 py-2 rounded-full text-sm font-semibold border transition ${
                        fuelFilter === fuel
                          ? 'bg-primary-50 text-primary-700 border-primary-400'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-primary-300'
                      }`}
                    >
                      {fuel}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {availableTransmissions.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-2">Transmission</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setTransmissionFilter(null)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold border transition ${
                      transmissionFilter === null
                        ? 'bg-primary-600 text-white border-primary-600'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-primary-300'
                    }`}
                  >
                    All
                  </button>
                  {availableTransmissions.map((trans) => (
                    <button
                      key={trans}
                      onClick={() => setTransmissionFilter(trans || null)}
                      className={`px-4 py-2 rounded-full text-sm font-semibold border transition ${
                        transmissionFilter === trans
                          ? 'bg-primary-50 text-primary-700 border-primary-400'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-primary-300'
                      }`}
                    >
                      {trans}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Variant List */}
        <div className="space-y-3">
          {filteredVariants.map((variant) => {
            const isSelected = carDetails.variant === String(variant.id);
            const variantName = variant.displayName || variant.name || '';
            return (
              <button
                key={variant.id}
                onClick={() => handleSelectVariant(variant)}
                className={`
                  w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all
                  ${isSelected
                    ? 'border-primary-500 bg-primary-50 shadow-lg'
                    : 'border-slate-200 bg-white hover:border-primary-300 hover:shadow-md'
                  }
                `}
              >
                <div className="flex flex-col items-start">
                  <span className={`text-base font-semibold ${isSelected ? 'text-primary-700' : 'text-slate-700'}`}>
                    {variantName}
                  </span>
                  <div className="flex gap-2 mt-1">
                    {variant.fuelType && (
                      <span className="px-2 py-1 text-xs font-medium bg-slate-100 text-slate-600 rounded-full">
                        {variant.fuelType}
                      </span>
                    )}
                    {variant.transmissionType && (
                      <span className="px-2 py-1 text-xs font-medium bg-slate-100 text-slate-600 rounded-full">
                        {variant.transmissionType}
                      </span>
                    )}
                  </div>
                </div>
                {isSelected && (
                  <ChevronRight className="w-5 h-5 text-primary-500" />
                )}
              </button>
            );
          })}
        </div>

        {filteredVariants.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500">No variants found with the selected filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VariantStep;

