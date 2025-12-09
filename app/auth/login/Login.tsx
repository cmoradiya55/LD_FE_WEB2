'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Car, ArrowLeft, Smartphone, Mail } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/Button/Button';

export default function Login() {
  const router = useRouter();
  const [step, setStep] = useState<'method' | 'otp'>('method');
  const [method, setMethod] = useState<'phone' | 'email'>('phone');
  const [contact, setContact] = useState('');
  const [otp, setOtp] = useState('');

  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('otp');
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, verify OTP here
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center bg-primary-600 p-4 rounded-2xl mb-4">
            <Car className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to AutoMarket
          </h1>
          <p className="text-gray-600">
            Your trusted platform to buy & sell cars
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {step === 'method' ? (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Login or Sign Up
              </h2>

              {/* Method Selector */}
              <div className="flex space-x-4 mb-6">
                <button
                  onClick={() => setMethod('phone')}
                  className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${
                    method === 'phone'
                      ? 'border-primary-600 bg-primary-50 text-primary-600'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <Smartphone className="w-6 h-6 mx-auto mb-1" />
                  <span className="text-sm font-medium">Phone</span>
                </button>
                <button
                  onClick={() => setMethod('email')}
                  className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${
                    method === 'email'
                      ? 'border-primary-600 bg-primary-50 text-primary-600'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <Mail className="w-6 h-6 mx-auto mb-1" />
                  <span className="text-sm font-medium">Email</span>
                </button>
              </div>

              <form onSubmit={handleSendOTP}>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {method === 'phone' ? 'Phone Number' : 'Email Address'}
                  </label>
                  <input
                    type={method === 'phone' ? 'tel' : 'email'}
                    placeholder={
                      method === 'phone'
                        ? '+91 98765 43210'
                        : 'you@example.com'
                    }
                    className="input-field"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" className="w-full">
                  Send OTP
                </Button>
              </form>

              <p className="mt-6 text-xs text-gray-500 text-center">
                By continuing, you agree to our Terms of Service and Privacy Policy
              </p>
            </>
          ) : (
            <>
              <button
                onClick={() => setStep('method')}
                className="flex items-center text-primary-600 mb-6 hover:text-primary-700"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back
              </button>

              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Verify OTP
              </h2>
              <p className="text-gray-600 mb-6">
                We've sent a 6-digit code to{' '}
                <span className="font-medium text-gray-900">{contact}</span>
              </p>

              <form onSubmit={handleVerifyOTP}>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter OTP
                  </label>
                  <input
                    type="text"
                    placeholder="000000"
                    maxLength={6}
                    className="input-field text-center text-2xl tracking-widest"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    required
                  />
                </div>

                <Button type="submit" className="w-full">
                  Verify & Continue
                </Button>
              </form>

              <button className="w-full mt-4 text-sm text-primary-600 hover:text-primary-700">
                Resend OTP
              </button>
            </>
          )}
        </div>

        {/* Footer Link */}
        <div className="text-center mt-6">
          <Link href="/" className="text-sm text-gray-600 hover:text-primary-600">
            Continue browsing without login →
          </Link>
        </div>
      </div>
    </div>
  );
}

