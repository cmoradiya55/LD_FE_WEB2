'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Car, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/Button/Button';
import { getStorageItem, setStorageItem } from '@/lib/storage';

const RegistrationNumberComponent = () => {
    const router = useRouter();
    const [registrationNumber, setRegistrationNumber] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const formatRegistrationNumber = (value: string) => {
        const cleaned = value.replace(/[-\s]/g, '').toUpperCase();
        
        if (cleaned.length <= 2) {
            return cleaned;
        } else if (cleaned.length <= 4) {
            return `${cleaned.slice(0, 2)}-${cleaned.slice(2)}`;
        } else if (cleaned.length <= 6) {
            return `${cleaned.slice(0, 2)}-${cleaned.slice(2, 4)}-${cleaned.slice(4)}`;
        } else if (cleaned.length <= 10) {
            return `${cleaned.slice(0, 2)}-${cleaned.slice(2, 4)}-${cleaned.slice(4, 6)}-${cleaned.slice(6, 10)}`;
        }
        return cleaned.slice(0, 10); 
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (/^[A-Z0-9\s-]*$/i.test(value)) {
            const formatted = formatRegistrationNumber(value);
            setRegistrationNumber(formatted);
            setError('');
        }
    };

    const validateRegistrationNumber = (regNumber: string): boolean => {
        const regNumberRegex = /^[A-Z]{2}-[0-9]{2}-[A-Z]{2}-(?!0000)[0-9]{4}$/;
        
        if (!regNumberRegex.test(regNumber)) {
            setError('Please enter a valid registration number (e.g., AB-12-CD-1234)');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!registrationNumber.trim()) {
            setError('Please enter your car registration number');
            return;
        }

        if (!validateRegistrationNumber(registrationNumber)) {
            return;
        }

        setIsSubmitting(true);

        try {
            const cleanedRegNumber = registrationNumber.replace(/[-\s]/g, '').toUpperCase();
            let sellCarDetails: any = {};
            if (typeof window !== 'undefined') {
                const stored = getStorageItem('sellCarDetails');
                if (stored) {
                    try {
                        sellCarDetails = JSON.parse(stored);
                    } catch (e) {
                        console.error('Error parsing stored data', e);
                    }
                }
            }
            sellCarDetails.registrationNumber = cleanedRegNumber;
            sellCarDetails.registrationNumberFormatted = registrationNumber;
            if (typeof window !== 'undefined') {
                setStorageItem('sellCarDetails', JSON.stringify(sellCarDetails));
            }
            router.push('/sellCar/addCar');
        } catch (err) {
            setError('Something went wrong. Please try again.');
            setIsSubmitting(false);
        }
    };

    return (
        <div className="lg:pt-[5%] flex items-center justify-center px-4 overflow-hidden">
            <div className="w-full max-w-md">
                {/* Header Section */}
                <div className="text-center mb-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg shadow-primary-200 mb-3">
                        <Car className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-1">
                        Enter Your Car Registration Number
                    </h1>
                    <p className="text-slate-600 text-sm">
                        We'll use this to help you sell your car faster
                    </p>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Input Field */}
                        <div>
                            <label 
                                htmlFor="registrationNumber" 
                                className="block text-sm font-semibold text-slate-700 mb-1.5"
                            >
                                Registration Number
                            </label>
                            <div className="relative">
                                <input
                                    id="registrationNumber"
                                    type="text"
                                    value={registrationNumber}
                                    onChange={handleInputChange}
                                    placeholder="e.g., AB-12-CD-1234"
                                    className={`w-full px-4 py-2 text-slate-700 text-lg font-semibold tracking-wider text-center rounded-xl border-2 transition-all focus:outline-none focus:ring-4 focus:ring-primary-100 ${
                                        error 
                                            ? 'border-red-300 bg-red-50 focus:border-red-400' 
                                            : 'border-slate-200 bg-slate-50 focus:border-primary-400 focus:bg-white'
                                    }`}
                                    maxLength={13}
                                    autoComplete="off"
                                    autoFocus
                                />
                                {registrationNumber && !error && (
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                                    </div>
                                )}
                            </div>
                            
                            {/* Error Message */}
                            {error && (
                                <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                                    <span className="text-red-500">•</span>
                                    {error}
                                </p>
                            )}

                            {/* Helper Text */}
                            {!error && registrationNumber && (
                                <p className="mt-1.5 text-xs text-slate-500">
                                    Format: AB-12-CD-1234 (Last 4 digits cannot be 0000)
                                </p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={isSubmitting || !registrationNumber.trim()}
                            className="w-full py-3 text-base font-semibold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Processing...</span>
                                </>
                            ) : (
                                <>
                                    <span>Continue</span>
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </Button>
                    </form>

                    {/* Info Section */}
                    <div className="mt-4 pt-4 border-t border-slate-100">
                        <div className="flex items-start gap-2 text-xs text-slate-600">
                            <div className="w-4 h-4 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-primary-600 text-[10px] font-bold">i</span>
                            </div>
                            <p>
                                Your registration number helps us verify your vehicle details and provide accurate pricing estimates.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegistrationNumberComponent;