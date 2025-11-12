import React, { useRef, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

interface OtpInputProps {
  name: string;
  length?: number;
  required?: boolean;
  error?: string;
  className?: string;
  focusColor?: string;
  filledColor?: string;
}

const OtpInput: React.FC<OtpInputProps> = ({ 
  name, 
  length = 6, 
  required = true,
  error,
  className = '',
  focusColor = 'indigo',
  filledColor = 'indigo'
}) => {
  const { register, setValue, watch } = useFormContext();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const otpValues = watch(name) || Array(length).fill('');

  useEffect(() => {
    // Initialize the array in form data if not present
    if (!watch(name)) {
      setValue(name, Array(length).fill(''));
    }
  }, [name, length, setValue, watch]);

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    const numericValue = value.replace(/[^0-9]/g, '');
    
    if (numericValue) {
      const newOtpValues = [...otpValues];
      newOtpValues[index] = numericValue;
      setValue(name, newOtpValues);

      // Auto-focus next input
      if (index < length - 1 && numericValue) {
        inputRefs.current[index + 1]?.focus();
      }
    } else {
      const newOtpValues = [...otpValues];
      newOtpValues[index] = '';
      setValue(name, newOtpValues);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      // Move to previous input on backspace
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, length);
    
    const newOtpValues = [...otpValues];
    pasteData.split('').forEach((char, index) => {
      if (index < length) {
        newOtpValues[index] = char;
      }
    });
    
    setValue(name, newOtpValues);
    
    // Focus the last filled input
    const lastFilledIndex = Math.min(pasteData.length - 1, length - 1);
    inputRefs.current[lastFilledIndex]?.focus();
  };

  // Color mapping for focus and filled states
  const colorClasses = {
    indigo: {
      focus: 'focus:border-indigo-500 focus:ring-indigo-200',
      filled: 'border-indigo-400 bg-indigo-50'
    },
    emerald: {
      focus: 'focus:border-emerald-500 focus:ring-emerald-200',
      filled: 'border-emerald-400 bg-emerald-50'
    },
    blue: {
      focus: 'focus:border-blue-500 focus:ring-blue-200',
      filled: 'border-blue-400 bg-blue-50'
    },
    green: {
      focus: 'focus:border-green-500 focus:ring-green-200',
      filled: 'border-green-400 bg-green-50'
    },
    teal: {
      focus: 'focus:border-teal-500 focus:ring-teal-200',
      filled: 'border-teal-400 bg-teal-50'
    }
  };

  const getFocusClasses = () => colorClasses[focusColor as keyof typeof colorClasses]?.focus || colorClasses.indigo.focus;
  const getFilledClasses = () => colorClasses[filledColor as keyof typeof colorClasses]?.filled || colorClasses.indigo.filled;

  return (
    <div className={`space-y-3 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        Verification Code {required && '*'}
      </label>
      
      <div className="flex justify-center space-x-3">
        {Array.from({ length }).map((_, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            className={`w-12 h-12 text-center text-lg font-semibold border-2 rounded-lg outline-none transition-colors ${
              error ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : `border-gray-300 ${getFocusClasses()}`
            } ${otpValues[index] ? getFilledClasses() : ''}`}
            value={otpValues[index] || ''}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={index === 0 ? handlePaste : undefined}
            autoComplete="one-time-code"
          />
        ))}
      </div>

      {/* Hidden input for form validation */}
      <input
        type="hidden"
        {...register(name, {
          required: required ? 'Verification code is required' : false,
          validate: {
            complete: (value) => {
              const otpString = (value || []).join('');
              return otpString.length === length || `Code must be ${length} digits`;
            },
            numeric: (value) => {
              const otpString = (value || []).join('');
              return /^\d*$/.test(otpString) || 'Code must contain only numbers';
            }
          }
        })}
      />

      {error && (
        <p className="text-sm text-red-600 mt-1">{error}</p>
      )}
    </div>
  );
};

export default OtpInput;