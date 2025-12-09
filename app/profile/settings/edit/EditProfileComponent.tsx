'use client';

import { Button } from '@/components/Button/Button';
import TextInput from '@/components/FormComponent/TextInput';
import MobileInput from '@/components/FormComponent/MobileInput';
import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Camera, Pencil, Trash, Trash2, Trash2Icon } from 'lucide-react';

type ProfileFormValues = {
  name: string;
  mobile: string;
  email: string;
};

const EditProfileComponent = () => {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    defaultValues: {
      name: 'Chirag Moradiya',
      mobile: '+91 9687348565',
      email: 'cmoradiya55@gmail.com',
    },
  });

  const onSubmit = (data: ProfileFormValues) => {
    // TODO: hook up API call here
    console.log('Profile data:', data);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Optionally, you can add file size/type validation here
    const imageUrl = URL.createObjectURL(file);
    setProfileImage((prev) => {
      if (prev) {
        URL.revokeObjectURL(prev);
      }
      return imageUrl;
    });
  };

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

  return (
    <>
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-gray-100">
        <h1 className="text-lg sm:text-xl font-semibold text-slate-900">Edit Profile</h1>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 sm:px-8 pb-6 pt-6 sm:pt-8 bg-slate-50/60">
        <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          
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

              {/* Small edit badge in bottom-right when photo exists */}
              {/* {profileImage && (
                <span className="absolute bottom-1 right-1 rounded-full bg-white/90 border border-slate-200 px-2 py-0.5 text-[10px] font-medium text-slate-700 shadow-sm">
                  Edit
                </span>
              )} */}
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
                  name="name"
                  control={control}
                  label="Name"
                  required
                  error={errors.name}
                  hideLabel
                  placeholder="Enter your name"
                  inputClassName="px-3.5 py-2.5 text-sm"
                />
              </div>

              {/* Mobile */}
              <div>
                <p className="text-[11px] font-medium text-primary-600 uppercase tracking-wide mb-1.5">Mobile Number</p>
                <MobileInput
                  name="mobile"
                  control={control}
                  label="Mobile Number"
                  required
                  error={errors.mobile}
                  hideLabel
                  placeholder="+91 9687348565"
                  inputClassName="px-3.5 py-2.5 text-sm"
                />
              </div>

              {/* Email */}
              <div>
                <p className="text-[11px] font-medium text-primary-600 uppercase tracking-wide mb-1.5">Email Id</p>
                <TextInput
                  name="email"
                  control={control}
                  type="email"
                  label="Email Id"
                  required
                  error={errors.email}
                  hideLabel
                  placeholder="you@example.com"
                  inputClassName="px-3.5 py-2.5 text-sm"
                />
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
              >
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditProfileComponent;

