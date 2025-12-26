'use client';

import { useQuery } from '@tanstack/react-query';
import { Mail, Phone, Trash2Icon } from 'lucide-react';
import React, { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { getProfileData, sendDeleteAccountOtp, verifyDeleteAccountOtp } from '@/lib/auth';
import { Button } from '@/components/Button/Button';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';

const SettingsComponent = () => {
  const router = useRouter();
  const { user: authUser } = useAuth();

  const { data: profileResponse, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['GET_PROFILE_DATA'],
    queryFn: async () => {
      const response = await getProfileData();
      if (response?.code === 200) return response.data;
      return response?.data || response;
    },
    retry: false,
    refetchInterval: false,
    refetchOnWindowFocus: false,
    refetchOnMount: 'always',
  });

  const profile = useMemo(() => {
    if (!profileResponse) return null;
    if (profileResponse?.data) return profileResponse.data;
    return profileResponse;
  }, [profileResponse]);

  // Get mobile number from profile or auth user data (fallback to auth user from login)
  const getMobileNumber = useMemo(() => {
    const profilePhone = profile?.mobileNo?.toString() || profile?.mobile || profile?.phone || profile?.mobile_no;
    const profileCountryCode = profile?.countryCode || profile?.country_code;
    
    // Fallback to auth user data from login
    const authPhone = authUser?.mobile_no || authUser?.mobileNo || authUser?.mobile || authUser?.phone;
    const authCountryCode = authUser?.country_code || authUser?.countryCode;
    
    const phoneNumber = profilePhone || authPhone;
    const countryCode = profileCountryCode || authCountryCode || '91';
    
    if (phoneNumber) {
      // Format: +91 1234567890
      const formattedCode = countryCode.toString().startsWith('+') ? countryCode.toString() : `+${countryCode}`;
      return `${formattedCode} ${phoneNumber.toString()}`;
    }
    
    return 'Not provided';
  }, [profile, authUser]);

  const displayName = profile?.full_name || profile?.fullName || profile?.name || authUser?.name || 'Guest User';
  const displayPhone = getMobileNumber;
  const displayEmail = profile?.email || authUser?.email || 'Not provided';

  const [isDeleteOtpVisible, setIsDeleteOtpVisible] = useState(false);
  const [deleteOtp, setDeleteOtp] = useState<string[]>(['', '', '', '', '', '']);
  const deleteOtpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [deleteOtpError, setDeleteOtpError] = useState<string | null>(null);
  const [deleteOtpMessage, setDeleteOtpMessage] = useState<string | null>(null);
  const [isSendingDeleteOtp, setIsSendingDeleteOtp] = useState(false);
  const [isVerifyingDeleteOtp, setIsVerifyingDeleteOtp] = useState(false);

  const handleDeleteOtpChange = (index: number, value: string) => {
    const sanitized = value.replace(/\D/g, '').slice(0, 1);
    const nextOtp = [...deleteOtp];
    nextOtp[index] = sanitized;
    setDeleteOtp(nextOtp);

    if (sanitized && index < deleteOtp.length - 1) {
      deleteOtpRefs.current[index + 1]?.focus();
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteOtpError(null);
    setDeleteOtpMessage(null);
    setIsSendingDeleteOtp(true);

    const payload = {}; // adjust payload as per backend requirement
    const res = await sendDeleteAccountOtp(payload);

    if (res?.code === 200) {
      setIsDeleteOtpVisible(true);
      setDeleteOtp(['', '', '', '', '', '']);
      setDeleteOtpMessage(res?.message || 'OTP has been sent for account deletion.');
    } else {
      setDeleteOtpError(res?.message || 'Unable to send OTP. Please try again.');
    }

    setIsSendingDeleteOtp(false);
  };

  const handleCancelDelete = () => {
    setIsDeleteOtpVisible(false);
    setDeleteOtp(['', '', '', '', '', '']);
    setDeleteOtpError(null);
    setDeleteOtpMessage(null);
  };

  const handleConfirmDelete = async () => {
    const otp = deleteOtp.join('');
    setDeleteOtpError(null);
    setDeleteOtpMessage(null);

    if (otp.length !== 6) {
      setDeleteOtpError('Please enter the complete 6-digit OTP.');
      return;
    }

    setIsVerifyingDeleteOtp(true);
    const payload = { otp }; // adjust payload as per backend requirement
    const res = await verifyDeleteAccountOtp(payload);

    if (res?.code === 200) {
      setDeleteOtpMessage(res?.message || 'Account deleted successfully.');
      // Optionally redirect user after successful deletion
      // router.push('/');
    } else {
      setDeleteOtpError(res?.message || 'Unable to verify OTP. Please try again.');
    }

    setIsVerifyingDeleteOtp(false);
  };

  return (
    <>
      {/* Page header */}
      <div className="px-6 pt-6 pb-4 border-b border-gray-100">
        <h1 className="text-lg sm:text-xl font-semibold text-slate-900">Profile Settings</h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-500">
          Update your personal details and manage your account.
        </p>
      </div>

      {/* Content cards */}
      <div className="flex-1 px-4 sm:px-6 py-6 space-y-4">
        {/* Profile card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-sm sm:text-base font-semibold text-slate-900">
              {isLoadingProfile ? 'Loading profile...' : displayName}
            </h2>
            <div className="mt-3 space-y-2 text-xs sm:text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary-50">
                  <Phone className="w-4 h-4 text-primary-400" />
                </span>
                <span>{isLoadingProfile ? 'Fetching phone...' : displayPhone}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary-50">
                  <Mail className="w-4 h-4 text-primary-400" />
                </span>
                <span>{isLoadingProfile ? 'Fetching email...' : displayEmail}</span>
              </div>
            </div>
          </div>

          <Link
            href="/profile/settings/edit"
            className="self-start text-xs sm:text-sm font-medium text-blue-500 hover:text-blue-600"
          >
            Edit Profile
          </Link>
        </div>

        {/* Delete Account card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary-50">
                <Trash2Icon className="w-4 h-4 text-primary-400" />
              </span>
              <h2 className="text-sm sm:text-base font-semibold text-slate-900">Delete Account</h2>
            </div>
            <Button
              variant="secondary"
              className="flex items-center px-3 py-1.5 rounded-full border text-xs sm:text-sm font-medium text-red-600 hover:text-red-700 hover:border-red-200 hover:bg-red-50 transition-colors"
              onClick={handleDeleteAccount}
              disabled={isSendingDeleteOtp || isVerifyingDeleteOtp}
            >
              {isSendingDeleteOtp ? 'Sending OTP...' : 'Delete Account'}
            </Button>
          </div>

          {isDeleteOtpVisible && (
            <div className="mt-2 rounded-md border border-slate-100 bg-slate-50 px-3 py-3">
              <p className="text-[11px] font-medium text-slate-700 mb-1">Confirm with OTP</p>
              <p className="text-[11px] text-slate-500 mb-2">
                Enter the 6-digit OTP sent to your registered contact to permanently delete your account.
              </p>
              <div className="flex gap-1.5 mb-3">
                {deleteOtp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      deleteOtpRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleDeleteOtpChange(index, e.target.value)}
                    className="w-8 h-9 rounded-md border border-slate-200 bg-white text-center text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-300"
                  />
                ))}
              </div>
              {deleteOtpError && (
                <p className="mb-2 text-[11px] text-red-600">{deleteOtpError}</p>
              )}
              {deleteOtpMessage && (
                <p className="mb-2 text-[11px] text-emerald-600">{deleteOtpMessage}</p>
              )}
              <div className="flex items-center gap-3">
                <Button
                  variant="secondary"
                  className="px-2 py-1 text-[11px] font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md"
                  type="button"
                  onClick={handleConfirmDelete}
                  disabled={isVerifyingDeleteOtp}
                >
                  {isVerifyingDeleteOtp ? 'Deleting...' : 'Confirm Delete'}
                </Button>
                <Button
                  variant="ghost"
                  className="px-2 py-1 text-[11px] font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-md"
                  type="button"
                  onClick={handleCancelDelete}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SettingsComponent;