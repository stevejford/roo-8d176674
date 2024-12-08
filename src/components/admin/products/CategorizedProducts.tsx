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
  dragHandleProps?: any;
}

export const CategorizedProducts = ({ 
  category, 
  products, 
  onEdit, 
  onDelete,
  onEditCategory,
  onDeleteCategory,
  onAddProduct,
  dragHandleProps
}: CategorizedProductsProps) => {
  const isPopularCategory = category.title.toLowerCase() === 'popular';
  
  return (
    <div className="mb-6">
      <CategoryHeader
        title={category.title}
        onEdit={() => onEditCategory(category)}
        onDelete={() => onDeleteCategory(category.id)}
        onAddProduct={() => onAddProduct(category.id)}
        dragHandleProps={dragHandleProps}
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
                      onDelete={isPopularCategory ? undefined : onDelete}
                      showDragHandle={true}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
            {isPopularCategory && products.length === 0 && (
              <div className="text-center text-gray-500 py-4">
                No popular products yet. Mark products as popular to see them here.
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
};