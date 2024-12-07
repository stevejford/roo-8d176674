import React from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ProductDialog } from './ProductDialog';
import { CategoryDialog } from './CategoryDialog';
import { useToast } from '@/components/ui/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CategorizedProducts } from './CategorizedProducts';
import { UncategorizedProducts } from './UncategorizedProducts';
import type { Product, Category } from './types';

export const ProductList = () => {
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = React.useState<Category | null>(null);
  const [isProductDialogOpen, setIsProductDialogOpen] = React.useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = React.useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('position');
      
      if (error) throw error;
      return data;
    },
  });

  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('position');
      
      if (error) throw error;
      return data;
    },
  });

  const updateProductOrder = useMutation({
    mutationFn: async ({ sourceIndex, destinationIndex, productId, categoryId }: any) => {
      const { error } = await supabase
        .from('products')
        .update({ 
          position: destinationIndex,
          category_id: categoryId
        })
        .eq('id', productId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: "Order updated",
        description: "The product order has been updated successfully.",
      });
    },
  });

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

  const handleDeleteProduct = async (id: string) => {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    } else {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: "Product deleted",
        description: "The product has been deleted successfully.",
      });
    }
  };

  const handleDeleteCategory = async (id: string) => {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete category",
        variant: "destructive",
      });
    } else {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({
        title: "Category deleted",
        description: "The category has been deleted successfully.",
      });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const categorizedProducts = products?.reduce((acc: any, product: Product) => {
    const categoryId = product.category_id || 'uncategorized';
    if (!acc[categoryId]) {
      acc[categoryId] = [];
    }
    acc[categoryId].push(product);
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Products</h2>
        <div className="space-x-2">
          <Button onClick={() => setIsCategoryDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Category
          </Button>
          <Button onClick={() => setIsProductDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Button>
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        {/* Categories */}
        {categories?.map((category: Category) => (
          <CategorizedProducts
            key={category.id}
            category={category}
            products={categorizedProducts[category.id] || []}
            onEdit={setSelectedProduct}
            onDelete={handleDeleteProduct}
            onEditCategory={setSelectedCategory}
            onDeleteCategory={handleDeleteCategory}
          />
        ))}

        {/* Uncategorized Products */}
        <UncategorizedProducts
          products={categorizedProducts['uncategorized'] || []}
          onEdit={setSelectedProduct}
          onDelete={handleDeleteProduct}
        />
      </DragDropContext>

      <ProductDialog
        open={isProductDialogOpen}
        onOpenChange={setIsProductDialogOpen}
        product={selectedProduct}
        onClose={() => {
          setSelectedProduct(null);
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