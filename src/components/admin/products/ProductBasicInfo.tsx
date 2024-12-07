import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ProductBasicInfoProps {
  title: string;
  description: string;
  price: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onPriceChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ProductBasicInfo = ({
  title,
  description,
  price,
  onTitleChange,
  onDescriptionChange,
  onPriceChange,
}: ProductBasicInfoProps) => {
  return (
    <>
      <div className="grid gap-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="price">Price ($)</Label>
        <Input
          id="price"
          type="text"
          value={price}
          onChange={onPriceChange}
          placeholder="0.00"
        />
      </div>
    </>
  );
};