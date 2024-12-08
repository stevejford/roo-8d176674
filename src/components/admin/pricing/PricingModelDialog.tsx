import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/components/ui/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface PricingModelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  model?: any;
  onClose: () => void;
}

export const PricingModelDialog = ({ open, onOpenChange, model, onClose }: PricingModelDialogProps) => {
  const [name, setName] = React.useState(model?.name || '');
  const [type, setType] = React.useState(model?.type || 'simple');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  React.useEffect(() => {
    if (model) {
      setName(model.name);
      setType(model.type);
    } else {
      setName('');
      setType('simple');
    }
  }, [model]);

  const handleSave = async () => {
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Name is required",
        variant: "destructive",
      });
      return;
    }

    try {
      const modelData = {
        name,
        type,
        config: {},
      };

      if (model?.id) {
        const { error } = await supabase
          .from('pricing_strategies')
          .update(modelData)
          .eq('id', model.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('pricing_strategies')
          .insert([modelData]);

        if (error) throw error;
      }

      await queryClient.invalidateQueries({ queryKey: ['pricing-strategies'] });
      
      toast({
        title: model ? "Model updated" : "Model created",
        description: `The pricing model has been ${model ? 'updated' : 'created'} successfully.`,
      });
      
      onClose();
    } catch (error) {
      console.error("Error saving pricing model:", error);
      toast({
        title: "Error",
        description: `Failed to ${model ? 'update' : 'create'} pricing model`,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{model ? 'Edit Pricing Model' : 'Add Pricing Model'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="type">Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue placeholder="Select a type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="simple">Simple</SelectItem>
                <SelectItem value="size_based">Size Based</SelectItem>
                <SelectItem value="portion_based">Portion Based</SelectItem>
                <SelectItem value="selection_based">Selection Based</SelectItem>
                <SelectItem value="volume_based">Volume Based</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {model ? 'Update' : 'Create'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};