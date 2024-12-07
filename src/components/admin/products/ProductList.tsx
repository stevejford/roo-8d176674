import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, GripVertical } from "lucide-react";
import { ProductDialog } from './ProductDialog';
import { useToast } from '@/components/ui/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Product {
  id: string;
  title: string;
  description: string;
  image_url: string;
  sizes: any;
  active: boolean;
}

export const ProductList = () => {
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at');
      
      if (error) throw error;
      return data;
    },
  });

  const updateProductOrder = useMutation({
    mutationFn: async ({ sourceIndex, destinationIndex, productId }: any) => {
      // Implementation for updating product order will go here
      // We'll need to add a 'position' column to the products table
      console.log('Updating product order:', { sourceIndex, destinationIndex, productId });
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

    updateProductOrder.mutate({
      sourceIndex: result.source.index,
      destinationIndex: result.destination.index,
      productId: result.draggableId,
    });
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Products</h2>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="products">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
              {products?.map((product: Product, index: number) => (
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
                            onClick={() => handleEdit(product)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDelete(product.id)}
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
      </DragDropContext>

      <ProductDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        product={selectedProduct}
        onClose={() => {
          setSelectedProduct(null);
          setIsDialogOpen(false);
        }}
      />
    </div>
  );
};