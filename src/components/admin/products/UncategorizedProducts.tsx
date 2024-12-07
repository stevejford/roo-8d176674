import React from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { ProductCard } from './ProductCard';
import type { Product } from './types';

interface UncategorizedProductsProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export const UncategorizedProducts = ({ products, onEdit, onDelete }: UncategorizedProductsProps) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2">Uncategorized</h3>
      <Droppable droppableId="uncategorized">
        {(provided) => (
          <div 
            {...provided.droppableProps} 
            ref={provided.innerRef} 
            className="space-y-2 min-h-[100px] bg-gray-50 p-4 rounded-lg"
          >
            {products?.map((product: Product, index: number) => (
              <Draggable key={product.id} draggableId={product.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                  >
                    <ProductCard
                      product={product}
                      dragHandleProps={provided.dragHandleProps}
                      onEdit={onEdit}
                      onDelete={onDelete}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};