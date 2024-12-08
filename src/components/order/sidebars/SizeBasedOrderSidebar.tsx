import React, { useState } from "react";
import { OrderHeader } from "../OrderHeader";
import { DeliveryModeSelector } from "../DeliveryModeSelector";
import { OrderLocation } from "../../OrderLocation";
import { TimeSelector } from "../TimeSelector";
import { VoucherSection } from "../VoucherSection";
import { ComplementaryItems } from "../../ComplementaryItems";
import { PickupTimeModal } from "../../PickupTimeModal";
import { X } from "lucide-react";
import type { PricingConfig } from "@/types/pricing/interfaces";

interface SizeBasedOrderSidebarProps {
  product: {
    title: string;
    description: string;
    image: string;
    price: number;
    category_id?: string;
  };
  pricing: PricingConfig;
  onClose: () => void;
}

export const SizeBasedOrderSidebar = ({ product, pricing, onClose }: SizeBasedOrderSidebarProps) => {
  const [mode, setMode] = useState<'pickup' | 'delivery'>('pickup');
  const [showVoucherInput, setShowVoucherInput] = useState(false);
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [selectedTime, setSelectedTime] = useState("Today - 20 Minutes");
  const [selectedSize, setSelectedSize] = useState(pricing.sizes?.[0]?.name || '');

  const handleTimeSchedule = (date: string, time: string) => {
    setSelectedTime(`${date} - ${time}`);
    setShowTimeModal(false);
  };

  const getCurrentPrice = () => {
    const size = pricing.sizes?.find(s => s.name === selectedSize);
    return size?.price || product.price;
  };

  return (
    <div className="h-full flex flex-col overflow-auto">
      <div className="flex-1">
        <div className="relative">
          <img
            src={product.image}
            alt={product.title}
            className="w-full aspect-square object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white rounded-full hover:bg-gray-100"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-2">{product.title}</h2>
            <p className="text-gray-600">{product.description}</p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Size Options</h3>
            <div className="grid gap-2">
              {pricing.sizes?.map((size) => (
                <button
                  key={size.name}
                  onClick={() => setSelectedSize(size.name)}
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    selectedSize === size.name
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200'
                  }`}
                >
                  <span>{size.name}</span>
                  <span className="font-semibold">${size.price.toFixed(2)}</span>
                </button>
              ))}
            </div>
          </div>

          <OrderHeader onClose={onClose} />
          <DeliveryModeSelector mode={mode} setMode={setMode} />
          <OrderLocation mode={mode} />
          <TimeSelector 
            mode={mode} 
            selectedTime={selectedTime} 
            onTimeChange={() => setShowTimeModal(true)} 
          />
          <VoucherSection 
            showVoucherInput={showVoucherInput}
            setShowVoucherInput={setShowVoucherInput}
          />
          <ComplementaryItems />
        </div>
      </div>

      <div className="p-4 border-t border-gray-200 mt-auto">
        <button className="w-full py-3 px-4 bg-primary text-white rounded-md flex items-center justify-between">
          <span>Add to Order</span>
          <span>${getCurrentPrice().toFixed(2)}</span>
        </button>
      </div>

      <PickupTimeModal 
        isOpen={showTimeModal}
        onClose={() => setShowTimeModal(false)}
        onSchedule={handleTimeSchedule}
      />
    </div>
  );
};