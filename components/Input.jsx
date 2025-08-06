// components/common/Input.jsx
import React from 'react';

const Input = ({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  placeholder, 
  required = false,
  error,
  icon: Icon,
  className = '',
  ...props 
}) => {
  const baseClasses = 'w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400';
  const errorClasses = error ? 'border-red-500 focus:ring-red-500' : '';
  const iconClasses = Icon ? 'pl-10' : '';
  
  const inputClasses = `${baseClasses} ${errorClasses} ${iconClasses} ${className}`;

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-300">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {Icon && (
          <Icon 
            size={16} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
          />
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={inputClasses}
          {...props}
        />
      </div>
      
      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
    </div>
  );
};

export default Input;