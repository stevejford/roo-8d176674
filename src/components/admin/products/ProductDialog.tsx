import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/components/ui/use-toast';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ImageUpload } from './ImageUpload';
import { Checkbox } from "@/components/ui/checkbox";

interface ProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: any;
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
    } else {
      setTitle('');
      setDescription('');
      setImageUrl('');
      setCategoryId(categoryId || 'uncategorized');
      setIsPopular(false);
      setIsComplementary(false);
    }
  }, [product, categoryId]);

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
          <ImageUpload
            currentImage={imageUrl}
            onImageUploaded={setImageUrl}
          />
          
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="category">Category</Label>
            <Select value={selectedCategoryId} onValueChange={setCategoryId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="uncategorized">Uncategorized</SelectItem>
                {categories?.map((category: any) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_popular"
              checked={isPopular}
              onCheckedChange={(checked) => setIsPopular(checked as boolean)}
            />
            <Label htmlFor="is_popular">Popular Item</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_complementary"
              checked={isComplementary}
              onCheckedChange={(checked) => setIsComplementary(checked as boolean)}
            />
            <Label htmlFor="is_complementary">Complementary Item</Label>
          </div>
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
