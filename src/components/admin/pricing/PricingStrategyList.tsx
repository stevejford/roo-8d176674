import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { PricingStrategyCard } from './PricingStrategyCard';
import { PricingStrategyDialog } from './PricingStrategyDialog';

export const PricingStrategyList = () => {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [selectedStrategy, setSelectedStrategy] = React.useState<any>(null);

  const { data: strategies, isLoading } = useQuery({
    queryKey: ['pricing-strategies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pricing_strategies')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const handleEdit = (strategy: any) => {
    setSelectedStrategy(strategy);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setSelectedStrategy(null);
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Pricing Strategies</h2>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" /> Add Strategy
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {strategies?.map((strategy) => (
          <PricingStrategyCard
            key={strategy.id}
            strategy={strategy}
            onEdit={() => handleEdit(strategy)}
          />
        ))}
      </div>

      <PricingStrategyDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        strategy={selectedStrategy}
      />
    </div>
  );
};