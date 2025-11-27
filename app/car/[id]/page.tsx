'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { dummyCars } from '@/lib/dummyData';
import {
  ArrowLeft,
  Heart,
  Share2,
  Calendar,
  Gauge,
  Fuel,
  Settings,
  MapPin,
  FileText,
  CheckCircle,
  Eye,
  Phone,
  MessageCircle,
  IndianRupee,
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
} from 'lucide-react';
import Link from 'next/link';

export default function CarDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const car = dummyCars.find((c) => c.id === params.id);

  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(car?.isFavorite || false);
  const [showBidModal, setShowBidModal] = useState(false);
  const [bidAmount, setBidAmount] = useState('');
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);

  if (!car) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Car not found</h2>
        <Link href="/" className="btn-primary">
          Back to Browse
        </Link>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handlePlaceBid = () => {
    setShowBidModal(true);
  };

  const submitBid = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Bid placed successfully for ${formatPrice(parseInt(bidAmount))}!`);
    setShowBidModal(false);
    setBidAmount('');
  };

  const openImageModal = (index: number) => {
    setModalImageIndex(index);
    setShowImageModal(true);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
  };

  const nextImage = () => {
    setModalImageIndex((prev) => (prev + 1) % car.images.length);
  };

  const previousImage = () => {
    setModalImageIndex((prev) => (prev - 1 + car.images.length) % car.images.length);
  };

  // Keyboard navigation for image modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!showImageModal) return;
      
      if (e.key === 'Escape') {
        closeImageModal();
      } else if (e.key === 'ArrowRight') {
        nextImage();
      } else if (e.key === 'ArrowLeft') {
        previousImage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showImageModal, car.images.length]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Images & Details */}
        <div className="lg:col-span-2">
          {/* Main Image */}
          <div 
            className="relative w-full h-64 sm:h-96 bg-gray-200 rounded-2xl overflow-hidden mb-4 cursor-pointer group"
            onClick={() => openImageModal(selectedImage)}
          >
            <img
              src={car.images[selectedImage]}
              alt={`${car.brand} ${car.model}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />

            {/* Zoom icon overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
              <Maximize2 className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Verified Badge */}
            {car.inspectionStatus === 'approved' && (
              <div className="absolute top-4 right-4">
                <span className="badge-verified flex items-center space-x-1 text-sm">
                  <CheckCircle className="w-4 h-4" />
                  <span>Verified</span>
                </span>
              </div>
            )}
          </div>

          {/* Thumbnail Images */}
          <div className="flex space-x-3 mb-8 overflow-x-auto pb-2">
            {car.images.map((image, index) => (
              <button
                key={index}
                onClick={() => {
                  setSelectedImage(index);
                  openImageModal(index);
                }}
                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${
                  selectedImage === index
                    ? 'border-primary-600'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <img
                  src={image}
                  alt={`View ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>

          {/* Car Title & Info */}
          <div className="card mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  {car.brand} {car.model}
                </h1>
                <p className="text-lg text-gray-600">{car.variant}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="p-3 rounded-full border border-gray-200 hover:bg-gray-50"
                >
                  <Heart
                    className={`w-6 h-6 ${
                      isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
                    }`}
                  />
                </button>
                <button className="p-3 rounded-full border border-gray-200 hover:bg-gray-50">
                  <Share2 className="w-6 h-6 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Key Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                <Calendar className="w-6 h-6 text-primary-600 mb-2" />
                <span className="text-sm text-gray-600">Year</span>
                <span className="text-lg font-bold text-gray-900">{car.year}</span>
              </div>
              <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                <Gauge className="w-6 h-6 text-primary-600 mb-2" />
                <span className="text-sm text-gray-600">Kilometers</span>
                <span className="text-lg font-bold text-gray-900">
                  {(car.kmDriven / 1000).toFixed(0)}K
                </span>
              </div>
              <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                <Fuel className="w-6 h-6 text-primary-600 mb-2" />
                <span className="text-sm text-gray-600">Fuel</span>
                <span className="text-lg font-bold text-gray-900">{car.fuelType}</span>
              </div>
              <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                <Settings className="w-6 h-6 text-primary-600 mb-2" />
                <span className="text-sm text-gray-600">Transmission</span>
                <span className="text-lg font-bold text-gray-900">{car.transmission}</span>
              </div>
            </div>

            <div className="flex items-center justify-between py-4 border-t border-gray-200">
              <div className="flex items-center text-gray-600">
                <MapPin className="w-5 h-5 mr-2" />
                <span>{car.city}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Eye className="w-5 h-5 mr-2" />
                <span>{car.views} views</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="card mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
            <p className="text-gray-700 leading-relaxed">{car.description}</p>
          </div>

          {/* Features */}
          <div className="card mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Features</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {car.features.map((feature, index) => (
                <div key={index} className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Valuation Report */}
          {car.valuationPrice && (
            <div className="card mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    Valuation Report
                  </h2>
                  <p className="text-gray-600">
                    Professionally assessed value: {formatPrice(car.valuationPrice)}
                  </p>
                </div>
                <FileText className="w-12 h-12 text-primary-600" />
              </div>
              <button className="mt-4 btn-secondary w-full sm:w-auto">
                View Full Report
              </button>
            </div>
          )}
        </div>

        {/* Right Column - Pricing & Actions */}
        <div className="lg:col-span-1">
          <div className="sticky top-20">
            <div className="card mb-4">
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-2">Asking Price</p>
                <p className="text-3xl font-bold text-gray-900">
                  {formatPrice(car.price)}
                </p>
                <p className="text-sm text-gray-500 mt-1">{car.ownership}</p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handlePlaceBid}
                  className="w-full btn-primary flex items-center justify-center space-x-2"
                >
                  <IndianRupee className="w-5 h-5" />
                  <span>Place Bid</span>
                </button>

                <Link href="/book-test-visit" className="block">
                  <button className="w-full btn-secondary flex items-center justify-center space-x-2">
                    <Calendar className="w-5 h-5" />
                    <span>Book Test Visit</span>
                  </button>
                </Link>

                <button className="w-full btn-ghost flex items-center justify-center space-x-2">
                  <Phone className="w-5 h-5" />
                  <span>Call Seller</span>
                </button>

                <button className="w-full btn-ghost flex items-center justify-center space-x-2">
                  <MessageCircle className="w-5 h-5" />
                  <span>Chat</span>
                </button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-3">Why Trust Us?</h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Verified Inspection</p>
                    <p className="text-sm text-gray-600">
                      Professional 150-point check
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Transparent Pricing</p>
                    <p className="text-sm text-gray-600">Market-based valuation</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Secure Transaction</p>
                    <p className="text-sm text-gray-600">Protected payment process</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bid Modal */}
      {showBidModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 animate-slide-up">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Place Your Bid</h2>
            <p className="text-gray-600 mb-6">
              Asking price: {formatPrice(car.price)}
            </p>

            <form onSubmit={submitBid}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Bid Amount (₹)
                </label>
                <input
                  type="number"
                  className="input-field"
                  placeholder="Enter your bid"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  required
                  min={car.price * 0.7}
                  max={car.price}
                />
                <p className="text-xs text-gray-500 mt-2">
                  Bid range: {formatPrice(car.price * 0.7)} -{' '}
                  {formatPrice(car.price)}
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowBidModal(false)}
                  className="flex-1 btn-ghost"
                >
                  Cancel
                </button>
                <button type="submit" className="flex-1 btn-primary">
                  Submit Bid
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Image Gallery Modal */}
      {showImageModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center"
          onClick={closeImageModal}
        >
          <div className="relative w-full h-full flex items-center justify-center p-4">
            {/* Close Button */}
            <button
              onClick={closeImageModal}
              className="absolute top-4 right-4 z-10 bg-white bg-opacity-10 hover:bg-opacity-20 p-3 rounded-full transition-all"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Image Counter */}
            <div className="absolute top-4 left-4 z-10 bg-black bg-opacity-50 px-4 py-2 rounded-lg">
              <span className="text-white font-medium">
                {modalImageIndex + 1} / {car.images.length}
              </span>
            </div>

            {/* Previous Button */}
            {car.images.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  previousImage();
                }}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-10 hover:bg-opacity-20 p-3 rounded-full transition-all z-10"
              >
                <ChevronLeft className="w-8 h-8 text-white" />
              </button>
            )}

            {/* Next Button */}
            {car.images.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-10 hover:bg-opacity-20 p-3 rounded-full transition-all z-10"
              >
                <ChevronRight className="w-8 h-8 text-white" />
              </button>
            )}

            {/* Main Image */}
            <div 
              className="max-w-6xl max-h-full w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={car.images[modalImageIndex]}
                alt={`${car.brand} ${car.model} - Image ${modalImageIndex + 1}`}
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            </div>

            {/* Thumbnail Navigation */}
            {car.images.length > 1 && (
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 bg-black bg-opacity-50 p-3 rounded-lg max-w-full overflow-x-auto">
                {car.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      setModalImageIndex(index);
                    }}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      modalImageIndex === index
                        ? 'border-white scale-110'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Keyboard Hint */}
            <div className="absolute bottom-6 right-6 bg-black bg-opacity-50 px-3 py-2 rounded-lg">
              <p className="text-white text-xs">
                Use ← → keys or ESC to close
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

