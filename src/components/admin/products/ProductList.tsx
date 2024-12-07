import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, GripVertical } from "lucide-react";
import { ProductDialog } from './ProductDialog';
import { CategoryDialog } from './CategoryDialog';
import { useToast } from '@/components/ui/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Product {
  id: string;
  title: string;
  description: string;
  image_url: string;
  category_id: string | null;
}

interface Category {
  id: string;
  title: string;
}

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

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsProductDialogOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setIsCategoryDialogOpen(true);
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
          <div key={category.id} className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">{category.title}</h3>
              <div className="space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditCategory(category)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteCategory(category.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <Droppable droppableId={category.id}>
              {(provided) => (
                <div 
                  {...provided.droppableProps} 
                  ref={provided.innerRef} 
                  className="space-y-2 min-h-[100px] bg-gray-50 p-4 rounded-lg"
                >
                  {categorizedProducts[category.id]?.map((product: Product, index: number) => (
                    <Draggable key={product.id} draggableId={product.id} index={index}>
                      {(provided) => (
                        <Card
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="bg-white"
                        >
                          <CardContent className="flex items-center p-4">
                            <div {...provided.dragHandleProps} className="mr-4">
                              <GripVertical className="text-gray-400" />
                            </div>
                            
                            {product.image_url && (
                              <img
                                src={product.image_url}
                                alt={product.title}
                                className="w-16 h-16 object-cover rounded mr-4"
                              />
                            )}
                            
                            <div className="flex-1">
                              <h3 className="font-semibold">{product.title}</h3>
                              <p className="text-sm text-gray-500 line-clamp-1">
                                {product.description}
                              </p>
                            </div>
                            
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleEditProduct(product)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleDeleteProduct(product.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}

        {/* Uncategorized Products */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Uncategorized</h3>
          <Droppable droppableId="uncategorized">
            {(provided) => (
              <div 
                {...provided.droppableProps} 
                ref={provided.innerRef} 
                className="space-y-2 min-h-[100px] bg-gray-50 p-4 rounded-lg"
              >
                {categorizedProducts['uncategorized']?.map((product: Product, index: number) => (
                  <Draggable key={product.id} draggableId={product.id} index={index}>
                    {(provided) => (
                      <Card
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="bg-white"
                      >
                        <CardContent className="flex items-center p-4">
                          <div {...provided.dragHandleProps} className="mr-4">
                            <GripVertical className="text-gray-400" />
                          </div>
                          
                          {product.image_url && (
                            <img
                              src={product.image_url}
                              alt={product.title}
                              className="w-16 h-16 object-cover rounded mr-4"
                            />
                          )}
                          
                          <div className="flex-1">
                            <h3 className="font-semibold">{product.title}</h3>
                            <p className="text-sm text-gray-500 line-clamp-1">
                              {product.description}
                            </p>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleEditProduct(product)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleDeleteProduct(product.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
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