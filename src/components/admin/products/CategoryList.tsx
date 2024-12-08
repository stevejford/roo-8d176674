import React from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { CategorizedProducts } from './CategorizedProducts';
import type { Product, Category } from './types';

interface CategoryListProps {
  categories: Category[];
  popularCategory: Category | undefined;
  popularProducts: Product[];
  categorizedProducts: { [key: string]: Product[] };
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onEditCategory: (category: Category) => void;
  onDeleteCategory: (id: string) => void;
  onAddProduct: (categoryId: string) => void;
}

export const CategoryList = ({
  categories,
  popularCategory,
  popularProducts,
  categorizedProducts,
  onEdit,
  onDelete,
  onEditCategory,
  onDeleteCategory,
  onAddProduct,
}: CategoryListProps) => {
  const sortedCategories = [...categories].sort((a, b) => {
    return (a.position ?? Number.MAX_SAFE_INTEGER) - (b.position ?? Number.MAX_SAFE_INTEGER);
  });

  return (
    <Droppable droppableId="categories" type="CATEGORY">
      {(provided) => (
        <div {...provided.droppableProps} ref={provided.innerRef}>
          {/* Always show Popular category first if it exists */}
          {popularCategory && (
            <CategorizedProducts
              key={popularCategory.id}
              category={popularCategory}
              products={popularProducts}
              onEdit={onEdit}
              onDelete={onDelete}
              onEditCategory={onEditCategory}
              onDeleteCategory={onDeleteCategory}
              onAddProduct={onAddProduct}
            />
          )}

          {/* Show other categories */}
          {sortedCategories
            .filter(cat => cat.title.toLowerCase() !== 'popular')
            .map((category, index) => (
              <Draggable 
                key={category.id} 
                draggableId={category.id} 
                index={index}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                  >
                    <CategorizedProducts
                      category={category}
                      products={categorizedProducts[category.id] || []}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onEditCategory={onEditCategory}
                      onDeleteCategory={onDeleteCategory}
                      onAddProduct={onAddProduct}
                      dragHandleProps={provided.dragHandleProps}
                    />
                  </div>
                )}
              </Draggable>
            ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};