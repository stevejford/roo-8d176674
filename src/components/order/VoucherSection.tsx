import React from "react";
import { Plus } from "lucide-react";

interface VoucherSectionProps {
  showVoucherInput: boolean;
  setShowVoucherInput: (show: boolean) => void;
}

export const VoucherSection = ({ showVoucherInput, setShowVoucherInput }: VoucherSectionProps) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-[#2D3648]">Items</h3>
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
  );
};