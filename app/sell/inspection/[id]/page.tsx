'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export default function InspectionTrackingPage() {
  const params = useParams();
  const router = useRouter();

  // Mock inspection data
  const inspection = {
    carName: 'Honda City VX CVT 2020',
    status: 'scheduled', // pending, scheduled, in-progress, completed, approved
    scheduledDate: '2024-11-25',
    scheduledTime: '10:00 AM - 12:00 PM',
    location: 'AutoMarket Inspection Center, Andheri, Mumbai',
    inspector: 'Rajesh Kumar',
    inspectorPhone: '+91 98765 43210',
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      case 'scheduled':
        return 'text-blue-600 bg-blue-50';
      case 'in-progress':
        return 'text-purple-600 bg-purple-50';
      case 'completed':
        return 'text-green-600 bg-green-50';
      case 'approved':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const steps = [
    {
      title: 'Submitted',
      description: 'Car details submitted for review',
      status: 'completed',
      date: '2024-11-20',
    },
    {
      title: 'Inspection Scheduled',
      description: 'Inspection appointment confirmed',
      status: 'completed',
      date: '2024-11-21',
    },
    {
      title: 'Physical Inspection',
      description: '150-point quality check',
      status: 'scheduled',
      date: '2024-11-25',
    },
    {
      title: 'Valuation',
      description: 'Market price assessment',
      status: 'pending',
      date: '-',
    },
    {
      title: 'Listing Live',
      description: 'Car goes live on marketplace',
      status: 'pending',
      date: '-',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Dashboard
      </button>

      {/* Header */}
      <div className="card mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {inspection.carName}
            </h1>
            <p className="text-gray-600">Track your inspection status</p>
          </div>
          <span
            className={`px-4 py-2 rounded-full text-sm font-medium capitalize mt-4 sm:mt-0 ${getStatusColor(
              inspection.status
            )}`}
          >
            {inspection.status.replace('-', ' ')}
          </span>
        </div>
      </div>

      {/* Scheduled Inspection Card */}
      {inspection.status === 'scheduled' && (
        <div className="card mb-6 bg-gradient-to-br from-primary-50 to-blue-50 border-primary-200">
          <div className="flex items-start space-x-4">
            <div className="bg-primary-600 p-3 rounded-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Upcoming Inspection
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-gray-700">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>
                    <strong>Date:</strong> {inspection.scheduledDate}
                  </span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>
                    <strong>Time:</strong> {inspection.scheduledTime}
                  </span>
                </div>
                <div className="flex items-start text-gray-700">
                  <AlertCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Location:</strong> {inspection.location}
                  </span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-primary-200">
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Inspector:</strong> {inspection.inspector}
                </p>
                <a
                  href={`tel:${inspection.inspectorPhone}`}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  Call: {inspection.inspectorPhone}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Progress Timeline */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Inspection Progress
        </h2>

        <div className="space-y-6">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={`absolute left-6 top-12 w-0.5 h-12 ${
                    step.status === 'completed'
                      ? 'bg-green-500'
                      : 'bg-gray-200'
                  }`}
                />
              )}

              <div className="flex items-start space-x-4">
                {/* Icon */}
                <div
                  className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                    step.status === 'completed'
                      ? 'bg-green-100'
                      : step.status === 'scheduled' || step.status === 'in-progress'
                      ? 'bg-blue-100'
                      : 'bg-gray-100'
                  }`}
                >
                  {step.status === 'completed' ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : step.status === 'scheduled' || step.status === 'in-progress' ? (
                    <Clock className="w-6 h-6 text-blue-600" />
                  ) : (
                    <div className="w-3 h-3 rounded-full bg-gray-400" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pb-6">
                  <div className="flex items-center justify-between mb-1">
                    <h3
                      className={`font-semibold ${
                        step.status === 'pending'
                          ? 'text-gray-500'
                          : 'text-gray-900'
                      }`}
                    >
                      {step.title}
                    </h3>
                    {step.date !== '-' && (
                      <span className="text-sm text-gray-500">{step.date}</span>
                    )}
                  </div>
                  <p
                    className={`text-sm ${
                      step.status === 'pending'
                        ? 'text-gray-400'
                        : 'text-gray-600'
                    }`}
                  >
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Help Card */}
      <div className="card mt-6 bg-gray-50">
        <h3 className="font-semibold text-gray-900 mb-3">Need Help?</h3>
        <p className="text-sm text-gray-600 mb-4">
          If you have any questions about the inspection process, our support team
          is here to help.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button className="btn-secondary flex-1">Call Support</button>
          <button className="btn-ghost flex-1">Chat with Us</button>
        </div>
      </div>
    </div>
  );
}

