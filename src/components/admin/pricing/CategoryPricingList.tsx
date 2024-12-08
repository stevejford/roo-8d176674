import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { CategoryPricingDialog } from './CategoryPricingDialog';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const CategoryPricingList = () => {
  const [selectedCategory, setSelectedCategory] = React.useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select(`
          *,
          category_pricing (
            id,
            strategy_id,
            config,
            pricing_strategies (
              name,
              type
            )
          )
        `)
        .order('position');
      
      if (error) throw error;
      return data;
    },
  });

  const handleAssignPricing = (category: any) => {
    setSelectedCategory(category);
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Category Pricing</h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categories?.map((category) => {
          const pricing = category.category_pricing?.[0];
          
          return (
            <Card key={category.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{category.title}</CardTitle>
              </CardHeader>
              <CardContent>
                {pricing ? (
                  <>
                    <div className="text-sm text-muted-foreground mb-2">
                      Strategy: {pricing.pricing_strategies.name}
                    </div>
                    <div className="text-sm text-muted-foreground mb-4">
                      Type: {pricing.pricing_strategies.type}
                    </div>
                    <pre className="text-xs bg-muted p-2 rounded-md overflow-auto max-h-32">
                      {JSON.stringify(pricing.config, null, 2)}
                    </pre>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground mb-4">
                    No pricing strategy assigned
                  </p>
                )}
                <Button 
                  onClick={() => handleAssignPricing(category)}
                  className="mt-4"
                  variant="outline"
                >
                  {pricing ? 'Edit' : 'Assign'} Pricing
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {selectedCategory && (
        <CategoryPricingDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          categoryId={selectedCategory.id}
          categoryTitle={selectedCategory.title}
        />
      )}
    </div>
  );
};