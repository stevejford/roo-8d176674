import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, GripVertical } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import type { Product } from './types';

interface ProductCardProps {
  product: Product;
  dragHandleProps: any;
  onEdit: (product: Product) => void;
  onDelete?: (id: string) => void;
  showDragHandle?: boolean;
}

export const ProductCard = ({ 
  product, 
  dragHandleProps, 
  onEdit, 
  onDelete,
  showDragHandle = true 
}: ProductCardProps) => {
  const { toast } = useToast();

  const handleDelete = async () => {
    if (!onDelete) return;
    
    const confirmDelete = window.confirm(`Are you sure you want to delete "${product.title}"?`);
    if (!confirmDelete) return;

    try {
      onDelete(product.id);
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error",
        description: "Failed to delete product. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="bg-white">
      <CardContent className="flex items-center p-4">
        {showDragHandle && (
          <div {...dragHandleProps} className="cursor-grab mr-4">
            <GripVertical className="text-gray-400" />
          </div>
        )}
        
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
          {onDelete && (
            <Button
              variant="outline"
              size="icon"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};