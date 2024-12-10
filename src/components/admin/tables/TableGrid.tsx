import React from 'react';
import { TableCard } from '@/components/TableCard';
import { useTableManagement } from '@/hooks/useTableManagement';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export const TableGrid = () => {
  const { tables, refetch } = useTableManagement();
  
  const handleTableClick = (table: any) => {
    // Will implement in next step
    console.log('Table clicked:', table);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Tables</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Table
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Object.values(tables || {}).map((table) => (
          <TableCard
            key={table.id}
            table={table}
            onClick={() => handleTableClick(table)}
          />
        ))}
      </div>
    </div>
  );
};