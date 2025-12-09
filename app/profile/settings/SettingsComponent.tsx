import { Mail, Phone } from 'lucide-react';
import React from 'react';
import Link from 'next/link';

const SettingsComponent = () => {
  return (
    <>
      {/* Page header */}
      <div className="px-6 pt-6 pb-4 border-b border-gray-100">
        <h1 className="text-lg sm:text-xl font-semibold text-slate-900">Profile Settings</h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-500">
          Update your personal details and manage your address book.
        </p>
      </div>

      {/* Content cards */}
      <div className="flex-1 px-4 sm:px-6 py-6 space-y-4">
        {/* Profile card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-sm sm:text-base font-semibold text-slate-900">Chirag Moradiya</h2>
            <div className="mt-3 space-y-2 text-xs sm:text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary-50">
                  <Phone className="w-4 h-4 text-primary-400" />
                </span>
                <span>+91 9658743205</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary-50">
                  <Mail className="w-4 h-4 text-primary-400" />
                </span>
                <span>yourname@gmail.com</span>
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

        {/* Address Book card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm sm:text-base font-semibold text-slate-900">Address Book</h2>
            <button className="text-xs sm:text-sm font-medium text-blue-500 hover:text-blue-600">
              Add Address
            </button>
          </div>
          <p className="mt-4 text-xs sm:text-sm text-slate-400">No Address Added</p>
        </div>
      </div>
    </>
  );
};

export default SettingsComponent;