import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { ProductDialog } from './ProductDialog';
import { CategoryDialog } from './CategoryDialog';
import { CategorizedProducts } from './CategorizedProducts';
import { UncategorizedProducts } from './UncategorizedProducts';
import { ProductListHeader } from './ProductListHeader';
import { useProductManagement } from '@/hooks/useProductManagement';
import { supabase } from '@/integrations/supabase/client';
import type { Product } from './types';

export const ProductList = () => {
  const {
    products,
    categories,
    isLoading,
    selectedProduct,
    selectedCategory,
    selectedCategoryId,
    isProductDialogOpen,
    isCategoryDialogOpen,
    handleDragEnd,
    handleAddProduct,
    handleEditProduct,
    deleteProduct,
    deleteCategory,
    setSelectedCategory,
    setIsProductDialogOpen,
    setIsCategoryDialogOpen,
    handleCloseProductDialog,
    handleCloseCategoryDialog,
  } = useProductManagement();

  const handleCategoryDragEnd = async (result: any) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const categoryId = result.draggableId;

    try {
      const { error } = await supabase
        .from('categories')
        .update({ position: destination.index })
        .eq('id', categoryId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating category position:', error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Get all products that are marked as popular
  const popularProducts = products?.filter(product => product.is_popular) || [];

  // Group remaining products by category
  const categorizedProducts = products?.reduce((acc: { [key: string]: Product[] }, product: Product) => {
    const categoryId = product.category_id || 'uncategorized';
    if (!acc[categoryId]) {
      acc[categoryId] = [];
    }
    acc[categoryId].push(product);
    return acc;
  }, {});

  // Find the Popular category
  const popularCategory = categories?.find(cat => cat.title.toLowerCase() === 'popular');

  // Sort categories by position
  const sortedCategories = [...(categories || [])].sort((a, b) => 
    (a.position || 0) - (b.position || 0)
  );

  return (
    <div className="space-y-4">
      <ProductListHeader 
        onAddCategory={() => setIsCategoryDialogOpen(true)}
        onAddProduct={() => {
          handleAddProduct('');
          setIsProductDialogOpen(true);
        }}
      />

      <DragDropContext onDragEnd={handleCategoryDragEnd}>
        <Droppable droppableId="categories" type="CATEGORY">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {/* Always show Popular category first if it exists */}
              {popularCategory && (
                <CategorizedProducts
                  key={popularCategory.id}
                  category={popularCategory}
                  products={popularProducts}
                  onEdit={handleEditProduct}
                  onDelete={deleteProduct}
                  onEditCategory={setSelectedCategory}
                  onDeleteCategory={deleteCategory}
                  onAddProduct={handleAddProduct}
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
                          onEdit={handleEditProduct}
                          onDelete={deleteProduct}
                          onEditCategory={setSelectedCategory}
                          onDeleteCategory={deleteCategory}
                          onAddProduct={handleAddProduct}
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

        <DragDropContext onDragEnd={handleDragEnd}>
          <UncategorizedProducts
            products={categorizedProducts['uncategorized'] || []}
            onEdit={handleEditProduct}
            onDelete={deleteProduct}
          />
        </DragDropContext>
      </DragDropContext>

      <ProductDialog
        open={isProductDialogOpen}
        onOpenChange={setIsProductDialogOpen}
        product={selectedProduct}
        categoryId={selectedCategoryId}
        onClose={handleCloseProductDialog}
      />

      <CategoryDialog
        open={isCategoryDialogOpen}
        onOpenChange={setIsCategoryDialogOpen}
        category={selectedCategory}
        onClose={handleCloseCategoryDialog}
      />
    </div>
  );
};