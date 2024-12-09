import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface TableAllocationFormProps {
  onAllocate: (customerName: string) => Promise<void>;
}

export const TableAllocationForm = ({ onAllocate }: TableAllocationFormProps) => {
  const [customerName, setCustomerName] = useState('');
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!customerName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a customer name",
        variant: "destructive",
      });
      return;
    }
    await onAllocate(customerName);
    setCustomerName('');
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Customer Name</label>
        <Input
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          placeholder="Enter customer name"
        />
      </div>
      <Button 
        className="w-full"
        onClick={handleSubmit}
      >
        Allocate Table
      </Button>
    </div>
  );
};