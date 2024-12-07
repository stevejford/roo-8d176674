import React from "react";
import { Clock, MapPin } from "lucide-react";

export const OrderSidebar = () => {
  return (
    <div className="w-full md:w-[400px] bg-white border-l border-gray-200 p-6">
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Order</h2>
        
        <div className="flex space-x-2">
          <button className="flex-1 py-2 px-4 rounded-md bg-primary text-white">
            Pickup
          </button>
          <button className="flex-1 py-2 px-4 rounded-md border border-gray-200">
            Delivery
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <MapPin className="h-5 w-5 text-gray-400 mt-1" />
            <div>
              <h3 className="font-medium">Town and Country Pizza</h3>
              <p className="text-sm text-gray-600">
                Gateway Plaza, G65/621-659 Bellarine Hwy Leopold
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Clock className="h-5 w-5 text-gray-400 mt-1" />
            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Pickup Time</h3>
                <button className="text-primary text-sm">CHANGE</button>
              </div>
              <p className="text-sm text-gray-600">Today - 20 Minutes</p>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Items</h3>
            <button className="text-primary text-sm">+ Add Voucher</button>
          </div>
          <div className="text-center py-12 text-gray-500">
            <p>Your cart is empty</p>
            <p className="text-sm">Add items to get started</p>
          </div>
        </div>
      </div>
    </div>
  );
};