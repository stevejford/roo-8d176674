import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface ProductListHeaderProps {
  onAddCategory: () => void;
  onAddProduct: () => void;
}

export const ProductListHeader = ({ onAddCategory, onAddProduct }: ProductListHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold">Products</h2>
      <div className="space-x-2">
        <Button onClick={onAddCategory}>
          <Plus className="mr-2 h-4 w-4" /> Add Category
        </Button>
        <Button onClick={onAddProduct}>
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </div>
    </div>
  );
};