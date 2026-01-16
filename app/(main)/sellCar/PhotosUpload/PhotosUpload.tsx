'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Upload, X, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';

interface PhotosUploadProps {
    setUploadedPhotoFiles: (files: File[]) => void;
    onSelectionChange?: (value: string) => void;
    onPhotosUploaded?: (count: number) => void;
    onPhotosChange?: (photos: string[]) => void;
}

const PhotosUpload: React.FC<PhotosUploadProps> = ({
    setUploadedPhotoFiles,
    onSelectionChange,
    onPhotosUploaded,
    onPhotosChange,
}) => {
    const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if(uploadedFiles.length > 0) onSelectionChange?.('upload-now');
    }, [uploadedFiles]);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const newFiles = Array.from(files);
        const previewUrls = newFiles.map((file) => URL.createObjectURL(file));

        try {
            setUploadError(null);
            const updatedPhotos = [...uploadedPhotos, ...previewUrls].slice(0, 20);
            const updatedFiles = [...uploadedFiles, ...newFiles].slice(0, 20);
            setUploadedPhotos(updatedPhotos);
            setUploadedFiles(updatedFiles);  // this is for current component to keep track of the uploaded files
            setUploadedPhotoFiles(updatedFiles); // this is for parent component to get the uploaded files
            onPhotosUploaded?.(updatedPhotos.length);
            toast.success("Photos uploaded successfully!");

        } catch (error: any) {
            previewUrls.forEach((url) => URL.revokeObjectURL(url));
            setUploadError(error?.message || 'An error occurred while uploading images. Please try again.');
            toast.error("Failed to upload photos");
        } finally {
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const removePhoto = (index: number) => {
        setUploadedPhotos((prev) => {
            URL.revokeObjectURL(prev[index]);
            const newPhotos = prev.filter((_, i) => i !== index);
            onPhotosUploaded?.(newPhotos.length);
            onPhotosChange?.(newPhotos);
            return newPhotos;
        });
        setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const clearAllPhotos = () => {
        uploadedPhotos.forEach((url) => URL.revokeObjectURL(url));
        setUploadedPhotos([]);
        setUploadedFiles([]);
        onPhotosUploaded?.(0);
        onPhotosChange?.([]);
    };

    return (
        <div className="space-y-3">
            {/* Upload Photos Section - Only show when Upload myself is selected */}
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
                            onClick={clearAllPhotos}
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

                {/* Upload Error Message */}
                {uploadError && (
                    <div className="rounded-xl border-2 border-red-200 bg-red-50/40 p-3 flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                            <p className="text-xs font-semibold text-red-600">Upload Error</p>
                            <p className="text-[10px] text-red-800">{uploadError}</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setUploadError(null)}
                            className="text-red-600 hover:text-red-700"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                )}

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
        </div>
    );
};

export default PhotosUpload;

