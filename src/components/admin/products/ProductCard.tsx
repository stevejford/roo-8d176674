import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, GripVertical } from "lucide-react";
import type { Product } from './types';

interface ProductCardProps {
  product: Product;
  dragHandleProps: any;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export const ProductCard = ({ product, dragHandleProps, onEdit, onDelete }: ProductCardProps) => {
  return (
    <Card className="bg-white">
      <CardContent className="flex items-center p-4">
        <div {...dragHandleProps} className="mr-4">
          <GripVertical className="text-gray-400" />
        </div>
        
        {product.image_url && (
          <img
            src={product.image_url}
            alt={product.title}
            className="w-16 h-16 object-cover rounded mr-4"
          />
        )}
        
        <div className="flex-1">
          <h3 className="font-semibold">{product.title}</h3>
          <p className="text-sm text-gray-500 line-clamp-1">
            {product.description}
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onEdit(product)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onDelete(product.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};