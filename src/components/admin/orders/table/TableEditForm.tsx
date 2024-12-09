import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface TableEditFormProps {
  tableId: string;
  initialTableNumber: string;
  onSuccess: () => void;
}

export const TableEditForm = ({ tableId, initialTableNumber, onSuccess }: TableEditFormProps) => {
  const [tableNumber, setTableNumber] = useState(initialTableNumber);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!tableNumber.trim()) {
      toast({
        title: "Error",
        description: "Table number cannot be empty",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('tables')
        .update({ table_number: tableNumber })
        .eq('id', tableId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Table number updated successfully",
      });
      onSuccess();
    } catch (error) {
      console.error('Error updating table:', error);
      toast({
        title: "Error",
        description: "Failed to update table number",
        variant: "destructive",
      });
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      onClick={(e) => e.stopPropagation()}
      className="flex items-center gap-2 mb-2"
    >
      <Input
        value={tableNumber}
        onChange={(e) => setTableNumber(e.target.value)}
        className="w-24 h-8 bg-white text-gray-900"
        autoFocus
        onClick={(e) => e.stopPropagation()}
      />
      <Button 
        type="submit" 
        size="sm"
        variant="secondary"
        className="h-8 whitespace-nowrap bg-white text-gray-900 hover:bg-gray-100"
      >
        <Save className="h-4 w-4 mr-1" />
        Save
      </Button>
    </form>
  );
};