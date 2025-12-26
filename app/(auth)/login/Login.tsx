'use client';

import { useState } from 'react';
import { Car, ArrowLeft, Smartphone, Mail } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/Button/Button';
import { useAuth } from '@/components/providers/AuthProvider';
import PublicRoute from '@/components/Route/PublicRoute';

export default function Login() {
  const { sendOTP, login } = useAuth();
  const [step, setStep] = useState<'method' | 'otp'>('method');
  const [contact, setContact] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const result = await sendOTP(contact);
    
    if (result.success) {
      setStep('otp');
    } else {
      setError(result.error || 'Failed to send OTP');
    }
    
    setLoading(false);
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const result = await login(contact, otp);
    
    if (!result.success) {
      setError(result.error || 'Invalid OTP');
    }
    
    setLoading(false);
  };

  const handleResendOTP = async () => {
    setError('');
    setLoading(true);
    
    const result = await sendOTP(contact);
    
    if (result.success) {
      setOtp('');
    } else {
      setError(result.error || 'Failed to resend OTP');
    }
    
    setLoading(false);
  };

  return (
    <PublicRoute>
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center">
              <Image src="/logo.webp" alt="AutoMarket logo" width={80} height={80} priority />
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
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            {step === 'method' ? (
              <>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Login
                </h2>

                <form onSubmit={handleSendOTP}>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="9090909090"
                      className="input-field"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Sending...' : 'Send OTP'}
                  </Button>
                </form>

                <p className="mt-6 text-xs text-gray-500 text-center">
                  By continuing, you agree to our Terms of Service and Privacy Policy
                </p>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setStep('method');
                    setError('');
                    setOtp('');
                  }}
                  className="flex items-center text-primary-600 mb-6 hover:text-primary-700"
                  disabled={loading}
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
                      disabled={loading}
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Verifying...' : 'Verify & Continue'}
                  </Button>
                </form>

                <button
                  onClick={handleResendOTP}
                  className="w-full mt-4 text-sm text-primary-600 hover:text-primary-700 disabled:opacity-50"
                  disabled={loading}
                >
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
    </PublicRoute>
  );
}

