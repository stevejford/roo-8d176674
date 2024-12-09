import React from "react";
import { MapPin, Search } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

interface OrderLocationProps {
  mode: 'pickup' | 'delivery';
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const OrderLocation = ({ mode, isOpen = true, onOpenChange }: OrderLocationProps) => {
  const isMobile = useIsMobile();

  const content = mode === 'pickup' ? (
    <div className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg">
      <MapPin className="h-5 w-5 text-gray-400 mt-1" />
      <div>
        <h3 className="font-medium text-[#2D3648]">Roo Restaurant</h3>
        <p className="text-sm text-gray-600">
          7A Rockingham Beach Rd, Rockingham WA 6168
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
  );

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-[400px] sm:w-[540px]">
          <div className="mt-6">
            {content}
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div className="fixed top-0 right-0 w-[400px] h-screen bg-white border-l border-gray-200 p-4 z-50">
      {content}
    </div>
  );
};