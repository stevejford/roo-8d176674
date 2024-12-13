import { Badge } from "@/components/ui/badge";

interface TableHeaderProps {
  tableNumber: string;
  status: string;
  orderStatus?: string;
}

export const TableHeader = ({ tableNumber, status, orderStatus }: TableHeaderProps) => {
  const getStatusBadgeStyle = () => {
    switch (status) {
      case 'available':
        return 'bg-gray-100 text-gray-900 border-gray-200';
      case 'reserved':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-white/20 text-white';
    }
  };

  return (
    <div className="flex items-start justify-between mb-3">
      <div className="flex flex-col items-start">
        <h3 className={`text-xl font-bold mb-1 ${status === 'available' ? 'text-gray-900' : 'text-white'}`}>
          Table {tableNumber}
        </h3>
        <Badge 
          variant={status === 'available' ? 'secondary' : 'outline'}
          className={getStatusBadgeStyle()}
        >
          {status === 'occupied' && orderStatus ? orderStatus : status}
        </Badge>
      </div>
    </div>
  );
};