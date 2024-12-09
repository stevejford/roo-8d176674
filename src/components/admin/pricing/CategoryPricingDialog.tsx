import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from '@/components/ui/use-toast';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { DialogActions } from './shared/DialogActions';
import { IngredientsEditor } from '@/components/IngredientsEditor';
import { DebugSection } from './sections/DebugSection';
import { IngredientsSection } from './sections/IngredientsSection';
import { PricingSection } from './sections/PricingSection';
import { PricingConfig } from '@/types/pricing/interfaces';
import { Json } from '@/integrations/supabase/types';
import type { CategoryPricingRow, IngredientsState } from './types';

interface CategoryPricingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: any;
  onClose: () => void;
}

export const CategoryPricingDialog = ({ 
  open, 
  onOpenChange, 
  category, 
  onClose 
}: CategoryPricingDialogProps) => {
  const [selectedStrategyId, setSelectedStrategyId] = React.useState<string>('');
  const [config, setConfig] = React.useState<PricingConfig>({});
  const [isIngredientsOpen, setIsIngredientsOpen] = React.useState(false);
  const [ingredients, setIngredients] = React.useState<IngredientsState[]>([
    { name: "Cheese", checked: true },
    { name: "Tomato Sauce", checked: true },
    { name: "Pepperoni", checked: false },
    { name: "Mushrooms", checked: false },
    { name: "Onions", checked: false },
  ]);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch existing pricing data
  const { data: existingPricing } = useQuery<CategoryPricingRow | null>({
    queryKey: ['category-pricing', category?.id],
    queryFn: async () => {
      if (!category?.id) return null;
      
      const { data, error } = await supabase
        .from('category_pricing')
        .select(`
          *,
          pricing_strategies (*)
        `)
        .eq('category_id', category.id)
        .limit(1);
      
      if (error) throw error;
      return data?.[0] as CategoryPricingRow || null;
    },
    enabled: !!category?.id
  });

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

  const selectedStrategy = strategies?.find(s => s.id === selectedStrategyId);

  React.useEffect(() => {
    if (existingPricing) {
      setSelectedStrategyId(existingPricing.strategy_id);
      setConfig(existingPricing.config as unknown as PricingConfig);
      if (existingPricing.ingredients) {
        setIngredients((existingPricing.ingredients as unknown as IngredientsState[]) || []);
      }
    } else {
      setSelectedStrategyId('');
      setConfig({});
    }
  }, [existingPricing]);

  const handleIngredientToggle = (ingredientName: string) => {
    setIngredients(prevIngredients =>
      prevIngredients.map(ingredient =>
        ingredient.name === ingredientName
          ? { ...ingredient, checked: !ingredient.checked }
          : ingredient
      )
    );
  };

  const handleSave = async () => {
    if (!selectedStrategyId) {
      toast({
        title: "Error",
        description: "Please select a pricing strategy",
        variant: "destructive",
      });
      return;
    }

    try {
      const pricingData = {
        strategy_id: selectedStrategyId,
        config: config as unknown as Json,
        ingredients: ingredients as unknown as Json,
      };

      if (existingPricing?.id) {
        const { error } = await supabase
          .from('category_pricing')
          .update(pricingData)
          .eq('id', existingPricing.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('category_pricing')
          .insert([{
            ...pricingData,
            category_id: category.id,
          }]);

        if (error) throw error;
      }

      await queryClient.invalidateQueries({ queryKey: ['category-pricing'] });
      
      toast({
        title: "Success",
        description: "Category pricing has been saved",
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
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Category Pricing - {category?.title}</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2">
          <div className="grid gap-6">
            <PricingSection
              selectedStrategyId={selectedStrategyId}
              onStrategyChange={setSelectedStrategyId}
              selectedStrategy={selectedStrategy}
              config={config}
              onConfigChange={setConfig}
            />

            <IngredientsSection
              onEditIngredients={() => setIsIngredientsOpen(true)}
            />

            <DebugSection
              category={category}
              existingPricing={existingPricing}
              config={config}
            />
          </div>
        </div>

        <DialogActions
          onClose={onClose}
          onSave={handleSave}
        />

        <IngredientsEditor
          isOpen={isIngredientsOpen}
          onClose={() => setIsIngredientsOpen(false)}
          ingredients={ingredients}
          onIngredientToggle={handleIngredientToggle}
        />
      </DialogContent>
    </Dialog>
  );
};