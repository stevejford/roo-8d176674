import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from '@/components/ui/use-toast';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { PricingModelConfig } from './PricingModelConfig';

interface CategoryPricingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: any;
  onClose: () => void;
}

export const CategoryPricingDialog = ({ open, onOpenChange, category, onClose }: CategoryPricingDialogProps) => {
  const [selectedStrategyId, setSelectedStrategyId] = React.useState<string>('');
  const [config, setConfig] = React.useState({});
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: strategies } = useQuery({
    queryKey: ['pricing-strategies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pricing_strategies')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });

  const { data: existingPricing } = useQuery({
    queryKey: ['category-pricing', category?.id],
    queryFn: async () => {
      if (!category?.id) return null;
      
      const { data, error } = await supabase
        .from('category_pricing')
        .select('*')
        .eq('category_id', category.id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!category?.id,
  });

  React.useEffect(() => {
    if (existingPricing) {
      setSelectedStrategyId(existingPricing.strategy_id);
      setConfig(existingPricing.config);
    } else {
      setSelectedStrategyId('');
      setConfig({});
    }
  }, [existingPricing]);

  const selectedStrategy = strategies?.find(s => s.id === selectedStrategyId);

  const handleSave = async () => {
    try {
      if (existingPricing) {
        const { error } = await supabase
          .from('category_pricing')
          .update({
            strategy_id: selectedStrategyId,
            config,
          })
          .eq('id', existingPricing.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('category_pricing')
          .insert([{
            category_id: category.id,
            strategy_id: selectedStrategyId,
            config,
          }]);

        if (error) throw error;
      }

      await queryClient.invalidateQueries({ queryKey: ['category-pricing'] });
      
      toast({
        title: "Success",
        description: "Category pricing updated successfully",
      });
      
      onClose();
    } catch (error) {
      console.error('Error saving category pricing:', error);
      toast({
        title: "Error",
        description: "Failed to save category pricing",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Category Pricing - {category?.title}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Pricing Strategy</Label>
            <Select 
              value={selectedStrategyId} 
              onValueChange={setSelectedStrategyId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a pricing strategy" />
              </SelectTrigger>
              <SelectContent>
                {strategies?.map((strategy) => (
                  <SelectItem key={strategy.id} value={strategy.id}>
                    {strategy.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedStrategy && (
            <PricingModelConfig
              type={selectedStrategy.type}
              config={config}
              onChange={setConfig}
            />
          )}
        </div>
        
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!selectedStrategyId}
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};