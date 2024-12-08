import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from '@/components/ui/use-toast';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { PricingStrategyForm } from './forms/PricingStrategyForm';

interface ProductPricingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId: string;
  productTitle: string;
}

export const ProductPricingDialog = ({ 
  open, 
  onOpenChange, 
  productId,
  productTitle 
}: ProductPricingDialogProps) => {
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

  // Fetch existing product pricing if any
  const { data: productPricing } = useQuery({
    queryKey: ['product-pricing', productId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_pricing')
        .select('*')
        .eq('product_id', productId)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
  });

  React.useEffect(() => {
    if (productPricing) {
      setSelectedStrategyId(productPricing.strategy_id);
      setConfig(JSON.stringify(productPricing.config, null, 2));
    }
  }, [productPricing]);

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
        product_id: productId,
        strategy_id: selectedStrategyId,
        config: parsedConfig,
        is_override: true,
      };

      if (productPricing?.id) {
        const { error } = await supabase
          .from('product_pricing')
          .update(pricingData)
          .eq('id', productPricing.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('product_pricing')
          .insert([pricingData]);

        if (error) throw error;
      }

      await queryClient.invalidateQueries({ queryKey: ['product-pricing'] });
      
      toast({
        title: "Success",
        description: `Pricing strategy has been ${productPricing ? 'updated' : 'assigned'} for ${productTitle}`,
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving product pricing:', error);
      toast({
        title: "Error",
        description: `Failed to ${productPricing ? 'update' : 'assign'} pricing strategy`,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {productPricing ? 'Edit' : 'Assign'} Pricing Strategy for {productTitle}
          </DialogTitle>
        </DialogHeader>
        
        <PricingStrategyForm
          strategies={strategies || []}
          selectedStrategyId={selectedStrategyId}
          config={config}
          onStrategyChange={setSelectedStrategyId}
          onConfigChange={setConfig}
        />
        
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!selectedStrategyId}>
            {productPricing ? 'Update' : 'Assign'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};