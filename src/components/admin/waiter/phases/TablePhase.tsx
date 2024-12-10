import React from 'react';
import { useTableManagement } from '@/hooks/useTableManagement';
import { TableCard } from '@/components/TableCard';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export const TablePhase = () => {
  const { tables, refetch } = useTableManagement();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Tables</h2>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Table
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {tables && Object.values(tables).map((table) => (
          <TableCard
            key={table.id}
            table={table}
            onClick={() => {}}
          />
        ))}
      </div>
    </div>
  );
};