import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TableManagementButtonsProps {
  onEdit: () => void;
  onDelete: () => void;
}

export const TableManagementButtons = ({ onEdit, onDelete }: TableManagementButtonsProps) => {
  return (
    <div className="absolute top-4 right-4 flex space-x-1">
      <Button
        size="icon"
        variant="ghost"
        className="h-8 w-8 bg-white/90 hover:bg-white shadow-sm"
        onClick={(e) => {
          e.stopPropagation();
          onEdit();
        }}
      >
        <Pencil className="h-4 w-4 text-gray-600" />
      </Button>
      <Button
        size="icon"
        variant="ghost"
        className="h-8 w-8 bg-white/90 hover:bg-white shadow-sm"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
      >
        <Trash2 className="h-4 w-4 text-red-600" />
      </Button>
    </div>
  );
};