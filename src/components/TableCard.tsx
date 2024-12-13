import { Users, Edit, Trash, Clock, AlertCircle, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip } from "@/components/ui/tooltip";
import { TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { differenceInMinutes } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface TableCardProps {
  table: {
    id: string;
    table_number: string;
    status: 'available' | 'occupied' | 'reserved';
    customer_name?: string;
    order_id?: string;
    order_status?: string;
    seated_at?: string;
    order_taken_at?: string;
    drinks_suggested_at?: string;
    dessert_suggested_at?: string;
    last_check_at?: string;
  };
  onClick: () => void;
  onDelete?: () => void;
}

export const TableCard = ({ table, onClick, onDelete }: TableCardProps) => {
  const navigate = useNavigate();

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

  const getStatusBadgeStyle = () => {
    switch (table.status) {
      case 'available':
        return 'bg-gray-100 text-gray-900 border-gray-200';
      case 'reserved':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-white/20 text-white';
    }
  };

  const getServiceAlerts = () => {
    if (table.status !== 'occupied' || !table.seated_at) return [];
    
    const alerts = [];
    const now = new Date();
    const seatedTime = new Date(table.seated_at);
    
    // Check if initial order hasn't been taken within 5 minutes
    if (!table.order_taken_at && differenceInMinutes(now, seatedTime) >= 5) {
      alerts.push({
        message: "Take initial order",
        urgent: true
      });
    }

    // Check if drinks haven't been suggested within 15 minutes
    if (!table.drinks_suggested_at && differenceInMinutes(now, seatedTime) >= 15) {
      alerts.push({
        message: "Suggest drinks",
        urgent: false
      });
    }

    // Check if dessert hasn't been suggested within 30 minutes of seating
    if (!table.dessert_suggested_at && differenceInMinutes(now, seatedTime) >= 30) {
      alerts.push({
        message: "Suggest dessert",
        urgent: false
      });
    }

    // Check if table hasn't been checked in last 10 minutes
    if (table.last_check_at) {
      const lastCheck = new Date(table.last_check_at);
      if (differenceInMinutes(now, lastCheck) >= 10) {
        alerts.push({
          message: "Check on table",
          urgent: false
        });
      }
    }

    return alerts;
  };

  const alerts = getServiceAlerts();

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
                className={getStatusBadgeStyle()}
              >
                {table.status === 'occupied' && table.order_status ? table.order_status : table.status}
              </Badge>
            </div>
          </div>

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

          {/* Action Buttons */}
          <div className="mt-4 flex gap-2">
            <Button
              className="flex-1 bg-white/10 hover:bg-white/20 text-white"
              onClick={handleAddItems}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Items
            </Button>
            
            {table.order_id && (
              <Button
                className="flex-1 bg-white/10 hover:bg-white/20 text-white"
                onClick={handleViewOrder}
              >
                View Order
              </Button>
            )}
          </div>
        </div>

        {alerts.length > 0 && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="absolute top-4 left-4">
                  <AlertCircle className={`h-5 w-5 ${alerts.some(a => a.urgent) ? 'text-red-500' : 'text-yellow-500'}`} />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div className="space-y-1">
                  {alerts.map((alert, index) => (
                    <p key={index} className={alert.urgent ? 'text-red-500' : 'text-yellow-500'}>
                      {alert.message}
                    </p>
                  ))}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

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
    </div>
  );
};