import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface IngredientsSectionProps {
  onEditIngredients: () => void;
}

export const IngredientsSection = ({ onEditIngredients }: IngredientsSectionProps) => {
  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-md border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-[#2D3648]">Ingredients</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={onEditIngredients}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Ingredients
          </Button>
        </div>
      </div>
    </div>
  );
};