import React from "react";
import { MapPin, X, Clock } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { DeliveryModeSelector } from "./order/DeliveryModeSelector";
import { TimeSelector } from "./order/TimeSelector";

interface OrderLocationProps {
  mode: 'pickup' | 'delivery';
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const OrderLocation = ({ mode, isOpen = true, onOpenChange }: OrderLocationProps) => {
  const isMobile = useIsMobile();
  const [selectedTime, setSelectedTime] = React.useState("Wednesday - Reopen");

  const content = (
    <div className="h-full flex flex-col bg-white">
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
            <button 
              className="text-red-500 text-sm font-medium flex items-center"
              onClick={() => {}}
            >
              <span className="mr-1">+</span> Add Voucher
            </button>
          </div>

          {/* Example items - these would be dynamic in production */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img 
                  src="/placeholder.svg" 
                  alt="Mexicana"
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div>
                  <h4 className="font-medium text-[#2D3648]">Mexicana</h4>
                  <p className="text-sm text-gray-500">Small</p>
                  <p className="font-medium">$16.00</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button className="text-gray-400">
                  <X className="h-5 w-5" />
                </button>
                <span className="text-[#2D3648]">1</span>
                <button className="text-gray-600 font-medium">+</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-auto">
        <div className="p-6">
          <button
            className="w-full bg-red-500 text-white py-4 rounded-lg font-medium flex items-center justify-center space-x-2"
          >
            <span>Store Closed</span>
            <span className="ml-1">→</span>
          </button>
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-[400px] sm:w-[540px] z-50 p-0">
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