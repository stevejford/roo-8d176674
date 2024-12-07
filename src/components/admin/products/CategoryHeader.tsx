import React from 'react';
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

interface CategoryHeaderProps {
  title: string;
  onEdit: () => void;
  onDelete: () => void;
}

export const CategoryHeader = ({ title, onEdit, onDelete }: CategoryHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-2">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onEdit}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};