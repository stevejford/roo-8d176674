import React from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ProductDialog } from './ProductDialog';
import { CategoryDialog } from './CategoryDialog';
import { CategorizedProducts } from './CategorizedProducts';
import { UncategorizedProducts } from './UncategorizedProducts';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import type { Product, Category } from './types';

export const ProductList = () => {
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = React.useState<Category | null>(null);
  const [isProductDialogOpen, setIsProductDialogOpen] = React.useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = React.useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = React.useState<string | null>(null);

  const { products, isLoading, updateProductOrder, deleteProduct } = useProducts();
  const { categories, deleteCategory } = useCategories();

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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Get all products that are marked as popular
  const popularProducts = products?.filter(product => product.is_popular) || [];

  // Group remaining products by category
  const categorizedProducts = products?.reduce((acc: any, product: Product) => {
    // Skip popular products in regular categories if they're already shown in Popular
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
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Products</h2>
        <div className="space-x-2">
          <Button onClick={() => setIsCategoryDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Category
          </Button>
          <Button onClick={() => {
            setSelectedProduct(null);
            setSelectedCategoryId(null);
            setIsProductDialogOpen(true);
          }}>
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Button>
        </div>
      </div>

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
        {categories?.filter(cat => cat.title.toLowerCase() !== 'popular').map((category: Category) => (
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
        onClose={() => {
          setSelectedProduct(null);
          setSelectedCategoryId(null);
          setIsProductDialogOpen(false);
        }}
      />

      <CategoryDialog
        open={isCategoryDialogOpen}
        onOpenChange={setIsCategoryDialogOpen}
        category={selectedCategory}
        onClose={() => {
          setSelectedCategory(null);
          setIsCategoryDialogOpen(false);
        }}
      />
    </div>
  );
};