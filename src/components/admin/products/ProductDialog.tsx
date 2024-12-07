import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from '@/components/ui/use-toast';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ProductImageSection } from './ProductImageSection';
import { ProductBasicInfo } from './ProductBasicInfo';
import { ProductCategorySelect } from './ProductCategorySelect';
import { ProductFlags } from './ProductFlags';
import type { Product } from './types';

interface ProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product;
  categoryId?: string | null;
  onClose: () => void;
}

export const ProductDialog = ({ open, onOpenChange, product, categoryId, onClose }: ProductDialogProps) => {
  const [title, setTitle] = React.useState(product?.title || '');
  const [description, setDescription] = React.useState(product?.description || '');
  const [imageUrl, setImageUrl] = React.useState(product?.image_url || '');
  const [selectedCategoryId, setCategoryId] = React.useState(categoryId || product?.category_id || 'uncategorized');
  const [isPopular, setIsPopular] = React.useState(product?.is_popular || false);
  const [isComplementary, setIsComplementary] = React.useState(product?.is_complementary || false);
  const [price, setPrice] = React.useState(product?.price?.toString() || '0.00');
  
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

  React.useEffect(() => {
    if (product) {
      setTitle(product.title);
      setDescription(product.description || '');
      setImageUrl(product.image_url || '');
      setCategoryId(product.category_id || 'uncategorized');
      setIsPopular(product.is_popular || false);
      setIsComplementary(product.is_complementary || false);
      setPrice(product.price?.toString() || '0.00');
    } else {
      setTitle('');
      setDescription('');
      setImageUrl('');
      setCategoryId(categoryId || 'uncategorized');
      setIsPopular(false);
      setIsComplementary(false);
      setPrice('0.00');
    }
  }, [product, categoryId]);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d{0,2}$/.test(value)) {
      setPrice(value);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Title is required",
        variant: "destructive",
      });
      return;
    }

    const productData = {
      title,
      description,
      image_url: imageUrl,
      category_id: selectedCategoryId === 'uncategorized' ? null : selectedCategoryId,
      is_popular: isPopular,
      is_complementary: isComplementary,
      price: parseFloat(price) || 0.00,
    };

    if (product?.id) {
      const { error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', product.id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update product",
          variant: "destructive",
        });
        return;
      }
    } else {
      const { error } = await supabase
        .from('products')
        .insert([productData]);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to create product",
          variant: "destructive",
        });
        return;
      }
    }

    queryClient.invalidateQueries({ queryKey: ['products'] });
    toast({
      title: product ? "Product updated" : "Product created",
      description: `The product has been ${product ? 'updated' : 'created'} successfully.`,
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{product ? 'Edit Product' : 'Add Product'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <ProductImageSection
            imageUrl={imageUrl}
            onImageUploaded={setImageUrl}
          />
          
          <ProductBasicInfo
            title={title}
            description={description}
            price={price}
            onTitleChange={setTitle}
            onDescriptionChange={setDescription}
            onPriceChange={handlePriceChange}
          />

          <ProductCategorySelect
            selectedCategoryId={selectedCategoryId}
            categories={categories || []}
            onCategoryChange={setCategoryId}
          />

          <ProductFlags
            isPopular={isPopular}
            isComplementary={isComplementary}
            onPopularChange={setIsPopular}
            onComplementaryChange={setIsComplementary}
          />
        </div>
        
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {product ? 'Update' : 'Create'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};