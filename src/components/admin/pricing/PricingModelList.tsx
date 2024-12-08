import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash } from 'lucide-react';
import { PricingModelDialog } from './PricingModelDialog';

export const PricingModelList = () => {
  const [selectedModel, setSelectedModel] = React.useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const { data: pricingModels, isLoading } = useQuery({
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

  const handleEdit = (model: any) => {
    setSelectedModel(model);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setSelectedModel(null);
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Pricing Models</h2>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" /> Add Model
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pricingModels?.map((model) => (
            <TableRow key={model.id}>
              <TableCell>{model.name}</TableCell>
              <TableCell className="capitalize">{model.type.replace('_', ' ')}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(model)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <PricingModelDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        model={selectedModel}
        onClose={() => {
          setSelectedModel(null);
          setIsDialogOpen(false);
        }}
      />
    </div>
  );
};