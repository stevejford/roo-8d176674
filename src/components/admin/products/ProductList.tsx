import React from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import { ProductDialog } from './ProductDialog';
import { CategoryDialog } from './CategoryDialog';
import { CategorizedProducts } from './CategorizedProducts';
import { UncategorizedProducts } from './UncategorizedProducts';
import { ProductListHeader } from './ProductListHeader';
import { useProductManagement } from '@/hooks/useProductManagement';
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

  return (
    <div className="space-y-4">
      <ProductListHeader 
        onAddCategory={() => setIsCategoryDialogOpen(true)}
        onAddProduct={() => {
          handleAddProduct('');
          setIsProductDialogOpen(true);
        }}
      />

      <DragDropContext onDragEnd={handleDragEnd}>
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
        {categories?.filter(cat => cat.title.toLowerCase() !== 'popular').map((category) => (
          <CategorizedProducts
            key={category.id}
            category={category}
            products={categorizedProducts[category.id] || []}
            onEdit={handleEditProduct}
            onDelete={deleteProduct}
            onEditCategory={setSelectedCategory}
            onDeleteCategory={deleteCategory}
            onAddProduct={handleAddProduct}
          />
        ))}

        <UncategorizedProducts
          products={categorizedProducts['uncategorized'] || []}
          onEdit={handleEditProduct}
          onDelete={deleteProduct}
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