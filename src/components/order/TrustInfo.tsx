import React from 'react';

export const TrustInfo = () => {
  return (
    <div className="flex items-center justify-center mt-3 space-x-2 text-gray-500 text-xs">
      <span>Secure payment by</span>
      <svg 
        className="h-4" 
        viewBox="0 0 40 15" 
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
      >
        <path d="M2 2h36v3H2zM2 7h36v3H2zM2 12h36v3H2z"/>
      </svg>
      <span>SSL encrypted</span>
    </div>
  );
};