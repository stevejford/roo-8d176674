import React from 'react';
import { Plus, Trash2 } from "lucide-react";
import { useCartStore } from "@/stores/useCartStore";

export const OrderItems = () => {
  const [showVoucherInput, setShowVoucherInput] = React.useState(false);
  const { items, updateQuantity, removeItem } = useCartStore();

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[#2D3648]">Items</h3>
        {!showVoucherInput && (
          <button 
            onClick={() => setShowVoucherInput(true)}
            className="text-red-500 text-sm font-medium flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            Add Voucher
          </button>
        )}
      </div>

      {showVoucherInput ? (
        <div className="space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="ENTER VOUCHER CODE"
              className="w-full p-3 border border-gray-200 rounded-lg text-sm placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-red-500"
            />
            <button
              onClick={() => setShowVoucherInput(false)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-lg overflow-hidden">
                  <img 
                    src={item.image_url} 
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-medium text-[#2D3648]">{item.title}</h4>
                  {item.size && <p className="text-sm text-gray-500">{item.size}</p>}
                  <p className="font-medium">${item.price.toFixed(2)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => removeItem(item.id)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
                <span className="text-[#2D3648] font-medium">{item.quantity}</span>
                <button 
                  onClick={() => updateQuantity(item.id, true)}
                  className="text-gray-600 font-medium hover:text-gray-800"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};