'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/Button/Button';
import TextInput from '@/components/FormComponent/TextInput';
import MobileInput from '@/components/FormComponent/MobileInput';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Camera, ChevronLeft, Pencil, Trash2Icon } from 'lucide-react';
import { getProfileData, updateProfileData, sendEmailOtp, verifyEmailOtp } from '@/lib/auth';
import { useRouter } from 'next/navigation';

type ProfileFormValues = {
  fullName: string;
  mobileNo: string;
  mobileNoCountryCode: string;
  email: string;
};

const EditProfileComponent = () => {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const updatePayloadRef = useRef<ProfileFormValues | null>(null);
  const queryClient = useQueryClient();
  const [serverStatus, setServerStatus] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [originalEmail, setOriginalEmail] = useState<string>('');
  const router = useRouter();
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    defaultValues: {
      fullName: '',
      mobileNo: '',
      mobileNoCountryCode: '+91',
      email: '',
    },
  });

  // Watch the email field to detect changes
  const currentEmail = watch('email');

  const {
    data: profileResponse,
    isFetching: isLoadingProfile,
  } = useQuery({
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

  useEffect(() => {
    if (!profileResponse) return;
    const profile = profileResponse?.data ? profileResponse.data : profileResponse;
    if (profile?.profileImage) {
      setProfileImage(profile.profileImage);
    }
    const emailValue = profile?.email || '';
    setOriginalEmail(emailValue);
    reset({
      fullName: profile?.fullName || profile?.name || '',
      mobileNo: profile?.mobileNo?.toString() || profile?.mobile || profile?.phone || '',
      mobileNoCountryCode: profile?.countryCode ? `+${profile.countryCode}` : '+91',
      email: emailValue,
    });
  }, [profileResponse, reset]);

  // Reset OTP state when email changes
  useEffect(() => {
    if (currentEmail && currentEmail !== originalEmail) {
      setIsEmailOtpVisible(false);
      setEmailOtp(['', '', '', '', '', '']);
      setEmailOtpError(null);
      setEmailOtpMessage(null);
    }
  }, [currentEmail, originalEmail]);

  const { isFetching: isUpdatingProfile, refetch: triggerProfileUpdate } = useQuery({
    queryKey: ['UPDATE_PROFILE_DATA'],
    queryFn: async () => {
      if (!updatePayloadRef.current) return null;
      const payload = {
        fullName: updatePayloadRef.current.fullName,
        email: updatePayloadRef.current.email,
        profileImage: profileImage ? profileImage : null,
      };
      const response = await updateProfileData(payload);
      return response;
    },
    enabled: false,
    retry: false,
    refetchInterval: false,
    refetchOnWindowFocus: false,
  });

  const isFormDisabled = isLoadingProfile || isUpdatingProfile;

  const onSubmit = async (data: ProfileFormValues) => {
    setServerError(null);
    setServerStatus(null);
    updatePayloadRef.current = data;
    const { data: response } = await triggerProfileUpdate();
    if (response?.code === 200) {
      setServerStatus('Profile updated successfully.');
      queryClient.invalidateQueries({ queryKey: ['GET_PROFILE_DATA'] });
    } else {
      setServerError(response?.message || 'Unable to update profile. Please try again.');
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setProfileImage((prev) => {
      if (prev) {
        URL.revokeObjectURL(prev);
      }
      return imageUrl;
    });
  };

  const [isEmailOtpVisible, setIsEmailOtpVisible] = useState(false);
  const [emailOtp, setEmailOtp] = useState<string[]>(['', '', '', '', '', '']);
  const emailOtpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [emailOtpMessage, setEmailOtpMessage] = useState<string | null>(null);
  const [emailOtpError, setEmailOtpError] = useState<string | null>(null);
  const sendEmailOtpPayloadRef = useRef<{ email: string } | null>(null);
  const verifyEmailOtpPayloadRef = useRef<{ email: string; otp: string } | null>(null);

  const {
    isFetching: isSendingEmailOtp,
    refetch: triggerSendEmailOtp,
  } = useQuery({
    queryKey: ['SEND_EMAIL_OTP'],
    queryFn: async () => {
      if (!sendEmailOtpPayloadRef.current) return null;
      const res = await sendEmailOtp(sendEmailOtpPayloadRef.current);
      return res;
    },
    enabled: false,
    retry: false,
    refetchInterval: false,
    refetchOnWindowFocus: false,
  });

  const {
    isFetching: isVerifyingEmailOtp,
    refetch: triggerVerifyEmailOtp,
  } = useQuery({
    queryKey: ['VERIFY_EMAIL_OTP'],
    queryFn: async () => {
      if (!verifyEmailOtpPayloadRef.current) return null;
      const res = await verifyEmailOtp(verifyEmailOtpPayloadRef.current);
      return res;
    },
    enabled: false,
    retry: false,
    refetchInterval: false,
    refetchOnWindowFocus: false,
  });

  const handleRemovePhoto = () => {
    setProfileImage((prev) => {
      if (prev) {
        URL.revokeObjectURL(prev);
      }
      return null;
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleEmailOtpChange = (index: number, value: string) => {
    const sanitized = value.replace(/\D/g, '').slice(0, 1);
    const nextOtp = [...emailOtp];
    nextOtp[index] = sanitized;
    setEmailOtp(nextOtp);

    // Auto-focus next input when a digit is entered
    if (sanitized && index < emailOtp.length - 1) {
      emailOtpRefs.current[index + 1]?.focus();
    }
  };

  const handleSendEmailOtp = async () => {
    const email = watch('email');
    setEmailOtpError(null);
    setEmailOtpMessage(null);

    if (!email) {
      setEmailOtpError('Please enter your email to receive OTP.');
      return;
    }

    sendEmailOtpPayloadRef.current = { email };
    const { data: res } = await triggerSendEmailOtp();

    if (res?.code === 200) {
      setIsEmailOtpVisible(true);
      setEmailOtp(['', '', '', '', '', '']);
      setEmailOtpMessage('OTP has been sent to your email.');
    } else {
      setEmailOtpError(res?.message || 'Unable to send OTP. Please try again.');
    }
  };

  const handleVerifyEmailOtp = async () => {
    const email = watch('email');
    const otp = emailOtp.join('');
    setEmailOtpError(null);
    setEmailOtpMessage(null);

    if (!email) {
      setEmailOtpError('Please enter your email to verify.');
      return;
    }

    if (otp.length !== 6) {
      setEmailOtpError('Please enter the complete 6-digit OTP.');
      return;
    }

    verifyEmailOtpPayloadRef.current = { email, otp };
    const { data: res } = await triggerVerifyEmailOtp();

    if (res?.code === 200) {
      setEmailOtpMessage('Email verified successfully.');
      setIsEmailOtpVisible(false);
      // Update original email to reflect the newly verified email
      setOriginalEmail(email);
      // Refresh profile data to reflect updated verification status
      queryClient.invalidateQueries({ queryKey: ['GET_PROFILE_DATA'] });
    } else {
      setEmailOtpError(res?.message || 'Unable to verify OTP. Please try again.');
    }
  };

  // Normalize profile data shape (API sometimes returns data at root or under .data)
  const profile = profileResponse?.data ? profileResponse.data : profileResponse;
  
  // Determine if email is verified - if email changed, it's automatically not verified
  const isEmailVerified = currentEmail && currentEmail === originalEmail 
    ? profile?.isEmailVerified 
    : false;

  return (
    <>
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-gray-100 flex items-center gap-2">

        <h1 className="text-lg sm:text-xl font-semibold text-slate-900">Edit Profile</h1>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 sm:px-8 py-4 bg-slate-50/60">

        {/* Back Button */}
        <Button
          variant="ghost"
          className="flex items-center px-1.5 py-1 rounded-full border text-base md:text-lg lg:text-xs font-medium hover:text-primary-600 transition-colors"
          onClick={() => router.push('/profile/settings')}
        >
          <ChevronLeft className="w-3.5 h-3.5 md:w-4 md:h-4" />
          Back
        </Button>

        <div className="max-w-xl mx-auto bg-white pb-6 rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Avatar */}
          <div className="px-6 pt-8 pb-6 flex flex-col items-center">
            <button
              type="button"
              onClick={handleAvatarClick}
              className="relative h-24 w-24 rounded-full bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center mb-3 overflow-hidden border border-slate-200 hover:border-primary-400 hover:shadow-md transition-all"
            >
              {profileImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profileImage}
                  alt="Profile avatar"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="flex flex-col items-center justify-center text-[11px] text-slate-500">
                  <Camera className="w-6 h-6 text-primary-400 mb-0.5" />
                  <span>+ Add photo</span>
                </span>
              )}

            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            <div className="mt-1 flex items-center gap-3 text-[11px]">
              <button
                type="button"
                onClick={handleAvatarClick}
                className="text-primary-600 flex items-center gap-1 hover:text-primary-700 font-medium"
              >
                <Pencil className="w-3.5 h-3.5 text-primary-600" />
                Change photo
              </button>
              {profileImage && (
                <>
                  <span className="h-3 w-px bg-slate-300" />
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="text-red-500 flex items-center gap-1 hover:text-red-600 font-medium"
                  >
                    <Trash2Icon className="w-3.5 h-3.5 text-red-500" />
                    Remove
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
            <div className="px-6 pb-5 space-y-3.5">
              {/* Name */}
              <div>
                <p className="text-[11px] font-medium text-primary-600 uppercase tracking-wide mb-1.5">Name</p>
                <TextInput
                  name="fullName"
                  control={control}
                  label="Name"
                  required
                  error={errors.fullName}
                  hideLabel
                  placeholder="Enter your name"
                  disabled={isFormDisabled}
                  inputClassName="px-3.5 py-2.5 text-sm"
                />
              </div>

              {/* Mobile */}
              <div>
                <p className="text-[11px] font-medium text-primary-600 uppercase tracking-wide mb-1.5">Mobile Number</p>
                <MobileInput
                  name="mobileNo"
                  control={control}
                  label="Mobile Number"
                  required
                  error={errors.mobileNo}
                  hideLabel
                  placeholder="9099XXXXXX"
                  disabled={true}
                  inputClassName="px-3.5 py-2.5 text-sm"
                  rules={{
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: 'Please enter a valid 10-digit mobile number'
                    }
                  }}
                />
                <p className="text-[10px] text-slate-500 mt-1">Mobile number cannot be changed</p>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <p className="text-[11px] font-medium text-primary-600 uppercase tracking-wide">Email Id</p>
                <TextInput
                  name="email"
                  control={control}
                  type="email"
                  label="Email Id"
                  required
                  error={errors.email}
                  hideLabel
                  placeholder="you@example.com"
                  disabled={isFormDisabled}
                  inputClassName="px-3.5 py-2.5 text-sm"
                />
                {/* Email verification status */}
                <div className="mt-1.5 space-y-2 rounded-md border border-slate-100 bg-slate-50 px-3 py-2">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-medium text-slate-700">Email verification</p>
                      <p className="text-[11px] text-slate-500">
                        We use this email for important updates and booking notifications.
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-3">
                      <span
                        className={`inline-flex items-center rounded-full mt-1 px-2 py-0.5 text-[11px] font-medium ring-1 ${isEmailVerified
                            ? 'bg-emerald-50 text-emerald-700 ring-emerald-100'
                            : 'bg-amber-50 text-amber-700 ring-amber-100'
                          }`}
                      >
                        <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-current" />
                        {isEmailVerified ? 'Verified' : 'Not verified'}
                      </span>
                      {!isEmailVerified && (
                        <Button
                          variant="secondary"
                          className="px-3 py-1 text-[9px] font-medium rounded-lg"
                          type="button"
                          onClick={handleSendEmailOtp}
                          disabled={isFormDisabled}
                        >
                          Send OTP
                        </Button>
                      )}
                    </div>
                  </div>

                  {!isEmailVerified && isEmailOtpVisible && (
                    <div className="pt-1 border-t border-slate-100">
                      <p className="mb-1.5 text-[11px] text-slate-500">
                        Enter the 6-digit OTP sent to your email.
                      </p>
                      <div className="flex gap-1.5 mb-2">
                        {emailOtp.map((digit, index) => (
                          <input
                            key={index}
                            ref={(el) => {
                              emailOtpRefs.current[index] = el;
                            }}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleEmailOtpChange(index, e.target.value)}
                            className="w-8 h-9 rounded-md border border-slate-200 bg-white text-center text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-300"
                          />
                        ))}
                      </div>
                      <div className="flex items-center gap-3">
                        <Button
                          variant="secondary"
                          className="px-2 py-1 text-[11px] font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-md"
                          type="button"
                          onClick={handleVerifyEmailOtp}
                          disabled={isFormDisabled}
                        >
                          Verify OTP
                        </Button>
                        <Button
                          variant="ghost"
                          className="px-2 py-1 text-[11px] font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-md"
                          type="button"
                          onClick={handleSendEmailOtp}
                          disabled={isFormDisabled}
                        >
                          Resend OTP
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer buttons */}
            <div className="border-t border-gray-100 px-6 py-4 flex items-center gap-3 mt-auto">
              <Button
                variant="secondary"
                className="flex-1"
                href="/profile/settings"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="flex-1"
                disabled={isFormDisabled}
              >
                {isUpdatingProfile ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
            {(serverStatus || serverError) && (
              <div className="px-6 pb-4 text-xs">
                {serverStatus && <p className="text-green-600">{serverStatus}</p>}
                {serverError && <p className="text-red-600">{serverError}</p>}
              </div>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default EditProfileComponent;

