import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from '@/components/ui/use-toast';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CategoryPricingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categoryId: string;
  categoryTitle: string;
}

export const CategoryPricingDialog = ({ 
  open, 
  onOpenChange, 
  categoryId,
  categoryTitle 
}: CategoryPricingDialogProps) => {
  const [selectedStrategyId, setSelectedStrategyId] = React.useState<string>('');
  const [config, setConfig] = React.useState('{}');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch pricing strategies
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

  // Fetch existing category pricing if any
  const { data: categoryPricing } = useQuery({
    queryKey: ['category-pricing', categoryId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('category_pricing')
        .select('*')
        .eq('category_id', categoryId)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows returned"
      return data;
    },
  });

  // Set initial values when data is loaded
  React.useEffect(() => {
    if (categoryPricing) {
      setSelectedStrategyId(categoryPricing.strategy_id);
      setConfig(JSON.stringify(categoryPricing.config, null, 2));
    }
  }, [categoryPricing]);

  const handleSave = async () => {
    try {
      let parsedConfig;
      try {
        parsedConfig = JSON.parse(config);
      } catch (e) {
        toast({
          title: "Invalid JSON",
          description: "Please check your configuration format",
          variant: "destructive",
        });
        return;
      }

      const pricingData = {
        category_id: categoryId,
        strategy_id: selectedStrategyId,
        config: parsedConfig,
      };

      if (categoryPricing?.id) {
        const { error } = await supabase
          .from('category_pricing')
          .update(pricingData)
          .eq('id', categoryPricing.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('category_pricing')
          .insert([pricingData]);

        if (error) throw error;
      }

      await queryClient.invalidateQueries({ queryKey: ['category-pricing'] });
      
      toast({
        title: "Success",
        description: `Pricing strategy has been ${categoryPricing ? 'updated' : 'assigned'} for ${categoryTitle}`,
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving category pricing:', error);
      toast({
        title: "Error",
        description: `Failed to ${categoryPricing ? 'update' : 'assign'} pricing strategy`,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {categoryPricing ? 'Edit' : 'Assign'} Pricing Strategy for {categoryTitle}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="strategy">Pricing Strategy</Label>
            <Select
              value={selectedStrategyId}
              onValueChange={setSelectedStrategyId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a strategy" />
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

          <div className="grid gap-2">
            <Label htmlFor="config">Configuration (JSON)</Label>
            <Textarea
              id="config"
              value={config}
              onChange={(e) => setConfig(e.target.value)}
              className="font-mono"
              rows={8}
            />
          </div>
        </div>
        
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!selectedStrategyId}>
            {categoryPricing ? 'Update' : 'Assign'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};