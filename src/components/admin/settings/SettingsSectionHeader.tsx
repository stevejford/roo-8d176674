import React from 'react';

interface SettingsSectionHeaderProps {
  title: string;
  description: string;
}

export const SettingsSectionHeader = ({ title, description }: SettingsSectionHeaderProps) => {
  return (
    <div className="mb-4">
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};