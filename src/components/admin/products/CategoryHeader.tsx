import React from 'react';
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Plus, GripVertical } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface CategoryHeaderProps {
  title: string;
  onEdit: () => void;
  onDelete: () => void;
  onAddProduct: () => void;
  dragHandleProps?: any;
}

export const CategoryHeader = ({ 
  title, 
  onEdit, 
  onDelete,
  onAddProduct,
  dragHandleProps
}: CategoryHeaderProps) => {
  const { toast } = useToast();
  const isPopularCategory = title.toLowerCase() === 'popular';

  const handleDelete = async () => {
    if (isPopularCategory) {
      toast({
        title: "Cannot Delete Popular Category",
        description: "The Popular category is a default category and cannot be deleted.",
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
        {!isPopularCategory && dragHandleProps && (
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
          onClick={onEdit}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        {!isPopularCategory && (
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