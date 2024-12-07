import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from '@/components/ui/use-toast';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: any;
  onClose: () => void;
}

export const CategoryDialog = ({ open, onOpenChange, category, onClose }: CategoryDialogProps) => {
  const [title, setTitle] = React.useState(category?.title || '');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  React.useEffect(() => {
    if (category) {
      setTitle(category.title);
    } else {
      setTitle('');
    }
  }, [category]);

  const handleSave = async () => {
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Title is required",
        variant: "destructive",
      });
      return;
    }

    const categoryData = {
      title,
    };

    if (category?.id) {
      const { error } = await supabase
        .from('categories')
        .update(categoryData)
        .eq('id', category.id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update category",
          variant: "destructive",
        });
        return;
      }
    } else {
      const { error } = await supabase
        .from('categories')
        .insert([categoryData]);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to create category",
          variant: "destructive",
        });
        return;
      }
    }

    queryClient.invalidateQueries({ queryKey: ['categories'] });
    toast({
      title: category ? "Category updated" : "Category created",
      description: `The category has been ${category ? 'updated' : 'created'} successfully.`,
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{category ? 'Edit Category' : 'Add Category'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {category ? 'Update' : 'Create'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};