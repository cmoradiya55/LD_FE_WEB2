'use client';

import { useState, useEffect, useMemo } from 'react';
import { Filter, X, ChevronDown, ChevronUp, Search, Fuel, Zap, Leaf, BatteryCharging, Droplets } from 'lucide-react';
import { fuelTypes, cities, sampleCars } from '@/lib/carData';
import { fetchSellCarBrands, fetchSellCarModels, fetchSellCarYears } from '@/lib/auth';
import { Button } from '@/components/Button/Button';
import { RangeFilterSection } from './components/RangeFilterSection';

interface FilterSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    filters: FilterState;
    onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
    status: string;
    minPrice: string;
    maxPrice: string;
    brand: string;
    model: string;
    fuelType: string;
    transmission: string;
    minYear: string;
    maxYear: string;
    location: string;
    owner: string;
    minKms: string;
    maxKms: string;
    bodyType?: string;
}

const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'pending', label: 'Pending' },
    { value: 'sold', label: 'Sold' },
    { value: 'draft', label: 'Draft' },
];

const transmissionOptions = [
    { value: '', label: 'All' },
    { value: 'Manual', label: 'Manual' },
    { value: 'Automatic', label: 'Automatic' },
];

const ownerOptions = [
    { value: '', label: 'All' },
    { value: 'First Owner', label: 'First Owner' },
    { value: 'Second Owner', label: 'Second Owner' },
    { value: 'Third Owner', label: 'Third Owner' },
];

const budgetStops = [0, 50000, 100000, 200000, 300000, 400000, 500000, 600000, 700000, 800000, 1000000, 1200000, 1500000, 2000000, 2500000];

const yearStops = [2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];

const kmsStops = [0, 10000, 20000, 30000, 40000, 50000, 75000, 100000, 150000, 200000, 1250000, 150000, 200000, 500000, 10000000];

