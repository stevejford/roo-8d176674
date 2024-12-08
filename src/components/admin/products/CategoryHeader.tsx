import React from 'react';
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Plus, GripVertical, DollarSign } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface CategoryHeaderProps {
  title: string;
  onEdit: () => void;
  onDelete: () => void;
  onAddProduct: () => void;
  onConfigurePricing: () => void;
  dragHandleProps?: any;
}

export const CategoryHeader = ({ 
  title, 
  onEdit, 
  onDelete,
  onAddProduct,
  onConfigurePricing,
  dragHandleProps
}: CategoryHeaderProps) => {
  const { toast } = useToast();
  const isDefaultCategory = title.toLowerCase() === 'popular' || title.toLowerCase() === 'specials';

  const handleDelete = async () => {
    if (isDefaultCategory) {
      toast({
        title: `Cannot Delete ${title} Category`,
        description: `The ${title} category is a default category and cannot be deleted.`,
        variant: "destructive",
      });
      return;
    }

    const confirmDelete = window.confirm(`Are you sure you want to delete the category "${title}"?`);
    if (!confirmDelete) return;

    try {
      onDelete();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        title: "Error",
        description: "Failed to delete category. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex justify-between items-center mb-2">
      <div className="flex items-center gap-2">
        {!isDefaultCategory && dragHandleProps && (
          <div {...dragHandleProps} className="cursor-grab">
            <GripVertical className="h-4 w-4 text-gray-400" />
          </div>
        )}
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <div className="space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onAddProduct}
        >
          <Plus className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onConfigurePricing}
        >
          <DollarSign className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onEdit}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        {!isDefaultCategory && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};