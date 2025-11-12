import React, { useState } from 'react';
import { clsx } from 'clsx';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  type?: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  placeholder?: string;
  register?: any; // For react-hook-form compatibility
  className?: string;
  labelClassName?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  type = "text",
  required = false,
  error,
  helperText,
  icon,
  leftIcon,
  rightIcon,
  placeholder,
  register,
  className,
  labelClassName,
  id,
  disabled = false,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const displayIcon = icon || leftIcon;
  
  // State for password visibility
  const [showPassword, setShowPassword] = useState(false);
  
  // Determine the actual input type
  const getInputType = () => {
    if (type === 'password') {
      return showPassword ? 'text' : 'password';
    }
    return type;
  };
  
  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Password visibility toggle icon
  const passwordToggleIcon = type === 'password' ? (
    <button
      type="button"
      onClick={togglePasswordVisibility}
      className="p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 rounded"
      tabIndex={-1} // Prevent tab focus on the toggle button
    >
      {showPassword ? (
        <EyeOff className="h-4 w-4" />
      ) : (
        <Eye className="h-4 w-4" />
      )}
    </button>
  ) : null;

  return (
    <div className="space-y-2">
      <label 
        htmlFor={inputId}
        className={clsx("flex items-center text-sm font-medium text-gray-700", labelClassName)} 
      >
        {displayIcon && <span className="mr-2 text-gray-500">{displayIcon}</span>}
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      
      <div className="relative">
        {displayIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div className="h-5 w-5 text-gray-400">
              {displayIcon}
            </div>
          </div>
        )}
        
        <input
          id={inputId}
          type={getInputType()}
          placeholder={placeholder}
          disabled={disabled}
          defaultValue={props.defaultValue}
          className={clsx(
            'w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 placeholder:text-gray-400 placeholder:opacity-70',
            {
              'pl-10': displayIcon,
              'pr-10': rightIcon || passwordToggleIcon,
              'border-red-300 bg-red-50 focus:border-red-500': error,
              'border-gray-200 bg-white focus:border-blue-500 hover:border-gray-300': !error,
              'opacity-50 cursor-not-allowed bg-gray-100': disabled,
            },
            className
          )}
          {...(register ? register : {})}
          {...props}
        />
        
        {/* Password toggle button or custom right icon */}
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          {passwordToggleIcon || rightIcon}
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

export default Input;