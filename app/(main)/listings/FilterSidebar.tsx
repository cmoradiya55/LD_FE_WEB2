'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { Filter, X, ChevronDown, ChevronUp, Fuel, Leaf, BatteryCharging, Droplets, Car, Search } from 'lucide-react';
import AllIconComponent from '../../../public/AllIconComponent';
import { Button } from '@/components/Button/Button';
import { RangeFilterSection } from './components/RangeFilterSection';
import { getCarBrands, getCarModelsByBrandId, getSearchModelByBrandOrModel } from '@/utils/auth';
import { BodyType, FuelType, OwnerType, SafetyRating, TransmissionType, UsedCarSortOption } from '@/lib/data';
import { budgetStops, kmsStops, yearStops } from './CarsListingsPageComponent';

interface FilterSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    filters: FilterState;
    onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
    cityId: string | null;
    isCityIncluded: boolean | null;
    status: string;
    sortBy?: UsedCarSortOption | string;
    minPrice: number;
    maxPrice: number;
    brand: string | string[];
    model: string | string[];
    fuelType: Array<FuelType | string>;
    transmissionType: Array<TransmissionType | string>;
    minModelYear: number;
    maxModelYear: number;
    location: string;
    minKms: number;
    maxKms: number;
    bodyType?: Array<BodyType | string>;
    color?: string;
    features?: string[];
    seats?: string[];
    ownershipType: Array<OwnerType | string>;
    safetyRating?: SafetyRating | string;
    airbags?: string;
    safetyFeatures?: string[];
}



