import React from 'react';
import { useProducts } from './useProducts';
import { useCategories } from './useCategories';
import type { Product, Category } from '@/components/admin/products/types';

export const useProductManagement = () => {
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = React.useState<Category | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = React.useState<string | null>(null);
  const [isProductDialogOpen, setIsProductDialogOpen] = React.useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = React.useState(false);

  const { products, isLoading, updateProductOrder, deleteProduct } = useProducts();
  const { categories, deleteCategory, setCategories } = useCategories();

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const categoryId = result.destination.droppableId === 'uncategorized' 
      ? null 
      : result.destination.droppableId;

    updateProductOrder.mutate({
      sourceIndex: result.source.index,
      destinationIndex: result.destination.index,
      productId: result.draggableId,
      categoryId,
    });
  };

  const handleAddProduct = (categoryId: string) => {
    setSelectedProduct(null);
    setSelectedCategoryId(categoryId);
    setIsProductDialogOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setSelectedCategoryId(product.category_id);
    setIsProductDialogOpen(true);
  };

  const handleCloseProductDialog = () => {
    setSelectedProduct(null);
    setSelectedCategoryId(null);
    setIsProductDialogOpen(false);
  };

  const handleCloseCategoryDialog = () => {
    setSelectedCategory(null);
    setIsCategoryDialogOpen(false);
  };

  return {
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
    setCategories,
  };
};