import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import type { Category } from './types';

interface CategorySidebarProps {
  category: Category | null;
}

export const CategorySidebar = ({ category }: CategorySidebarProps) => {
  const { data: categoryPricing } = useQuery({
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
      
      if (error) throw error;
      return data;
    },
    enabled: !!category?.id,
  });

  if (!category) {
    return (
      <div className="w-80 border-l p-4 bg-gray-50">
        <p className="text-gray-500 text-center">
          Select a category to view details
        </p>
      </div>
    );
  }

  return (
    <div className="w-80 border-l">
      <ScrollArea className="h-[calc(100vh-8rem)]">
        <div className="p-4 space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">{category.title}</h2>
            <div className="space-y-4">
              <Card className="p-4">
                <div className="space-y-2">
                  <Label>Pricing Strategy</Label>
                  <div className="text-sm">
                    {categoryPricing?.pricing_strategies?.name || 'No pricing strategy set'}
                  </div>
                </div>
              </Card>

              {categoryPricing?.pricing_strategies && (
                <Card className="p-4">
                  <div className="space-y-2">
                    <Label>Strategy Type</Label>
                    <div className="text-sm capitalize">
                      {categoryPricing.pricing_strategies.type.replace(/_/g, ' ')}
                    </div>
                  </div>
                </Card>
              )}

              {categoryPricing?.config && (
                <Card className="p-4">
                  <div className="space-y-2">
                    <Label>Configuration</Label>
                    <pre className="text-xs bg-gray-50 p-2 rounded overflow-x-auto">
                      {JSON.stringify(categoryPricing.config, null, 2)}
                    </pre>
                  </div>
                </Card>
              )}

              {categoryPricing?.ingredients && categoryPricing.ingredients.length > 0 && (
                <Card className="p-4">
                  <div className="space-y-2">
                    <Label>Ingredients</Label>
                    <div className="space-y-1">
                      {categoryPricing.ingredients.map((ingredient: any, index: number) => (
                        <div key={index} className="text-sm">
                          {ingredient.name}
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};