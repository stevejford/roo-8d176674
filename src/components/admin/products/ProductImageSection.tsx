import React from 'react';
import { Label } from "@/components/ui/label";
import { ImageUpload } from './ImageUpload';

interface ProductImageSectionProps {
  imageUrl: string;
  onImageUploaded: (url: string) => void;
}

export const ProductImageSection = ({ imageUrl, onImageUploaded }: ProductImageSectionProps) => {
  return (
    <div className="grid gap-2">
      <Label>Image</Label>
      <ImageUpload
        currentImage={imageUrl}
        onImageUploaded={onImageUploaded}
      />
    </div>
  );
};