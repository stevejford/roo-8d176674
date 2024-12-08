import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Category } from './types';

interface ProductCategorySelectProps {
  selectedCategoryId: string;
  categories: Category[];
  onCategoryChange: (value: string) => void;
}

export const ProductCategorySelect = ({
  selectedCategoryId,
  categories,
  onCategoryChange,
}: ProductCategorySelectProps) => {
  return (
    <div className="grid gap-2">
      <Label htmlFor="category">Category</Label>
      <Select value={selectedCategoryId} onValueChange={onCategoryChange}>
        <SelectTrigger className="bg-white">
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          {categories?.map((category: Category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};