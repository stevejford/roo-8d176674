import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/components/ui/use-toast';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ImageUpload } from './ImageUpload';

interface ProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: any;
  onClose: () => void;
}

export const ProductDialog = ({ open, onOpenChange, product, onClose }: ProductDialogProps) => {
  const [title, setTitle] = React.useState(product?.title || '');
  const [description, setDescription] = React.useState(product?.description || '');
  const [imageUrl, setImageUrl] = React.useState(product?.image_url || '');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  React.useEffect(() => {
    if (product) {
      setTitle(product.title);
      setDescription(product.description || '');
      setImageUrl(product.image_url || '');
    } else {
      setTitle('');
      setDescription('');
      setImageUrl('');
    }
  }, [product]);

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