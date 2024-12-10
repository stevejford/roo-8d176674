import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStripe } from '@fortawesome/free-brands-svg-icons';

export const TrustInfo = () => {
  return (
    <div className="flex items-center justify-center mt-3 space-x-2 text-gray-500 text-xs">
      <span>Secure payment powered by</span>
      <FontAwesomeIcon icon={faStripe} className="h-4" />
      <span>with SSL encryption</span>
    </div>
  );
};