import React from "react";
import { MapPin, X } from "lucide-react";
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

  const [selectedTime, setSelectedTime] = React.useState("Tomorrow - Reopen");

  const content = (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center border-b border-gray-200 p-4">
        <h2 className="text-2xl font-semibold text-[#2D3648]">Order</h2>
        <button 
          onClick={() => onOpenChange?.(false)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Close order sheet"
        >
          <X className="h-6 w-6 text-gray-600" />
        </button>
      </div>
      
      <div className="flex-1 overflow-auto p-4 space-y-6">
        <DeliveryModeSelector mode={mode} setMode={() => {}} />
        
        <div className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg">
          <MapPin className="h-5 w-5 text-gray-400 mt-1" />
          <div>
            <h3 className="font-medium text-[#2D3648]">Town and Country Pizza</h3>
            <p className="text-sm text-gray-600">
              222 Fischer St Torquay
            </p>
          </div>
        </div>

        <TimeSelector 
          mode={mode}
          selectedTime={selectedTime}
          onTimeChange={() => {}}
        />
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