export default function FilterSidebar({ isOpen, onClose, filters, onFilterChange }: FilterSidebarProps) {
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
        sortBy: false,
        status: false,
        budget: false,
        brand: false,
        location: false,
        minModelYear: false,
        maxModelYear: false,
        kms: false,
        fuelType: false,
        bodyType: false,
        transmissionType: false,
        color: false,
        features: false,
        seats: false,
        owners: false,
        safety: false,
    });

    const [expandedTransmissions, setExpandedTransmissions] = useState<Record<string, boolean>>({
        Manual: false,
        Automatic: false,
    });
    const [expandedBrands, setExpandedBrands] = useState<Record<string, boolean>>({});
    const [brandSearchTerm, setBrandSearchTerm] = useState('');
    const [brandsData, setBrandsData] = useState<Record<string, { id: string; displayName: string; logo?: string; count: number; subTypes: Array<{ value: string; label: string; count: number }> }>>({});
    const [loadingBrands, setLoadingBrands] = useState(false);
    const [loadingModels, setLoadingModels] = useState<Record<string, boolean>>({});
    const [isSearchingModels, setIsSearchingModels] = useState(false);

    const toggleSection = async (section: string) => {
        const newExpanded = !expandedSections[section];
        setExpandedSections(prev => ({
            ...prev,
            [section]: newExpanded,
        }));

        if (section === 'brand' && newExpanded && Object.keys(brandsData).length === 0) {
            setLoadingBrands(true);
            try {
                const brandsResponse = await getCarBrands();
                const brands = Array.isArray(brandsResponse?.data)
                    ? brandsResponse.data
                    : Array.isArray(brandsResponse)
                        ? brandsResponse
                        : [];

                const brandsMap: Record<string, { id: string; displayName: string; logo?: string; count: number; subTypes: Array<{ value: string; label: string; count: number }> }> = {};
                
                brands.forEach((brand: any) => {
                    brandsMap[brand.displayName || brand.name] = {
                        id: String(brand.id),
                        displayName: brand.displayName || brand.name,
                        logo: brand.logo,
                        count: 0, 
                        subTypes: [], 
                    };
                });

                setBrandsData(brandsMap);
            } catch (error) {
                console.error('Error fetching brands:', error);
            } finally {
                setLoadingBrands(false);
            }
        }
    };

    const handleFilterChange = (key: keyof FilterState, value: string) => {
        onFilterChange({
            ...filters,
            [key]: value,
        });
    };

    // Helper functions to normalize brand and model to arrays
    const getBrandsArray = (): string[] => {
        if (Array.isArray(filters.brand)) return filters.brand;
        return filters.brand ? [filters.brand] : [];
    };

    const getModelsArray = (): string[] => {
        if (Array.isArray(filters.model)) return filters.model;
        return filters.model ? [filters.model] : [];
    };

    const getFuelTypesArray = (): string[] => {
        if (Array.isArray(filters.fuelType)) return filters.fuelType.map(String);
        return filters.fuelType ? [String(filters.fuelType)] : [];
    };

    const getTransmissionTypesArray = (): string[] => {
        if (Array.isArray(filters.transmissionType)) return filters.transmissionType.map(String);
        return filters.transmissionType ? [String(filters.transmissionType)] : [];
    };

    const getBodyTypesArray = (): string[] => {
        if (Array.isArray(filters.bodyType)) return filters.bodyType.map(String);
        return filters.bodyType ? [String(filters.bodyType)] : [];
    };

    const getSeatsArray = (): string[] => {
        if (Array.isArray(filters.seats)) return filters.seats.map(String);
        return filters.seats ? [String(filters.seats)] : [];
    };

    const getOwnerTypesArray = (): string[] => {
        if (Array.isArray(filters.ownershipType)) return filters.ownershipType.map(String);
        return filters.ownershipType ? [String(filters.ownershipType)] : [];
    };

    const hasActiveFilters = useMemo(() => {
        const brandArray = getBrandsArray();
        const modelArray = getModelsArray();
        const fuelArray = getFuelTypesArray();
        const transmissionArray = getTransmissionTypesArray();
        const bodyArray = getBodyTypesArray();
        const seatsArray = getSeatsArray();
        const ownersArray = getOwnerTypesArray();
        return Object.entries(filters).some(([key, value]) => {
            if (key === 'brand') return brandArray.length > 0;
            if (key === 'model') return modelArray.length > 0;
            if (key === 'fuelType') return fuelArray.length > 0;
            if (key === 'transmissionType') return transmissionArray.length > 0;
            if (key === 'bodyType') return bodyArray.length > 0;
            if (key === 'seats') return seatsArray.length > 0;
            if (key === 'ownershipType') return ownersArray.length > 0;
            if (Array.isArray(value)) return value.length > 0;
            return value !== '' && value !== null && value !== undefined;
        });
    }, [filters]);

    const handleReset = () => {
        onFilterChange({
            cityId: null,
            isCityIncluded: null,
            status: '',
            sortBy: '',
            minPrice: budgetStops[0],
            maxPrice: budgetStops[budgetStops.length - 1],
            brand: [],
            model: [],
            fuelType: [],
            transmissionType: [],
            minModelYear: yearStops[0],
            maxModelYear: yearStops[yearStops.length - 1],
            location: '',
            ownershipType: [],
            minKms: kmsStops[0],
            maxKms: kmsStops[kmsStops.length - 1],
            bodyType: [],
            color: '',
            features: [],
            seats: [],
        safetyRating: '',
        airbags: '',
        safetyFeatures: [],
        });
    };

    const toNumber = (value: number, fallback: number) => {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : fallback;
    };

    const fuelCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        return counts;
    }, []);
    
    const fuelIconMap: Record<string, { Icon: any; color: string; bg: string }> = {
        Petrol: { Icon: Fuel, color: 'text-primary-500', bg: 'bg-primary-50' },
        Diesel: { Icon: Fuel, color: 'text-blue-500', bg: 'bg-blue-50' },
        CNG: { Icon: Droplets, color: 'text-emerald-500', bg: 'bg-emerald-50' },
        Electric: { Icon: BatteryCharging, color: 'text-indigo-500', bg: 'bg-indigo-50' },
        Hybrid: { Icon: Leaf, color: 'text-green-500', bg: 'bg-green-50' },
        LPG: { Icon: Fuel, color: 'text-amber-500', bg: 'bg-amber-50' },
        Other: { Icon: Fuel, color: 'text-gray-500', bg: 'bg-gray-50' },
    };

    type BodyTypeLabel = 'Hatchback' | 'SUV' | 'Sedan';
    const fuelOptions = useMemo(() => {
        const options = [
            { label: 'Petrol', value: FuelType.PETROL },
            { label: 'Diesel', value: FuelType.DIESEL },
            { label: 'CNG', value: FuelType.CNG },
            { label: 'Electric', value: FuelType.ELECTRIC },
            { label: 'Hybrid', value: FuelType.HYBRID },
        ];

        return options.map(option => {
            const meta = fuelIconMap[option.label] || { Icon: Fuel, color: 'text-primary-500', bg: 'bg-primary-50' };
            return { ...option, count: fuelCounts[option.label] || 0, ...meta };
    }, [fuelCounts]);
    }, [fuelCounts]);
    const classifyBodyType = (name: string): BodyTypeLabel => {
        const lower = name.toLowerCase();
        if (lower.includes('suv') || lower.includes('xuv') || lower.includes('creta') || lower.includes('scorpio')) return 'SUV';
        if (lower.includes('sedan') || lower.includes('ciaz') || lower.includes('city') || lower.includes('verna') || lower.includes('dzire')) return 'Sedan';
        if (lower.includes('hatch') || lower.includes('swift') || lower.includes('i20') || lower.includes('baleno') || lower.includes('polo')) return 'Hatchback';
        return 'Sedan'; 
    };

    const bodyTypeOptions = useMemo(() => {
        const bodyTypeImageMap: Record<BodyTypeLabel, string> = {
            Hatchback: '/Hatchback.webp',
            SUV: '/SUV.webp',
            Sedan: '/Sedan.webp',
        };

        const map: Record<BodyTypeLabel, { count: number; image?: string }> = {
            Hatchback: { count: 0, image: bodyTypeImageMap.Hatchback },
            SUV: { count: 0, image: bodyTypeImageMap.SUV },
            Sedan: { count: 0, image: bodyTypeImageMap.Sedan },
        };

        const bodyTypeValueMap: Record<BodyTypeLabel, BodyType> = {
            Hatchback: BodyType.HATCHBACK,
            SUV: BodyType.SUV,
            Sedan: BodyType.SEDAN,
        };

        return (Object.keys(map) as BodyTypeLabel[]).map(label => ({
            label,
            value: bodyTypeValueMap[label],
            count: map[label].count,
            image: map[label].image,
        }));
    }, []);

    const transmissionIconMap: Record<string, { iconKey: 'manualIcon' | 'automaticIcon'; color: string; bg: string }> = {
        Manual: { iconKey: 'manualIcon', color: 'text-blue-500', bg: 'bg-blue-50' },
        Automatic: { iconKey: 'automaticIcon', color: 'text-purple-500', bg: 'bg-purple-50' },
    };

    const seatOptions = [
        { value: '4', label: '4 Seater', count: 13, image: '/filter/4Seater.webp' },
        { value: '5', label: '5 Seater', count: 1135, image: '/filter/5Seater.webp' },
        { value: '6', label: '6 Seater', count: 16, image: '/filter/6Seater.webp' },
        { value: '7', label: '7 Seater', count: 75, image: '/filter/7Seater.webp' },
        { value: '8', label: '8 Seater', count: 9, image: '/filter/8Seater.webp' },
        { value: '9', label: '9 Seater', count: 0, image: '/filter/9Seater.webp' },
    ];

    const getOwnerLabelFromEnum = (ownerType: OwnerType): string => {
        const ordinalMap: Record<number, string> = {
            [OwnerType.FIRST]: '1st Owner',
            [OwnerType.SECOND]: '2nd Owner',
            [OwnerType.THIRD]: '3rd Owner',
            [OwnerType.FOURTH]: '4th Owner',
            [OwnerType.FIFTH]: '5th Owner',
        };
        const ordinal = ordinalMap[ownerType] ?? String(ownerType);
        return `${ordinal} owner`;
    };

    const ownerOptions = (Object.values(OwnerType).filter(
        (v) => typeof v === 'number',
    ) as OwnerType[]).map((value) => {
        const numeric = Number(value);
        const iconKey = `user${numeric}Icon`;
        // Static counts for now; can be wired to API later
        const defaultCounts: Record<number, number> = {
            [OwnerType.FIRST]: 809,
            [OwnerType.SECOND]: 357,
            [OwnerType.THIRD]: 100,
            [OwnerType.FOURTH]: 23,
            [OwnerType.FIFTH]: 5,
        };

        return {
            value,
            label: getOwnerLabelFromEnum(value),
            count: defaultCounts[numeric] ?? 0,
            Icon: iconKey,
        };
    });

    const ncapRatings = [
        { value: SafetyRating.FIVE, filled: 5, count: 17 },
        { value: SafetyRating.FOUR, filled: 4, count: 18 },
        { value: SafetyRating.THREE, filled: 3, count: 5 },
        { value: SafetyRating.TWO, filled: 2, count: 4 },
        { value: SafetyRating.ONE, filled: 1, count: 0 },
    ];

    // const airbagOptions = [
    //     { value: '1', label: '1 Airbag', count: 63 },
    //     { value: '2', label: '2 Airbags', count: 542 },
    //     { value: '3', label: '3 Airbags', count: 2 },
    //     { value: '4', label: '4 Airbags', count: 20 },
    //     { value: '5', label: '5 Airbags', count: 0 },
    //     { value: '6', label: '6 Airbags', count: 128 },
    //     { value: '7', label: '7 Airbags', count: 4 },
    //     { value: '8', label: '8 Airbags', count: 2 },
    // ];

    // const safetyFeatureOptions = [
    //     { value: 'abs', label: 'ABS', count: 817 },
    //     { value: 'ebd', label: 'EBD', count: 603 },
    //     { value: 'tractionControl', label: 'Traction Control', count: 212 },
    //     { value: 'hillHoldControl', label: 'Hill Hold Control', count: 191 },
    //     { value: 'isofix', label: 'ISOFIX Child', count: 421 },
    // ];

    // const selectedSafetyFeatures = filters.safetyFeatures || [];
    // const safetyFeatureImageMap: Record<string, string> = {
    //     abs: '/filter/brake_assist.webp',
    //     ebd: '/filter/EBD.webp',
    //     tractionControl: '/filter/traction_control.webp',
    //     hillHoldControl: '/filter/hill_control.webp',
    //     isofix: '/filter/ISOFIX.webp',
    // };

    const transmissionTypes = useMemo(() => {
        const types = {
            Manual: {
                value: TransmissionType.MANUAL,
                count: 1085,
                subTypes: [
                    { value: 'Regular (Manual)', label: 'Regular (Manual)', count: 1080 },
                    { value: 'iMT', label: 'iMT (Intelligent Manual Transmission)', count: 5 },
                ],
            },
            Automatic: {
                value: TransmissionType.AUTOMATIC,
                count: 234,
                subTypes: [
                    { value: 'TC', label: 'TC (Torque Converter)', count: 89 },
                    { value: 'AMT', label: 'AMT (Automated Manual Transmission)', count: 55 },
                    { value: 'CVT', label: 'CVT (Continuously Variable Transmission)', count: 48 },
                    { value: 'DCT', label: 'DCT (Dual-Clutch Transmission)', count: 38 },
                    { value: 'IVT', label: 'IVT (Intelligent Variable Transmission)', count: 4 },
                ],
            },
        };
        return types;
    }, []);

    const brandIconMap: Record<string, { logo: string }> = {
        'Maruti Suzuki': { logo: '/CarLogo/MarutiLogo.png' },
        'Hyundai': { logo: '/CarLogo/Hyundai.png' },
        'Tata': { logo: '/CarLogo/TATA.png' },
        'Mahindra': { logo: '/CarLogo/Mahindra.jpg' },
        'Honda': { logo: '/CarLogo/Honda.png' },
        'Toyota': { logo: '/CarLogo/carToyota.png' },
    };

    const brandTypes = useMemo(() => {
        return brandsData;
    }, [brandsData]);

    useEffect(() => {
        if (!brandSearchTerm.trim()) return;

        const term = brandSearchTerm.toLowerCase();
        let isCancelled = false;

        const loadModelsForSearch = async () => {
            setIsSearchingModels(true);
            try {
                const response = await getSearchModelByBrandOrModel(brandSearchTerm);
                const models = Array.isArray(response?.data)
                    ? response.data
                    : Array.isArray(response)
                        ? response
                        : [];

                const expandedUpdates: Record<string, boolean> = {};

                setBrandsData(prev => {
                    const next = { ...prev };

                    models.forEach((model: any) => {
                        const brandName =
                            model.brandName ||
                            model.brand?.displayName ||
                            model.brand?.name ||
                            model.brand ||
                            '';
                        const brandId = String(model.brandId ?? model.brand?.id ?? '');
                        const modelId = String(model.id ?? model.modelId ?? model.name ?? model.displayName ?? '');
                        const modelLabel = model.displayName || model.name || model.modelName || modelId;

                        if (!brandName || !modelId || !modelLabel) return;

                        const existingBrand = next[brandName] ?? {
                            id: brandId || modelId,
                            displayName: brandName,
                            logo: model.brandLogo || model.logo,
                            count: 0,
                            subTypes: [],
                        };

                        const subTypes = existingBrand.subTypes ? [...existingBrand.subTypes] : [];

                        if (!subTypes.some(sub => sub.value === modelId)) {
                            subTypes.push({
                                value: modelId,
                                label: modelLabel,
                                count: 0,
                            });
                        }

                        next[brandName] = {
                            ...existingBrand,
                            id: existingBrand.id || brandId || modelId,
                            subTypes,
                            count: subTypes.length,
                        };

                        if (
                            brandName.toLowerCase().includes(term) ||
                            modelLabel.toLowerCase().includes(term)
                        ) {
                            expandedUpdates[brandName] = true;
                        }
                    });

                    return next;
                });

                if (!isCancelled && Object.keys(expandedUpdates).length > 0) {
                    setExpandedBrands(prev => ({
                        ...prev,
                        ...expandedUpdates,
                    }));
                }
            } catch (error) {
                console.error('Error searching models:', error);
            } finally {
                if (!isCancelled) {
                    setIsSearchingModels(false);
                }
            }
        };

        loadModelsForSearch();

        return () => {
            isCancelled = true;
        };
    }, [brandSearchTerm]);

    const filteredBrandEntries = useMemo(() => {
        if (!brandSearchTerm.trim()) return Object.entries(brandTypes);

        const term = brandSearchTerm.toLowerCase();
        return Object.entries(brandTypes).filter(([brandName, data]) => {
            const brandMatch = brandName.toLowerCase().includes(term);
            const modelMatch = data.subTypes.some(sub => sub.label.toLowerCase().includes(term));
            return brandMatch || modelMatch;
        });
    }, [brandSearchTerm, brandTypes]);

    // const toggleTransmission = (type: string) => {
    //     setExpandedTransmissions(prev => ({
    //         ...prev,
    //         [type]: !prev[type],
    //     }));
    // };

    const toggleBrand = async (brandName: string) => {
        const brandData = brandsData[brandName];
        if (!brandData) return;

        const newExpanded = !expandedBrands[brandName];
        setExpandedBrands(prev => ({
            ...prev,
            [brandName]: newExpanded,
        }));

        // Fetch models when brand is expanded for the first time
        if (newExpanded && brandData.subTypes.length === 0) {
            setLoadingModels(prev => ({ ...prev, [brandName]: true }));
            try {
                const modelsResponse = await getCarModelsByBrandId(brandData.id);
                const models = Array.isArray(modelsResponse?.data)
                    ? modelsResponse.data
                    : Array.isArray(modelsResponse)
                        ? modelsResponse
                        : [];

                const subTypes = models.map((model: any) => ({
                    value: String(model.id ?? model.name ?? model.displayName ?? ''),
                    label: model.displayName || model.name || '',
                    count: 0, // Count can be updated if available from API
                }));

                setBrandsData(prev => ({
                    ...prev,
                    [brandName]: {
                        ...prev[brandName],
                        subTypes,
                        count: subTypes.length, // Update count based on models
                    },
                }));
            } catch (error) {
                console.error('Error fetching models:', error);
            } finally {
                setLoadingModels(prev => ({ ...prev, [brandName]: false }));
            }
        }
    };

    const formatCurrency = (value: number) => `₹ ${value.toLocaleString('en-IN')}`;
    const formatNumber = (value: number) => value.toLocaleString('en-IN');

    const budgetMinValue = toNumber(filters.minPrice, budgetStops[0]);
    const budgetMaxValue = toNumber(filters.maxPrice, budgetStops[budgetStops.length - 1]);
    const yearMinValue = toNumber(filters.minModelYear, yearStops[0]);
    const yearMaxValue = toNumber(filters.maxModelYear, yearStops[yearStops.length - 1]);
    const kmsMinValue = toNumber(filters.minKms, kmsStops[0]);
    const kmsMaxValue = toNumber(filters.maxKms, kmsStops[kmsStops.length - 1]);

    console.log("budgetMinValue: ", budgetMinValue, " budgetMaxValue: ", budgetMaxValue);
    
    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed lg:sticky top-0 left-0 h-screen lg:min-h-screen z-50 lg:z-auto
                w-[280px] lg:w-62 bg-white border-r border-gray-200 shadow-xl lg:shadow-sm lg:rounded-lg
                transform transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                overflow-y-auto custom-scrollbar`}
            >
                <div className="p-4 sm:p-5">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Filter className="w-5 h-5 text-primary-600" />
                            <h2 className="text-lg font-bold text-gray-900">Filters</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>

                    {/* Reset Button */}
                    {hasActiveFilters && (
                        <Button
                            variant="secondary"
                            onClick={handleReset}
                            className="w-full mb-3"
                        >
                            Reset Filters
                        </Button>
                    )}

                    {/* Sort By Options Filter */}
                    <div className="border-t border-gray-200 pt-3">
                        <button
                            onClick={() => toggleSection('sortBy')}
                            className="w-full flex items-center justify-between mb-3"
                        >
                            <h3 className="text-sm font-semibold text-gray-900">Sort By</h3>
                            {expandedSections.sortBy ? (
                                <ChevronUp className="w-4 h-4 text-gray-500" />
                            ) : (
                                <ChevronDown className="w-4 h-4 text-gray-500" />
                            )}
                        </button>
                        {expandedSections.sortBy && (
                            <div className="space-y-2 mb-3">
                                {[
                                    { value: UsedCarSortOption.NEWEST, label: 'Newest' },
                                    { value: UsedCarSortOption.PRICE_LOW_TO_HIGH, label: 'Price: Low to High' },
                                    { value: UsedCarSortOption.PRICE_HIGH_TO_LOW, label: 'Price: High to Low' },
                                    { value: UsedCarSortOption.KM_LOW_TO_HIGH, label: 'Kms: Low to High' },
                                    { value: UsedCarSortOption.MODEL_NEW_TO_OLD, label: 'Model: New to Old' },
                                ].map((option) => {
                                    const isSelected = filters.sortBy === String(option.value) || filters.sortBy === option.value;
                                    return (
                                        <label
                                            key={option.value}
                                            className={`flex items-center gap-3 rounded-xl border px-3 py-2 shadow-sm transition-colors cursor-pointer ${
                                                isSelected
                                                    ? 'border-primary-500 bg-primary-50'
                                                    : 'border-gray-200 bg-white hover:bg-gray-50'
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name="sortBy"
                                                value={option.value}
                                                checked={isSelected}
                                                onChange={(e) =>
                                                    onFilterChange({
                                                        ...filters,
                                                        sortBy: String(option.value),
                                                    })
                                                }
                                                className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                                            />
                                            <span className="text-sm font-medium text-gray-800 flex-1">
                                                {option.label}
                                            </span>
                                        </label>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Budget Filter */}
                    <div className="border-t border-gray-200 pt-3">
                        <RangeFilterSection
                            title="Budget"
                            min={budgetStops[0]}
                            max={budgetStops[budgetStops.length - 1]}
                            step={50000}
                            stops={budgetStops}
                            expanded={expandedSections.budget}
                            onToggle={() => toggleSection('budget')}
                            valueMin={budgetMinValue}
                            valueMax={budgetMaxValue}
                            formatValue={formatCurrency}
                            onChange={(min, max) =>
                                onFilterChange({
                                    ...filters,
                                    minPrice: min,
                                    maxPrice: max,
                                })
                            }
                            onClear={() =>
                                onFilterChange({
                                    ...filters,
                                    minPrice: budgetStops[0],
                                    maxPrice: budgetStops[budgetStops.length - 1],
                                })
                            }
                        />
                    </div>

                    {/* Make and Model Filter */}
                    <div className="mb-4 border-b border-gray-200 pb-3">
                        <button
                            onClick={() => toggleSection('brand')}
                            className="w-full flex items-center justify-between mb-2"
                        >
                            <h3 className="text-sm font-semibold text-gray-900">Make and Model</h3>
                            {expandedSections.brand ? (
                                <ChevronUp className="w-4 h-4 text-gray-500" />
                            ) : (
                                <ChevronDown className="w-4 h-4 text-gray-500" />
                            )}
                        </button>
                        {expandedSections.brand && (
                            <div className="space-y-2">
                                <div className="relative mt-3">
                                    <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                    <input
                                        type="search"
                                        value={brandSearchTerm}
                                        onChange={e => setBrandSearchTerm(e.target.value)}
                                        placeholder="Search"
                                        className="w-full rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-3 py-2 text-sm placeholder:text-gray-400 focus:border-primary-500 focus:outline-none text-gray-900"
                                    />
                                    {isSearchingModels && (
                                        <p className="px-1 pt-1 text-xs text-gray-500">Searching models...</p>
                                    )}
                                </div>

                                <div className="space-y-0 max-h-52 overflow-y-auto pr-1 custom-scrollbar mt-3">
                                    {filteredBrandEntries.length === 0 && (
                                        <p className="px-1 py-2 text-xs text-gray-500">No matches found</p>
                                    )}
                                    {loadingBrands && Object.keys(brandsData).length === 0 && (
                                        <p className="px-1 py-2 text-xs text-gray-500">Loading brands...</p>
                                    )}
                                    {filteredBrandEntries.map(([brandName, data]) => {
                                        const brandLogo = data.logo || brandIconMap[brandName]?.logo;
                                        const isExpanded = expandedBrands[brandName];
                                        const selectedBrands = getBrandsArray();
                                        const selectedModels = getModelsArray();
                                        const allModelsSelected =
                                            data.subTypes.length > 0 &&
                                            data.subTypes.every(sub => selectedModels.includes(sub.value));
                                        const isBrandSelected = selectedBrands.includes(data.id);
                                        const isSelected = isBrandSelected || allModelsSelected;
                                        const isLoadingModels = loadingModels[brandName];

                                        return (
                                            <div key={brandName} className="border-b border-gray-100 last:border-b-0">
                                                {/* Brand Type Header */}
                                                <div className="flex items-center gap-2 py-2.5 px-1 hover:bg-gray-50 transition-colors">
                                                    {/* Brand Checkbox and Name */}
                                                    <label className="flex-1 flex items-center gap-2 cursor-pointer min-w-0">
                                                        <input
                                                            type="checkbox"
                                                            checked={isBrandSelected}
                                                            onChange={(e) => {
                                                                const currentBrands = getBrandsArray();
                                                                const currentModels = getModelsArray();
                                                                
                                                                if (isBrandSelected) {
                                                                    // Remove brand and all its models
                                                                    const updatedBrands = currentBrands.filter(b => b !== data.id);
                                                                    const brandModelIds = data.subTypes.map(sub => sub.value);
                                                                    const updatedModels = currentModels.filter(m => !brandModelIds.includes(m));
                                                                    onFilterChange({
                                                                        ...filters,
                                                                        brand: updatedBrands,
                                                                        model: updatedModels,
                                                                    });
                                                                } else {
                                                                    // Add brand and select all its models (if any are loaded)
                                                                    const updatedBrands = [...currentBrands, data.id];
                                                                    const brandModelIds = data.subTypes.map(sub => sub.value);
                                                                    const mergedModels = Array.from(new Set([...currentModels, ...brandModelIds]));
                                                                    onFilterChange({
                                                                        ...filters,
                                                                        brand: updatedBrands,
                                                                        model: mergedModels,
                                                                    });
                                                                }
                                                            }}
                                                            onClick={(e) => e.stopPropagation()}
                                                            className="w-4 h-4 text-primary-600 accent-primary-600 border-gray-300 rounded flex-shrink-0"
                                                        />
                                                        {/* Brand Logo */}
                                                        {brandLogo ? (
                                                            brandLogo.startsWith('http') ? (
                                                                // Use regular img tag for external URLs to avoid hostname configuration issues
                                                                <img
                                                                    src={brandLogo}
                                                                    alt={`${brandName} logo`}
                                                                    className="w-5 h-5 object-contain flex-shrink-0"
                                                                />
                                                            ) : (
                                                                <Image
                                                                    src={brandLogo}
                                                                    alt={`${brandName} logo`}
                                                                    width={20}
                                                                    height={20}
                                                                    className="w-5 h-5 object-contain flex-shrink-0"
                                                                />
                                                            )
                                                        ) : (
                                                            <Car className="w-4 h-4 text-gray-600 flex-shrink-0" />
                                                        )}
                                                        <span className="text-sm font-semibold text-gray-900 truncate">
                                                            {brandName}
                                                            {/* {data.count > 0 && `(${data.count})`} */}
                                                        </span>
                                                    </label>

                                                    {/* Chevron Icon */}
                                                    <button
                                                        onClick={() => toggleBrand(brandName)}
                                                        className="p-1 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
                                                    >
                                                        {isExpanded ? (
                                                            <ChevronUp className="w-4 h-4 text-gray-500" />
                                                        ) : (
                                                            <ChevronDown className="w-4 h-4 text-gray-500" />
                                                        )}
                                                    </button>
                                                </div>

                                                {/* Sub Types List */}
                                                {isExpanded && (() => {
                                                    const term = brandSearchTerm.toLowerCase();
                                                    const filteredModels = brandSearchTerm.trim() 
                                                        ? data.subTypes.filter(sub => sub.label.toLowerCase().includes(term))
                                                        : data.subTypes;
                                                    
                                                    return (
                                                        <div className="ml-7 space-y-0 pb-2 pr-1">
                                                            {isLoadingModels && (
                                                                <p className="px-3 py-2 text-xs text-gray-500">Loading models...</p>
                                                            )}
                                                            {!isLoadingModels && data.subTypes.length === 0 && (
                                                                <p className="px-3 py-2 text-xs text-gray-500">No models available</p>
                                                            )}
                                                            {!isLoadingModels && brandSearchTerm.trim() && filteredModels.length === 0 && data.subTypes.length > 0 && (
                                                                <p className="px-3 py-2 text-xs text-gray-500">No matching models</p>
                                                            )}
                                                            {!isLoadingModels && filteredModels.map((subType) => {
                                                            const selectedModels = getModelsArray();
                                                            const isSubSelected = selectedModels.includes(subType.value);
                                                            return (
                                                                <label
                                                                    key={subType.value}
                                                                    className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 py-2 px-3 transition-colors"
                                                                >
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={isSubSelected}
                                                                        onChange={(e) => {
                                                                            const currentBrands = getBrandsArray();
                                                                            const currentModels = getModelsArray();
                                                                            
                                                                            if (isSubSelected) {
                                                                                // Remove model
                                                                                const updatedModels = currentModels.filter(m => m !== subType.value);
                                                                                // If this was the only model for this brand, we can optionally remove the brand too
                                                                                // For now, we'll keep the brand selected
                                                                                onFilterChange({
                                                                                    ...filters,
                                                                                    brand: currentBrands,
                                                                                    model: updatedModels,
                                                                                });
                                                                            } else {
                                                                                // Add model and ensure brand is selected
                                                                                const updatedModels = [...currentModels, subType.value];
                                                                                const updatedBrands = currentBrands.includes(data.id) 
                                                                                    ? currentBrands 
                                                                                    : [...currentBrands, data.id];
                                                                                onFilterChange({
                                                                                    ...filters,
                                                                                    brand: updatedBrands,
                                                                                    model: updatedModels,
                                                                                });
                                                                            }
                                                                        }}
                                                                        className="w-4 h-4 text-primary-600 accent-primary-600 border-gray-300 rounded flex-shrink-0"
                                                                    />
                                                                    <span className="text-sm text-gray-700 flex-1 truncate">
                                                                        {subType.label}
                                                                    </span>
                                                                    {subType.count > 0 && (
                                                                        <span className="text-xs text-gray-500">({subType.count})</span>
                                                                    )}
                                                                </label>
                                                            );
                                                        })}
                                                        </div>
                                                    );
                                                })()}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Model Year Filter */}
                    <div>
                        <RangeFilterSection
                            title="Model Year"
                            min={yearStops[0]}
                            max={yearStops[yearStops.length - 1]}
                            step={1}
                            stops={yearStops}
                            expanded={expandedSections.minModelYear}
                            onToggle={() => toggleSection('minModelYear')}
                            valueMin={yearMinValue}
                            valueMax={yearMaxValue}
                            onChange={(min, max) =>
                                onFilterChange({
                                    ...filters,
                                    minModelYear: min,
                                    maxModelYear: max,
                                })
                            }
                            onClear={() =>
                                onFilterChange({
                                    ...filters,
                                    minModelYear: yearStops[0],
                                    maxModelYear: yearStops[yearStops.length - 1],
                                })
                            }
                        />
                    </div>

                    {/* Kms Driven Filter */}
                    <div>
                        <RangeFilterSection
                            title="Kms Driven"
                            min={kmsStops[0]}
                            max={kmsStops[kmsStops.length - 1]}
                            step={5000}
                            stops={kmsStops}
                            expanded={expandedSections.kms}
                            onToggle={() => toggleSection('kms')}
                            valueMin={kmsMinValue}
                            valueMax={kmsMaxValue}
                            formatValue={(val) => `${formatNumber(val)} Km`}
                            onChange={(min, max) =>
                                onFilterChange({
                                    ...filters,
                                    minKms: min,
                                    maxKms: max,
                                })
                            }
                            onClear={() =>
                                onFilterChange({
                                    ...filters,
                                    minKms: kmsStops[0],
                                    maxKms: kmsStops[kmsStops.length - 1],
                                })
                            }
                        />
                    </div>

                    {/* Fuel Type Filter */}
                    <div className="mb-4 border-b border-gray-200 pb-3">
                        <button
                            onClick={() => toggleSection('fuelType')}
                            className="w-full flex items-center justify-between mb-3"
                        >
                            <h3 className="text-sm font-semibold text-gray-900">Fuel Type</h3>
                            {expandedSections.fuelType ? (
                                <ChevronUp className="w-4 h-4 text-gray-500" />
                            ) : (
                                <ChevronDown className="w-4 h-4 text-gray-500" />
                            )}
                        </button>
                        {expandedSections.fuelType && (
                            <div className="space-y-2">
                                {fuelOptions.map(({ label, value, count, Icon, color, bg }) => {
                                    const valueString = String(value);
                                    const selectedFuelTypes = getFuelTypesArray();
                                    const isSelected = selectedFuelTypes.includes(valueString);
                                    return (
                                        <label
                                            key={value}
                                            className={`flex items-center w-full gap-3 rounded-2xl border px-3 py-1 shadow-sm transition-colors ${isSelected
                                                ? 'border-primary-500 bg-primary-50'
                                                : 'border-gray-200 bg-white'
                                                }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={(e) => {
                                                    const next = isSelected
                                                        ? selectedFuelTypes.filter(ft => ft !== valueString)
                                                        : [...selectedFuelTypes, valueString];
                                                    onFilterChange({
                                                        ...filters,
                                                        fuelType: next,
                                                    });
                                                }}
                                                className="h-4 w-4 rounded border-2 border-gray-300 text-primary-600 accent-primary-600 focus:ring-primary-500"
                                            />
                                            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${bg}`}>
                                                <Icon className={`h-4 w-4 ${color}`} />
                                            </div>
                                            <div className="flex-1 flex items-center justify-between">
                                                <span className="text-[12px] font-medium text-gray-800">{label}</span>
                                                {/* <span className="text-[12px] font-semibold text-gray-400">({count})</span> */}
                                            </div>
                                        </label>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Body Type Filter */}
                    <div className="mb-4 border-b border-gray-200 pb-3">
                        <button
                            onClick={() => toggleSection('bodyType')}
                            className="w-full flex items-center justify-between mb-3"
                        >
                            <h3 className="text-sm font-semibold text-gray-900">Body Type</h3>
                            {expandedSections.bodyType ? (
                                <ChevronUp className="w-4 h-4 text-gray-500" />
                            ) : (
                                <ChevronDown className="w-4 h-4 text-gray-500" />
                            )}
                        </button>
                        {expandedSections.bodyType && (
                            <div className="grid grid-cols-2 gap-3">
                                {bodyTypeOptions.map(({ label, value, count, image }) => {
                                    const valueString = String(value);
                                    const selectedBodyTypes = getBodyTypesArray();
                                    const selected = selectedBodyTypes.includes(valueString);
                                    return (
                                        <label key={value} className="relative block">
                                            <input
                                                type="checkbox"
                                                checked={selected}
                                                onChange={() => {
                                                    const next = selected
                                                        ? selectedBodyTypes.filter(bt => bt !== valueString)
                                                        : [...selectedBodyTypes, valueString];
                                                    onFilterChange({
                                                        ...filters,
                                                        bodyType: next,
                                                    });
                                                }}
                                                className="h-4 w-4 accent-primary-600 absolute top-2 right-2 rounded border-2 border-gray-300"
                                            />
                                            <div
                                                className={`rounded-2xl border shadow-sm h-32 flex flex-col items-center justify-between py-3 px-2 transition-colors ${selected
                                                    ? 'border-primary-500 bg-primary-50'
                                                    : 'border-gray-200 bg-gray-50'
                                                    }`}
                                            >
                                                <div className="flex-1 flex items-center justify-center">
                                                    {image ? (
                                                        <img src={image} alt={label} className="h-14 object-contain" />
                                                    ) : (
                                                        <div className="h-14 w-14 bg-gray-200 rounded" />
                                                    )}
                                                </div>
                                                <div className="text-center space-y-1">
                                                    <div className="text-sm font-semibold text-gray-800">{label}</div>
                                                    {/* <div className="text-xs text-gray-500">({count})</div> */}
                                                </div>
                                            </div>
                                        </label>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Transmission Filter */}
                    <div className="mb-4 border-b border-gray-200 pb-3">
                        <button
                            onClick={() => toggleSection('transmissionType')}
                            className="w-full flex items-center justify-between mb-2"
                        >
                            <h3 className="text-sm font-semibold text-gray-900">Transmission</h3>
                            {expandedSections.transmissionType ? (
                                <ChevronUp className="w-4 h-4 text-gray-500" />
                            ) : (
                                <ChevronDown className="w-4 h-4 text-gray-500" />
                            )}
                        </button>
                        {expandedSections.transmissionType && (
                            <div className="space-y-0">
                                {Object.entries(transmissionTypes).map(([type, data]) => {
                                    const { iconKey } = transmissionIconMap[type] || { iconKey: 'manualIcon' };
                                    const valueString = String(data.value);
                                    const selectedTransmissionTypes = getTransmissionTypesArray();
                                    const isSelected = selectedTransmissionTypes.includes(valueString);

                                    return (
                                        <div key={type} className="border-b border-gray-100 last:border-b-0">
                                            {/* Transmission Type Header */}
                                            <div className="flex items-center gap-2 py-2.5 px-1 hover:bg-gray-50 transition-colors">
                                                {/* Transmission Checkbox and Name */}
                                                <label className="flex-1 flex items-center gap-2 cursor-pointer min-w-0">
                                                    <input
                                                        type="checkbox"
                                                        checked={isSelected}
                                                        onChange={() => {
                                                            const next = isSelected
                                                                ? selectedTransmissionTypes.filter(tt => tt !== valueString)
                                                                : [...selectedTransmissionTypes, valueString];
                                                            onFilterChange({
                                                                ...filters,
                                                                transmissionType: next,
                                                            });
                                                        }}
                                                        onClick={(e) => e.stopPropagation()}
                                                        className="w-4 h-4 text-primary-600 accent-primary-600 border-gray-300 rounded flex-shrink-0"
                                                    />
                                                    {/* Transmission Logo */}
                                                    <AllIconComponent
                                                        width={18}
                                                        height={18}
                                                        color="#4b5563"
                                                        icon={iconKey}
                                                    />
                                                    <span className="text-sm font-semibold text-gray-900 truncate">
                                                        {type}
                                                        {/* ({data.count}) */}
                                                    </span>
                                                </label>

                                                {/* Chevron Icon */}
                                                {/* <button
                                                    onClick={() => toggleTransmission(type)}
                                                    className="p-1 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
                                                >
                                                    {isExpanded ? (
                                                        <ChevronUp className="w-4 h-4 text-gray-500" />
                                                    ) : (
                                                        <ChevronDown className="w-4 h-4 text-gray-500" />
                                                    )}
                                                </button> */}
                                            </div>

                                            {/* Sub Types List */}
                                            {/* {isExpanded && (
                                                <div className="ml-7 space-y-0 pb-2">
                                                    {data.subTypes.map((subType) => {
                                                        const isSubSelected = selectedTransmissionTypes.includes(String(subType.value));
                                                        const showAsSelected = isSelected || isSubSelected;
                                                        return (
                                                            <label
                                                                key={subType.value}
                                                                className={`flex items-start gap-2 cursor-pointer hover:bg-gray-50 py-2 px-3 transition-colors ${showAsSelected ? 'bg-primary-50 border border-primary-100' : ''}`}
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    checked={showAsSelected}
                                                                    onChange={() => {
                                                                        const next = showAsSelected
                                                                            ? selectedTransmissionTypes.filter(tt => tt !== String(subType.value))
                                                                            : [...selectedTransmissionTypes, String(subType.value)];
                                                                        onFilterChange({
                                                                            ...filters,
                                                                            transmissionType: next,
                                                                        });
                                                                    }}
                                                                    className="w-4 h-4 text-primary-600 accent-primary-600 border-gray-300 rounded flex-shrink-0"
                                                                />
                                                                <div className="flex-1">
                                                                    <div className="text-sm text-gray-800 leading-tight">{subType.label}</div>
                                                                </div>
                                                                <span className="text-xs text-gray-500 ml-2">({subType.count})</span>
                                                            </label>
                                                        );
                                                    })}
                                                </div>
                                            )} */}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Color Filter */}
                    {/* <div className="mb-4 border-b border-gray-200 pb-3">
                        <button
                            onClick={() => toggleSection('color')}
                            className="w-full flex items-center justify-between mb-3"
                        >
                            <h3 className="text-sm font-semibold text-gray-900">Color</h3>
                            {expandedSections.color ? (
                                <ChevronUp className="w-4 h-4 text-gray-500" />
                            ) : (
                                <ChevronDown className="w-4 h-4 text-gray-500" />
                            )}
                        </button>
                        {expandedSections.color && (
                            <div className="grid grid-cols-2 gap-3">
                                {colorOptions.map(color => {
                                    const isSelected = filters.color === color.value;
                                    return (
                                        <label key={color.value} className="relative block">
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={(e) =>
                                                    onFilterChange({
                                                        ...filters,
                                                        color: e.target.checked ? color.value : '',
                                                    })
                                                }
                                                className="h-4 w-4 accent-primary-600 absolute top-2 right-2 rounded border-2 border-gray-300"
                                            />
                                            <div
                                                className={`rounded-2xl border shadow-sm h-32 flex flex-col items-center justify-between py-3 px-2 transition-colors ${isSelected
                                                    ? 'border-primary-500 bg-primary-50'
                                                    : 'border-gray-200 bg-gray-50'
                                                    }`}
                                            >
                                                <div className="flex-1 flex items-center justify-center">
                                                    <img src={color.image} alt={color.label} className="h-14 object-contain" />
                                                </div>
                                                <div className="text-center space-y-1">
                                                    <div className={`text-sm font-semibold ${color.text}`}>{color.label}</div>
                                                    <div className="text-xs text-gray-500">({color.count})</div>
                                                </div>
                                            </div>
                                        </label>
                                    );
                                })}
                            </div>
                        )}
                    </div> */}

                    {/* Features Filter */}
                    {/* <div className="mb-4 border-b border-gray-200 pb-3">
                        <button
                            onClick={() => toggleSection('features')}
                            className="w-full flex items-center justify-between mb-3"
                        >
                            <h3 className="text-sm font-semibold text-gray-900">Features</h3>
                            {expandedSections.features ? (
                                <ChevronUp className="w-4 h-4 text-gray-500" />
                            ) : (
                                <ChevronDown className="w-4 h-4 text-gray-500" />
                            )}
                        </button>
                        {expandedSections.features && (
                            <div className="space-y-4">
                                {featureSections.map(section => (
                                    <div key={section.title} className="space-y-3">
                                        <div className="text-xs font-semibold text-gray-600">{section.title}</div>
                                        <div className="space-y-2">
                                            {section.items.map(item => {
                                                const isSelected = selectedFeatures.includes(item.value);
                                                return (
                                                    <label
                                                        key={item.value}
                                                        className={`flex items-center gap-2 rounded-xl border px-3 py-1.5 shadow-sm transition-colors ${isSelected
                                                            ? 'border-primary-500 bg-primary-50'
                                                            : 'border-gray-200 bg-white'
                                                            }`}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={isSelected}
                                                            onChange={() => toggleFeature(item.value)}
                                                            className="h-4 w-4 rounded border-2 border-gray-300 text-primary-600 accent-primary-600 focus:ring-primary-500"
                                                        />
                                                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100">
                                                            <AllIconComponent
                                                                width={16}
                                                                height={16}
                                                                color="#111827"
                                                                icon={item.icon}
                                                            />
                                                        </div>
                                                        <div className="flex-1 flex items-center justify-between">
                                                            <span className="text-[12px] font-medium text-gray-800">{item.label}</span>
                                                            <span className="text-[12px] font-semibold text-gray-400">({item.count})</span>
                                                        </div>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div> */}

                    {/* Seats Filter */}
                    <div className="mb-4 border-b border-gray-200 pb-3">
                        <button
                            onClick={() => toggleSection('seats')}
                            className="w-full flex items-center justify-between mb-3"
                        >
                            <h3 className="text-sm font-semibold text-gray-900">Seats</h3>
                            {expandedSections.seats ? (
                                <ChevronUp className="w-4 h-4 text-gray-500" />
                            ) : (
                                <ChevronDown className="w-4 h-4 text-gray-500" />
                            )}
                        </button>
                        {expandedSections.seats && (
                            <div className="grid grid-cols-2 gap-3">
                                {seatOptions.map(seat => {
                                    const seatsSelected = getSeatsArray();
                                    const isSelected = seatsSelected.includes(seat.value);
                                    return (
                                        <label key={seat.value} className="relative block">
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() => {
                                                    const next = isSelected
                                                        ? seatsSelected.filter(s => s !== seat.value)
                                                        : [...seatsSelected, seat.value];
                                                    onFilterChange({
                                                        ...filters,
                                                        seats: next,
                                                    });
                                                }}
                                                className="h-4 w-4 accent-primary-600 absolute top-2 right-2 rounded border-2 border-gray-300"
                                            />
                                            <div
                                                className={`rounded-2xl border shadow-sm h-32 flex flex-col items-center justify-between py-3 px-2 transition-colors ${isSelected
                                                    ? 'border-primary-500 bg-primary-50'
                                                    : 'border-gray-200 bg-gray-50'
                                                    }`}
                                            >
                                                <div className="flex-1 flex items-center justify-center">
                                                    <Image src={seat.image} alt={seat.label} width={70} height={70} className="h-15 w-15 object-contain" />
                                                </div>
                                                <div className="text-center space-y-1">
                                                    <div className="text-[12px] font-semibold text-gray-800">{seat.label}</div>
                                                    {/* <div className="text-[12px] text-gray-500">({seat.count})</div> */}
                                                </div>
                                            </div>
                                        </label>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Owners Filter */}
                    <div className="mb-4 border-b border-gray-200 pb-3">
                        <button
                            onClick={() => toggleSection('owners')}
                            className="w-full flex items-center justify-between mb-3"
                        >
                            <h3 className="text-sm font-semibold text-gray-900">Owners</h3>
                            {expandedSections.owners ? (
                                <ChevronUp className="w-4 h-4 text-gray-500" />
                            ) : (
                                <ChevronDown className="w-4 h-4 text-gray-500" />
                            )}
                        </button>
                        {expandedSections.owners && (
                            <div className="space-y-2">
                                {ownerOptions.map(({ value, label, count, Icon }) => {
                                    const valueString = String(value);
                                    const selectedOwners = getOwnerTypesArray();
                                    const isSelected = selectedOwners.includes(valueString);
                                    return (
                                        <label
                                            key={value}
                                            className={`flex items-center gap-3 rounded-xl border px-3 py-2 shadow-sm transition-colors ${isSelected
                                                ? 'border-primary-500 bg-primary-50'
                                                : 'border-gray-200 bg-gray-50'
                                                }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() => {
                                                    const next = isSelected
                                                        ? selectedOwners.filter(o => o !== valueString)
                                                        : [...selectedOwners, valueString];
                                                    onFilterChange({
                                                        ...filters,
                                                        ownershipType: next,
                                                    });
                                                }}
                                                className="h-4 w-4 rounded border-2 border-gray-300 text-primary-600 accent-primary-600 focus:ring-primary-500"
                                            />
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white border border-gray-200">
                                                <AllIconComponent
                                                    width={16}
                                                    height={16}
                                                    color="#111827"
                                                    icon={Icon}
                                                />
                                            </div>
                                            <div className="flex-1 flex items-center justify-between">
                                                <span className="text-[12px] font-medium text-gray-800">{label}</span>
                                                {/* <span className="text-[12px] font-semibold text-gray-400">({count})</span> */}
                                            </div>
                                        </label>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Safety Filter */}
                    <div className="mb-4 border-b border-gray-200 pb-3">
                        <button
                            onClick={() => toggleSection('safety')}
                            className="w-full flex items-center justify-between mb-3"
                        >
                            <h3 className="text-sm font-semibold text-gray-900">Safety</h3>
                            {expandedSections.safety ? (
                                <ChevronUp className="w-4 h-4 text-gray-500" />
                            ) : (
                                <ChevronDown className="w-4 h-4 text-gray-500" />
                            )}
                        </button>
                        {expandedSections.safety && (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <div className="text-xs font-semibold text-gray-600">NCAP Ratings</div>
                                    <div className="grid grid-cols-2 gap-2">
                                        {ncapRatings.map(rating => {
                                            const valueString = String(rating.value);
                                            const isSelected = filters.safetyRating === rating.value || filters.safetyRating === valueString;
                                            return (
                                                <button
                                                    key={rating.value}
                                                    onClick={() =>
                                                        onFilterChange({
                                                            ...filters,
                                                            safetyRating: isSelected ? '' : valueString,
                                                        })
                                                    }
                                                    className={`flex items-center justify-center rounded-lg border px-1.5 py-2 text-xs font-semibold transition-colors ${isSelected
                                                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                                                            : 'border-gray-200 bg-white text-gray-800'
                                                        }`}
                                                >
                                                    <div className="flex items-center">
                                                        {Array.from({ length: 5 }).map((_, idx) => {
                                                            const filled = idx < rating.filled;
                                                            return (
                                                                <AllIconComponent
                                                                    key={idx}
                                                                    width={16}
                                                                    height={16}
                                                                    color={filled ? '#FACC15' : '#D1D5DB'}
                                                                    icon={filled ? 'ratingStarColor' : 'ratingStarEmpty'}
                                                                />
                                                            );
                                                        })}
                                                    </div>
                                                    {/* <span className="text-[11px] text-gray-500 font-semibold">({rating.count})</span> */}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Airbags Filter */}
                                {/* <div className="space-y-2">
                                    <div className="text-xs font-semibold text-gray-600">Airbags</div>
                                    <div className="grid grid-cols-2 gap-2">
                                        {airbagOptions.map(option => {
                                            const isSelected = filters.airbags === option.value;
                                            return (
                                                <button
                                                    key={option.value}
                                                    onClick={() =>
                                                        onFilterChange({
                                                            ...filters,
                                                            airbags: isSelected ? '' : option.value,
                                                        })
                                                    }
                                                    className={`flex items-center justify-between rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${isSelected
                                                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                                                            : 'border-gray-200 bg-white text-gray-800'
                                                        }`}
                                                >
                                                    <span>{option.label}</span>
                                                    <span className="text-[11px] text-gray-500 font-semibold">({option.count})</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div> */}

                                {/* Safety Features Filter */}
                                {/* <div className="space-y-2">
                                    <div className="text-xs font-semibold text-gray-600">Safety Features</div>
                                    <div className="space-y-2">
                                        {safetyFeatureOptions.map(item => {
                                            const isSelected = selectedSafetyFeatures.includes(item.value);
                                            return (
                                                <label
                                                    key={item.value}
                                                    className={`flex items-center gap-3 rounded-xl border px-3 py-2 shadow-sm transition-colors ${isSelected
                                                        ? 'border-primary-500 bg-primary-50'
                                                        : 'border-gray-200 bg-gray-50'
                                                        }`}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={isSelected}
                                                        onChange={() => {
                                                            const next = isSelected
                                                                ? selectedSafetyFeatures.filter(v => v !== item.value)
                                                                : [...selectedSafetyFeatures, item.value];
                                                            onFilterChange({
                                                                ...filters,
                                                                safetyFeatures: next,
                                                            });
                                                        }}
                                                        className="h-4 w-4 rounded border-2 border-gray-300 text-primary-600 accent-primary-600 focus:ring-primary-500"
                                                    />
                                                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100">
                                                        <Image
                                                            src={safetyFeatureImageMap[item.value]}
                                                            alt={item.label}
                                                            width={25}
                                                            height={25}
                                                            className="h-14 w-14 object-contain"
                                                        />
                                                    </div>
                                                    <div className="flex-1 flex items-center justify-between">
                                                        <span className="text-[12px] font-medium text-gray-800">{item.label}</span>
                                                        <span className="text-[12px] font-semibold text-gray-400">({item.count})</span>
                                                    </div>
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div> */}

                            </div>
                        )}
                    </div>

                </div>
            </aside>
        </>
    );
}

