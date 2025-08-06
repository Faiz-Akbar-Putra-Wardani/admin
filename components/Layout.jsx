"use client";
import React from 'react';

const Layout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {(title || subtitle) && (
          <div className="mb-8">
            {title && (
              <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
            )}
            {subtitle && (
              <p className="text-gray-400">{subtitle}</p>
            )}
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

export default Layout;