const fuelIconMap: Record<string, { Icon: any; color: string; bg: string }> = {
    Petrol: { Icon: Fuel, color: 'text-green-500', bg: 'bg-green-50' },
    Diesel: { Icon: Fuel, color: 'text-blue-500', bg: 'bg-blue-50' },
    CNG: { Icon: Droplets, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    Electric: { Icon: BatteryCharging, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    Hybrid: { Icon: Leaf, color: 'text-teal-500', bg: 'bg-teal-50' },
    LPG: { Icon: Fuel, color: 'text-amber-500', bg: 'bg-amber-50' },
    Other: { Icon: Fuel, color: 'text-gray-500', bg: 'bg-gray-50' },
};

export default function FilterSidebar({ isOpen, onClose, filters, onFilterChange }: FilterSidebarProps) {
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
        status: false,
        budget: false,
        brand: false,
        price: false,
        vehicle: false,
        location: false,
        year: false,
        kms: false,
        fuelType: false,
        bodyType: false,
    });
    const [brandSearch, setBrandSearch] = useState('');
    const [brands, setBrands] = useState<Array<{ id: string; displayName: string; logo?: string; count?: number }>>([]);
    const [brandsLoading, setBrandsLoading] = useState(false);
    const [expandedBrands, setExpandedBrands] = useState<Record<string, boolean>>({});
    const [brandModels, setBrandModels] = useState<Record<string, Array<{ id: string; displayName: string; count?: number }>>>({});
    const [modelsLoading, setModelsLoading] = useState<Record<string, boolean>>({});
    const [brandModelCounts, setBrandModelCounts] = useState<Record<string, number>>({});

    const toggleSection = (section: string) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    const handleFilterChange = (key: keyof FilterState, value: string) => {
        onFilterChange({
            ...filters,
            [key]: value,
        });
    };

    const handleReset = () => {
        onFilterChange({
            status: '',
            minPrice: '',
            maxPrice: '',
            brand: '',
            model: '',
            fuelType: '',
            transmission: '',
            minYear: '',
            maxYear: '',
            location: '',
            owner: '',
            minKms: '',
            maxKms: '',
            bodyType: '',
        });
    };

    // Toggle brand expansion and fetch models
    const toggleBrand = async (brandId: string) => {
        const isExpanded = expandedBrands[brandId];
        setExpandedBrands(prev => ({
            ...prev,
            [brandId]: !isExpanded,
        }));

        // Fetch models if expanding and not already loaded
        if (!isExpanded && !brandModels[brandId]) {
            setModelsLoading(prev => ({ ...prev, [brandId]: true }));
            try {
                // First get years for the brand
                const yearsResponse = await fetchSellCarYears(brandId);
                const yearsData = Array.isArray(yearsResponse?.data)
                    ? yearsResponse.data
                    : Array.isArray(yearsResponse)
                        ? yearsResponse
                        : [];

                // Get the latest year or first available year
                const latestYear = yearsData.length > 0
                    ? (typeof yearsData[0] === 'object' ? yearsData[0].year : yearsData[0])
                    : new Date().getFullYear().toString();

                // Fetch models for the latest year
                const modelsResponse = await fetchSellCarModels(brandId, String(latestYear));
                const modelData = Array.isArray(modelsResponse?.data)
                    ? modelsResponse.data
                    : Array.isArray(modelsResponse)
                        ? modelsResponse
                        : [];

                const mappedModels = modelData.map((model: any) => ({
                    id: model.id,
                    displayName: model.displayName || model.name,
                    count: model.count,
                }));

                setBrandModels(prev => ({
                    ...prev,
                    [brandId]: mappedModels,
                }));

                // Update model count
                setBrandModelCounts(prev => ({
                    ...prev,
                    [brandId]: mappedModels.length,
                }));
            } catch (error) {
                console.error('Error fetching models:', error);
                setBrandModels(prev => ({
                    ...prev,
                    [brandId]: [],
                }));
            } finally {
                setModelsLoading(prev => ({ ...prev, [brandId]: false }));
            }
        }
    };

    const hasActiveFilters = Object.values(filters).some(value => value !== '');

    // Fetch model counts for all brands
    const fetchBrandModelCounts = async (brandList: Array<{ id: string; displayName: string; logo?: string; count?: number }>) => {
        const counts: Record<string, number> = {};

        // Fetch counts for all brands in parallel
        const countPromises = brandList.map(async (brand) => {
            try {
                // First get years for the brand
                const yearsResponse = await fetchSellCarYears(brand.id);
                const yearsData = Array.isArray(yearsResponse?.data)
                    ? yearsResponse.data
                    : Array.isArray(yearsResponse)
                        ? yearsResponse
                        : [];

                if (yearsData.length === 0) {
                    counts[brand.id] = 0;
                    return;
                }

                // Get the latest year or first available year
                const latestYear = typeof yearsData[0] === 'object' ? yearsData[0].year : yearsData[0];

                // Fetch models for the latest year
                const modelsResponse = await fetchSellCarModels(brand.id, String(latestYear));
                const modelData = Array.isArray(modelsResponse?.data)
                    ? modelsResponse.data
                    : Array.isArray(modelsResponse)
                        ? modelsResponse
                        : [];

                counts[brand.id] = modelData.length;
            } catch (error) {
                console.error(`Error fetching model count for brand ${brand.id}:`, error);
                counts[brand.id] = 0;
            }
        });

        await Promise.all(countPromises);
        setBrandModelCounts(counts);
    };

    // Fetch brands from API
    useEffect(() => {
        const loadBrands = async () => {
            setBrandsLoading(true);
            try {
                const response = await fetchSellCarBrands();
                const brandData = Array.isArray(response?.data)
                    ? response.data
                    : Array.isArray(response)
                        ? response
                        : [];
                setBrands(brandData);

                // Fetch model counts for all brands
                if (brandData.length > 0) {
                    await fetchBrandModelCounts(brandData);
                }
            } catch (error) {
                console.error('Error fetching brands:', error);
                setBrands([]);
            } finally {
                setBrandsLoading(false);
            }
        };

        loadBrands();
    }, []);

    const toNumber = (value: string, fallback: number) => {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : fallback;
    };

    const fuelCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        sampleCars.forEach(car => {
            const key = car.fuelType || 'Other';
            counts[key] = (counts[key] || 0) + 1;
        });
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

    type BodyType = 'Hatchback' | 'SUV' | 'Sedan';
    const fuelOptions = useMemo(() => {
        const baseFuelTypes = ['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid'];
        const mergedTypes = Array.from(new Set([...baseFuelTypes, ...fuelTypes]));

        return mergedTypes.map(type => {
            const meta = fuelIconMap[type] || { Icon: Fuel, color: 'text-primary-500', bg: 'bg-primary-50' };
            return {
                type,
                count: fuelCounts[type] ?? 0,
                ...meta,
            };
        });
    }, [fuelCounts, fuelTypes]);

    const classifyBodyType = (name: string): BodyType => {
        const lower = name.toLowerCase();
        if (lower.includes('suv') || lower.includes('xuv') || lower.includes('creta') || lower.includes('scorpio')) return 'SUV';
        if (lower.includes('sedan') || lower.includes('ciaz') || lower.includes('city') || lower.includes('verna') || lower.includes('dzire')) return 'Sedan';
        if (lower.includes('hatch') || lower.includes('swift') || lower.includes('i20') || lower.includes('baleno') || lower.includes('polo')) return 'Hatchback';
        return 'Sedan'; // Default to Sedan for unclassified types
    };

    const bodyTypeOptions = useMemo(() => {
        const map: Record<string, { count: number; image?: string }> = {
            Hatchback: { count: 0 },
            SUV: { count: 0 },
            Sedan: { count: 0 },
        } as Record<string, { count: number; image?: string }>;

        sampleCars.forEach(car => {
            const type = classifyBodyType(car.name);
            map[type].count += 1;
            if (!map[type].image) {
                map[type].image = car.image;
            }
        });

        return (Object.keys(map) as BodyType[]).map(type => ({
            type,
            count: map[type].count,
            image: map[type].image,
        }));
    }, []);

    const formatCurrency = (value: number) => `₹ ${value.toLocaleString('en-IN')}`;
    const formatNumber = (value: number) => value.toLocaleString('en-IN');

    const budgetMinValue = toNumber(filters.minPrice, budgetStops[0]);
    const budgetMaxValue = toNumber(filters.maxPrice, budgetStops[budgetStops.length - 1]);
    const yearMinValue = toNumber(filters.minYear, yearStops[0]);
    const yearMaxValue = toNumber(filters.maxYear, yearStops[yearStops.length - 1]);
    const kmsMinValue = toNumber(filters.minKms, kmsStops[0]);
    const kmsMaxValue = toNumber(filters.maxKms, kmsStops[kmsStops.length - 1]);

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
                w-[280px] lg:w-60 bg-white border-r border-gray-200 shadow-xl lg:shadow-sm lg:rounded-lg
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

                    {/* Budget Filter */}
                    <div>
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
                                    minPrice: String(min),
                                    maxPrice: String(max),
                                })
                            }
                            onClear={() =>
                                onFilterChange({
                                    ...filters,
                                    minPrice: '',
                                    maxPrice: '',
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
                            <h3 className="text-sm font-semibold text-gray-900">Make & Model</h3>
                            {expandedSections.brand ? (
                                <ChevronUp className="w-4 h-4 text-gray-500" />
                            ) : (
                                <ChevronDown className="w-4 h-4 text-gray-500" />
                            )}
                        </button>
                        {expandedSections.brand && (
                            <div className="space-y-3">
                                {/* Search Bar */}
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        value={brandSearch}
                                        onChange={(e) => setBrandSearch(e.target.value)}
                                        placeholder="Search brands..."
                                        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-gray-500 text-sm"
                                    />
                                </div>
                                {/* Brand List */}
                                <div className="max-h-96 overflow-y-auto custom-scrollbar space-y-0">
                                    {brandsLoading ? (
                                        <div className="text-xs text-gray-500 text-center py-4">
                                            Loading brands...
                                        </div>
                                    ) : (
                                        <>
                                            {brands
                                                .filter(brand =>
                                                    brand.displayName?.toLowerCase().includes(brandSearch.toLowerCase())
                                                )
                                                .map((brand) => {
                                                    const isExpanded = expandedBrands[brand.id];
                                                    const models = brandModels[brand.id] || [];
                                                    const isLoadingModels = modelsLoading[brand.id];

                                                    return (
                                                        <div key={brand.id} className="border-b border-gray-100 last:border-b-0">
                                                            {/* Brand Header */}
                                                            <div className="flex items-center gap-2 py-2.5 px-1 hover:bg-gray-50 transition-colors">
                                                                {/* Brand Checkbox and Name */}
                                                                <label className="flex-1 flex items-center gap-2 cursor-pointer min-w-0">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={filters.brand === brand.id}
                                                                        onChange={(e) => {
                                                                            handleFilterChange('brand', e.target.checked ? brand.id : '');
                                                                            if (!e.target.checked) {
                                                                                handleFilterChange('model', '');
                                                                            }
                                                                        }}
                                                                        onClick={(e) => e.stopPropagation()}
                                                                        className="w-4 h-4 text-primary-600 accent-primary-600 border-gray-300 rounded flex-shrink-0"
                                                                    />
                                                                    {/* Brand Logo */}
                                                                    {brand.logo ? (
                                                                        <img
                                                                            src={brand.logo}
                                                                            alt={brand.displayName}
                                                                            className="w-6 h-6 object-contain rounded-full flex-shrink-0"
                                                                        />
                                                                    ) : (
                                                                        <div className="w-6 h-6 rounded-full bg-gray-200 flex-shrink-0"></div>
                                                                    )}
                                                                    <span className="text-sm font-semibold text-gray-900 truncate">
                                                                        {brand.displayName} ({brandModelCounts[brand.id] ?? brand.count ?? 0})
                                                                    </span>

                                                                </label>

                                                                {/* Chevron Icon */}
                                                                <button
                                                                    onClick={() => toggleBrand(brand.id)}
                                                                    className="p-1 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
                                                                >
                                                                    {isExpanded ? (
                                                                        <ChevronUp className="w-4 h-4 text-gray-500" />
                                                                    ) : (
                                                                        <ChevronDown className="w-4 h-4 text-gray-500" />
                                                                    )}
                                                                </button>
                                                            </div>

                                                            {/* Models List */}
                                                            {isExpanded && (
                                                                <div className="ml-7 space-y-0 pb-2">
                                                                    {isLoadingModels ? (
                                                                        <div className="text-xs text-gray-500 py-2 pl-3">
                                                                            Loading models...
                                                                        </div>
                                                                    ) : models.length > 0 ? (
                                                                        models.map((model) => (
                                                                            <label
                                                                                key={model.id}
                                                                                className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 py-2 px-3 transition-colors"
                                                                            >
                                                                                <input
                                                                                    type="checkbox"
                                                                                    checked={filters.model === model.id}
                                                                                    onChange={(e) => {
                                                                                        handleFilterChange('model', e.target.checked ? model.id : '');
                                                                                        if (e.target.checked) {
                                                                                            handleFilterChange('brand', brand.id);
                                                                                        }
                                                                                    }}
                                                                                    className="w-4 h-4 text-primary-600 accent-primary-600 border-gray-300 rounded flex-shrink-0"
                                                                                />
                                                                                <span className="text-sm text-gray-700 flex-1 truncate">
                                                                                    {model.displayName}
                                                                                </span>
                                                                            </label>
                                                                        ))
                                                                    ) : (
                                                                        <div className="text-xs text-gray-500 py-2 pl-3">
                                                                            No models available
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            {brands.filter(brand =>
                                                brand.displayName?.toLowerCase().includes(brandSearch.toLowerCase())
                                            ).length === 0 && !brandsLoading && (
                                                    <div className="text-xs text-gray-500 text-center py-4">
                                                        No brands found
                                                    </div>
                                                )}
                                        </>
                                    )}
                                </div>
                                {/* Reset Button */}
                                {(filters.brand || filters.model) && (
                                    <button
                                        onClick={() => {
                                            onFilterChange({
                                                ...filters,
                                                brand: '',
                                                model: '',
                                            });
                                        }}
                                        className="w-full mt-2 px-3 py-1.5 text-xs text-gray-600 hover:text-primary-600 underline transition-colors"
                                    >
                                        Clear Selection
                                    </button>
                                )}
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
                            expanded={expandedSections.year}
                            onToggle={() => toggleSection('year')}
                            valueMin={yearMinValue}
                            valueMax={yearMaxValue}
                            onChange={(min, max) =>
                                onFilterChange({
                                    ...filters,
                                    minYear: String(min),
                                    maxYear: String(max),
                                })
                            }
                            onClear={() =>
                                onFilterChange({
                                    ...filters,
                                    minYear: '',
                                    maxYear: '',
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
                                    minKms: String(min),
                                    maxKms: String(max),
                                })
                            }
                            onClear={() =>
                                onFilterChange({
                                    ...filters,
                                    minKms: '',
                                    maxKms: '',
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
                                {fuelOptions.map(({ type, count, Icon, color, bg }) => (
                                    <label
                                        key={type}
                                        className={`flex items-center w-full gap-3 rounded-2xl border px-3 py-1 shadow-sm transition-colors ${filters.fuelType === type
                                                ? 'border-primary-500 bg-primary-50'
                                                : 'border-gray-200 bg-white'
                                            }`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={filters.fuelType === type}
                                            onChange={(e) =>
                                                onFilterChange({
                                                    ...filters,
                                                    fuelType: e.target.checked ? type : '',
                                                })
                                            }
                                            className="h-4 w-4 rounded border-2 border-gray-300 text-primary-600 accent-primary-600 focus:ring-primary-500"
                                        />
                                        <div className={`h-8 w-8 rounded-full flex items-center justify-center ${bg}`}>
                                            <Icon className={`h-4 w-4 ${color}`} />
                                        </div>
                                        <div className="flex-1 flex items-center justify-between">
                                            <span className="text-[12px] font-medium text-gray-800">{type}</span>
                                            <span className="text-[12px] font-semibold text-gray-400">({count})</span>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Body Type Filter */}
                    <div className="mb-4">
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
                                {bodyTypeOptions.map(({ type, count, image }) => {
                                    const selected = filters.bodyType === type;
                                    return (
                                        <label key={type} className="relative block">
                                            <input
                                                type="checkbox"
                                                checked={selected}
                                                onChange={(e) =>
                                                    onFilterChange({
                                                        ...filters,
                                                        bodyType: e.target.checked ? type : '',
                                                    })
                                                }
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
                                                        <img src={image} alt={type} className="h-14 object-contain" />
                                                    ) : (
                                                        <div className="h-14 w-14 bg-gray-200 rounded" />
                                                    )}
                                                </div>
                                                <div className="text-center space-y-1">
                                                    <div className="text-sm font-semibold text-gray-800">{type}</div>
                                                    <div className="text-xs text-gray-500">({count})</div>
                                                </div>
                                            </div>
                                        </label>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                </div>

            </aside>
        </>
    );
}

