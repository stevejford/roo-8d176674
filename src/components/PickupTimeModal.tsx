import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

interface PickupTimeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (date: string, time: string) => void;
}

export const PickupTimeModal = ({ isOpen, onClose, onSchedule }: PickupTimeModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-[#2D3648]">
            Select a Pickup Time
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <button className="w-full flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
            <span className="text-[#2D3648]">Today</span>
            <ChevronDown className="h-5 w-5 text-gray-400" />
          </button>
          <button className="w-full flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
            <span className="text-[#2D3648]">04:15 PM</span>
            <ChevronDown className="h-5 w-5 text-gray-400" />
          </button>
          <Button 
            className="w-full bg-[#E86452] hover:bg-[#E86452]/90 text-white py-6"
            onClick={() => onSchedule("Today", "04:15 PM")}
          >
            Schedule Pickup Time
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};