import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ProductPrice } from './index/ProductPrice';

interface MenuCardProps {
  product: {
    id: string;
    title: string;
    description?: string;
    image_url?: string;
    category_id: string | null;
  };
  onClick?: () => void;
}

export const MenuCard = ({ product, onClick }: MenuCardProps) => {
  return (
    <Card 
      className="overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer"
      onClick={onClick}
    >
      {product.image_url && (
        <div className="relative aspect-[4/3]">
          <img
            src={product.image_url}
            alt={product.title}
            className="object-cover w-full h-full"
          />
        </div>
      )}
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-1">{product.title}</h3>
        {product.description && (
          <p className="text-muted-foreground text-sm mb-2 line-clamp-2">
            {product.description}
          </p>
        )}
        <ProductPrice 
          productId={product.id} 
          categoryId={product.category_id}
        />
      </CardContent>
    </Card>
  );
};