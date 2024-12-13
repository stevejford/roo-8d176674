import { useState } from 'react';
import { TableCard } from '@/components/TableCard';
import { TableManagementDialogs } from '@/components/admin/orders/TableManagementDialogs';
import { useTableManagement } from '@/hooks/useTableManagement';
import { Button } from '@/components/ui/button';
import { Plus, Table2 } from 'lucide-react';
import { Dialog } from '@/components/ui/dialog';
import { TableAllocationDialog } from '@/components/admin/orders/TableAllocationDialog';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TableStatusOverview } from '@/components/admin/orders/TableStatusOverview';

export const TableGrid = () => {
  const { tables, refetch } = useTableManagement();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedTable, setSelectedTable] = useState<any>(null);

  const handleTableClick = (table: any) => {
    setSelectedTable(table);
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">Table Management</h2>
            <p className="text-muted-foreground">
              Manage your restaurant tables and monitor their status in real-time.
            </p>
          </div>
          <Button onClick={() => setShowAddDialog(true)} size="sm" className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Add Table
          </Button>
        </div>

        {/* Status Overview Cards */}
        <TableStatusOverview />
      </div>

      {/* Tables Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Table2 className="w-5 h-5" />
            Tables Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            {tables && Object.values(tables).map((table) => (
              <TableCard
                key={table.id}
                table={table}
                onClick={() => handleTableClick(table)}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedTable} onOpenChange={() => setSelectedTable(null)}>
        {selectedTable && (
          <TableAllocationDialog
            table={selectedTable}
            onClose={() => setSelectedTable(null)}
            onSuccess={() => {
              setSelectedTable(null);
              refetch();
            }}
          />
        )}
      </Dialog>

      <TableManagementDialogs
        showAddDialog={showAddDialog}
        onCloseAddDialog={() => setShowAddDialog(false)}
      />
    </div>
  );
};