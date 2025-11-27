'use client';

import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  FileText,
  Download,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Calendar,
  Gauge,
} from 'lucide-react';

export default function ValuationPage() {
  const params = useParams();
  const router = useRouter();

  // Mock valuation data
  const valuation = {
    carName: 'Honda City VX CVT 2020',
    estimatedValue: 1280000,
    marketRange: {
      min: 1200000,
      max: 1350000,
    },
    inspectionDate: '2024-11-15',
    reportDate: '2024-11-16',
    factors: [
      {
        category: 'Exterior Condition',
        rating: 4.5,
        maxRating: 5,
        description: 'Excellent condition with minor scratches',
      },
      {
        category: 'Interior Condition',
        rating: 4.8,
        maxRating: 5,
        description: 'Well maintained, clean upholstery',
      },
      {
        category: 'Engine & Mechanical',
        rating: 4.6,
        maxRating: 5,
        description: 'Smooth performance, regular servicing',
      },
      {
        category: 'Electrical Systems',
        rating: 4.7,
        maxRating: 5,
        description: 'All features functional',
      },
      {
        category: 'Tires & Suspension',
        rating: 4.3,
        maxRating: 5,
        description: 'Good condition, 60% tread life',
      },
    ],
    marketComparison: [
      { label: 'Similar cars in your city', value: 1250000 },
      { label: 'National average', value: 1220000 },
      { label: 'Dealer price', value: 1450000 },
    ],
    positives: [
      'Single owner with complete service history',
      'Low mileage for the year',
      'Popular variant with good demand',
      'Well-maintained condition',
    ],
    considerations: [
      'Minor scratches on rear bumper',
      'Front tires may need replacement in 6 months',
    ],
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getRatingPercentage = (rating: number, maxRating: number) => {
    return (rating / maxRating) * 100;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back
      </button>

      {/* Header */}
      <div className="card mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Valuation Report
            </h1>
            <p className="text-gray-600">{valuation.carName}</p>
            <p className="text-sm text-gray-500 mt-1">
              Report Date: {valuation.reportDate}
            </p>
          </div>
          <button className="btn-secondary flex items-center space-x-2">
            <Download className="w-5 h-5" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* Estimated Value Card */}
      <div className="card mb-6 bg-gradient-to-br from-primary-50 to-blue-50 border-primary-200">
        <div className="text-center">
          <FileText className="w-12 h-12 text-primary-600 mx-auto mb-4" />
          <p className="text-sm text-gray-600 mb-2">Estimated Market Value</p>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {formatPrice(valuation.estimatedValue)}
          </h2>
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
            <span>Range:</span>
            <span className="font-medium">
              {formatPrice(valuation.marketRange.min)} -{' '}
              {formatPrice(valuation.marketRange.max)}
            </span>
          </div>
        </div>
      </div>

      {/* Condition Assessment */}
      <div className="card mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Condition Assessment
        </h2>
        <div className="space-y-4">
          {valuation.factors.map((factor, index) => (
            <div key={index}>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-900">{factor.category}</span>
                <span className="text-sm text-gray-600">
                  {factor.rating} / {factor.maxRating}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${getRatingPercentage(factor.rating, factor.maxRating)}%`,
                  }}
                />
              </div>
              <p className="text-sm text-gray-600">{factor.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Market Comparison */}
      <div className="card mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Market Comparison
        </h2>
        <div className="space-y-4">
          {valuation.marketComparison.map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
            >
              <span className="text-gray-700">{item.label}</span>
              <div className="flex items-center space-x-3">
                <span className="text-lg font-bold text-gray-900">
                  {formatPrice(item.value)}
                </span>
                {item.value < valuation.estimatedValue ? (
                  <TrendingUp className="w-5 h-5 text-green-600" />
                ) : item.value > valuation.estimatedValue ? (
                  <TrendingDown className="w-5 h-5 text-red-600" />
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Positives & Considerations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        {/* Positives */}
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
            Strengths
          </h3>
          <ul className="space-y-2">
            {valuation.positives.map((item, index) => (
              <li key={index} className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span className="text-sm text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Considerations */}
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
            <FileText className="w-5 h-5 text-yellow-600 mr-2" />
            Considerations
          </h3>
          <ul className="space-y-2">
            {valuation.considerations.map((item, index) => (
              <li key={index} className="flex items-start">
                <span className="text-yellow-600 mr-2">•</span>
                <span className="text-sm text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Action Card */}
      <div className="card bg-green-50 border-green-200">
        <div className="flex items-start space-x-4">
          <div className="bg-green-100 p-3 rounded-lg">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-2">
              Ready to List Your Car?
            </h3>
            <p className="text-sm text-gray-700 mb-4">
              Your car has been approved and is ready to go live. Set your asking
              price and start receiving bids from interested buyers.
            </p>
            <button className="btn-primary">List My Car Now</button>
          </div>
        </div>
      </div>
    </div>
  );
}

