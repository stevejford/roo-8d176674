import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { StoreTimePicker } from "./StoreTimePicker";

interface PickupTimeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (date: string, time: string) => void;
}

export const PickupTimeModal = ({ isOpen, onClose, onSchedule }: PickupTimeModalProps) => {
  const [selectedDateTime, setSelectedDateTime] = useState<Date | undefined>();

  const handleSchedule = () => {
    if (selectedDateTime) {
      onSchedule(
        format(selectedDateTime, "EEEE, MMMM d"),
        format(selectedDateTime, "h:mm aa")
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-[#2D3648]">
            Select a Pickup Time
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <StoreTimePicker
            date={selectedDateTime}
            onSelect={setSelectedDateTime}
          />

          <Button 
            className="w-full bg-[#E86452] hover:bg-[#E86452]/90 text-white py-6 mt-4"
            onClick={handleSchedule}
            disabled={!selectedDateTime}
          >
            Schedule Pickup Time
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};