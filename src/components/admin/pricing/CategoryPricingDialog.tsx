import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from '@/components/ui/use-toast';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { PricingModelConfig } from './PricingModelConfig';
import { PricingStrategySelect } from './shared/PricingStrategySelect';
import { DialogActions } from './shared/DialogActions';
import { IngredientsEditor } from '@/components/IngredientsEditor';
import { Database } from '@/integrations/supabase/types';

type CategoryPricingRow = Database['public']['Tables']['category_pricing']['Row'] & {
  pricing_strategies: Database['public']['Tables']['pricing_strategies']['Row']
};

interface CategoryPricingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: any;
  onClose: () => void;
}

export const CategoryPricingDialog = ({ open, onOpenChange, category, onClose }: CategoryPricingDialogProps) => {
  const [selectedStrategyId, setSelectedStrategyId] = React.useState<string>('');
  const [config, setConfig] = React.useState({});
  const [isIngredientsOpen, setIsIngredientsOpen] = React.useState(false);
  const [ingredients, setIngredients] = React.useState([
    { name: "Cheese", checked: true },
    { name: "Tomato Sauce", checked: true },
    { name: "Pepperoni", checked: false },
    { name: "Mushrooms", checked: false },
    { name: "Onions", checked: false },
  ]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: existingPricing } = useQuery({
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
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data as CategoryPricingRow | null;
    },
    enabled: !!category?.id,
  });

  React.useEffect(() => {
    if (existingPricing) {
      setSelectedStrategyId(existingPricing.strategy_id);
      setConfig(existingPricing.config);
      if (existingPricing.ingredients) {
        setIngredients(existingPricing.ingredients as Array<{ name: string; checked: boolean }>);
      }
    } else {
      setSelectedStrategyId('');
      setConfig({});
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
    try {
      const pricingData = {
        strategy_id: selectedStrategyId,
        config,
        ingredients,
      };

      if (existingPricing) {
        const { error } = await supabase
          .from('category_pricing')
          .update(pricingData)
          .eq('id', existingPricing.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('category_pricing')
          .insert([{
            category_id: category.id,
            ...pricingData,
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
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-sm font-medium mb-2">Debug Information</h3>
            <div className="space-y-2">
              <div>
                <h4 className="text-xs font-medium text-gray-500">Category ID:</h4>
                <pre className="text-xs bg-white p-2 rounded">{category?.id}</pre>
              </div>
              <div>
                <h4 className="text-xs font-medium text-gray-500">Current Pricing Data:</h4>
                <pre className="text-xs bg-white p-2 rounded overflow-auto max-h-40">
                  {JSON.stringify(existingPricing, null, 2)}
                </pre>
              </div>
              <div>
                <h4 className="text-xs font-medium text-gray-500">Current Config:</h4>
                <pre className="text-xs bg-white p-2 rounded overflow-auto max-h-40">
                  {JSON.stringify(config, null, 2)}
                </pre>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white p-4 rounded-md border border-gray-200">
              <h3 className="text-lg font-semibold text-[#2D3648] mb-4">Ingredients</h3>
              <div className="space-y-2">
                {ingredients.map((ingredient) => (
                  <div 
                    key={ingredient.name}
                    className="flex items-center justify-between py-2"
                  >
                    <span className="text-[#2D3648]">{ingredient.name}</span>
                    <input
                      type="checkbox"
                      checked={ingredient.checked}
                      onChange={() => handleIngredientToggle(ingredient.name)}
                      className="h-5 w-5 border-2 border-[#E86452] rounded text-[#E86452] focus:ring-[#E86452]"
                    />
                  </div>
                ))}
              </div>
            </div>

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
          </div>
        </div>
        
        <DialogActions
          onClose={onClose}
          onSave={handleSave}
          disabled={!selectedStrategyId}
        />
      </DialogContent>
    </Dialog>
  );
};