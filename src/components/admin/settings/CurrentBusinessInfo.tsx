import React from 'react';

interface CurrentBusinessInfoProps {
  storeName: string;
  address: string;
}

export const CurrentBusinessInfo = ({ storeName, address }: CurrentBusinessInfoProps) => {
  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h3 className="text-lg font-medium mb-4">Current Information</h3>
      <div className="space-y-3">
        <div>
          <span className="font-medium">Business Name: </span>
          <span>{storeName}</span>
        </div>
        <div>
          <span className="font-medium">Business Address: </span>
          <span>{address}</span>
        </div>
      </div>
    </div>
  );
};