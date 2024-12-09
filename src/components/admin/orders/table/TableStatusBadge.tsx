import { Badge } from "@/components/ui/badge";

interface TableStatusBadgeProps {
  status: string;
  orderStatus?: string;
}

export const TableStatusBadge = ({ status, orderStatus }: TableStatusBadgeProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'occupied':
        return 'bg-green-600 hover:bg-green-700';
      case 'reserved':
        return 'bg-yellow-600 hover:bg-yellow-700';
      default:
        return '';
    }
  };

  return (
    <Badge 
      variant="secondary"
      className={`px-3 py-1 text-sm font-medium ${
        status === 'available' 
          ? 'bg-gray-100 text-gray-900' 
          : 'bg-white/20 text-white'
      }`}
    >
      {status === 'available' ? 'Available' : orderStatus || 'Occupied'}
    </Badge>
  );
};