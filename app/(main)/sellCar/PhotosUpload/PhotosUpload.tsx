'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Upload, X, Camera, CheckCircle2, AlertCircle } from 'lucide-react';

interface PhotosUploadProps {
    onSelectionChange?: (value: string) => void;
    selectedValue?: string;
    onPhotosUploaded?: (count: number) => void;
    onPhotosChange?: (photos: string[]) => void;
    initialPhotos?: string[];
}

const PhotosUpload: React.FC<PhotosUploadProps> = ({
    onSelectionChange,
    selectedValue,
    onPhotosUploaded,
    onPhotosChange,
    initialPhotos,
}) => {
    const [selectedOption, setSelectedOption] = useState<string | null>(selectedValue || null);
    const [uploadedPhotos, setUploadedPhotos] = useState<string[]>(initialPhotos || []);
    const [showConfirmPopup, setShowConfirmPopup] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Sync with external selectedValue changes
    useEffect(() => {
        if (selectedValue !== undefined) {
            setSelectedOption(selectedValue || null);
        }
    }, [selectedValue]);

    useEffect(() => {
        if (Array.isArray(initialPhotos)) {
            setUploadedPhotos(initialPhotos);
        }
    }, [initialPhotos]);

    const handleOptionSelect = (option: string) => {
        if (option === 'need-help') {
            setShowConfirmPopup(true);
        } else {
            setSelectedOption(option);
            onSelectionChange?.(option);
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const newPhotos = Array.from(files).map((file) => URL.createObjectURL(file));
            const updatedPhotos = [...uploadedPhotos, ...newPhotos].slice(0, 20); // Max 20 photos
            setUploadedPhotos(updatedPhotos);
            onPhotosUploaded?.(updatedPhotos.length);
            onPhotosChange?.(updatedPhotos);
        }
        // Reset input to allow selecting same file again
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const removePhoto = (index: number) => {
        setUploadedPhotos((prev) => {
            const newPhotos = [...prev];
            URL.revokeObjectURL(newPhotos[index]); // Clean up object URL
            newPhotos.splice(index, 1);
            onPhotosUploaded?.(newPhotos.length);
            onPhotosChange?.(newPhotos);
            return newPhotos;
        });
    };

    const handleConfirmPhotographySupport = () => {
        // Clear any uploaded photos once user opts for photography support
        uploadedPhotos.forEach((url) => URL.revokeObjectURL(url));
        setUploadedPhotos([]);
        onPhotosUploaded?.(0);
        onPhotosChange?.([]);
        setSelectedOption('need-help');
        onSelectionChange?.('need-help');
        setShowConfirmPopup(false);
    };

    const handleCancelPhotographySupport = () => {
        setShowConfirmPopup(false);
    };

    return (
        <div className="space-y-3">
            {/* Two Option Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Upload Myself Option */}
                <button
                    type="button"
                    onClick={() => handleOptionSelect('upload-now')}
                    className={`group relative rounded-xl border-2 p-4 text-left transition-all duration-300 hover:shadow-lg ${selectedOption === 'upload-now'
                        ? 'border-primary-500 bg-gradient-to-br from-primary-50 to-blue-50 shadow-md'
                        : 'border-slate-200 bg-white hover:border-primary-300'
                        }`}
                >
                    <div className="flex flex-col items-center text-center space-y-2">
                        <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${selectedOption === 'upload-now'
                                ? 'bg-primary-500 text-white shadow-md'
                                : 'bg-slate-100 text-slate-600 group-hover:bg-primary-100 group-hover:text-primary-600'
                                }`}
                        >
                            <Upload className="w-6 h-6" />
                        </div>
                        <div className="space-y-0.5">
                            <h3 className="text-sm font-bold text-slate-900">Upload my self</h3>
                            <p className="text-[10px] text-slate-500">I have photos ready to go</p>
                        </div>
                        {selectedOption === 'upload-now' && (
                            <div className="absolute top-2 right-2">
                                <CheckCircle2 className="w-4 h-4 text-primary-600" />
                            </div>
                        )}
                    </div>
                </button>

                {/* Need Photography Support Option */}
                <button
                    type="button"
                    onClick={() => handleOptionSelect('need-help')}
                    className={`group relative rounded-xl border-2 p-4 text-left transition-all duration-300 hover:shadow-lg ${selectedOption === 'need-help'
                        ? 'border-primary-500 bg-gradient-to-br from-primary-50 to-blue-50 shadow-md'
                        : 'border-slate-200 bg-white hover:border-primary-300'
                        }`}
                >
                    <div className="flex flex-col items-center text-center space-y-2">
                        <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${selectedOption === 'need-help'
                                ? 'bg-primary-500 text-white shadow-md'
                                : 'bg-slate-100 text-slate-600 group-hover:bg-primary-100 group-hover:text-primary-600'
                                }`}
                        >
                            <Camera className="w-6 h-6" />
                        </div>
                        <div className="space-y-0.5">
                            <h3 className="text-sm font-bold text-slate-900">Need Photography Support</h3>
                            <p className="text-[10px] text-slate-500">Schedule a shoot with our team</p>
                        </div>
                        {selectedOption === 'need-help' && (
                            <div className="absolute top-2 right-2">
                                <CheckCircle2 className="w-4 h-4 text-primary-600" />
                            </div>
                        )}
                    </div>
                </button>

            </div>

            {/* Upload Photos Section - Only show when Upload myself is selected */}
            {selectedOption === 'upload-now' && (
                <div className="mt-3 space-y-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="text-xs font-semibold text-slate-900">Upload Photos</h4>
                            <p className="text-[10px] text-slate-500 mt-0.5">
                                {uploadedPhotos.length}/20 photos uploaded
                            </p>
                        </div>
                        {uploadedPhotos.length > 0 && (
                            <button
                                type="button"
                                onClick={() => {
                                    uploadedPhotos.forEach((url) => URL.revokeObjectURL(url));
                                    setUploadedPhotos([]);
                                    onPhotosUploaded?.(0);
                                    onPhotosChange?.([]);
                                }}
                                className="text-[10px] text-red-600 hover:text-red-700 font-medium"
                            >
                                Clear All
                            </button>
                        )}
                    </div>

                    {/* Upload Area */}
                    <div className="relative">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleFileUpload}
                            className="hidden"
                            id="photo-upload"
                            disabled={uploadedPhotos.length >= 20}
                        />
                        <label
                            htmlFor="photo-upload"
                            className={`block rounded-xl border-2 border-dashed p-4 text-center cursor-pointer transition-all duration-200 ${uploadedPhotos.length >= 20
                                ? 'border-slate-200 bg-slate-50 cursor-not-allowed opacity-50'
                                : 'border-primary-300 bg-primary-50/40 hover:border-primary-500 hover:bg-primary-100/60'
                                }`}
                        >
                            <Upload className="w-8 h-8 text-primary-500 mx-auto mb-2" />
                            <p className="text-xs font-semibold text-slate-700 mb-0.5">
                                {uploadedPhotos.length >= 20
                                    ? 'Maximum 20 photos reached'
                                    : 'Click to upload or drag and drop'}
                            </p>
                            <p className="text-[10px] text-slate-500">
                                PNG, JPG up to 10MB each
                            </p>
                        </label>
                    </div>

                    {/* Photo Grid */}
                    {uploadedPhotos.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-64 overflow-y-auto custom-scrollbar">
                            {uploadedPhotos.map((photo, index) => (
                                <div
                                    key={index}
                                    className="group relative aspect-square rounded-lg overflow-hidden border-2 border-slate-200 bg-slate-100"
                                >
                                    <img
                                        src={photo}
                                        alt={`Upload ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removePhoto(index)}
                                        className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600 shadow-md"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-1.5">
                                        <p className="text-[10px] text-white font-medium">Photo {index + 1}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Confirmation Popup for Photography Support */}
            {showConfirmPopup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-5 space-y-4 animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center justify-center w-14 h-14 mx-auto rounded-full bg-primary-100">
                            <Camera className="w-7 h-7 text-primary-600" />
                        </div>

                        <div className="text-center space-y-1.5">
                            <h3 className="text-lg font-bold text-slate-900">Schedule Photography Support?</h3>
                            <p className="text-xs text-slate-600">
                                Our professional photography team will visit your location to capture high-quality images of your car.
                            </p>
                        </div>

                        <div className="bg-slate-50 rounded-xl p-3 space-y-2">
                            <div className="flex items-start gap-2.5">
                                <CheckCircle2 className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-xs font-semibold text-slate-900">Professional Quality</p>
                                    <p className="text-[10px] text-slate-500">High-resolution images that showcase your car</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-2.5">
                                <CheckCircle2 className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-xs font-semibold text-slate-900">Convenient Scheduling</p>
                                    <p className="text-[10px] text-slate-500">We'll coordinate a time that works for you</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-2.5">
                                <CheckCircle2 className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-xs font-semibold text-slate-900">No Extra Cost</p>
                                    <p className="text-[10px] text-slate-500">Included in your listing package</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2.5">
                            <button
                                type="button"
                                onClick={handleCancelPhotographySupport}
                                className="flex-1 px-4 py-2.5 rounded-xl border-2 border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmPhotographySupport}
                                style={{
                                    background: `linear-gradient(to right, var(--color-gradient-from), var(--color-gradient-to))`
                                }}
                                className="flex-1 px-4 py-2.5 rounded-xl text-white font-semibold text-xs shadow-md hover:shadow-lg transition-all"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Message for Photography Support */}
            {selectedOption === 'need-help' && !showConfirmPopup && (
                <div className="rounded-xl border-2 border-slate-200 bg-primary-50/40 p-3 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                        <p className="text-xs font-semibold text-primary-600">Photography Support Selected</p>
                        <p className="text-[10px] text-slate-800">
                            Our team will contact you shortly to schedule a photography session.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PhotosUpload;

