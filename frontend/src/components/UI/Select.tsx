import React from 'react';
import { clsx } from 'clsx';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
  icon?: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
  labelClassName?: string;
}

const Select: React.FC<SelectProps> = ({
  label,
  required = false,
  error,
  helperText,
  options,
  placeholder,
  icon,
  leftIcon,
  rightIcon,
  className,
  labelClassName,
  id,
  disabled = false,
  ...props
}) => {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
  const displayIcon = icon || leftIcon;

  return (
    <div className="space-y-2">
      {label && (
        <label 
          htmlFor={selectId}
          className={clsx("flex items-center text-sm font-medium text-gray-700", labelClassName)} 
        >
          {displayIcon && <span className="mr-2 text-gray-500">{displayIcon}</span>}
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}
      
      <div className="relative">
        {displayIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div className="h-5 w-5 text-gray-400">
              {displayIcon}
            </div>
          </div>
        )}
        
        <select
          id={selectId}
          disabled={disabled}
          className={clsx(
            'w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none bg-white',
            {
              'pl-10': displayIcon,
              'pr-10': rightIcon,
              'border-red-300 bg-red-50 focus:border-red-500': error,
              'border-gray-200 bg-white focus:border-blue-500 hover:border-gray-300': !error,
              'opacity-50 cursor-not-allowed bg-gray-100': disabled,
            },
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled className="text-gray-400">
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value} className="text-gray-900">
              {option.label}
            </option>
          ))}
        </select>
        
        {/* Custom dropdown arrow */}
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <svg 
            className={clsx(
              "h-5 w-5 transition-transform duration-200",
              {
                "text-gray-400": !disabled,
                "text-gray-300": disabled,
              }
            )}
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 20 20" 
            fill="currentColor"
            aria-hidden="true"
          >
            <path 
              fillRule="evenodd" 
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" 
              clipRule="evenodd" 
            />
          </svg>
        </div>
      </div>
      
      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <span className="w-1 h-1 bg-red-600 rounded-full"></span>
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p className="text-sm text-gray-500 flex items-center gap-1">
          <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
          {helperText}
        </p>
      )}
    </div>
  );
};

export default Select;