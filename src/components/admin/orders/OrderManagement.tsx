import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList } from "lucide-react";
import { KitchenOrderSkeleton } from './KitchenOrderSkeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import type { Database } from '@/integrations/supabase/types';

type OrderStatus = Database['public']['Enums']['order_status'];

interface OrderManagementProps {
  orders: any[] | null;
  isLoading: boolean;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  statusColors: Record<string, string>;
}

export const OrderManagement = ({ 
  orders, 
  isLoading, 
  onUpdateStatus,
  statusColors 
}: OrderManagementProps) => {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <KitchenOrderSkeleton />
        <KitchenOrderSkeleton />
        <KitchenOrderSkeleton />
      </div>
    );
  }

  if (!orders?.length) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4 text-gray-500">
        <ClipboardList className="w-12 h-12" />
        <h3 className="text-xl font-semibold">No Orders to Handle</h3>
        <p>When new orders come in or are ready for delivery, they will appear here.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {orders?.filter(order => order.status !== 'cancelled').map((order) => (
          <div 
            key={order.id}
            onClick={() => setSelectedOrder(order)}
            className="cursor-pointer p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold">Order #{order.id.slice(0, 8)}</h3>
                <p className="text-sm text-gray-500">
                  {format(new Date(order.created_at), 'HH:mm')}
                </p>
              </div>
              <Badge 
                variant="secondary"
                className={statusColors[order.status]}
              >
                {order.status}
              </Badge>
            </div>
            
            <div className="space-y-2">
              {order.order_items?.map((item: any) => (
                <div key={item.id} className="text-sm">
                  {item.quantity}x {item.product?.title}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Order Details #{selectedOrder?.id.slice(0, 8)}</DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">Customer</p>
                    <p className="font-medium">{selectedOrder.customer_name || 'Anonymous'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Table</p>
                    <p className="font-medium">{selectedOrder.table_number || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <Badge 
                      variant="secondary"
                      className={statusColors[selectedOrder.status]}
                    >
                      {selectedOrder.status}
                    </Badge>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Order Items</h3>
                <div className="space-y-2">
                  {selectedOrder.order_items?.map((item: any) => (
                    <div key={item.id} className="flex justify-between items-center py-2 border-b">
                      <div>
                        <p className="font-medium">{item.product?.title}</p>
                        {item.notes && (
                          <p className="text-sm text-gray-500">Note: {item.notes}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${item.price}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <p className="font-semibold">Total Amount</p>
                <p className="font-semibold">${selectedOrder.total_amount}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};