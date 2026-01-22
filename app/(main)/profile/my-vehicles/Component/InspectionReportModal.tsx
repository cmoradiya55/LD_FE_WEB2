"use client";

import React, { useState, useEffect } from "react";
import { X, IndianRupee, Save, Image as ImageIcon, XCircle, CarFront, MapPin } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getMyUsedCarDetail, patchApproveListingDelistingAndPriceUpdate } from "@/utils/auth";
import { UsedCarListingStatus, ExteriorFields, EngineAndTransmissionFields, SteeringSuspensionAndBrakesFields, AirConditioningFields, ElectricalFields, InteriorFields, SeatsFields, OwnerType } from "@/lib/data";
import { Button } from "@/components/Button/Button";
import { useAuth } from "@/components/providers/AuthProvider";
import InspectionSummary from "./InspectionSummery";
import StaffInspectionReport from "./StaffInspectionReport";
import ImagePreview from "@/components/common/ImagePreview";
import { useScrollLock } from "@/hooks/useScrollLock";

const defaultAllFields = {
    exterior: ExteriorFields,
    engine: EngineAndTransmissionFields,
    mechanical: SteeringSuspensionAndBrakesFields,
    ac: AirConditioningFields,
    electrical: ElectricalFields,
    interior: InteriorFields,
    seats: SeatsFields,
};

