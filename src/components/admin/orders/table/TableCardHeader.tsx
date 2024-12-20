import { Badge } from "@/components/ui/badge";

interface TableCardHeaderProps {
  tableNumber: string;
  customerName?: string;
  status: string;
  orderStatus?: string;
}

export const TableCardHeader = ({ tableNumber, customerName, status, orderStatus }: TableCardHeaderProps) => {
  const getStatusColor = () => {
    switch (status) {
      case 'occupied':
        return 'bg-emerald-600';
      case 'reserved':
        return 'bg-yellow-600';
      default:
        return 'bg-white border border-input';
    }
  };

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
          {customerName ? `${tableNumber} - ${customerName}` : `Table ${tableNumber}`}
        </h3>
        <Badge 
          variant="secondary"
          className={getStatusBadgeStyle()}
        >
          {status === 'occupied' && orderStatus ? orderStatus : status}
        </Badge>
      </div>
    </div>
  );
};