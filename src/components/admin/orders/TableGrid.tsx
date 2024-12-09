import { useState } from 'react';
import { TableCard } from './TableCard';
import { TableManagementDialogs } from './TableManagementDialogs';
import { useTableManagement } from '@/hooks/useTableManagement';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { OrderManagement } from './OrderManagement';

export const TableGrid = () => {
  const { tables } = useTableManagement();
  const [showAddDialog, setShowAddDialog] = useState(false);

  return (
    <div className="space-y-8">
      {/* Tables Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Tables</h3>
          <Button onClick={() => setShowAddDialog(true)} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Table
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {tables && Object.values(tables).map((table) => (
            <TableCard
              key={table.id}
              table={table}
              onClick={() => {}}
            />
          ))}
        </div>
      </div>

      {/* Active Orders Section */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Active Orders</h1>
        </div>
        <OrderManagement 
          orders={null}
          isLoading={false}
          onUpdateStatus={() => {}}
          statusColors={{
            pending: 'bg-yellow-100 text-yellow-800',
            confirmed: 'bg-blue-100 text-blue-800',
            preparing: 'bg-purple-100 text-purple-800',
            ready: 'bg-green-100 text-green-800',
            delivered: 'bg-gray-100 text-gray-800',
            completed: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800',
          }}
        />
      </div>

      <TableManagementDialogs
        showAddDialog={showAddDialog}
        onCloseAddDialog={() => setShowAddDialog(false)}
      />
    </div>
  );
};