const allFieldDefinitions = [
    ...ExteriorFields,
    ...EngineAndTransmissionFields,
    ...SteeringSuspensionAndBrakesFields,
    ...AirConditioningFields,
    ...ElectricalFields,
    ...InteriorFields,
    ...SeatsFields,
];

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

    const getOwnerTypeLabel = (owner: number): string => {
        const ownerTypeMap: Record<OwnerType, string> = {
            [OwnerType.FIRST]: '1st Owner',
            [OwnerType.SECOND]: '2nd Owner',
            [OwnerType.THIRD]: '3rd Owner',
            [OwnerType.FOURTH]: '4th Owner',
            [OwnerType.FIFTH]: '5th Owner',
        };
        return ownerTypeMap[owner as OwnerType] || 'N/A';
    };
    const [price, setPrice] = useState<string>("");
    const [customerExpectedPrice, setCustomerExpectedPrice] = useState<string>("");
    const [originalCustomerExpectedPrice, setOriginalCustomerExpectedPrice] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isRejecting, setIsRejecting] = useState(false);
    const [showRejectForm, setShowRejectForm] = useState(false);
    const [rejectReason, setRejectReason] = useState<string>("");
    const [isUnlisting, setIsUnlisting] = useState(false);
    const [showUnlistForm, setShowUnlistForm] = useState(false);
    const [unlistReason, setUnlistReason] = useState<string>("");

    const isAdmin = user?.role === "admin" || user?.userType === "admin" || user?.isAdmin === true;

    const { data: fetchedData, isLoading, refetch } = useQuery({
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

    const data = carData || fetchedData;

    useScrollLock(isOpen);

    useEffect(() => {
        if (!data) {
            setPrice("");
            setCustomerExpectedPrice("");
            setOriginalCustomerExpectedPrice("");
            return;
        }

        const currentStatus = data?.status;
        if (currentStatus === UsedCarListingStatus.APPROVED_BY_ADMIN) {
            const finalPrice = data?.final_price || data?.finalPrice;
            setPrice(finalPrice ? String(finalPrice) : "");

            const customerPrice = data?.customerExpectedPrice || data?.customer_expected_price;
            const customerPriceStr = customerPrice ? String(customerPrice) : "";
            setCustomerExpectedPrice(customerPriceStr);
            setOriginalCustomerExpectedPrice(customerPriceStr);
        } else if (currentStatus === UsedCarListingStatus.APPROVED_BY_MANAGER && isAdmin) {
            setPrice(data?.managerSuggestedPrice ? String(data.managerSuggestedPrice) : "");
            setCustomerExpectedPrice("");
            setOriginalCustomerExpectedPrice("");
        } else {
            setPrice("");
            setCustomerExpectedPrice("");
            setOriginalCustomerExpectedPrice("");
        }
    }, [data, isAdmin]);

    const handleCustomerExpectedPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9.]/g, "");
        setCustomerExpectedPrice(value);
    };

    const isPriceUpdated = customerExpectedPrice !== originalCustomerExpectedPrice;

    const handleSubmit = async () => {
        if (!carId) return;

        setIsSubmitting(true);
        try {
            const payload: any = { status: 1 };

            if (isPriceUpdated && customerExpectedPrice && parseFloat(customerExpectedPrice) > 0) {
                payload.price = parseFloat(customerExpectedPrice);
            }

            const response = await patchApproveListingDelistingAndPriceUpdate(String(carId), payload);

            if (response?.code === 200) {
                setOriginalCustomerExpectedPrice(customerExpectedPrice);
                await refetch();
                onClose();
            }
        } catch (error) {
            console.error('Error submitting:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRejectClick = () => {
        setShowRejectForm(true);
    };

    const handleRejectCancel = () => {
        setShowRejectForm(false);
        setRejectReason("");
    };

    const handleRejectSubmit = async () => {
        if (!carId || !rejectReason.trim()) return;

        setIsRejecting(true);
        try {
            const response = await patchApproveListingDelistingAndPriceUpdate(String(carId), {
                status: 2,
                reason: rejectReason.trim(),
            });

            if (response?.code === 200) {
                setShowRejectForm(false);
                setRejectReason("");
                await refetch();
                onClose();
            }
        } catch (error) {
            console.error('Error rejecting:', error);
        } finally {
            setIsRejecting(false);
        }
    };

    const handleUnlistClick = () => {
        setShowUnlistForm(true);
        onClose();
    };

    const handleUnlistCancel = () => {
        setShowUnlistForm(false);
        setUnlistReason("");
    };

    const handleUnlistSubmit = async () => {
        if (!carId || !unlistReason.trim()) return;

        setIsUnlisting(true);
        try {
            const response = await patchApproveListingDelistingAndPriceUpdate(String(carId), {
                status: 2,
                reason: unlistReason.trim(),
            });

            if (response?.code === 200) {
                setShowUnlistForm(false);
                setUnlistReason("");
                await refetch();
                onClose();
            }
        } catch (error) {
            console.error('Error unlisting:', error);
        } finally {
            setIsUnlisting(false);
        }
    };

    const transformInspectionData = (apiData: any) => {
        if (!apiData?.inspectionImages || !Array.isArray(apiData.inspectionImages)) {
            return { allFields: defaultAllFields, formValues: {} };
        }

        const fieldMap = new Map<string, any>();
        allFieldDefinitions.forEach((field) => {
            fieldMap.set(`${field.type}_${field.sub_type}`, field);
        });

        const formValues: Record<string, any> = {};
        apiData.inspectionImages.forEach((image: any) => {
            if (!image?.type || !image?.subType || !image?.imageUrl) return;

            const key = `${image.type}_${image.subType}`;
            const fieldDef = fieldMap.get(key);
            if (!fieldDef) return;

            formValues[fieldDef.name] = {
                image: image.imageUrl,
                damage: image.isDamage !== undefined && image.isDamage !== null
                    ? (image.isDamage ? "yes" : "no")
                    : undefined,
                remarks: image.remarks || undefined,
                treadDepth: image.treadDepth || undefined,
                tread_depth: image.treadDepth || undefined,
                electrical_type: image.isPower !== undefined
                    ? (image.isPower ? "power" : "manual")
                    : undefined,
            };
        });

        return { allFields: defaultAllFields, formValues };
    };

    if (!isOpen) return null;

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

    // Extract car info, customer info, and other data from the data object
    const carInfo = {
        variantName: data?.variantName,
        registration_number: data?.registration_number || data?.registrationNumber,
        registrationNumber: data?.registrationNumber,
        registartion_year: data?.registartion_year || data?.registrationYear,
        registrationYear: data?.registrationYear,
        modelYear: data?.modelYear,
        fuelTypeLabel: data?.fuelTypeLabel,
        fuelType: data?.fuelType,
        ownerType: data?.ownerType,
        owner: data?.owner,
        owner_type: data?.owner_type,
    };

    const customerInfo = {
        fullName: data?.customerName || data?.customer_name || data?.fullName,
        mobileNo: data?.customerMobile || data?.customer_mobile || data?.mobileNo,
        countryCode: data?.customerCountryCode || data?.customer_country_code || data?.countryCode,
        areaName: data?.areaName || data?.area_name,
        city: data?.city,
    };

    const kmDriven = data?.kmDriven || data?.km_driven;

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
                <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-3 sm:pt-4 overflow-y-auto scrollbar-thin max-h-[calc(90vh-56px)] space-y-4 sm:space-y-5">
                    {/* Vehicle Information */}
                    {data && (
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="bg-gradient-to-r from-primary-50 to-blue-50 px-4 py-2.5 border-b border-gray-200">
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 bg-gradient-to-br from-primary-500 to-blue-600 rounded-lg">
                                        <CarFront className="h-4 w-4 text-white" />
                                    </div>
                                    <h3 className="text-base font-bold text-gray-900">Vehicle Details</h3>
                                </div>
                            </div>
                            <div className="p-4">
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5">
                                    <div className="bg-gray-50 rounded-md p-2.5 border border-gray-200">
                                        <p className="text-[10px] text-gray-500 mb-0.5">Variant</p>
                                        <p className="text-xs font-semibold text-gray-900 truncate">{carInfo.variantName || 'N/A'}</p>
                                    </div>
                                    <div className="bg-gray-50 rounded-md p-2.5 border border-gray-200">
                                        <p className="text-[10px] text-gray-500 mb-0.5">Reg. No.</p>
                                        <p className="text-xs font-semibold text-gray-900 truncate">{carInfo.registration_number || carInfo.registrationNumber || 'N/A'}</p>
                                    </div>
                                    <div className="bg-gray-50 rounded-md p-2.5 border border-gray-200">
                                        <p className="text-[10px] text-gray-500 mb-0.5">Reg. Year</p>
                                        <p className="text-xs font-semibold text-gray-900">{carInfo.registartion_year || carInfo.registrationYear || carInfo.modelYear || 'N/A'}</p>
                                    </div>
                                    <div className="bg-gray-50 rounded-md p-2.5 border border-gray-200">
                                        <p className="text-[10px] text-gray-500 mb-0.5">Fuel Type</p>
                                        <p className="text-xs font-semibold text-gray-900 truncate">{carInfo.fuelTypeLabel || carInfo.fuelType || 'N/A'}</p>
                                    </div>
                                    <div className="bg-gray-50 rounded-md p-2.5 border border-gray-200">
                                        <p className="text-[10px] text-gray-500 mb-0.5">KM Driven</p>
                                        <p className="text-xs font-semibold text-gray-900">{kmDriven ? `${kmDriven.toLocaleString()} km` : 'N/A'}</p>
                                    </div>
                                    <div className="bg-gray-50 rounded-md p-2.5 border border-gray-200">
                                        <p className="text-[10px] text-gray-500 mb-0.5">Owner</p>
                                        <p className="text-xs font-semibold text-gray-900 truncate">
                                            {(carInfo.ownerType || carInfo.owner || carInfo.owner_type) ? getOwnerTypeLabel(carInfo.ownerType || carInfo.owner || carInfo.owner_type) : 'N/A'}
                                        </p>
                                    </div>
                                    {customerInfo?.fullName && (
                                        <div className="bg-gray-50 rounded-md p-2.5 border border-gray-200">
                                            <p className="text-[10px] text-gray-500 mb-0.5">Customer</p>
                                            <p className="text-xs font-semibold text-gray-900 truncate">{customerInfo.fullName}</p>
                                        </div>
                                    )}
                                    {(customerInfo?.areaName || customerInfo?.city) && (
                                        <div className="bg-gray-50 rounded-md p-2.5 border border-gray-200 sm:col-span-2 lg:col-span-1">
                                            <p className="text-[10px] text-gray-500 mb-0.5">Location</p>
                                            <div className="flex items-center gap-1">
                                                <MapPin className="h-3 w-3 text-blue-500 shrink-0" />
                                                <p className="text-xs font-semibold text-gray-900 truncate">
                                                    {[customerInfo.areaName, customerInfo.city].filter(Boolean).join(', ') || 'N/A'}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    <InspectionSummary
                        formValues={mergedFormValues || {}}
                        allFields={transformedData.allFields || defaultAllFields}
                    />
                    <StaffInspectionReport
                        inspectionData={data?.staffReport || {}}
                        formValues={data?.staffReport || {}}
                        carDetailsData={data || {}}
                        isLoading={isLoading}
                        onClose={onClose}
                        renderWithoutDialog={true}
                        hideVehicleDetails={true}
                    />

                    {/* Customer Uploaded Images */}
                    {data?.customerPhotos && data.customerPhotos.length > 0 && (
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
                                            ({data.customerPhotos.length})
                                        </span>
                                    </h3>
                                </div>
                            </div>

                            {/* Customer Images Content */}
                            <div className="p-4">
                                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2.5">
                                    {data.customerPhotos.map((photo: any, index: number) => (
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
                                const currentStatus = data?.status;

                                // If Status code = 700 then show the price details
                                if (currentStatus === UsedCarListingStatus.APPROVED_BY_ADMIN) {
                                    const finalPrice = data?.final_price || data?.finalPrice;

                                    return (
                                        <div className="space-y-3">
                                            {/* Final Price Display */}
                                            <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-primary-50 to-green-50 border border-primary-200/50 p-3 shadow-sm">
                                                <div className="flex items-center gap-1.5 mb-1">
                                                    <div className="p-1 rounded-md bg-primary-100">
                                                        <IndianRupee className="h-3 w-3 text-primary-600" />
                                                    </div>
                                                    <span className="text-[10px] font-semibold text-primary-600 uppercase tracking-wide">
                                                        Final Price
                                                    </span>
                                                </div>
                                                <p className="text-lg font-bold text-primary-700">
                                                    {finalPrice
                                                        ? `₹${Number(finalPrice).toLocaleString('en-IN')}`
                                                        : <span className="text-gray-400 text-sm">Not Available</span>
                                                    }
                                                </p>
                                            </div>

                                            {/* Customer Expected Price Input */}
                                            <div>
                                                <label htmlFor="customerExpectedPrice" className="block text-xs font-semibold text-gray-700 mb-1.5">
                                                    Customer Expected Price
                                                </label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                                                        <span className="text-gray-500 text-sm font-medium">₹</span>
                                                    </div>
                                                    <input
                                                        id="customerExpectedPrice"
                                                        type="text"
                                                        value={customerExpectedPrice}
                                                        onChange={handleCustomerExpectedPriceChange}
                                                        placeholder="Enter customer expected price"
                                                        className="w-1/2 pl-7 pr-3 py-2 text-sm border border-gray-200 rounded-lg bg-slate-50/50 focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all duration-200 outline-none text-gray-900 placeholder:text-gray-400"
                                                    />
                                                </div>
                                                {customerExpectedPrice && (
                                                    <p className="mt-1 text-[10px] text-gray-600">
                                                        Amount: ₹{parseFloat(customerExpectedPrice || '0').toLocaleString('en-IN')}
                                                    </p>
                                                )}
                                                {isPriceUpdated && (
                                                    <p className="mt-1 text-[10px] text-primary-600 font-medium">
                                                        Price has been updated
                                                    </p>
                                                )}
                                            </div>

                                            {/* Reject Reason Form */}
                                            {showRejectForm && (
                                                <div className="space-y-2.5 p-3 rounded-lg bg-red-50 border border-red-200">
                                                    <div>
                                                        <label htmlFor="rejectReason" className="block text-xs font-semibold text-gray-700 mb-1.5">
                                                            Reason for Rejection <span className="text-red-500">*</span>
                                                        </label>
                                                        <textarea
                                                            id="rejectReason"
                                                            value={rejectReason}
                                                            onChange={(e) => setRejectReason(e.target.value)}
                                                            placeholder="Enter reason for rejection..."
                                                            rows={3}
                                                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:border-red-400 focus:ring-1 focus:ring-red-400/20 transition-all duration-200 outline-none text-gray-900 placeholder:text-gray-400 resize-none"
                                                        />
                                                    </div>
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button
                                                            onClick={handleRejectCancel}
                                                            disabled={isRejecting}
                                                            variant="secondary"
                                                            className="flex items-center gap-1.5 px-4 py-1.5 text-sm"
                                                        >
                                                            Cancel
                                                        </Button>
                                                        <Button
                                                            onClick={handleRejectSubmit}
                                                            disabled={isRejecting || !rejectReason.trim()}
                                                            variant="reject"
                                                            className="flex items-center gap-1.5 px-6 py-1.5 text-sm"
                                                        >
                                                            <XCircle className="h-3.5 w-3.5" />
                                                            {isRejecting ? 'Rejecting...' : 'Reject'}
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Action Buttons */}
                                            {!showRejectForm && (
                                                <div className="flex items-center justify-end gap-3 pt-1">
                                                    <Button
                                                        onClick={handleRejectClick}
                                                        disabled={isRejecting || isSubmitting}
                                                        variant="reject"
                                                        className="flex items-center gap-1.5 px-6 py-1.5 text-sm"
                                                    >
                                                        <XCircle className="h-3.5 w-3.5" />
                                                        Reject
                                                    </Button>
                                                    <Button
                                                        onClick={handleSubmit}
                                                        disabled={isSubmitting || isRejecting}
                                                        variant="accept"
                                                        className="flex items-center gap-1.5 px-6 py-1.5 text-sm"
                                                    >
                                                        <Save className="h-3.5 w-3.5" />
                                                        {isSubmitting ? 'Submitting...' : 'Submit'}
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    );
                                }

                                // If Status code = 800 then show the listed price
                                if (currentStatus >= UsedCarListingStatus.LISTED) {
                                    const finalPrice = data?.final_price || data?.finalPrice;
                                    const customerExpectedPrice = data?.customerExpectedPrice || data?.customer_expected_price;

                                    return (
                                        <div className="space-y-2">
                                            {/* Price Comparison Grid */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                                {/* Customer Expected Price */}
                                                <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/50 p-3 shadow-sm hover:shadow-md transition-all duration-200">
                                                    <div className="flex items-center gap-1.5 mb-1">
                                                        <div className="p-1 rounded-md bg-blue-100">
                                                            <IndianRupee className="h-3 w-3 text-blue-600" />
                                                        </div>
                                                        <span className="text-[10px] font-semibold text-blue-600 uppercase tracking-wide">
                                                            Customer Expected
                                                        </span>
                                                    </div>
                                                    <p className="text-lg font-bold text-blue-700">
                                                        {customerExpectedPrice
                                                            ? `₹${Number(customerExpectedPrice).toLocaleString('en-IN')}`
                                                            : <span className="text-gray-400 text-sm">Not Available</span>
                                                        }
                                                    </p>
                                                </div>

                                                {/* Final Price */}
                                                <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-primary-50 to-green-50 border border-primary-200/50 p-3 shadow-sm hover:shadow-md transition-all duration-200">
                                                    <div className="flex items-center gap-1.5 mb-1">
                                                        <div className="p-1 rounded-md bg-primary-100">
                                                            <IndianRupee className="h-3 w-3 text-primary-600" />
                                                        </div>
                                                        <span className="text-[10px] font-semibold text-primary-600 uppercase tracking-wide">
                                                            Final Price
                                                        </span>
                                                    </div>
                                                    <p className="text-lg font-bold text-primary-700">
                                                        {finalPrice
                                                            ? `₹${Number(finalPrice).toLocaleString('en-IN')}`
                                                            : <span className="text-gray-400 text-sm">Not Available</span>
                                                        }
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Unlist Reason Form */}
                                            {showUnlistForm && (
                                                <div className="space-y-2.5 p-3 rounded-lg bg-red-50 border border-red-200">
                                                    <div>
                                                        <label htmlFor="unlistReason" className="block text-xs font-semibold text-gray-700 mb-1.5">
                                                            Reason for Unlisting <span className="text-red-500">*</span>
                                                        </label>
                                                        <textarea
                                                            id="unlistReason"
                                                            value={unlistReason}
                                                            onChange={(e) => setUnlistReason(e.target.value)}
                                                            placeholder="Enter reason for unlisting..."
                                                            rows={3}
                                                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:border-red-400 focus:ring-1 focus:ring-red-400/20 transition-all duration-200 outline-none text-gray-900 placeholder:text-gray-400 resize-none"
                                                        />
                                                    </div>
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button
                                                            onClick={handleUnlistCancel}
                                                            disabled={isUnlisting}
                                                            variant="secondary"
                                                            className="flex items-center gap-1.5 px-4 py-1.5 text-sm"
                                                        >
                                                            Cancel
                                                        </Button>
                                                        <Button
                                                            onClick={handleUnlistSubmit}
                                                            disabled={isUnlisting || !unlistReason.trim()}
                                                            variant="reject"
                                                            className="flex items-center gap-1.5 px-6 py-1.5 text-sm"
                                                        >
                                                            <XCircle className="h-3.5 w-3.5" />
                                                            {isUnlisting ? 'Unlisting...' : 'Unlist'}
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Unlist Button */}
                                            {!showUnlistForm && data?.status === 800 && (
                                                <div className="flex items-center justify-end pt-1">
                                                    <Button
                                                        onClick={handleUnlistClick}
                                                        disabled={isUnlisting}
                                                        variant="reject"
                                                        className="flex items-center gap-1.5 px-6 py-1.5 text-sm"
                                                    >
                                                        <XCircle className="h-3.5 w-3.5" />
                                                        Unlist
                                                    </Button>
                                                </div>
                                            )}
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
