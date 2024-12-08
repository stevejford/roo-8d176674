import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GripVertical, Pencil, Trash2, DollarSign } from "lucide-react";
import { ProductPricingDialog } from '../pricing/ProductPricingDialog';

interface ProductCardProps {
  product: any;
  dragHandleProps?: any;
  onEdit?: (product: any) => void;
  onDelete?: (id: string) => void;
  showDragHandle?: boolean;
}

export const ProductCard = ({ 
  product, 
  dragHandleProps, 
  onEdit, 
  onDelete,
  showDragHandle = false 
}: ProductCardProps) => {
  const [isPricingOpen, setIsPricingOpen] = React.useState(false);

  return (
    <>
      <Card className="p-4 mb-2">
        <div className="flex items-center gap-4">
          {showDragHandle && dragHandleProps && (
            <div {...dragHandleProps} className="cursor-grab">
              <GripVertical className="h-4 w-4 text-gray-400" />
            </div>
          )}
          
          <div className="flex-1">
            <div className="font-medium">{product.title}</div>
            {product.description && (
              <div className="text-sm text-gray-500">{product.description}</div>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsPricingOpen(true)}
            >
              <DollarSign className="h-4 w-4" />
            </Button>
            {onEdit && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(product)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive"
                onClick={() => onDelete(product.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </Card>

      <ProductPricingDialog
        open={isPricingOpen}
        onOpenChange={setIsPricingOpen}
        product={product}
        onClose={() => setIsPricingOpen(false)}
      />
    </>
  );
};