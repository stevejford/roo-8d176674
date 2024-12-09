import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TableCard } from './TableCard';
import { TableManagementDialogs } from './TableManagementDialogs';
import { useTableManagement } from '@/hooks/useTableManagement';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export const TableGrid = () => {
  const navigate = useNavigate();
  const { tables } = useTableManagement();
  const [showAddDialog, setShowAddDialog] = useState(false);

  const handleTableClick = (tableNumber: string, orderId?: string) => {
    if (orderId) {
      navigate(`/admin/waiter/${orderId}`);
    }
  };

  return (
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
            onClick={() => handleTableClick(table.table_number, table.order_id)}
          />
        ))}
      </div>

      <TableManagementDialogs
        showAddDialog={showAddDialog}
        onCloseAddDialog={() => setShowAddDialog(false)}
      />
    </div>
  );
};