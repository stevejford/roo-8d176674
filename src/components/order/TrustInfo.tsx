import React from 'react';

export const TrustInfo = () => {
  return (
    <div className="flex items-center justify-center mt-3 space-x-2 text-gray-500 text-xs">
      <span>Secure payment by</span>
      <svg 
        className="h-5" 
        viewBox="0 0 60 25" 
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
      >
        <path d="M59.64 14.28h-8.06v-1.84h8.06v1.84zm-8.06-3.67h8.06v1.84h-8.06v-1.84zm0 5.51h8.06v1.84h-8.06v-1.84zM53.64 8.9h-2.02v7.37h2.02V8.9zm4.03 0h-2.02v7.37h2.02V8.9zm-6.05 0h-2.02v7.37h2.02V8.9zm-4.02 0h-2.02v7.37h2.02V8.9zM39.58 8.9h-2.02v7.37h2.02V8.9zm-4.04 0h-2.02v7.37h2.02V8.9zm-6.04 0h-2.02v7.37h2.02V8.9zm-4.03 0h-2.02v7.37h2.02V8.9zM17.44 8.9h-2.02v7.37h2.02V8.9zm-4.03 0h-2.02v7.37h2.02V8.9zm-6.05 0H5.35v7.37h2.02V8.9zm-4.02 0H1.33v7.37h2.02V8.9z"/>
      </svg>
      <span>SSL encrypted</span>
    </div>
  );
};