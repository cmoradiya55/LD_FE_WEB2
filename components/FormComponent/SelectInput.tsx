'use client';

import React from 'react';

import { Control, Controller, FieldError, RegisterOptions } from 'react-hook-form';

import { AlertCircle, ChevronDown } from 'lucide-react';

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectInputProps {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  label: string;
  options: SelectOption[];
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

const SelectInput: React.FC<SelectInputProps> = ({
  name,
  control,
  label,
  options,
  placeholder = 'Select an option',
  required = false,
  error,
  className = '',
  icon,
  disabled = false,
  hideLabel = false,
  inputClassName = 'px-4 py-3',
  rules,
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
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
      <div className="relative">
        <Controller
          name={name}
          control={control}
          rules={rules || (required ? { 
            required: `${label} is required`
          } : undefined)}
          render={({ field }) => (
            <select
              {...field}
              value={field.value as string || ''}
              id={name}
              disabled={disabled}
              className={`w-full border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-0.5 text-gray-900 appearance-none cursor-pointer ${
                disabled 
                  ? 'bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed' 
                  : error 
                    ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-100' 
                    : 'border-teal-200 bg-teal-50 focus:border-teal-500 focus:ring-teal-100 focus:bg-white'
              } ${inputClassName} pr-10`}
            >
              <option value="" disabled>
                {placeholder}
              </option>
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}
        />
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
      </div>
      {error && (
        <p className="text-red-500 text-sm flex items-center gap-2 mt-1">
          <AlertCircle className="w-4 h-4" />
          {error.message}
        </p>
      )}
    </div>
  );
};

export default SelectInput;
