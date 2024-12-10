import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrderManagement } from '@/hooks/useOrderManagement';
import { OrderCardContent } from './waiter/OrderCardContent';
import { Button } from "@/components/ui/button";
import { Plus, UtensilsCrossed, Trash2 } from "lucide-react";
import type { Database } from '@/integrations/supabase/types';

type OrderStatus = Database['public']['Enums']['order_status'];

interface WaiterOrderCardProps {
  order: any;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  statusColors: Record<string, string>;
  isNew?: boolean;
}

export const WaiterOrderCard = ({ 
  order, 
  onUpdateStatus,
  statusColors, 
  isNew = false 
}: WaiterOrderCardProps) => {
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const navigate = useNavigate();
  const { deleteOrder, completeOrder, sendToKitchen } = useOrderManagement();

  const handlePayment = async (method: 'cash' | 'card') => {
    setIsProcessingPayment(true);
    try {
      const { error } = await completeOrder(order.id, order.total_amount);
      if (error) throw error;
      onUpdateStatus(order.id, 'completed');
    } catch (error) {
      console.error('Payment processing error:', error);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleSendToKitchen = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const { error } = await sendToKitchen(order.id);
      if (error) throw error;
      onUpdateStatus(order.id, 'preparing');
    } catch (error) {
      console.error('Send to kitchen error:', error);
    }
  };

  const handleDeleteOrder = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const { error } = await deleteOrder(order.id);
    if (!error) {
      onUpdateStatus(order.id, 'cancelled');
    }
  };

  const handleCardClick = () => {
    navigate(`/admin/waiter/order/${order.id}`);
  };

  const handleAddItems = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate('/admin/waiter/menu');
  };

  return (
    <div 
      className={`border rounded-lg p-6 bg-white shadow-sm space-y-6 transition-all duration-300 ${
        isNew ? 'ring-2 ring-blue-500 animate-pulse' : ''
      }`}
      onClick={handleCardClick}
    >
      <OrderCardContent
        order={order}
        statusColors={statusColors}
        onSendToKitchen={handleSendToKitchen}
        onAddItems={handleAddItems}
        onDeleteClick={handleDeleteOrder}
        onPayment={handlePayment}
        isProcessingPayment={isProcessingPayment}
      />
    </div>
  );
};