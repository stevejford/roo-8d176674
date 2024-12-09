import React from 'react';
import { X } from "lucide-react";

interface ProductHeaderProps {
  title: string;
  image: string;
  onClose: () => void;
}

export const ProductHeader = ({ title, image, onClose }: ProductHeaderProps) => {
  return (
    <div className="relative">
      <button
        onClick={onClose}
        className="absolute right-4 top-4 z-10 p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
      >
        <X className="h-6 w-6 text-gray-500" />
      </button>
      <div className="aspect-square w-full">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
};