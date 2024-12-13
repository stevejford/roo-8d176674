import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2 } from "lucide-react";
import { SettingsSectionHeader } from './SettingsSectionHeader';

interface DeliveryZone {
  id: string;
  postcode: string;
  suburb: string;
  estimated_minutes: number;
  active: boolean;
}

export const DeliveryZonesForm = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newZone, setNewZone] = React.useState({
    postcode: '',
    suburb: '',
    estimated_minutes: 30,
  });

  const { data: zones, isLoading } = useQuery({
    queryKey: ['delivery-zones'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('delivery_zones')
        .select('*')
        .order('postcode');
      
      if (error) throw error;
      return data as DeliveryZone[];
    },
  });

  const addMutation = useMutation({
    mutationFn: async (zone: Omit<DeliveryZone, 'id' | 'active'>) => {
      const { error } = await supabase
        .from('delivery_zones')
        .insert([{ ...zone, active: true }]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['delivery-zones'] });
      setNewZone({ postcode: '', suburb: '', estimated_minutes: 30 });
      toast({
        title: "Success",
        description: "Delivery zone added successfully",
      });
    },
    onError: (error) => {
      console.error('Error adding delivery zone:', error);
      toast({
        title: "Error",
        description: "Failed to add delivery zone",
        variant: "destructive",
      });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      const { error } = await supabase
        .from('delivery_zones')
        .update({ active })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['delivery-zones'] });
    },
    onError: (error) => {
      console.error('Error updating delivery zone:', error);
      toast({
        title: "Error",
        description: "Failed to update delivery zone",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('delivery_zones')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['delivery-zones'] });
      toast({
        title: "Success",
        description: "Delivery zone deleted successfully",
      });
    },
    onError: (error) => {
      console.error('Error deleting delivery zone:', error);
      toast({
        title: "Error",
        description: "Failed to delete delivery zone",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMutation.mutate(newZone);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <SettingsSectionHeader
        title="Delivery Zones"
        description="Manage delivery zones, postcodes, and estimated delivery times"
      />

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="Postcode"
            value={newZone.postcode}
            onChange={(e) => setNewZone(prev => ({ ...prev, postcode: e.target.value }))}
            required
          />
          <Input
            placeholder="Suburb"
            value={newZone.suburb}
            onChange={(e) => setNewZone(prev => ({ ...prev, suburb: e.target.value }))}
            required
          />
          <Input
            type="number"
            placeholder="Estimated Minutes"
            value={newZone.estimated_minutes}
            onChange={(e) => setNewZone(prev => ({ ...prev, estimated_minutes: parseInt(e.target.value) }))}
            required
            min="1"
          />
        </div>
        <Button type="submit" className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Add Delivery Zone
        </Button>
      </form>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Postcode</TableHead>
              <TableHead>Suburb</TableHead>
              <TableHead>Est. Minutes</TableHead>
              <TableHead>Active</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {zones?.map((zone) => (
              <TableRow key={zone.id}>
                <TableCell>{zone.postcode}</TableCell>
                <TableCell>{zone.suburb}</TableCell>
                <TableCell>{zone.estimated_minutes}</TableCell>
                <TableCell>
                  <Switch
                    checked={zone.active}
                    onCheckedChange={(checked) => toggleMutation.mutate({ id: zone.id, active: checked })}
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteMutation.mutate(zone.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};