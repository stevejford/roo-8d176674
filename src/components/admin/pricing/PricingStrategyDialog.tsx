import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/components/ui/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

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
                <SelectValue placeholder="Select type" />
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
          <Button onClick={handleSave}>
            {strategy ? 'Update' : 'Create'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};