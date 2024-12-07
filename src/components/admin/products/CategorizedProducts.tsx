import React from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { CategoryHeader } from './CategoryHeader';
import { ProductCard } from './ProductCard';
import type { Product, Category } from './types';

interface CategorizedProductsProps {
  category: Category;
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onEditCategory: (category: Category) => void;
  onDeleteCategory: (id: string) => void;
  onAddProduct: (categoryId: string) => void;
}

export const CategorizedProducts = ({ 
  category, 
  products, 
  onEdit, 
  onDelete,
  onEditCategory,
  onDeleteCategory,
  onAddProduct
}: CategorizedProductsProps) => {
  return (
    <div className="mb-6">
      <CategoryHeader
        title={category.title}
        onEdit={() => onEditCategory(category)}
        onDelete={() => onDeleteCategory(category.id)}
        onAddProduct={() => onAddProduct(category.id)}
      />
      
      <Droppable droppableId={category.id}>
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