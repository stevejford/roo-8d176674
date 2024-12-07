import React, { useState } from "react";
import { Clock, MapPin, Plus, Search, X } from "lucide-react";

export const OrderSidebar = () => {
  const [mode, setMode] = useState<'pickup' | 'delivery'>('pickup');
  const [showVoucherInput, setShowVoucherInput] = useState(false);

  return (
    <div className="w-full md:w-[400px] bg-white border-l border-gray-200 h-screen">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-[#2D3648]">Order</h2>
          <div className="flex p-1 bg-gray-100 rounded-full">
            <button 
              className={`flex-1 py-2 px-4 rounded-full ${mode === 'pickup' ? 'bg-white shadow-sm font-medium' : 'text-gray-600 hover:bg-white/50 transition-colors'}`}
              onClick={() => setMode('pickup')}
            >
              Pickup
            </button>
            <button 
              className={`flex-1 py-2 px-4 rounded-full ${mode === 'delivery' ? 'bg-white shadow-sm font-medium' : 'text-gray-600 hover:bg-white/50 transition-colors'}`}
              onClick={() => setMode('delivery')}
            >
              Delivery
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {mode === 'pickup' ? (
            <div className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg">
              <MapPin className="h-5 w-5 text-gray-400 mt-1" />
              <div>
                <h3 className="font-medium text-[#2D3648]">Town and Country Pizza</h3>
                <p className="text-sm text-gray-600">
                  Gateway Plaza, G65/621-659 Bellarine Hwy Leopold
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg">
              <Search className="h-5 w-5 text-gray-400 mt-1" />
              <div className="flex-1">
                <input 
                  type="text" 
                  placeholder="Enter delivery address"
                  className="w-full text-sm text-gray-600 bg-transparent border-none focus:outline-none p-0"
                />
              </div>
            </div>
          )}

          <div className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg">
            <Clock className="h-5 w-5 text-gray-400 mt-1" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-[#2D3648]">{mode === 'pickup' ? 'Pickup Time' : 'Delivery Time'}</h3>
                <button className="px-3 py-1 border border-[#10B981] text-[#10B981] text-sm font-medium rounded hover:bg-[#10B981]/5 transition-colors">
                  CHANGE
                </button>
              </div>
              <p className="text-sm text-gray-600">Today - 20 Minutes</p>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-[#2D3648]">Items</h3>
            {!showVoucherInput && (
              <button 
                onClick={() => setShowVoucherInput(true)}
                className="text-[#E86452] text-sm font-medium flex items-center gap-1 hover:text-[#E86452]/90"
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
                  className="w-full p-3 border border-gray-200 rounded-lg text-sm placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#E86452]"
                />
                <button
                  onClick={() => setShowVoucherInput(false)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#E86452] hover:text-[#E86452]/90"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>Your cart is empty</p>
              <p className="text-sm">Add items to get started</p>
            </div>
          )}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4">
        <button className="w-full py-3 px-4 bg-[#E86452] text-white rounded-md flex items-center justify-center space-x-2">
          <span>Store Closed</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
};