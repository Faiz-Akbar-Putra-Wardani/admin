// components/common/Select.jsx
import React from 'react';
import { ChevronDown } from 'lucide-react';

const Select = ({ 
  label, 
  value, 
  onChange, 
  options = [], 
  placeholder = 'Select an option',
  required = false,
  error,
  className = '',
  ...props 
}) => {
  const baseClasses = 'w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white appearance-none cursor-pointer';
  const errorClasses = error ? 'border-red-500 focus:ring-red-500' : '';
  
  const selectClasses = `${baseClasses} ${errorClasses} ${className}`;

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-300">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          required={required}
          className={selectClasses}
          {...props}
        >
          <option value="" disabled className="text-gray-400">
            {placeholder}
          </option>
          {options.map((option) => (
            <option 
              key={typeof option === 'string' ? option : option.value} 
              value={typeof option === 'string' ? option : option.value}
              className="bg-gray-700 text-white"
            >
              {typeof option === 'string' ? option : option.label}
            </option>
          ))}
        </select>
        <ChevronDown 
          size={16} 
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" 
        />
      </div>
      
      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
    </div>
  );
};

export default Select;