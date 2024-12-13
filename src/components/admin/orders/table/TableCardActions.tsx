import { Button } from "@/components/ui/button";
import { Plus, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TableCardActionsProps {
  table: {
    id: string;
    table_number: string;
    order_id?: string;
  };
}

export const TableCardActions = ({ table }: TableCardActionsProps) => {
  const navigate = useNavigate();

  const handleAddItems = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate('/admin/waiter/menu', { state: { selectedTable: table } });
  };

  const handleViewOrder = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (table.order_id) {
      navigate(`/admin/waiter/order/${table.order_id}`);
    }
  };

  return (
    <div className="mt-auto space-y-2">
      <Button
        className="w-full bg-primary hover:bg-primary/90"
        onClick={handleAddItems}
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Items
      </Button>
      
      {table.order_id && (
        <Button
          className="w-full bg-white/10 hover:bg-white/20 text-white"
          onClick={handleViewOrder}
        >
          <FileText className="w-4 h-4 mr-2" />
          View Order Details
        </Button>
      )}
    </div>
  );
};