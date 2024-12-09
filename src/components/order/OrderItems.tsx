import React from 'react';
import { Plus, Trash2, X, Loader2, Check } from "lucide-react";
import { useCartStore } from "@/stores/useCartStore";
import { useVoucherValidation } from "@/hooks/useVoucherValidation";
import { cn } from "@/lib/utils";

export const OrderItems = () => {
  const [showVoucherInput, setShowVoucherInput] = React.useState(false);
  const [voucherCode, setVoucherCode] = React.useState('');
  const { items, updateQuantity, removeItem } = useCartStore();
  const { validateVoucher, clearVoucher, isValidating, validVoucher, error } = useVoucherValidation();

  const handleVoucherSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await validateVoucher(voucherCode);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[#2D3648]">Items</h3>
        {!showVoucherInput && !validVoucher && (
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
          <form onSubmit={handleVoucherSubmit} className="relative">
            <input
              type="text"
              value={voucherCode}
              onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
              placeholder="ENTER VOUCHER CODE"
              className={cn(
                "w-full p-3 border rounded-lg text-sm placeholder:text-gray-500 focus:outline-none focus:ring-1",
                error ? "border-red-300 focus:ring-red-500" : "border-gray-200 focus:ring-red-500"
              )}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {isValidating ? (
                <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
              ) : (
                <>
                  <button
                    type="submit"
                    className="text-red-500 font-medium hover:text-red-600"
                  >
                    Apply
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowVoucherInput(false);
                      setVoucherCode('');
                      clearVoucher();
                    }}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </form>
          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}
        </div>
      ) : validVoucher ? (
        <div className="bg-green-50 p-3 rounded-lg flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Check className="h-5 w-5 text-green-600" />
            <div>
              <span className="text-green-700 font-medium">{validVoucher.code}</span>
              <p className="text-sm text-green-600">
                {validVoucher.discount_type === 'percentage' 
                  ? `${validVoucher.discount_value}% off`
                  : `$${validVoucher.discount_value} off`}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              clearVoucher();
              setVoucherCode('');
            }}
            className="text-green-700 hover:text-green-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      ) : null}

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
    </div>
  );
};