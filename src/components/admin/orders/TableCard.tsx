import { Users, Clock } from "lucide-react";
import { TableCardHeader } from "./table/TableCardHeader";
import { TableCardActions } from "./table/TableCardActions";
import { differenceInMinutes } from "date-fns";

interface TableCardProps {
  table: {
    id: string;
    table_number: string;
    status: 'available' | 'occupied' | 'reserved';
    customer_name?: string;
    order_id?: string;
    order_status?: string;
    seated_at?: string;
  };
  onClick: () => void;
}

export const TableCard = ({ table, onClick }: TableCardProps) => {
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
          <TableCardHeader 
            tableNumber={table.table_number}
            customerName={table.customer_name}
            status={table.status}
            orderStatus={table.order_status}
          />

          <div className="flex-1 flex flex-col items-center justify-center">
            {table.status === 'occupied' && table.customer_name ? (
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-white opacity-90" />
                  <span className="text-lg font-medium text-white opacity-90">
                    {table.customer_name}
                  </span>
                </div>
                {table.seated_at && (
                  <div className="flex items-center gap-1 text-white/80 text-sm">
                    <Clock className="h-4 w-4" />
                    <span>
                      {differenceInMinutes(new Date(), new Date(table.seated_at))}m
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <span className={`text-base ${table.status === 'available' ? 'text-gray-600' : 'text-white/90'}`}>
                {table.status === 'available' ? 'Tap to add order' : 'No customer name'}
              </span>
            )}
          </div>

          <TableCardActions table={table} />
        </div>
      </div>
    </div>
  );
};