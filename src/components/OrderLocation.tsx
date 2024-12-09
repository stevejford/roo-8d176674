import React from "react";
import { MapPin, Clock, Trash2, Plus } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { DeliveryModeSelector } from "./order/DeliveryModeSelector";
import { TimeSelector } from "./order/TimeSelector";
import { ComplementaryItems } from "./ComplementaryItems";

interface OrderLocationProps {
  mode: 'pickup' | 'delivery';
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const OrderLocation = ({ mode, isOpen = true, onOpenChange }: OrderLocationProps) => {
  const isMobile = useIsMobile();
  const [selectedTime, setSelectedTime] = React.useState("Wednesday - Reopen");
  const [showVoucherInput, setShowVoucherInput] = React.useState(false);

  const orderItems = [
    {
      name: "Mexicana",
      size: "Small",
      price: 16.00,
      image: "/lovable-uploads/234a1b1a-c6c2-4a81-9425-204ec6aed91e.png",
      quantity: 1
    },
    {
      name: "Carbonara",
      size: "main",
      price: 24.00,
      image: "/lovable-uploads/234a1b1a-c6c2-4a81-9425-204ec6aed91e.png",
      quantity: 1
    }
  ];

  const content = (
    <div className="h-full flex flex-col bg-white">
      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-[#2D3648]">Order</h2>
            <DeliveryModeSelector mode={mode} setMode={() => {}} />
          </div>

          <div className="bg-gray-50 rounded-lg p-4 space-y-4">
            <div className="flex items-start space-x-3">
              <MapPin className="h-5 w-5 text-gray-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-[#2D3648]">Town and Country Pizza</h3>
                <p className="text-sm text-gray-600">
                  16 Central Boulevard Armstrong Creek
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-gray-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-[#2D3648]">Pickup Time</h3>
                  <p className="text-sm text-gray-600">{selectedTime}</p>
                </div>
              </div>
              <button 
                className="text-emerald-600 text-sm font-medium"
                onClick={() => {}}
              >
                CHANGE
              </button>
            </div>
          </div>

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
                {orderItems.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium text-[#2D3648]">{item.name}</h4>
                        <p className="text-sm text-gray-500">{item.size}</p>
                        <p className="font-medium">${item.price.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <button className="text-gray-400">
                        <Trash2 className="h-5 w-5" />
                      </button>
                      <span className="text-[#2D3648] font-medium">{item.quantity}</span>
                      <button className="text-gray-600 font-medium">+</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4">
            <ComplementaryItems />
          </div>
        </div>
      </div>

      <div className="mt-auto p-6">
        <button
          className="w-full bg-red-500 text-white py-4 rounded-lg font-medium flex items-center justify-center space-x-2"
        >
          <span>Store Closed</span>
          <span className="ml-1">→</span>
        </button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-full sm:w-[400px] p-0">
          {content}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div className="fixed top-0 right-0 w-[400px] h-screen bg-white border-l border-gray-200 z-40">
      {content}
    </div>
  );
};