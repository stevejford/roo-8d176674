import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from '@/components/ui/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { PricingStrategyForm } from './PricingStrategyForm';

interface PricingStrategyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  strategy?: any;
}

export const PricingStrategyDialog = ({ 
  open, 
  onOpenChange, 
  strategy 
}: PricingStrategyDialogProps) => {
  const [name, setName] = React.useState(strategy?.name || '');
  const [type, setType] = React.useState(strategy?.type || 'simple');
  const [config, setConfig] = React.useState(
    JSON.stringify(strategy?.config || {}, null, 2)
  );

  const { toast } = useToast();
  const queryClient = useQueryClient();

  React.useEffect(() => {
    if (strategy) {
      setName(strategy.name);
      setType(strategy.type);
      setConfig(JSON.stringify(strategy.config || {}, null, 2));
    } else {
      setName('');
      setType('simple');
      setConfig('{}');
    }
  }, [strategy]);

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

      const strategyData = {
        name,
        type,
        config: parsedConfig,
      };

      if (strategy?.id) {
        const { error } = await supabase
          .from('pricing_strategies')
          .update(strategyData)
          .eq('id', strategy.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('pricing_strategies')
          .insert([strategyData]);

        if (error) throw error;
      }

      await queryClient.invalidateQueries({ queryKey: ['pricing-strategies'] });
      
      toast({
        title: strategy ? "Strategy updated" : "Strategy created",
        description: `The pricing strategy has been ${strategy ? 'updated' : 'created'} successfully.`,
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving pricing strategy:', error);
      toast({
        title: "Error",
        description: `Failed to ${strategy ? 'update' : 'create'} pricing strategy`,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {strategy ? 'Edit Pricing Strategy' : 'Create Pricing Strategy'}
          </DialogTitle>
        </DialogHeader>
        
        <PricingStrategyForm
          name={name}
          type={type}
          config={config}
          onNameChange={setName}
          onTypeChange={setType}
          onConfigChange={setConfig}
        />
        
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {strategy ? 'Update' : 'Create'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};