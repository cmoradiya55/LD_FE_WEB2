'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { dummyCars } from '@/lib/carData';
import { Button } from '@/components/Button/Button';
import {
  ArrowLeft,
  User,
  IndianRupee,
  Clock,
  CheckCircle,
  XCircle,
  Phone,
  MessageCircle,
  TrendingUp,
} from 'lucide-react';

export default function ManageBids() {
  const params = useParams();
  const router = useRouter();
  const car = dummyCars.find((c) => c.id === params.id);

  const [bids, setBids] = useState(car?.bids || []);

  if (!car) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Car not found</h2>
        <Button onClick={() => router.back()}>Go Back</Button>
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const handleAcceptBid = (bidId: string) => {
    setBids(
      bids.map((bid) =>
        bid.id === bidId ? { ...bid, status: 'accepted' as const } : bid
      )
    );
    alert('Bid accepted! Buyer will be notified.');
  };

  const handleRejectBid = (bidId: string) => {
    setBids(
      bids.map((bid) =>
        bid.id === bidId ? { ...bid, status: 'rejected' as const } : bid
      )
    );
  };

  const pendingBids = bids.filter((bid) => bid.status === 'pending');
  const acceptedBids = bids.filter((bid) => bid.status === 'accepted');
  const rejectedBids = bids.filter((bid) => bid.status === 'rejected');

  const highestBid = bids.length > 0
    ? Math.max(...bids.map((bid) => bid.amount))
    : 0;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Dashboard
      </button>

      {/* Car Info Header */}
      <div className="card mb-6">
        <div className="flex flex-col sm:flex-row gap-6">
          <img
            src={car.images[0]}
            alt={`${car.brand} ${car.model}`}
            className="w-full sm:w-48 h-32 object-cover rounded-lg"
          />
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {car.brand} {car.model}
            </h1>
            <p className="text-gray-600 mb-3">{car.variant}</p>
            <div className="flex flex-wrap gap-4 text-sm">
              <div>
                <span className="text-gray-600">Asking Price: </span>
                <span className="font-bold text-gray-900">
                  {formatPrice(car.price)}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Total Bids: </span>
                <span className="font-bold text-gray-900">{bids.length}</span>
              </div>
              <div>
                <span className="text-gray-600">Highest Bid: </span>
                <span className="font-bold text-green-600">
                  {formatPrice(highestBid)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                {pendingBids.length}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Accepted</p>
              <p className="text-2xl font-bold text-gray-900">
                {acceptedBids.length}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="bg-primary-100 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Highest Bid</p>
              <p className="text-xl font-bold text-gray-900">
                {formatPrice(highestBid)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Bids */}
      {pendingBids.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Pending Bids ({pendingBids.length})
          </h2>
          <div className="space-y-4">
            {pendingBids.map((bid) => (
              <div key={bid.id} className="card">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="bg-gray-100 p-3 rounded-full">
                      <User className="w-6 h-6 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {bid.buyerName}
                      </h3>
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <Clock className="w-4 h-4 mr-1" />
                        {formatDate(bid.timestamp)}
                      </div>
                      <div className="flex items-center">
                        <IndianRupee className="w-5 h-5 text-primary-600 mr-1" />
                        <span className="text-2xl font-bold text-gray-900">
                          {formatPrice(bid.amount)}
                        </span>
                        <span
                          className={`ml-3 text-sm ${
                            bid.amount >= car.price * 0.95
                              ? 'text-green-600'
                              : bid.amount >= car.price * 0.85
                              ? 'text-yellow-600'
                              : 'text-red-600'
                          }`}
                        >
                          {((bid.amount / car.price) * 100).toFixed(1)}% of asking
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <Button
                      onClick={() => handleAcceptBid(bid.id)}
                      className="flex items-center justify-center space-x-2"
                    >
                      <CheckCircle className="w-5 h-5" />
                      <span>Accept</span>
                    </Button>
                    <Button
                      onClick={() => handleRejectBid(bid.id)}
                      variant="ghost"
                      className="flex items-center justify-center space-x-2 text-red-600 hover:bg-red-50"
                    >
                      <XCircle className="w-5 h-5" />
                      <span>Reject</span>
                    </Button>
                    <Button variant="ghost" className="flex items-center justify-center space-x-2">
                      <Phone className="w-5 h-5" />
                      <span className="sm:hidden">Call</span>
                    </Button>
                    <Button variant="ghost" className="flex items-center justify-center space-x-2">
                      <MessageCircle className="w-5 h-5" />
                      <span className="sm:hidden">Chat</span>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Accepted Bids */}
      {acceptedBids.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Accepted Bids ({acceptedBids.length})
          </h2>
          <div className="space-y-4">
            {acceptedBids.map((bid) => (
              <div
                key={bid.id}
                className="card bg-green-50 border-green-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-green-100 p-3 rounded-full">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {bid.buyerName}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Bid: {formatPrice(bid.amount)}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="secondary" className="flex items-center space-x-2">
                      <Phone className="w-5 h-5" />
                      <span className="hidden sm:inline">Contact</span>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rejected Bids */}
      {rejectedBids.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Rejected Bids ({rejectedBids.length})
          </h2>
          <div className="space-y-4">
            {rejectedBids.map((bid) => (
              <div key={bid.id} className="card bg-gray-50 opacity-60">
                <div className="flex items-center space-x-4">
                  <div className="bg-gray-200 p-3 rounded-full">
                    <XCircle className="w-6 h-6 text-gray-500" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-700">{bid.buyerName}</h3>
                    <p className="text-sm text-gray-500">
                      Bid: {formatPrice(bid.amount)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Bids */}
      {bids.length === 0 && (
        <div className="card text-center py-16">
          <IndianRupee className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No bids yet
          </h3>
          <p className="text-gray-600">
            Your car is live. Buyers will start placing bids soon!
          </p>
        </div>
      )}
    </div>
  );
}

