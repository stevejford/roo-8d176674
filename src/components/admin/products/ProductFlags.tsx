import React from 'react';
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface ProductFlagsProps {
  isPopular: boolean;
  isComplementary: boolean;
  onPopularChange: (checked: boolean) => void;
  onComplementaryChange: (checked: boolean) => void;
}

export const ProductFlags = ({
  isPopular,
  isComplementary,
  onPopularChange,
  onComplementaryChange,
}: ProductFlagsProps) => {
  return (
    <>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="is_popular"
          checked={isPopular}
          onCheckedChange={(checked) => onPopularChange(checked as boolean)}
        />
        <Label htmlFor="is_popular">Popular Item</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="is_complementary"
          checked={isComplementary}
          onCheckedChange={(checked) => onComplementaryChange(checked as boolean)}
        />
        <Label htmlFor="is_complementary">Complementary Item</Label>
      </div>
    </>
  );
};