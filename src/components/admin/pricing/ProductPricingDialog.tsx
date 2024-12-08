import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from '@/components/ui/use-toast';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { PricingModelConfig } from './PricingModelConfig';
import { PricingStrategySelect } from './shared/PricingStrategySelect';
import { DialogActions } from './shared/DialogActions';

interface ProductPricingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: any;
  onClose: () => void;
}

export const ProductPricingDialog = ({ open, onOpenChange, product, onClose }: ProductPricingDialogProps) => {
  const [selectedStrategyId, setSelectedStrategyId] = React.useState<string>('');
  const [config, setConfig] = React.useState({});
  const [isOverride, setIsOverride] = React.useState(true);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: existingPricing } = useQuery({
    queryKey: ['product-pricing', product?.id],
    queryFn: async () => {
      if (!product?.id) return null;
      
      const { data, error } = await supabase
        .from('product_pricing')
        .select('*')
        .eq('product_id', product.id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!product?.id,
  });

  React.useEffect(() => {
    if (existingPricing) {
      setSelectedStrategyId(existingPricing.strategy_id);
      setConfig(existingPricing.config);
      setIsOverride(existingPricing.is_override ?? true);
    } else {
      setSelectedStrategyId('');
      setConfig({});
      setIsOverride(true);
    }
  }, [existingPricing]);

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

  const selectedStrategy = strategies?.find(s => s.id === selectedStrategyId);

  const handleSave = async () => {
    try {
      if (existingPricing) {
        const { error } = await supabase
          .from('product_pricing')
          .update({
            strategy_id: selectedStrategyId,
            config,
            is_override: isOverride,
          })
          .eq('id', existingPricing.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('product_pricing')
          .insert([{
            product_id: product.id,
            strategy_id: selectedStrategyId,
            config,
            is_override: isOverride,
          }]);

        if (error) throw error;
      }

      await queryClient.invalidateQueries({ queryKey: ['product-pricing'] });
      
      toast({
        title: "Success",
        description: "Product pricing updated successfully",
      });
      
      onClose();
    } catch (error) {
      console.error('Error saving product pricing:', error);
      toast({
        title: "Error",
        description: "Failed to save product pricing",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Product Pricing - {product?.title}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="override"
              checked={isOverride}
              onCheckedChange={setIsOverride}
            />
            <Label htmlFor="override">Override category pricing</Label>
          </div>

          {isOverride && (
            <>
              <PricingStrategySelect
                selectedStrategyId={selectedStrategyId}
                onStrategyChange={setSelectedStrategyId}
              />

              {selectedStrategy && (
                <PricingModelConfig
                  type={selectedStrategy.type}
                  config={config}
                  onChange={setConfig}
                />
              )}
            </>
          )}
        </div>
        
        <DialogActions
          onClose={onClose}
          onSave={handleSave}
          disabled={isOverride && !selectedStrategyId}
        />
      </DialogContent>
    </Dialog>
  );
};