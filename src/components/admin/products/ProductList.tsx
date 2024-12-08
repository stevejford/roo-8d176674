import React from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import { ProductDialog } from './ProductDialog';
import { CategoryDialog } from './CategoryDialog';
import { CategoryList } from './CategoryList';
import { ProductListHeader } from './ProductListHeader';
import { useProductManagement } from '@/hooks/useProductManagement';
import { supabase } from '@/integrations/supabase/client';
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
    setCategories
  } = useProductManagement();

  const handleCategoryDragEnd = async (result: any) => {
    if (!result.destination || !categories) return;

    const { source, destination } = result;
    const categoryId = result.draggableId;

    try {
      // Create a new array with updated positions
      const updatedCategories = [...categories].filter(cat => 
        cat.title.toLowerCase() !== 'popular'
      );
      
      // Update positions
      const [movedCategory] = updatedCategories.splice(source.index, 1);
      updatedCategories.splice(destination.index, 0, movedCategory);
      
      // Update all positions
      const categoriesWithNewPositions = updatedCategories.map((category, index) => ({
        ...category,
        position: index
      }));

      // Update local state immediately
      setCategories([
        ...categories.filter(cat => cat.title.toLowerCase() === 'popular'),
        ...categoriesWithNewPositions
      ]);

      // Update database
      const { error } = await supabase
        .from('categories')
        .update({ position: destination.index })
        .eq('id', categoryId);

      if (error) throw error;

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
  const categorizedProducts = products?.reduce((acc: { [key: string]: any[] }, product) => {
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
        <CategoryList
          categories={categories || []}
          popularCategory={popularCategory}
          popularProducts={popularProducts}
          categorizedProducts={categorizedProducts || {}}
          onEdit={handleEditProduct}
          onDelete={deleteProduct}
          onEditCategory={setSelectedCategory}
          onDeleteCategory={deleteCategory}
          onAddProduct={handleAddProduct}
        />
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