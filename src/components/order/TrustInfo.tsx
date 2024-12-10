import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStripe } from '@fortawesome/free-brands-svg-icons';

export const TrustInfo = () => {
  return (
    <div className="flex items-center justify-center mt-3 gap-1.5 text-gray-500 text-xs">
      <span>Secure payment powered by</span>
      <FontAwesomeIcon icon={faStripe} className="h-5 -mt-0.5" />
      <span>with SSL encryption</span>
    </div>
  );
};