import React, { ButtonHTMLAttributes, InputHTMLAttributes } from 'react';

// Reusable standard button
export const Button: React.FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, className = '', ...props }) => {
  return (
    <button 
      className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Reusable standard input field
export const Input: React.FC<InputHTMLAttributes<HTMLInputElement>> = ({ className = '', ...props }) => {
  return (
    <input 
      className={`w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      {...props}
    />
  );
};