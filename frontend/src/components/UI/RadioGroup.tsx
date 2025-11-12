import React from 'react';

interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
  className?: string;
}

interface RadioGroupProps {
  label: string;
  options: RadioOption[];
  required?: boolean;
  register: any;
  error?: string;
  name?: string;
  columns?: 1 | 2 | 3;
  disabled?:boolean;
}

const RadioGroup: React.FC<RadioGroupProps> = ({ 
  label, 
  options, 
  required = false, 
  register, 
  error,
  disabled,
  columns = 1
}) => {
  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      
      <div  className={`grid ${gridClasses[columns]} gap-3`}>
        {options.map((option) => (
          <label 
            key={option.value} 
            className={`
              flex items-center gap-3 p-3 rounded-lg border transition-colors
              ${option.disabled 
                ? 'bg-gray-50 border-gray-200 cursor-not-allowed opacity-60' 
                : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50 cursor-pointer'
              }
              ${option.className || ''}
            `}
          >
            <input

              type="radio"
              value={option.value}
              disabled={option.disabled || disabled}
              {...register}
              className={`
                w-4 h-4 text-blue-600 border-2 focus:ring-blue-500 focus:ring-2 transition-colors flex-shrink-0
                ${option.disabled 
                  ? 'border-gray-300 bg-gray-100 cursor-not-allowed' 
                  : 'border-gray-300 hover:border-blue-400'
                }
              `}
            />
            <span className={`
              text-sm transition-colors
              ${option.disabled 
                ? 'text-gray-500' 
                : 'text-gray-700 group-hover:text-gray-900'
              }
            `}>
              {option.label}
            </span>
          </label>
        ))}
      </div>
      
      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1 mt-2">
          <span className="w-1 h-1 bg-red-600 rounded-full flex-shrink-0"></span>
          {error}
        </p>
      )}
    </div>
  );
};

export default RadioGroup;