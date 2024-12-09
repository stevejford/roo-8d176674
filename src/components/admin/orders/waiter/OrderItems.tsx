import React from 'react';

interface OrderItem {
  id: string;
  quantity: number;
  product: {
    title: string;
  };
  price: number;
  size?: string;
  notes?: string;
}

interface OrderItemsProps {
  items: OrderItem[];
}

export const OrderItems = ({ items }: OrderItemsProps) => {
  return (
    <div className="space-y-3">
      {items?.map((item) => (
        <div key={item.id} className="flex justify-between items-center py-2 border-b last:border-0">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-lg">{item.quantity}x</span>
            <div>
              <span className="text-base">{item.product?.title}</span>
              {item.size && (
                <span className="text-sm text-gray-500 ml-2">({item.size})</span>
              )}
              {item.notes && (
                <p className="text-sm text-gray-600 italic">Note: {item.notes}</p>
              )}
            </div>
          </div>
          <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
        </div>
      ))}
    </div>
  );
};