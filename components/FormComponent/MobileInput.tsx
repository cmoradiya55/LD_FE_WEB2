'use client';

import React from 'react';

import { Control, Controller, FieldError, RegisterOptions } from 'react-hook-form';

import { AlertCircle } from 'lucide-react';

interface MobileInputProps {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  label: string;
  placeholder?: string;
  required?: boolean;
  error?: FieldError;
  className?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  hideLabel?: boolean;
  inputClassName?: string;
  rules?: RegisterOptions;
}

const MobileInput: React.FC<MobileInputProps> = ({
  name,
  control,
  label,
  placeholder = '+1 (555) 000-0000',
  required = false,
  error,
  className = '',
  icon,
  disabled = false,
  hideLabel = false,
  inputClassName = 'px-4 py-3',
  rules,
}) => {
  const formatPhoneNumber = (value: string) => {
    const phoneNumber = value.replace(/\D/g, '');
    if (phoneNumber.length === 0) return '';
    if (phoneNumber.length <= 3) return `(${phoneNumber}`;
    if (phoneNumber.length <= 6) return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  };

  return (
    <div className={hideLabel ? className : `space-y-2 ${className}`}>
      {!hideLabel && (
        <label 
          htmlFor={name} 
          className={`block text-sm font-semibold flex items-center gap-2 ${
            disabled ? 'text-gray-500' : 'text-teal-700'
          }`}
        >
          {icon}
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <Controller
        name={name}
        control={control}
        rules={rules || (required ? { 
          required: `${label} is required`,
          pattern: {
            value: /^\([0-9]{3}\) [0-9]{3}-[0-9]{4}$/,
            message: 'Please enter a valid phone number'
          }
        } : undefined)}
        render={({ field }) => (
          <input
            {...field}
            value={field.value as string || ''}
            id={name}
            type="tel"
            placeholder={placeholder}
            disabled={disabled}
            onChange={(e) => {
              const formatted = formatPhoneNumber(e.target.value);
              field.onChange(formatted);
            }}
            className={`w-full border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 placeholder:text-gray-400 text-gray-900 ${
              disabled 
                ? 'bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed' 
                : error 
                  ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-100' 
                  : 'border-gray-200 bg-slate-100 focus:border-primary-500 focus:ring-primary-100 focus:bg-white'
            } ${inputClassName}`}
          />
        )}
      />
      {error && (
        <p className="text-red-500 text-xs flex items-center gap-1.5 mt-1">
          <AlertCircle className="w-3.5 h-3.5" />
          {error.message}
        </p>
      )}
    </div>
  );
};

export default MobileInput;
