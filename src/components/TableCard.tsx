import { Users, Edit, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TableCardProps {
  table: {
    id: string;
    table_number: string;
    status: 'available' | 'occupied' | 'reserved';
    customer_name?: string;
    order_id?: string;
    order_status?: string;
  };
  onClick: () => void;
  onDelete?: () => void;
}

export const TableCard = ({ table, onClick, onDelete }: TableCardProps) => {
  const getStatusColor = () => {
    switch (table.status) {
      case 'occupied':
        return 'bg-emerald-600';
      case 'reserved':
        return 'bg-yellow-600';
      default:
        return 'bg-white border border-input';
    }
  };

  return (
    <div className="relative p-2">
      <div
        role="button"
        tabIndex={0}
        className={`relative h-[12rem] w-full rounded-md transition-all duration-300 hover:shadow-lg ${getStatusColor()}`}
        onClick={onClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            onClick();
          }
        }}
      >
        <div className="flex flex-col h-full p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex flex-col items-start">
              <h3 className={`text-xl font-bold mb-1 ${table.status === 'available' ? 'text-gray-900' : 'text-white'}`}>
                Table {table.table_number}
              </h3>
              <Badge 
                variant={table.status === 'available' ? 'secondary' : 'outline'}
                className="bg-white/20"
              >
                {table.status === 'occupied' && table.order_status ? table.order_status : table.status}
              </Badge>
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center">
            {table.status === 'occupied' && table.customer_name ? (
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-white opacity-90" />
                <span className="text-lg font-medium text-white opacity-90">
                  {table.customer_name}
                </span>
              </div>
            ) : (
              <span className={`text-base ${table.status === 'available' ? 'text-gray-600' : 'text-white/90'}`}>
                {table.status === 'available' ? 'Tap to add order' : 'No customer name'}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="absolute top-4 right-4 flex gap-2">
        <button
          className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white"
          onClick={(e) => {
            e.stopPropagation();
            // Handle edit
          }}
        >
          <Edit className="w-4 h-4" />
        </button>
        {onDelete && (
          <button
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <Trash className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};