import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { ProductDialog } from './ProductDialog';
import { CategoryDialog } from './CategoryDialog';
import { CategorizedProducts } from './CategorizedProducts';
import { ProductListHeader } from './ProductListHeader';
import { useProductManagement } from '@/hooks/useProductManagement';
import { supabase } from '@/integrations/supabase/client';
import type { Product } from './types';
import { toast } from "sonner";

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

    // Get all categories except Popular
    const reorderableCategories = categories
      ?.filter(cat => cat.title.toLowerCase() !== 'popular')
      .sort((a, b) => (a.position || 0) - (b.position || 0));

    if (!reorderableCategories) return;

    try {
      // Calculate new positions for all categories
      const updates = reorderableCategories.map((category, index) => {
        let newPosition = index;

        // Adjust positions based on the drag destination
        if (category.id === categoryId) {
          newPosition = destination.index;
        } else if (index >= destination.index && index < source.index) {
          newPosition = index + 1;
        } else if (index <= destination.index && index > source.index) {
          newPosition = index - 1;
        }

        return supabase
          .from('categories')
          .update({ position: newPosition })
          .eq('id', category.id);
      });

      // Execute all position updates
      const results = await Promise.all(updates);
      
      // Check for any errors in the results
      const errors = results.filter(result => result.error);
      if (errors.length > 0) {
        console.error('Errors updating category positions:', errors);
        throw new Error('Failed to update some category positions');
      }

      toast.success("Category order updated successfully");
    } catch (error) {
      console.error('Error updating category positions:', error);
      toast.error("Failed to update category order");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Get all products that are marked as popular
  const popularProducts = products?.filter(product => product.is_popular) || [];

  // Group remaining products by category
  const categorizedProducts = products?.reduce((acc: { [key: string]: Product[] }, product: Product) => {
    if (product.category_id) {
      if (!acc[product.category_id]) {
        acc[product.category_id] = [];
      }
      acc[product.category_id].push(product);
    }
    return acc;
  }, {});

  // Find the Popular category
  const popularCategory = categories?.find(cat => cat.title.toLowerCase() === 'popular');

  // Sort categories by position, ensuring null positions are handled
  const sortedCategories = [...(categories || [])].sort((a, b) => 
    ((a.position ?? Number.MAX_SAFE_INTEGER) - (b.position ?? Number.MAX_SAFE_INTEGER))
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