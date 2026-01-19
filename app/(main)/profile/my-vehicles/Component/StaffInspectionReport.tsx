"use client";

import LoadingSpinner from '@/components/common/LoadingSpinner';
import { Calendar, FileText, Shield, CheckCircle, XCircle, Receipt, Scale } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { OwnerType } from '@/lib/data';

interface StaffInspectionReportProps {
    isOpen?: boolean;
    onClose?: () => void;
    isLoading: boolean;
    inspectionData: any;
    formValues: Record<string, any>;
    carDetailsData?: any;
    renderWithoutDialog?: boolean;
    hideVehicleDetails?: boolean;

}

const StaffInspectionReport = ({ isOpen, onClose, isLoading, inspectionData, formValues, carDetailsData, renderWithoutDialog = false, hideVehicleDetails = false }: StaffInspectionReportProps) => {
    const getOwnerTypeLabel = (owner: number): string => {
        const ownerTypeMap: Record<OwnerType, string> = {
            [OwnerType.FIRST]: '1st Owner',
            [OwnerType.SECOND]: '2nd Owner',
            [OwnerType.THIRD]: '3rd Owner',
            [OwnerType.FOURTH]: '4th Owner',
        };
        return ownerTypeMap[owner as OwnerType] || 'N/A';
    };

    const formatDate = (dateString: string | null | undefined): string => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
        } catch {
            return dateString;
        }
    };

    const formatBoolean = (value: boolean | null | undefined): { label: string; icon: typeof CheckCircle | typeof XCircle; color: string } => {
        if (value === true) {
            return { label: 'Yes', icon: CheckCircle, color: 'text-green-600' };
        } else if (value === false) {
            return { label: 'No', icon: XCircle, color: 'text-red-600' };
        }
        return { label: 'N/A', icon: XCircle, color: 'text-gray-500' };
    };

    const staffData = inspectionData?.staffReport || carDetailsData?.staffReport || inspectionData?.additionalDetails || carDetailsData?.additionalDetails || inspectionData?.staffDetails || inspectionData?.staff || {};

    const content = (
        <>
            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <LoadingSpinner size="lg" />
                </div>
            ) : (
                <div className="space-y-3">
                    {/* Header */}
                    {!renderWithoutDialog && (
                        <div className="relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-600 to-primary-700 px-4 pt-6 pb-4 pr-16">
                            <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
                            <div className="relative z-10">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <h2 className="text-2xl font-bold text-white mb-2">Staff Inspection Report</h2>
                                        {(inspectionData?.id || carDetailsData?.id) && (
                                            <p className="text-primary-50 text-sm">
                                                Vehicle ID: <span className="font-semibold">{inspectionData?.id || carDetailsData?.id}</span>
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg shrink-0">
                                        <CheckCircle className="h-4 w-4 text-white" />
                                        <span className="text-sm font-medium text-white">
                                            {inspectionData?.statusLabel || carDetailsData?.statusLabel || 'Completed'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className={`${renderWithoutDialog ? 'px-1' : 'px-1'} pb-6 space-y-3`}>

                        {/* Staff Inspection Details - Compact Design */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="bg-gradient-to-r from-primary-50 to-blue-50 px-4 py-2.5 border-b border-gray-200">
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 bg-gradient-to-br from-primary-500 to-blue-600 rounded-lg">
                                        <Shield className="h-4 w-4 text-white" />
                                    </div>
                                    <h3 className="text-base font-bold text-gray-900">Staff Inspection Details</h3>
                                </div>
                            </div>
                            <div className="p-4 space-y-3">
                                {/* Registration & Documents Section */}
                                <div className="space-y-2">
                                    <div className="flex items-center gap-1.5 pb-1 border-b border-gray-200">
                                        <Calendar className="h-3.5 w-3.5 text-blue-600" />
                                        <h4 className="text-sm font-semibold text-gray-900">Registration & Documents</h4>
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
                                        <div className="bg-gray-50 rounded-md p-2.5 border border-gray-200">
                                            <p className="text-[10px] text-gray-500 mb-0.5">Reg. Date</p>
                                            <p className="text-xs font-semibold text-gray-900 truncate">
                                                {staffData.registrationDate || staffData.registartionDate || staffData.registartion_date || 'N/A'}
                                            </p>
                                        </div>
                                        <div className="bg-gray-50 rounded-md p-2.5 border border-gray-200">
                                            <p className="text-[10px] text-gray-500 mb-0.5">Fitness Until</p>
                                            <p className="text-xs font-semibold text-gray-900 truncate">
                                                {staffData.fitnessValidUntil || staffData.fitness_valid_until || 'N/A'}
                                            </p>
                                        </div>
                                        <div className="bg-gray-50 rounded-md p-2.5 border border-gray-200">
                                            <p className="text-[10px] text-gray-500 mb-0.5">Insurance Until</p>
                                            <p className="text-xs font-semibold text-gray-900 truncate">
                                                {staffData.insuranceValidUntil || staffData.insurance_valid_until || 'N/A'}
                                            </p>
                                        </div>
                                        <div className="bg-gray-50 rounded-md p-2.5 border border-gray-200">
                                            <p className="text-[10px] text-gray-500 mb-0.5">PUC Until</p>
                                            <p className="text-xs font-semibold text-gray-900 truncate">
                                                {staffData.pucValidUntil || staffData.puc_valid_until || 'N/A'}
                                            </p>
                                        </div>
                                        <div className="bg-gray-50 rounded-md p-2.5 border border-gray-200 sm:col-span-3 lg:col-span-1">
                                            <p className="text-[10px] text-gray-500 mb-0.5">Reg. Place</p>
                                            <p className="text-xs font-semibold text-gray-900 truncate">
                                                {staffData.registrationPlace || staffData.registration_place || 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Status & Ownership Section */}
                                <div className="space-y-2">
                                    <div className="flex items-center gap-1.5 pb-1 border-b border-gray-200">
                                        <Shield className="h-3.5 w-3.5 text-primary-600" />
                                        <h4 className="text-sm font-semibold text-gray-900">Status & Ownership</h4>
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5">
                                        {[
                                            { key: 'loanStatus', label: 'Loan Status', apiKey: 'loan_status' },
                                            { key: 'isBlacklisted', label: 'Blacklisted', apiKey: 'is_blacklisted' },
                                            { key: 'isRtoNocIssued', label: 'RTO NOC', apiKey: 'is_rto_noc_issued' },
                                            { key: 'isPartyPeshi', label: 'Party Peshi', apiKey: 'is_party_peshi' },
                                            { key: 'isHypothecated', label: 'Hypothecated', apiKey: 'is_hypothecated' },
                                            { key: 'isConverted', label: 'Converted', apiKey: 'is_converted' },
                                            { key: 'isMigrated', label: 'Migrated', apiKey: 'is_migrated' },
                                            { key: 'adaptedForSpecialUse', label: 'Special Use', apiKey: 'adapted_for_special_use' },
                                        ].map((field) => {
                                            const value = staffData[field.key] ?? staffData[field.apiKey];
                                            const formatted = formatBoolean(value);
                                            const Icon = formatted.icon;
                                            return (
                                                <div key={field.key} className="bg-gray-50 rounded-md p-2.5 border border-gray-200">
                                                    <p className="text-[10px] text-gray-500 mb-0.5 truncate">{field.label}</p>
                                                    <div className="flex items-center gap-1.5">
                                                        <Icon className={`h-3 w-3 ${formatted.color} shrink-0`} />
                                                        <p className={`text-xs font-semibold ${formatted.color} truncate`}>
                                                            {formatted.label}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Legal & Cases Section */}
                                <div className="space-y-2">
                                    <div className="flex items-center gap-1.5 pb-1 border-b border-gray-200">
                                        <Scale className="h-3.5 w-3.5 text-red-600" />
                                        <h4 className="text-sm font-semibold text-gray-900">Legal & Cases</h4>
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
                                        {[
                                            { key: 'criminalCases', label: 'Criminal', apiKey: 'criminal_cases' },
                                            { key: 'civilCases', label: 'Civil', apiKey: 'civil_cases' },
                                            { key: 'roadAccidents', label: 'Road Accidents', apiKey: 'road_accidents' },
                                            { key: 'compensationCases', label: 'Compensation', apiKey: 'compensation_cases' },
                                            { key: 'otherCases', label: 'Other', apiKey: 'other_cases' },
                                        ].map((field) => {
                                            const value = staffData[field.key] ?? staffData[field.apiKey] ?? 0;
                                            return (
                                                <div key={field.key} className="bg-gray-50 rounded-md p-2.5 border border-gray-200">
                                                    <p className="text-[10px] text-gray-500 mb-0.5">{field.label}</p>
                                                    <p className="text-xs font-semibold text-gray-900">{value}</p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Challan Details Section */}
                                {staffData.challanDetails && Object.keys(staffData.challanDetails).length > 0 && (
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-1.5 pb-1 border-b border-gray-200">
                                            <Receipt className="h-3.5 w-3.5 text-orange-600" />
                                            <h4 className="text-sm font-semibold text-gray-900">Challan Details</h4>
                                        </div>
                                        <div className="space-y-2">
                                            {Object.entries(staffData.challanDetails).map(([index, challan]: [string, any]) => (
                                                <div key={index} className="bg-orange-50 rounded-md p-2.5 border border-orange-200">
                                                    <div className="flex items-center justify-between mb-1.5">
                                                        <h5 className="text-xs font-semibold text-gray-900">Challan {parseInt(index) + 1}</h5>
                                                    </div>
                                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                                        <div>
                                                            <p className="text-[10px] text-gray-500 mb-0.5">Number</p>
                                                            <p className="text-xs font-medium text-gray-900 truncate">{challan.challanNumber || 'N/A'}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] text-gray-500 mb-0.5">Date</p>
                                                            <p className="text-xs font-medium text-gray-900">{formatDate(challan.challanDate)}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] text-gray-500 mb-0.5">Amount</p>
                                                            <p className="text-xs font-medium text-gray-900">
                                                                {challan.challanAmount ? `₹${challan.challanAmount}` : 'N/A'}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] text-gray-500 mb-0.5">Reason</p>
                                                            <p className="text-xs font-medium text-gray-900 truncate">{challan.challanReason || 'N/A'}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Staff Remarks Section */}
                                {staffData.staffRemarks || staffData.staff_remarks ? (
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-1.5 pb-1 border-b border-gray-200">
                                            <FileText className="h-3.5 w-3.5 text-indigo-600" />
                                            <h4 className="text-sm font-semibold text-gray-900">Staff Remarks</h4>
                                        </div>
                                        <div className="bg-indigo-50 rounded-md p-2.5 border border-indigo-200">
                                            <p className="text-xs text-gray-700 whitespace-pre-wrap">
                                                {staffData.staffRemarks || staffData.staff_remarks || 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );

    if (renderWithoutDialog) {
        return content;
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto scrollbar-thin p-0">
                {content}
            </DialogContent>
        </Dialog>
    );
};

export default StaffInspectionReport;
