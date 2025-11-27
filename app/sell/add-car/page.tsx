'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Upload,
  X,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { brands, cities } from '@/lib/dummyData';

export default function AddCarPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [images, setImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    variant: '',
    year: '',
    kmDriven: '',
    ownership: '1st Owner',
    fuelType: 'Petrol',
    transmission: 'Manual',
    city: '',
    description: '',
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
      setImages([...images, ...newImages].slice(0, 10));
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Submit form
      alert('Car submitted for inspection!');
      router.push('/sell/inspection/new-listing');
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>
        <div className="flex items-center space-x-2">
          {[1, 2, 3].map((num) => (
            <div
              key={num}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === num
                  ? 'bg-primary-600 text-white'
                  : step > num
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {step > num ? <CheckCircle className="w-5 h-5" /> : num}
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {step === 1 && 'Basic Information'}
          {step === 2 && 'Upload Photos & Documents'}
          {step === 3 && 'Review & Submit'}
        </h1>
        <p className="text-gray-600 mb-6">
          {step === 1 && 'Tell us about your car'}
          {step === 2 && 'Add photos and service history'}
          {step === 3 && 'Confirm your listing details'}
        </p>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Brand *
                  </label>
                  <select
                    className="input-field"
                    value={formData.brand}
                    onChange={(e) => updateFormData('brand', e.target.value)}
                    required
                  >
                    <option value="">Select Brand</option>
                    {brands.map((brand) => (
                      <option key={brand} value={brand}>
                        {brand}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Model *
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g., City"
                    value={formData.model}
                    onChange={(e) => updateFormData('model', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Variant *
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g., VX CVT"
                    value={formData.variant}
                    onChange={(e) => updateFormData('variant', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Year *
                  </label>
                  <input
                    type="number"
                    className="input-field"
                    placeholder="e.g., 2020"
                    min="2000"
                    max={new Date().getFullYear()}
                    value={formData.year}
                    onChange={(e) => updateFormData('year', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    KM Driven *
                  </label>
                  <input
                    type="number"
                    className="input-field"
                    placeholder="e.g., 32000"
                    value={formData.kmDriven}
                    onChange={(e) => updateFormData('kmDriven', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ownership *
                  </label>
                  <select
                    className="input-field"
                    value={formData.ownership}
                    onChange={(e) => updateFormData('ownership', e.target.value)}
                    required
                  >
                    <option value="1st Owner">1st Owner</option>
                    <option value="2nd Owner">2nd Owner</option>
                    <option value="3rd Owner">3rd Owner</option>
                    <option value="4th Owner">4th Owner</option>
                    <option value="5+ Owner">5+ Owner</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fuel Type *
                  </label>
                  <select
                    className="input-field"
                    value={formData.fuelType}
                    onChange={(e) => updateFormData('fuelType', e.target.value)}
                    required
                  >
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="CNG">CNG</option>
                    <option value="Electric">Electric</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Transmission *
                  </label>
                  <select
                    className="input-field"
                    value={formData.transmission}
                    onChange={(e) => updateFormData('transmission', e.target.value)}
                    required
                  >
                    <option value="Manual">Manual</option>
                    <option value="Automatic">Automatic</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <select
                    className="input-field"
                    value={formData.city}
                    onChange={(e) => updateFormData('city', e.target.value)}
                    required
                  >
                    <option value="">Select City</option>
                    {cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    className="input-field"
                    rows={4}
                    placeholder="Tell buyers about your car's condition, features, etc."
                    value={formData.description}
                    onChange={(e) => updateFormData('description', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Images & Documents */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Car Photos (Max 10) *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-500 transition-colors">
                  <input
                    type="file"
                    id="images"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <label htmlFor="images" className="cursor-pointer">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-700 font-medium mb-1">
                      Click to upload images
                    </p>
                    <p className="text-sm text-gray-500">
                      PNG, JPG up to 10MB each
                    </p>
                  </label>
                </div>

                {images.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        {index === 0 && (
                          <span className="absolute bottom-2 left-2 bg-primary-600 text-white text-xs px-2 py-1 rounded">
                            Cover
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service History (PDF/JPG)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors">
                  <input
                    type="file"
                    id="documents"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                  />
                  <label htmlFor="documents" className="cursor-pointer">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-700">
                      Upload service records (optional)
                    </p>
                  </label>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-900">
                  <p className="font-medium mb-1">Pro Tip</p>
                  <p>
                    Photos with good lighting and multiple angles get 3x more interest!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Car Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Brand & Model</p>
                    <p className="font-medium text-gray-900">
                      {formData.brand} {formData.model}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Variant</p>
                    <p className="font-medium text-gray-900">{formData.variant}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Year</p>
                    <p className="font-medium text-gray-900">{formData.year}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">KM Driven</p>
                    <p className="font-medium text-gray-900">
                      {parseInt(formData.kmDriven).toLocaleString()} km
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Fuel Type</p>
                    <p className="font-medium text-gray-900">{formData.fuelType}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Transmission</p>
                    <p className="font-medium text-gray-900">
                      {formData.transmission}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">City</p>
                    <p className="font-medium text-gray-900">{formData.city}</p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-green-900">
                    <p className="font-medium mb-2">What happens next?</p>
                    <ol className="list-decimal list-inside space-y-1">
                      <li>Your listing will be reviewed within 24 hours</li>
                      <li>Our team will schedule an inspection</li>
                      <li>After valuation, your car goes live automatically</li>
                      <li>You'll receive bids from interested buyers</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="btn-ghost"
              >
                Previous
              </button>
            )}
            <button
              type="submit"
              className={`btn-primary ${step === 1 ? 'ml-auto' : ''}`}
            >
              {step === 3 ? 'Submit for Review' : 'Next'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

