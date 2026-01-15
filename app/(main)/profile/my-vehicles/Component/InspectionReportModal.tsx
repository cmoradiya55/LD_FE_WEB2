"use client";

import React, { useState, useEffect } from "react";
import { X, IndianRupee, Save, Image as ImageIcon } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getMyUsedCarDetail, patchApproveListingDelistingAndPriceUpdate } from "@/utils/auth";
import { UsedCarListingStatus, ExteriorFields, EngineAndTransmissionFields, SteeringSuspensionAndBrakesFields, AirConditioningFields, ElectricalFields, InteriorFields, SeatsFields } from "@/lib/data";
import { Button } from "@/components/Button/Button";
import { useAuth } from "@/components/providers/AuthProvider";
import InspectionSummary from "./InspectionSummery";
import StaffInspectionReport from "./StaffInspectionReport";
import ImagePreview from "@/components/common/ImagePreview";

interface InspectionReportModalProps {
    isOpen: boolean;
    carId: number | null;
    carData?: any; // Full API response data
    onClose: () => void;
}

const InspectionReportModal: React.FC<InspectionReportModalProps> = ({
    isOpen,
    carId,
    carData,
    onClose,
}) => {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [price, setPrice] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Determine if user is admin (adjust based on your user object structure)
    const isAdmin = user?.role === "admin" || user?.userType === "admin" || user?.isAdmin === true;

    // Fetch data only if carData is not provided
    const {
        data: fetchedData,
        isLoading,
    } = useQuery({
        queryKey: ["GET_MY_USED_CAR_DETAIL", carId],
        queryFn: async () => {
            if (!carId) return null;
            const response = await getMyUsedCarDetail(String(carId));
            if (response?.code === 200) {
                return response.data;
            }
            throw new Error(response?.message || "Failed to fetch car details");
        },
        enabled: isOpen && !!carId && !carData,
        retry: false,
        refetchOnWindowFocus: false,
    });

    // Use carData if provided, otherwise use fetched data
    const data = carData || fetchedData;

    // Initialize price from car data
    useEffect(() => {
        if (data) {
            const currentStatus = data?.status;

            if (currentStatus === UsedCarListingStatus.APPROVED_BY_ADMIN) {
                const finalPrice = data?.final_price || data?.finalPrice;
                setPrice(finalPrice ? String(finalPrice) : "");
            } else if (currentStatus === UsedCarListingStatus.APPROVED_BY_MANAGER && isAdmin) {
                const managerPrice = data?.managerSuggestedPrice;
                setPrice(managerPrice ? String(managerPrice) : "");
            } else {
                setPrice("");
            }
        }
    }, [data, isAdmin]);

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9.]/g, "");
        setPrice(value);
    };

    const handleSubmitPrice = async () => {
        if (!price || parseFloat(price) <= 0 || !carId) return;

        setIsSubmitting(true);
        try {
            const payload = {
                price: parseFloat(price),
            };

            const response = await patchApproveListingDelistingAndPriceUpdate(String(carId), payload);

            if (response?.code === 200) {
                // Refetch car details
                await queryClient.invalidateQueries({ queryKey: ["GET_MY_USED_CAR_DETAIL", carId] });
                setPrice("");
            } else {
                alert(response?.message || "Failed to save price");
            }
        } catch (error: any) {
            console.error("Error submitting price:", error);
            alert(error?.message || "Failed to save price");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Default allFields structure
    const defaultAllFields = {
        exterior: ExteriorFields,
        engine: EngineAndTransmissionFields,
        mechanical: SteeringSuspensionAndBrakesFields,
        ac: AirConditioningFields,
        electrical: ElectricalFields,
        interior: InteriorFields,
        seats: SeatsFields,
    };

    // Transform inspection images from API to formValues and allFields
    const transformInspectionData = (apiData: any) => {
        try {
            if (!apiData || !apiData.inspectionImages || !Array.isArray(apiData.inspectionImages)) {
                return {
                    allFields: defaultAllFields,
                    formValues: {},
                };
            }

            // Create a map of all field definitions by type and sub_type
            const allFieldDefinitions = [
                ...ExteriorFields,
                ...EngineAndTransmissionFields,
                ...SteeringSuspensionAndBrakesFields,
                ...AirConditioningFields,
                ...ElectricalFields,
                ...InteriorFields,
                ...SeatsFields,
            ];

            // Create a lookup map: type_subtype -> field definition
            const fieldMap = new Map<string, any>();
            allFieldDefinitions.forEach((field) => {
                const key = `${field.type}_${field.sub_type}`;
                fieldMap.set(key, field);
            });

            // Transform inspectionImages to formValues
            // API now returns flat array with: type, subType, imageUrl, isDamage, remarks, treadDepth, etc.
            const formValues: Record<string, any> = {};
            
            apiData.inspectionImages.forEach((image: any) => {
                if (image && image.type !== undefined && image.subType !== undefined && image.imageUrl) {
                    const key = `${image.type}_${image.subType}`;
                    const fieldDef = fieldMap.get(key);
                    
                    if (fieldDef) {
                        // Convert isDamage boolean to "yes"/"no" string format
                        let damage: string | undefined = undefined;
                        if (image.isDamage !== undefined && image.isDamage !== null) {
                            damage = image.isDamage ? "yes" : "no";
                        }
                        
                        // Create form value entry with all available data
                        formValues[fieldDef.name] = {
                            image: image.imageUrl,
                            damage: damage,
                            remarks: image.remarks || undefined,
                            treadDepth: image.treadDepth || undefined,
                            tread_depth: image.treadDepth || undefined, // Support both naming conventions
                            electrical_type: image.isPower !== undefined ? (image.isPower ? "power" : "manual") : undefined,
                        };
                    }
                }
            });

            return { 
                allFields: defaultAllFields, 
                formValues 
            };
        } catch (error) {
            console.error("Error transforming inspection data:", error);
            return {
                allFields: defaultAllFields,
                formValues: {},
            };
        }
    };

    if (!isOpen) return null;

    // Show loading state if data is being fetched and not provided
    if (!carData && isLoading) {
        return (
            <div className="w-full h-full fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-2 sm:p-4">
                <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden w-full h-full max-h-[98vh] flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading inspection report...</p>
                    </div>
                </div>
            </div>
        );
    }

    const transformedData = data ? transformInspectionData(data) : { allFields: defaultAllFields, formValues: {} };
    
    const mergedFormValues = {
        registrationNumber: data?.registrationNumber,
        registartionYear: data?.registrationYear,
        km_driven: data?.kmDriven,
        rc_image: data?.rcImage,
        insurance_image: data?.insuranceImage,
        ...transformedData.formValues,
    };
    
    const car = data;

    return (
        <div className="w-full h-full fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-2 sm:p-4">
            <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden w-full h-full max-h-[98vh]">
                {/* Header */}
                <div className="relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-600 to-primary-700 px-6 pt-6 pb-4 pr-16">
                    <div className="relative z-10">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold text-white mb-2">Inspection Report</h2>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 inline-flex p-2 rounded-full bg-white/30 hover:bg-white/40 text-white hover:text-gray-700 transition-colors"
                        aria-label="Close"
                    >
                        <X className="h-4 w-4 text-white" />
                    </button>
                </div>

                {/* Body */}
                <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-3 sm:pt-4 overflow-y-auto max-h-[calc(90vh-56px)] space-y-4 sm:space-y-5">
                    <InspectionSummary
                        formValues={mergedFormValues || {}}
                        allFields={transformedData.allFields || defaultAllFields}
                    />
                    <StaffInspectionReport
                        inspectionData={car?.staffReport || {}}
                        formValues={car?.staffReport || {}}
                        carDetailsData={car || {}}
                        isLoading={isLoading}
                        onClose={onClose}
                        renderWithoutDialog={true}
                        hideVehicleDetails={true}
                    />

                    {/* Customer Uploaded Images */}
                    {car?.customerPhotos && car.customerPhotos.length > 0 && (
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            {/* Customer Images Header */}
                            <div className="bg-gradient-to-r from-primary-50 to-blue-50 px-4 py-2.5 border-b border-gray-200">
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 bg-gradient-to-br from-primary-500 to-blue-600 rounded-lg">
                                        <ImageIcon className="h-4 w-4 text-white" />
                                    </div>
                                    <h3 className="text-base font-bold text-gray-900">
                                        Customer Uploaded Images
                                        <span className="ml-2 text-sm font-semibold text-gray-600">
                                            ({car.customerPhotos.length})
                                        </span>
                                    </h3>
                                </div>
                            </div>

                            {/* Customer Images Content */}
                            <div className="p-4">
                                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2.5">
                                    {car.customerPhotos.map((photo: any, index: number) => (
                                        <div
                                            key={photo.id || index}
                                            className="group relative aspect-square rounded-lg border border-gray-200 bg-gray-50 overflow-hidden hover:border-primary-400 hover:shadow-lg transition-all duration-200"
                                        >
                                            <div className="w-full h-full cursor-pointer">
                                                <ImagePreview
                                                    src={photo.url || photo.imageUrl || photo.image}
                                                    alt={`Customer uploaded image ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center pointer-events-none">
                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <div className="bg-white/95 rounded-full p-1.5 shadow-lg">
                                                        <ImageIcon className="h-3.5 w-3.5 text-primary-600" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Price Details */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        {/* Price Details Header */}
                        <div className="bg-gradient-to-r from-primary-50 to-blue-50 px-4 py-2.5 border-b border-gray-200">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-gradient-to-br from-primary-500 to-blue-600 rounded-lg">
                                    <IndianRupee className="h-4 w-4 text-white" />
                                </div>
                                <h3 className="text-base font-bold text-gray-900">Price Details</h3>
                            </div>
                        </div>

                        {/* Price Details Content */}
                        <div className="p-4">
                            {(() => {
                                const currentStatus = car?.status;

                                if (currentStatus === UsedCarListingStatus.APPROVED_BY_ADMIN) {
                                    return (
                                        <div className="space-y-4">
                                            <div>
                                                <label htmlFor="price" className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Enter Price
                                                </label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <span className="text-gray-500 text-lg font-medium">₹</span>
                                                    </div>
                                                    <input
                                                        id="price"
                                                        type="text"
                                                        value={price}
                                                        onChange={handlePriceChange}
                                                        placeholder="Enter price amount"
                                                        className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-lg bg-slate-50/50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 outline-none text-gray-900 placeholder:text-gray-400"
                                                    />
                                                </div>
                                                {price && (
                                                    <p className="mt-2 text-xs text-gray-600">
                                                        Amount: ₹{parseFloat(price || '0').toLocaleString('en-IN')}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="flex justify-end">
                                                <Button
                                                    onClick={handleSubmitPrice}
                                                    disabled={!price || parseFloat(price) <= 0 || isSubmitting}
                                                    variant="primary"
                                                    className="flex items-center gap-2 px-6 py-2.5"
                                                >
                                                    <Save className="h-4 w-4" />
                                                    {isSubmitting ? 'Saving...' : 'Save Price'}
                                                </Button>
                                            </div>
                                        </div>
                                    );
                                }

                                if (currentStatus === UsedCarListingStatus.LISTED) {
                                    const finalPrice = car?.final_price || car?.finalPrice;
                                    return (
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Final Price
                                            </label>
                                            <div className="p-4 rounded-lg bg-primary-50 border-2 border-primary-200">
                                                <p className="text-2xl font-bold text-primary-700">
                                                    ₹{finalPrice ? finalPrice.toLocaleString('en-IN') : 'N/A'}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                }

                                return (
                                    <div className="text-center py-4 text-gray-500">
                                        Price details not available for this status
                                    </div>
                                );
                            })()}
                        </div>
                    </div>


                </div>
            </div>
        </div>
    );
};

export default InspectionReportModal;


